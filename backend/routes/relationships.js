// backend/routes/relationships.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// CREATE relationship
// POST /relationships
router.post('/', async (req, res) => {
  const { person_id, rel_type, status, started_at, end_at, notes } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO relationships
         (person_id, rel_type, status, started_at, ended_at, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [person_id, rel_type, status, started_at || null, end_at || null, notes || null]
    );
    res.status(201).json({ relationship_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create relationship.');
  }
});

// READ all (or by person_id)
// GET /relationships?person_id=…
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
// PUT /relationships/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { rel_type, status, started_at, end_at, notes } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE relationships
         SET rel_type   = ?,
             status     = ?,
             started_at = ?,
             ended_at   = ?,
             notes      = ?
       WHERE relationship_id = ?`,
      [rel_type, status, started_at || null, end_at || null, notes || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Relationship not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update relationship.');
  }
});

// DELETE relationship
// DELETE /relationships/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `DELETE FROM relationships WHERE relationship_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Relationship not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete relationship.');
  }
});

module.exports = router;
