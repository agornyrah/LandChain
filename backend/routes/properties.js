const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// @route   GET api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const properties = await Property.findAll();
    res.json(properties);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/properties
// @desc    Create a new property
// @access  Protected
router.post('/', auth, async (req, res) => {
  const { owner, gpsCoordinates, landTitle, address, size, type, status } = req.body;
  if (!owner || !gpsCoordinates || !landTitle) {
    return res.status(400).json({ success: false, error: 'Owner, GPS coordinates, and land title are required' });
  }
  try {
    const property = await Property.create({ 
      owner, 
      gpsCoordinates, 
      landTitle,
      address,
      size,
      type: type || 'residential',
      status: status || 'active'
    });
    res.status(201).json({ success: true, property, id: property.id });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Land title must be unique' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PATCH api/properties/:id
// @desc    Edit a property
// @access  Protected
router.patch('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { owner, gpsCoordinates, landTitle } = req.body;
  try {
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    if (owner !== undefined) property.owner = owner;
    if (gpsCoordinates !== undefined) property.gpsCoordinates = gpsCoordinates;
    if (landTitle !== undefined) property.landTitle = landTitle;
    await property.save();
    res.json({ success: true, property });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Land title must be unique' });
    }
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/properties/:id
// @desc    Delete a property
// @access  Protected
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByPk(id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    await property.destroy();
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;