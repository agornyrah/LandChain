const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../landchain.sqlite');
const db = new sqlite3.Database(dbFile);

const query = `
  SELECT t.id, t.property_id, p.address as property_address, p.size as property_size, p.type as property_type, p.status as property_status,
         t.from_user_id, u1.username as from_username, u1.email as from_email,
         t.to_user_id, u2.username as to_username, u2.email as to_email,
         t.status, t.created_at, t.approved_at
  FROM transfers t
  LEFT JOIN properties p ON t.property_id = p.property_id
  LEFT JOIN users u1 ON t.from_user_id = u1.id
  LEFT JOIN users u2 ON t.to_user_id = u2.id
  ORDER BY t.created_at DESC
`;

db.all(query, [], (err, rows) => {
  if (err) {
    console.error('Error querying transfers:', err.message);
    db.close();
    return;
  }
  if (rows.length === 0) {
    console.log('No transfers found.');
    db.close();
    return;
  }
  rows.forEach(row => {
    console.log('---');
    console.log(`Transfer ID: ${row.id}`);
    console.log(`Property ID: ${row.property_id}`);
    console.log(`  Address: ${row.property_address}`);
    console.log(`  Size: ${row.property_size}`);
    console.log(`  Type: ${row.property_type}`);
    console.log(`  Status: ${row.property_status}`);
    console.log(`From User ID: ${row.from_user_id}`);
    console.log(`  Username: ${row.from_username}`);
    console.log(`  Email: ${row.from_email}`);
    console.log(`To User ID: ${row.to_user_id}`);
    console.log(`  Username: ${row.to_username}`);
    console.log(`  Email: ${row.to_email}`);
    console.log(`Transfer Status: ${row.status}`);
    console.log(`Initiated: ${row.created_at}`);
    console.log(`Approved: ${row.approved_at}`);
  });
  db.close();
}); 