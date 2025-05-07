const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// CREATE a relationship-tag mapping
router.post('/', async (req, res) => {
  const { relationship_id, tag_id } = req.body;
  try {
    await db.query(
      `INSERT INTO relationship_tags (relationship_id, tag_id)
       VALUES (?, ?)`,
      [relationship_id, tag_id]
    );
    res.status(201).send('Tag assigned to relationship.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to assign tag.');
  }
});

// READ all mappings
router.get('/', async (req, res) => {
  try {
    const { person_id } = req.query;

    let query = `
      SELECT rt.* FROM relationship_tags rt
      JOIN relationships r ON rt.relationship_id = r.relationship_id
    `;
    const params = [];

    if (person_id) {
      query += ' WHERE r.person_id = ?';
      params.push(person_id);
    }

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch relationship-tags.');
  }
});


// DELETE a mapping
router.delete('/', async (req, res) => {
  const { relationship_id, tag_id } = req.body;
  try {
    await db.query(
      `DELETE FROM relationship_tags
       WHERE relationship_id = ? AND tag_id = ?`,
      [relationship_id, tag_id]
    );
    res.status(200).send('Tag removed from relationship.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete mapping.');
  }
});

module.exports = router;
