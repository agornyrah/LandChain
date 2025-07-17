const express = require('express');
const bcrypt = require('bcrypt');
const { getUserByEmail, createUser } = require('../db');
const router = express.Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  const { fullname, email, phone, address, password } = req.body;
  if (!fullname || !email || !phone || !address || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({
      fullname,
      email,
      phone,
      address,
      password: hash,
      role: 'user'
    });
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ success: true, user: req.session.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.json({ success: true, user: req.session.user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// @route   GET api/auth/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

module.exports = router;