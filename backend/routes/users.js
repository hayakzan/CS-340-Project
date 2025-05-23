// backend/routes/users.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// 1) CREATE a new user
// POST /users
router.post('/', async (req, res) => {
  const { name, username, dob, gender } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO users (name, username, dob, gender)
       VALUES (?, ?, ?, ?)`,
      [name, username, dob, gender]
    );
    // return the new user_id so frontend can redirect if desired
    res.status(201).json({ user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create user.');
  }
});

// 2) READ all users
// GET /users
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, name, username,
              dob, gender, created_at
         FROM users`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch users.');
  }
});

// 3) READ one user by ID
// GET /users/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT user_id, name, username,
              dob, gender, created_at
         FROM users
        WHERE user_id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch user.');
  }
});

// 4) UPDATE a user
// PUT /users/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, username, dob, gender } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE users
         SET name     = ?,
             username = ?,
             dob      = ?,
             gender   = ?
       WHERE user_id = ?`,
      [name, username, dob, gender, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update user.');
  }
});

// 5) DELETE a user
// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `DELETE FROM users WHERE user_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete user.');
  }
});

module.exports = router;
