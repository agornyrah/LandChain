const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const dbFile = path.join(__dirname, 'landchain.sqlite');
const db = new sqlite3.Database(dbFile);

// Get user by email
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

// Create a new user
// Note: 'role' should only be set to 'admin' or 'commissioner' by trusted admin code. Registration always passes 'user'.
function createUser({ fullname, email, phone, address, password, role }) {
  return new Promise((resolve, reject) => {
    const [first_name, last_name] = fullname.split(' ');
    db.run(
      'INSERT INTO users (username, email, password_hash, role, first_name, last_name, address, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        email, // username
        email,
        password, // password_hash
        role,
        first_name || '',
        last_name || '',
        address,
        phone
      ],
      function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          fullname,
          email,
          role
        });
      }
    );
  });
}

module.exports = {
  db,
  getUserByEmail,
  createUser
};