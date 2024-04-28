const express = require('express');
const db = require('../DB/dbconnect');

const router = express.Router();

const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) ,
    email VARCHAR(200),
    password VARCHAR(200)
  )
`;

// Create user table if not exists
db.query(createUserTable, (err) => {
  if (err) {
    console.error('Error creating "users" table:', err);
  } else {
    console.log('"users" table created (or already exists)');
  }
});

// Get all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(result);
  });
});

// Create a new user
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  });
});

// Update a user
router.put('/:userid', (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.params.userid;
  db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE userid = ?', [name, email, password, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Delete a user
router.delete('/:userid', (req, res) => {
  const userId = req.params.userid;
  db.query('DELETE FROM users WHERE userid = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
