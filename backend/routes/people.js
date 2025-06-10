// backend/routes/people.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// 1) CREATE a new person
// POST /people
router.post('/', async (req, res) => {
  const { user_id, name, phone, email, dob, gender } = req.body;
  try {
    // CALL the stored procedure
    const [ result ] = await db.query(
      `CALL CreatePerson(?, ?, ?, ?, ?, ?)`,
      [user_id, name, phone, email, dob, gender]
    );
    
    const insertId = result[0]?.insertId || result[0]?.[0]?.insertId;
    res.status(201).json({ people_id: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create person.');
  }
});

// 2) READ all people (or by user_id)
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
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [ rows ] = await db.query(
      `SELECT * FROM people WHERE people_id = ?`,
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, dob, gender } = req.body;
  try {
    // CALL the stored procedure
    const [ result ] = await db.query(
      `CALL UpdatePerson(?, ?, ?, ?, ?, ?)`,
      [ id, name, phone, email, dob, gender ]
    );
    
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update person.');
  }
});

// 5) DELETE a person
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // CALL the stored procedure
    const [ result ] = await db.query(
      `CALL DeletePerson(?)`,
      [ id ]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete person.');
  }
});

module.exports = router;
