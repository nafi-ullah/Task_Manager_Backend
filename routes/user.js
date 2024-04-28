const express = require('express');
const db = require('../DB/dbconnect');

const router = express.Router();



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
  const { name, email, password,role } = req.body;
  db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  });
});

// Update a user
router.put('/:userid', (req, res) => {
  const { name, email, password, role } = req.body;
  const userId = req.params.userid;
  db.query('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE userid = ?', [name, email, password, role, userId], (err, result) => {
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


// {
//     "name": "rifat",
//     "email": "rifat@gmail.com",
//     "password": "pending",
//     "role": "admin"
// }