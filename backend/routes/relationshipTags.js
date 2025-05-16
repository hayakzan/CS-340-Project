// backend/routes/relationshipTags.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// ASSIGN tag
// POST /relationship-tags
router.post('/', async (req, res) => {
  const { relationship_id, tag_id } = req.body;
  try {
    await db.query(
      `INSERT INTO relationship_tags
         (relationship_id, tag_id)
       VALUES (?, ?)`,
      [relationship_id, tag_id]
    );
    res.status(201).send('Tag assigned.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to assign tag.');
  }
});

// READ all (or by person_id)
// GET /relationship-tags?person_id=…
router.get('/', async (req, res) => {
  try {
    const { person_id } = req.query;
    let sql = `
      SELECT rt.*
        FROM relationship_tags AS rt
        JOIN relationships   AS r
          ON rt.relationship_id = r.relationship_id
    `;
    const params = [];
    if (person_id) {
      sql += ` WHERE r.person_id = ?`;
      params.push(person_id);
    }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch tags.');
  }
});

// REMOVE tag
// DELETE /relationship-tags
router.delete('/', async (req, res) => {
  const { relationship_id, tag_id } = req.body;
  try {
    await db.query(
      `DELETE FROM relationship_tags
       WHERE relationship_id = ?
         AND tag_id          = ?`,
      [relationship_id, tag_id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to remove tag.');
  }
});

module.exports = router;
