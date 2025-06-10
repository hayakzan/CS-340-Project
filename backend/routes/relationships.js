// backend/routes/relationships.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// CREATE relationship
router.post('/', async (req, res) => {
  const { person_id, rel_type, status, started_at, ended_at, notes } = req.body;
  try {
    const [result] = await db.query(
      `CALL CreateRelationship(?, ?, ?, ?, ?, ?)`,
      [person_id, rel_type, status, started_at || null, ended_at || null, notes || null]
    );

    const insertId = result[0]?.insertId || result[0]?.[0]?.insertId;
    res.status(201).json({ relationship_id: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create relationship.');
  }
});

// READ all (or by person_id)
router.get('/', async (req, res) => {
  try {
    const { person_id } = req.query;
    let sql = `SELECT * FROM relationships`;
    const params = [];
    if (person_id) {
      sql += ` WHERE person_id = ?`;
      params.push(person_id);
    }
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch relationships.');
  }
});

// UPDATE relationship
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { rel_type, status, started_at, ended_at, notes } = req.body;
  try {
    await db.query(
      `CALL UpdateRelationship(?, ?, ?, ?, ?, ?)`,
      [id, rel_type, status, started_at || null, ended_at || null, notes || null]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update relationship.');
  }
});

// DELETE relationship
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      `CALL DeleteRelationship(?)`,
      [id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete relationship.');
  }
});

module.exports = router;
