// backend/routes/tags.js
const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// CREATE a new tag 
router.post('/', async (req, res) => {
  const { user_id, name, color } = req.body;
  try {
    await db.query('CALL CreateTag(?, ?, ?)', [user_id, name, color]);
    res.status(201).send('Tag created.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create tag.');
  }
});

// READ all tags
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;
    const query = user_id
      ? 'SELECT * FROM tags WHERE user_id = ?'
      : 'SELECT * FROM tags';
    const params = user_id ? [user_id] : [];
    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch tags.');
  }
});

// UPDATE a tag 
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  try {
    await db.query('CALL UpdateTag(?, ?, ?)', [id, name, color]);
    res.status(200).send('Tag updated.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update tag.');
  }
});

// DELETE a tag
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('CALL DeleteTag(?)', [id]);
    res.status(200).send('Tag deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete tag.');
  }
});

module.exports = router;
