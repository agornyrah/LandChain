// debug-transfer-details.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../landchain.sqlite');
const db = new sqlite3.Database(dbFile);

const propertyId = 'PROP-1751067467684';

db.get('SELECT * FROM transfers WHERE property_id = ?', [propertyId], (err, transfer) => {
  if (err) {
    console.error('Error querying transfer:', err.message);
    db.close();
    return;
  }
  if (!transfer) {
    console.log('No transfer found for property_id:', propertyId);
    db.close();
    return;
  }
  console.log('Transfer:', transfer);
  db.get('SELECT * FROM properties WHERE property_id = ?', [propertyId], (err, property) => {
    if (err) {
      console.error('Error querying property:', err.message);
      db.close();
      return;
    }
    if (!property) {
      console.log('No property found for property_id:', propertyId);
    } else {
      console.log('Property:', property);
    }
    db.get('SELECT * FROM users WHERE id = ?', [transfer.from_user_id], (err, fromUser) => {
      if (err) {
        console.error('Error querying from_user:', err.message);
        db.close();
        return;
      }
      if (!fromUser) {
        console.log('No user found for from_user_id:', transfer.from_user_id);
      } else {
        console.log('From User:', fromUser);
      }
      db.get('SELECT * FROM users WHERE id = ?', [transfer.to_user_id], (err, toUser) => {
        if (err) {
          console.error('Error querying to_user:', err.message);
        } else if (!toUser) {
          console.log('No user found for to_user_id:', transfer.to_user_id);
        } else {
          console.log('To User:', toUser);
        }
        db.close();
      });
    });
  });
}); 