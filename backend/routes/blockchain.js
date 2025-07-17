const express = require('express');
const router = express.Router();

// @route   GET api/blockchain
// @desc    Get blockchain status
// @access  Public
router.get('/', (req, res) => {
  res.send('Blockchain route');
});

module.exports = router;