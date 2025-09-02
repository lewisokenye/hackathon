import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all donations
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT d.*, u.name as donor_name 
      FROM donations d 
      JOIN users u ON d.donor_id = u.id 
      ORDER BY d.created_at DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get donations by user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM donations WHERE donor_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new donation
router.post('/', async (req, res) => {
  try {
    const { donor_id, type, description, amount, food_type, quantity } = req.body;

    // Validate required fields
    if (!donor_id || !type || !description) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: donor_id, type, description' 
      });
    }

    if (type === 'money' && !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount is required for monetary donations' 
      });
    }

    if (type === 'food' && (!food_type || !quantity)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Food type and quantity are required for food donations' 
      });
    }

    const [result] = await db.execute(
      `INSERT INTO donations (donor_id, type, description, amount, food_type, quantity, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
      [donor_id, type, description, amount || null, food_type || null, quantity || null]
    );

    // Update user rewards (add 10 points per donation)
    await updateUserRewards(donor_id);

    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, message: 'Donation created successfully' }
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update donation status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description } = req.body;

    const [result] = await db.execute(
      'UPDATE donations SET status = ?, description = ? WHERE id = ?',
      [status, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Donation not found' });
    }

    res.json({ success: true, message: 'Donation updated successfully' });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to update user rewards
async function updateUserRewards(userId) {
  try {
    // Check if user rewards record exists
    const [existing] = await db.execute(
      'SELECT * FROM user_rewards WHERE user_id = ?',
      [userId]
    );

    if (existing.length === 0) {
      // Create new rewards record
      await db.execute(
        'INSERT INTO user_rewards (user_id, points, streak, last_donation_date) VALUES (?, 10, 1, CURDATE())',
        [userId]
      );
    } else {
      const userRewards = existing[0];
      const today = new Date().toISOString().split('T')[0];
      const lastDonationDate = userRewards.last_donation_date ? 
        userRewards.last_donation_date.toISOString().split('T')[0] : null;

      let newStreak = userRewards.streak;
      let bonusPoints = 0;

      // Calculate streak
      if (lastDonationDate) {
        const daysDiff = Math.floor(
          (new Date(today) - new Date(lastDonationDate)) / (1000 * 60 * 60 * 24)
        );
        
        if (daysDiff === 1) {
          // Consecutive day - increase streak
          newStreak += 1;
          bonusPoints = Math.floor(newStreak / 7) * 5; // 5 bonus points per week streak
        } else if (daysDiff > 1) {
          // Streak broken
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Update rewards
      await db.execute(
        `UPDATE user_rewards 
         SET points = points + 10 + ?, streak = ?, last_donation_date = CURDATE() 
         WHERE user_id = ?`,
        [bonusPoints, newStreak, userId]
      );
    }
  } catch (error) {
    console.error('Error updating user rewards:', error);
  }
}

export default router;