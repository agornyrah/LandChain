const express = require('express');
const requireAuth = require('../middleware/auth');
const { db } = require('../db');

const router = express.Router();

// --- Get All Transfers (Admin Only) ---
router.get('/', requireAuth, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
  }
  db.all(`SELECT t.*, 
            u1.username as from_username, u1.first_name as from_first_name, u1.last_name as from_last_name,
            u2.username as to_username, u2.first_name as to_first_name, u2.last_name as to_last_name,
            p.address as property_address, p.size as property_size, p.type as property_type
            FROM transfers t
            LEFT JOIN users u1 ON t.from_user_id = u1.id
            LEFT JOIN users u2 ON t.to_user_id = u2.id
            LEFT JOIN properties p ON t.property_id = p.property_id
            ORDER BY t.created_at DESC`, [], (err, transfers) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, transfers: transfers || [] });
  });
});

// --- Get Current User's Transfers ---
router.get('/my', requireAuth, (req, res) => {
  db.all(`SELECT t.*, u1.username as from_username, u2.username as to_username, u1.email as from_email, u2.email as to_email, p.address as property_address, p.size as property_size, p.type as property_type, p.status as property_status
            FROM transfers t
            LEFT JOIN users u1 ON t.from_user_id = u1.id
            LEFT JOIN users u2 ON t.to_user_id = u2.id
            LEFT JOIN properties p ON t.property_id = p.property_id
            WHERE t.from_user_id = ? OR t.to_user_id = ?
            ORDER BY t.created_at DESC`,
    [req.session.user.id, req.session.user.id], (err, transfers) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, transfers });
  });
});

// --- Create Transfer Request ---
router.post('/', requireAuth, (req, res) => {
  const { property_id, to_user_id } = req.body;
  if (!property_id || !to_user_id) return res.status(400).json({ success: false, error: 'Missing fields' });
  db.get('SELECT * FROM properties WHERE property_id = ?', [property_id], (err, property) => {
    if (err || !property) return res.status(404).json({ success: false, error: 'Property not found' });
    if (property.owner_id !== req.session.user.id) return res.status(403).json({ success: false, error: 'Not the owner' });
    if (property.status !== 'registered') return res.status(400).json({ success: false, error: 'Property must be registered to transfer' });
    db.get('SELECT * FROM transfers WHERE property_id = ? AND status = ?', [property_id, 'pending'], (err, existingTransfer) => {
      if (existingTransfer) return res.status(400).json({ success: false, error: 'A pending transfer already exists for this property.' });
      db.get('SELECT * FROM users WHERE id = ?', [to_user_id], (err, toUser) => {
        if (err || !toUser) return res.status(404).json({ success: false, error: 'Recipient user not found' });
        db.get('SELECT * FROM users WHERE id = ?', [req.session.user.id], (err, fromUser) => {
          if (err || !fromUser) return res.status(404).json({ success: false, error: 'Sender user not found' });
          db.run('INSERT INTO transfers (property_id, from_user_id, to_user_id, status) VALUES (?, ?, ?, ?)',
            [property_id, req.session.user.id, to_user_id, 'pending'],
            function (err) {
              if (err) return res.status(500).json({ success: false, error: err.message });
              res.json({ success: true, transfer_id: this.lastID });
            });
        });
      });
    });
  });
});

// --- Get All Pending Transfers (Commissioner) ---
router.get('/pending', requireAuth, (req, res) => {
  if (req.session.user.role !== 'commissioner') return res.status(403).json({ success: false, error: 'Forbidden' });
  db.all(`SELECT t.*, p.address, u1.username as from_username, u2.username as to_username
            FROM transfers t
            LEFT JOIN properties p ON t.property_id = p.property_id
            LEFT JOIN users u1 ON t.from_user_id = u1.id
            LEFT JOIN users u2 ON t.to_user_id = u2.id
            WHERE t.status = 'pending'`, [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, transfers: rows });
  });
});

// --- Approve Transfer (Commissioner) ---
router.patch('/:id/approve', requireAuth, (req, res) => {
  if (req.session.user.role !== 'commissioner') return res.status(403).json({ success: false, error: 'Forbidden' });
  const transferId = req.params.id;
  db.get('SELECT * FROM transfers WHERE id = ?', [transferId], (err, transfer) => {
    if (err || !transfer) return res.status(404).json({ success: false, error: 'Transfer not found' });
    if (transfer.status !== 'pending') return res.status(400).json({ success: false, error: 'Transfer not pending' });
    db.serialize(() => {
      db.run('UPDATE properties SET owner_id = ? WHERE property_id = ?', [transfer.to_user_id, transfer.property_id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        db.run('UPDATE transfers SET status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?', ['approved', transferId], function (err) {
          if (err) return res.status(500).json({ success: false, error: err.message });
          db.run('INSERT INTO ownership_history (property_id, from_user_id, to_user_id) VALUES (?, ?, ?)',
            [transfer.property_id, transfer.from_user_id, transfer.to_user_id],
            function (err) {
              if (err) return res.status(500).json({ success: false, error: err.message });
              res.json({ success: true });
            });
        });
      });
    });
  });
});

// --- Get Transfer by ID ---
router.get('/:id', requireAuth, (req, res) => {
  const transferId = req.params.id;
  db.get('SELECT * FROM transfers WHERE id = ?', [transferId], (err, transfer) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!transfer) return res.status(404).json({ success: false, error: 'Transfer not found' });
    res.json({ success: true, transfer });
  });
});

module.exports = router;