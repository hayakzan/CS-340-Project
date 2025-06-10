// backend/routes/relationshipEvents.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// CREATE event
router.post('/', async (req, res) => {
  const { relationship_id, event_type, event_desc, event_date } = req.body;
  try {
    const [result] = await db.query(
      `CALL CreateRelationshipEvent(?, ?, ?, ?)`,
      [relationship_id, event_type, event_desc || null, event_date]
    );
    const insertId = result[0]?.insertId || result[0]?.[0]?.insertId;
    res.status(201).json({ rel_event_id: insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create event.');
  }
});

// READ all (or by person_id)
router.get('/', async (req, res) => {
  try {
    const { person_id } = req.query;
    let sql = `
      SELECT e.*
        FROM relationship_events AS e
        JOIN relationships    AS r
          ON e.relationship_id = r.relationship_id
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
    res.status(500).send('Failed to fetch events.');
  }
});

// UPDATE event
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { event_type, event_desc, event_date } = req.body;
  try {
    await db.query(
      `CALL UpdateRelationshipEvent(?, ?, ?, ?)`,
      [id, event_type, event_desc || null, event_date]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update event.');
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      `CALL DeleteRelationshipEvent(?)`,
      [id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete event.');
  }
});

module.exports = router;
