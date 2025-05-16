// backend/routes/people.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// 1) CREATE a new person
// POST /people
router.post('/', async (req, res) => {
  const { user_id, name, phone, email, dob, gender } = req.body;
  try {
    const [ result ] = await db.query(
      `INSERT INTO people
         (user_id, name, phone, email, dob, gender)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, name, phone, email, dob, gender]
    );
    res.status(201).json({ people_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create person.');
  }
});

// 2) READ all people (or by user_id)
// GET /people?user_id=…
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id
      ? 'SELECT * FROM people WHERE user_id = ?'
      : 'SELECT * FROM people';
    const params = user_id ? [user_id] : [];
    const [ rows ] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch people.');
  }
});

// 3) READ one person by ID
// GET /people/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [ rows ] = await db.query(
      `SELECT * 
         FROM people
        WHERE people_id = ?`,
      [ id ]
    );
    if (rows.length === 0) {
      return res.status(404).send('Person not found');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch person.');
  }
});

// 4) UPDATE a person
// PUT /people/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, dob, gender } = req.body;
  try {
    const [ result ] = await db.query(
      `UPDATE people
         SET name   = ?,
             phone  = ?,
             email  = ?,
             dob    = ?,
             gender = ?
       WHERE people_id = ?`,
      [ name, phone, email, dob, gender, id ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Person not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update person.');
  }
});

// 5) DELETE a person
// DELETE /people/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [ result ] = await db.query(
      `DELETE FROM people WHERE people_id = ?`,
      [ id ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Person not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete person.');
  }
});

module.exports = router;
