const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbFile = path.join(__dirname, '../landchain.sqlite');
const db = new sqlite3.Database(dbFile);

function runCleanup() {
  db.serialize(() => {
    db.run('PRAGMA foreign_keys = OFF;');
    db.run(
      `DELETE FROM transfers WHERE property_id NOT IN (SELECT property_id FROM properties);`,
      function (err) {
        if (err) {
          console.error('Error deleting transfers with missing properties:', err.message);
        } else {
          console.log(`Deleted ${this.changes} transfers with missing properties.`);
        }
      }
    );
    db.run(
      `DELETE FROM transfers WHERE from_user_id NOT IN (SELECT id FROM users) OR to_user_id NOT IN (SELECT id FROM users);`,
      function (err) {
        if (err) {
          console.error('Error deleting transfers with missing users:', err.message);
        } else {
          console.log(`Deleted ${this.changes} transfers with missing users.`);
        }
      }
    );
  });
}

runCleanup();
db.close(); 