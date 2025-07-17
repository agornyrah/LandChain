const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../landchain.sqlite');
const db = new sqlite3.Database(dbFile);

// Ensure complaints table exists with status
const createTableSql = `CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  subject TEXT,
  email TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending'
)`;
db.run(createTableSql);

// POST /api/complaints - submit a complaint
router.post('/', (req, res) => {
  const { subject, email, message } = req.body;
  if (!subject || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const date = new Date().toISOString();
  db.run(
    'INSERT INTO complaints (date, subject, email, message, status) VALUES (?, ?, ?, ?, ?)',
    [date, subject, email, message, 'pending'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// GET /api/complaints - fetch all complaints, filter by email if provided
router.get('/', (req, res) => {
  const { email } = req.query;
  let sql = 'SELECT * FROM complaints';
  const params = [];
  if (email) {
    sql += ' WHERE email = ?';
    params.push(email);
  }
  sql += ' ORDER BY date DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ complaints: rows });
  });
});

// DELETE /api/complaints/:id - delete a complaint
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM complaints WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// PATCH /api/complaints/:id - mark as resolved/pending
router.patch('/:id', (req, res) => {
  const { status } = req.body;
  if (!['pending', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  db.run('UPDATE complaints SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router; 