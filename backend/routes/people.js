const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// CREATE person
router.post('/', async (req, res) => {
  const { user_id, name, phone, email, dob, gender } = req.body;
  try {
    await db.query(
      `INSERT INTO people (user_id, name, phone, email, dob, gender) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, name, phone, email, dob, gender]
    );
    res.status(201).send('Person added.');
  } catch (err) {
    res.status(500).send('Insert failed.');
  }
});

// READ all people or by user_id this isnt a secure route but its fine for school lol
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id
      ? 'SELECT * FROM people WHERE user_id = ?'
      : 'SELECT * FROM people';
    const params = user_id ? [user_id] : [];
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch people.');
  }
});


// UPDATE person
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await db.query(
      `UPDATE people SET name = ?, email = ? WHERE people_id = ?`,
      [name, email, id]
    );
    res.status(200).send('Person updated.');
  } catch (err) {
    res.status(500).send('Update failed.');
  }
});

// DELETE person
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM people WHERE people_id = ?`, [id]);
    res.status(200).send('Person deleted.');
  } catch (err) {
    res.status(500).send('Delete failed.');
  }
});

module.exports = router;
