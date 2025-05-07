const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// CREATE a new user
router.post('/', async (req, res) => {
  const { name, username, dob, gender } = req.body;
  try {
    await db.query(
      `INSERT INTO users (name, username, dob, gender, created_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [name, username, dob, gender]
    );
    res.status(201).send('User created.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create user.');
  }
});

// READ all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch users.');
  }
});

// UPDATE a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, username, dob, gender } = req.body;
  try {
    await db.query(
      `UPDATE users SET name = ?, username = ?, dob = ?, gender = ?
       WHERE user_id = ?`,
      [name, username, dob, gender, id]
    );
    res.status(200).send('User updated.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update user.');
  }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM users WHERE user_id = ?`, [id]);
    res.status(200).send('User deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete user.');
  }
});

module.exports = router;
