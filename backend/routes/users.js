// backend/routes/users.js

const express = require('express');
const router  = express.Router();
const pool    = require('../db-connector');

// — READ all users —
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Could not fetch users' });
  }
});

// — READ one user by ID —
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(`Error fetching user ${id}:`, err);
    res.status(500).json({ message: 'Could not fetch user' });
  }
});

// — CREATE a new user via stored proc CreateUser(...) —
router.post('/', async (req, res) => {
  const { name, username, dob, gender } = req.body;
  try {
    await pool.query('CALL CreateUser(?,?,?,?)', [
      name,
      username,
      dob || null,
      gender || null
    ]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Could not create user' });
  }
});

// — UPDATE an existing user via stored proc UpdateUser(...) —
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, username, dob, gender } = req.body;
  try {
    await pool.query('CALL UpdateUser(?,?,?,?,?)', [
      id,
      name,
      username,
      dob || null,
      gender || null
    ]);
    res.sendStatus(204);
  } catch (err) {
    console.error(`Error updating user ${id}:`, err);
    res.status(500).json({ message: 'Could not update user' });
  }
});

// — DELETE a user via stored proc DeleteUser(...) —
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('CALL DeleteUser(?)', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(`Error deleting user ${id}:`, err);
    res.status(500).json({ message: 'Could not delete user' });
  }
});

module.exports = router;
