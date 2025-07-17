const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../landchain.sqlite');
const db = new sqlite3.Database(dbFile);

// Helper: format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

// Users registered per day
router.get('/users', (req, res) => {
  db.all(`SELECT DATE(created_at) as day, COUNT(*) as count FROM users GROUP BY day ORDER BY day ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = rows.map(r => r.day);
    const data = rows.map(r => r.count);
    res.json({ labels, data });
  });
});

// Properties registered per day
router.get('/properties', (req, res) => {
  db.all(`SELECT DATE(created_at) as day, COUNT(*) as count FROM properties GROUP BY day ORDER BY day ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = rows.map(r => r.day);
    const data = rows.map(r => r.count);
    res.json({ labels, data });
  });
});

// Revenue per day (example: count of transfers * 100 as fake revenue)
router.get('/revenue', (req, res) => {
  db.all(`SELECT DATE(created_at) as day, COUNT(*) * 100 as revenue FROM transfers WHERE status = 'approved' GROUP BY day ORDER BY day ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = rows.map(r => r.day);
    const data = rows.map(r => r.revenue);
    res.json({ labels, data });
  });
});

module.exports = router; 