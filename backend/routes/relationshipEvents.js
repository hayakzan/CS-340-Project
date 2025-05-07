const express = require('express');
const router = express.Router();
const db = require('../db-connector');

// CREATE a new event
router.post('/', async (req, res) => {
  const { relationship_id, title, description, occurred_at } = req.body;
  try {
    await db.query(
      `INSERT INTO relationship_events (relationship_id, title, description, occurred_at)
       VALUES (?, ?, ?, ?)`,
      [relationship_id, title, description, occurred_at]
    );
    res.status(201).send('Event created.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create event.');
  }
});

// READ all events
router.get('/', async (req, res) => {
  try {
    const { person_id } = req.query;

    let query = `
      SELECT e.* FROM relationship_events e
      JOIN relationships r ON e.relationship_id = r.relationship_id
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
    res.status(500).send('Failed to fetch events.');
  }
});


// UPDATE an event
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, occurred_at } = req.body;
  try {
    await db.query(
      `UPDATE relationship_events
       SET title = ?, description = ?, occurred_at = ?
       WHERE event_id = ?`,
      [title, description, occurred_at, id]
    );
    res.status(200).send('Event updated.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update event.');
  }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      `DELETE FROM relationship_events WHERE event_id = ?`,
      [id]
    );
    res.status(200).send('Event deleted.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete event.');
  }
});

module.exports = router;
