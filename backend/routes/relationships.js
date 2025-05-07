const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// CREATE a new relationship
router.post('/', async (req, res) => {
  const { user_id, name, type, status, started_at } = req.body;
  try {
    await db.query(
      `INSERT INTO relationships (user_id, name, type, status, started_at)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, name, type, status, started_at]
    );
    res.status(201).send('Relationship created.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create relationship.');
  }
});

// READ all relationships or by id this isnt a secure route but its fine for school
router.get('/', async (req, res) => {
  try {
    const { person_id } = req.query;
    const query = person_id
      ? 'SELECT * FROM relationships WHERE person_id = ?'
      : 'SELECT * FROM relationships';
    const params = person_id ? [person_id] : [];
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch relationships.');
  }
});


// UPDATE a relationship
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, status, started_at } = req.body;
  try {
    await db.query(
      `UPDATE relationships
       SET name = ?, type = ?, status = ?, started_at = ?
       WHERE relationship_id = ?`,
      [name, type, status, started_at, id]
    );
    res.status(200).send('Relationship updated.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update relationship.');
  }
});

// DELETE a relationship
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      `DELETE FROM relationships WHERE relationship_id = ?`,
      [id]
    );
    res.status(200).send('Relationship deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete relationship.');
  }
});

module.exports = router;
