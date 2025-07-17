const express = require('express');
const bcrypt = require('bcrypt');
const { db } = require('../db');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
  db.all('SELECT id, email, username, role, phone, address FROM users', [], (err, users) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, users });
  });
});

// @route   PATCH api/users/me
// @desc    Update current user's profile
// @access  Private
router.patch('/me', async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  const userId = req.session.user.id;
  const { email, phone, address, password } = req.body;
  if (!email && !phone && !address && !password) {
    return res.status(400).json({ success: false, message: 'No fields to update.' });
  }
  try {
    let updateFields = [];
    let params = [];
    if (email) { updateFields.push('email = ?'); params.push(email); }
    if (phone) { updateFields.push('phone = ?'); params.push(phone); }
    if (address) { updateFields.push('address = ?'); params.push(address); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updateFields.push('password_hash = ?');
      params.push(hash);
    }
    params.push(userId);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get('SELECT id, email, username, role, phone, address FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        req.session.user = { id: user.id, email: user.email, role: user.role };
        res.json({ success: true, user });
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
});

module.exports = router;