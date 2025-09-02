import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get user rewards
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get or create user rewards
    let [rows] = await db.execute(
      'SELECT * FROM user_rewards WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      // Create default rewards record
      await db.execute(
        'INSERT INTO user_rewards (user_id, points, streak, badges) VALUES (?, 0, 0, JSON_ARRAY())',
        [userId]
      );
      
      [rows] = await db.execute(
        'SELECT * FROM user_rewards WHERE user_id = ?',
        [userId]
      );
    }

    const userRewards = rows[0];
    
    // Parse badges JSON
    let badges = [];
    try {
      badges = userRewards.badges ? JSON.parse(userRewards.badges) : [];
    } catch (e) {
      badges = [];
    }

    res.json({ 
      success: true, 
      data: {
        ...userRewards,
        badges
      }
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user points
router.put('/:userId/points', async (req, res) => {
  try {
    const { userId } = req.params;
    const { points } = req.body;

    if (typeof points !== 'number' || points < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Points must be a non-negative number' 
      });
    }

    const [result] = await db.execute(
      'UPDATE user_rewards SET points = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [points, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User rewards not found' });
    }

    // Check for badge achievements
    await checkAndAwardBadges(userId, points);

    res.json({ success: true, message: 'Points updated successfully' });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user streak
router.put('/:userId/streak', async (req, res) => {
  try {
    const { userId } = req.params;
    const { streak } = req.body;

    if (typeof streak !== 'number' || streak < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Streak must be a non-negative number' 
      });
    }

    const [result] = await db.execute(
      'UPDATE user_rewards SET streak = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [streak, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User rewards not found' });
    }

    res.json({ success: true, message: 'Streak updated successfully' });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Award badge to user
router.post('/:userId/badges', async (req, res) => {
  try {
    const { userId } = req.params;
    const { badge } = req.body;

    if (!badge) {
      return res.status(400).json({ 
        success: false, 
        error: 'Badge name is required' 
      });
    }

    // Get current badges
    const [rows] = await db.execute(
      'SELECT badges FROM user_rewards WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User rewards not found' });
    }

    let badges = [];
    try {
      badges = rows[0].badges ? JSON.parse(rows[0].badges) : [];
    } catch (e) {
      badges = [];
    }

    // Check if badge already exists
    if (!badges.includes(badge)) {
      badges.push(badge);
      
      await db.execute(
        'UPDATE user_rewards SET badges = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [JSON.stringify(badges), userId]
      );
    }

    res.json({ success: true, message: 'Badge awarded successfully', badges });
  } catch (error) {
    console.error('Error awarding badge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const [rows] = await db.execute(`
      SELECT ur.*, u.name 
      FROM user_rewards ur 
      JOIN users u ON ur.user_id = u.id 
      ORDER BY ur.points DESC 
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to check and award badges based on points
async function checkAndAwardBadges(userId, points) {
  try {
    const badges = [];
    
    if (points >= 100) badges.push('Bronze Donor');
    if (points >= 250) badges.push('Community Helper');
    if (points >= 500) badges.push('Silver Donor');
    if (points >= 750) badges.push('Food Warrior');
    if (points >= 1000) badges.push('Gold Donor');
    if (points >= 1500) badges.push('Platinum Supporter');

    // Get current badges
    const [rows] = await db.execute(
      'SELECT badges FROM user_rewards WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) return;

    let currentBadges = [];
    try {
      currentBadges = rows[0].badges ? JSON.parse(rows[0].badges) : [];
    } catch (e) {
      currentBadges = [];
    }

    // Add new badges
    let badgesUpdated = false;
    badges.forEach(badge => {
      if (!currentBadges.includes(badge)) {
        currentBadges.push(badge);
        badgesUpdated = true;
      }
    });

    if (badgesUpdated) {
      await db.execute(
        'UPDATE user_rewards SET badges = ? WHERE user_id = ?',
        [JSON.stringify(currentBadges), userId]
      );
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

export default router;