// backend/routes/relationshipEvents.js
const express = require('express');
const router  = express.Router();
const db      = require('../db-connector');

// CREATE event
// POST /events
router.post('/', async (req, res) => {
  const { relationship_id, event_type, event_desc, event_date } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO relationship_events
         (relationship_id, event_type, event_desc, event_date)
       VALUES (?, ?, ?, ?)`,
      [relationship_id, event_type, event_desc || null, event_date]
    );
    res.status(201).json({ rel_event_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create event.');
  }
});

// READ all (or by person_id)
// GET /events?person_id=…
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
// PUT /events/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { event_type, event_desc, event_date } = req.body;
  try {
    const [result] = await db.query(
      `UPDATE relationship_events
         SET event_type = ?,
             event_desc = ?,
             event_date = ?
       WHERE rel_event_id = ?`,
      [event_type, event_desc || null, event_date, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Event not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update event.');
  }
});

// DELETE event
// DELETE /events/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `DELETE FROM relationship_events WHERE rel_event_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Event not found');
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete event.');
  }
});

module.exports = router;
