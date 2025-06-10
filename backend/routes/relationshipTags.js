// backend/routes/relationshipTags.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// ASSIGN tag (now procedure-based)
router.post('/', async (req, res) => {
  const { relationship_id, tag_id } = req.body;
  try {
    await db.query(
      `CALL AssignRelationshipTag(?, ?)`,
      [relationship_id, tag_id]
    );
    res.status(201).json({ message: 'Tag assigned.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to assign tag.' });
  }
});

// READ all tags for a person’s relationships (unchanged)
router.get('/', async (req, res) => {
  const { person_id } = req.query;
  try {
    const [rows] = await db.query(
      `SELECT 
         rt.relationship_id,
         rt.tag_id,
         t.label
       FROM relationship_tags AS rt
       JOIN relationships   AS r
         ON rt.relationship_id = r.relationship_id
       JOIN tags            AS t
         ON rt.tag_id          = t.tag_id
       WHERE r.person_id = ?`,
      [person_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch tags.' });
  }
});

// REMOVE tag (now procedure-based)
router.delete('/', async (req, res) => {
  const { relationship_id, tag_id } = req.body;
  try {
    await db.query(
      `CALL RemoveRelationshipTag(?, ?)`,
      [relationship_id, tag_id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove tag.' });
  }
});

module.exports = router;
