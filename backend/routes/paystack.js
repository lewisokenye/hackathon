import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize payment
router.post('/pay', async (req, res) => {
  try {
    const { amount, email, reference, donor_id, description } = req.body;

    // Validate required fields
    if (!amount || !email || !reference) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount, email, and reference are required' 
      });
    }

    if (!PAYSTACK_SECRET_KEY) {
      // Mock response for development
      return res.json({
        success: true,
        data: {
          authorization_url: '#mock-payment-url',
          access_code: 'mock-access-code',
          reference: reference
        },
        message: 'Payment initialized (mock mode - configure PAYSTACK_SECRET_KEY for live payments)'
      });
    }

    const paymentData = {
      amount: Math.round(amount * 100), // Convert to kobo (Paystack uses smallest currency unit)
      email,
      reference,
      callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback`,
      metadata: {
        donor_id,
        description,
        custom_fields: [
          {
            display_name: "Donation Type",
            variable_name: "donation_type",
            value: "monetary"
          }
        ]
      }
    };

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status) {
      // Store pending payment in database
      await db.execute(
        `INSERT INTO donations (donor_id, type, description, amount, status) 
         VALUES (?, 'money', ?, ?, 'pending')`,
        [donor_id || 1, description || 'Monetary donation', amount]
      );

      res.json({
        success: true,
        data: response.data.data,
        message: 'Payment initialized successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.data.message || 'Payment initialization failed'
      });
    }

  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!PAYSTACK_SECRET_KEY) {
      // Mock verification for development
      return res.json({
        success: true,
        data: {
          status: 'success',
          reference,
          amount: 2500, // Mock amount in kobo
          gateway_response: 'Successful (Mock)',
          paid_at: new Date().toISOString()
        },
        message: 'Payment verified (mock mode)'
      });
    }

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status && response.data.data.status === 'success') {
      // Update donation status to completed
      const amount = response.data.data.amount / 100; // Convert from kobo to main currency
      const metadata = response.data.data.metadata;

      await db.execute(
        `UPDATE donations 
         SET status = 'completed', amount = ? 
         WHERE donor_id = ? AND type = 'money' AND status = 'pending' 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [amount, metadata?.donor_id || 1]
      );

      // Update user rewards
      if (metadata?.donor_id) {
        await updateUserRewardsAfterPayment(metadata.donor_id, amount);
      }

      res.json({
        success: true,
        data: response.data.data,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
        data: response.data.data
      });
    }

  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Handle payment callback/webhook
router.post('/callback', async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === 'charge.success') {
      const { reference, amount, metadata, status } = data;

      if (status === 'success') {
        // Update donation record
        const actualAmount = amount / 100; // Convert from kobo
        
        await db.execute(
          `UPDATE donations 
           SET status = 'completed', amount = ? 
           WHERE donor_id = ? AND type = 'money' AND status = 'pending' 
           ORDER BY created_at DESC 
           LIMIT 1`,
          [actualAmount, metadata?.donor_id || 1]
        );

        // Update user rewards
        if (metadata?.donor_id) {
          await updateUserRewardsAfterPayment(metadata.donor_id, actualAmount);
        }

        console.log(`✅ Payment completed: ${reference} - $${actualAmount}`);
      }
    }

    // Always respond with 200 to acknowledge webhook
    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Paystack callback error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Callback processing failed' 
    });
  }
});

// Helper function to update user rewards after successful payment
async function updateUserRewardsAfterPayment(userId, amount) {
  try {
    // Calculate points (10 base + 1 per dollar)
    const pointsToAdd = 10 + Math.floor(amount);

    // Get current rewards
    const [rows] = await db.execute(
      'SELECT * FROM user_rewards WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      // Create new rewards record
      await db.execute(
        'INSERT INTO user_rewards (user_id, points, streak, last_donation_date) VALUES (?, ?, 1, CURDATE())',
        [userId, pointsToAdd]
      );
    } else {
      const currentRewards = rows[0];
      const today = new Date().toISOString().split('T')[0];
      const lastDonationDate = currentRewards.last_donation_date ? 
        currentRewards.last_donation_date.toISOString().split('T')[0] : null;

      let newStreak = currentRewards.streak;
      let bonusPoints = 0;

      // Calculate streak bonus
      if (lastDonationDate) {
        const daysDiff = Math.floor(
          (new Date(today) - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDiff === 1) {
          newStreak += 1;
          bonusPoints = Math.floor(newStreak / 7) * 5; // 5 bonus points per week streak
        } else if (daysDiff > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Update rewards
      await db.execute(
        `UPDATE user_rewards 
         SET points = points + ? + ?, streak = ?, last_donation_date = CURDATE(), updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [pointsToAdd, bonusPoints, newStreak, userId]
      );
    }
  } catch (error) {
    console.error('Error updating rewards after payment:', error);
  }
}

export default router;