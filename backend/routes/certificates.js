const express = require('express');
const requireAuth = require('../middleware/auth');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../landchain.sqlite');
const db = new sqlite3.Database(dbFile);

const router = express.Router();

// --- Get Certificate (Blockchain, TODO) ---
router.get('/:propertyId', (req, res) => {
  const propertyId = req.params.propertyId;
  // TODO: Fetch certificate from blockchain (chaincode)
  res.status(501).json({ success: false, error: 'Not implemented: integrate with chaincode' });
});

// --- Generate Certificate for Property (Blockchain, TODO) ---
router.post('/:propertyId/generate', requireAuth, (req, res) => {
  const propertyId = req.params.propertyId;
  // TODO: Call chaincode to generate certificate
  res.status(501).json({ success: false, error: 'Not implemented: generate certificate' });
});

// --- Verify Certificate (Blockchain, TODO) ---
router.post('/verify', (req, res) => {
  const { certificateHash, propertyId } = req.body;
  if (!certificateHash && !propertyId) {
    return res.status(400).json({ success: false, error: 'Certificate hash or property ID required' });
  }
  let query, params;
  if (certificateHash) {
    // Verify by certificate hash (mock implementation)
    // In a real blockchain implementation, this would verify the hash against the blockchain
    query = 'SELECT * FROM properties WHERE property_id = ?';
    params = [certificateHash];
  } else {
    // Verify by property ID
    query = 'SELECT * FROM properties WHERE property_id = ?';
    params = [propertyId];
  }
  db.get(query, params, (err, property) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!property) {
      return res.json({ 
        success: false, 
        verified: false, 
        error: 'Certificate not found or invalid' 
      });
    }
    db.get('SELECT username, email, first_name, last_name FROM users WHERE id = ?', [property.owner_id], (err, owner) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      const certificateData = {
        propertyId: property.property_id,
        address: property.address,
        size: property.size,
        type: property.type,
        status: property.status,
        owner: owner ? {
          username: owner.username,
          email: owner.email,
          name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim()
        } : null,
        verifiedAt: new Date().toISOString(),
        certificateHash: certificateHash || `CERT-${property.property_id}-${Date.now()}`
      };
      res.json({ 
        success: true, 
        verified: true, 
        certificate: certificateData 
      });
    });
  });
});

module.exports = router; 