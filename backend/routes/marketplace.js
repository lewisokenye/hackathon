import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Get all marketplace items
router.get('/', async (req, res) => {
  try {
    const { status = 'available' } = req.query;
    
    const [rows] = await db.execute(`
      SELECT m.*, u.name as donor_name 
      FROM marketplace_items m 
      JOIN users u ON m.donor_id = u.id 
      WHERE m.status = ?
      ORDER BY m.created_at DESC
    `, [status]);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new marketplace item
router.post('/', async (req, res) => {
  try {
    const { name, description, quantity, donor_id, category, location } = req.body;

    // Validate required fields
    if (!name || !description || !quantity || !donor_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, description, quantity, donor_id' 
      });
    }

    const [result] = await db.execute(
      `INSERT INTO marketplace_items (name, description, quantity, donor_id, category, location, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'available')`,
      [name, description, quantity, donor_id, category || null, location || null]
    );

    res.status(201).json({ 
      success: true, 
      data: { id: result.insertId, message: 'Item added to marketplace successfully' }
    });
  } catch (error) {
    console.error('Error adding marketplace item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Claim an item
router.put('/:id/claim', async (req, res) => {
  try {
    const { id } = req.params;
    const { claimant_id } = req.body;

    // Check if item exists and is available
    const [existing] = await db.execute(
      'SELECT * FROM marketplace_items WHERE id = ? AND status = "available"',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Item not found or already claimed' 
      });
    }

    // Update item status to claimed
    const [result] = await db.execute(
      'UPDATE marketplace_items SET status = "claimed" WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, message: 'Item claimed successfully' });
  } catch (error) {
    console.error('Error claiming item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update item status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['available', 'claimed', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status. Must be one of: available, claimed, expired' 
      });
    }

    const [result] = await db.execute(
      'UPDATE marketplace_items SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, message: 'Item status updated successfully' });
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.execute(`
      SELECT m.*, u.name as donor_name 
      FROM marketplace_items m 
      JOIN users u ON m.donor_id = u.id 
      WHERE m.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;