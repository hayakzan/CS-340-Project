// backend/routes/reset.js

const express = require('express');
const router  = express.Router();
const pool    = require('../db-connector');

// Route to reset all data
router.get('/reset-all', async (req, res) => {
  try {
    await pool.query('CALL ResetRelationshipTracker();');
    console.log('Database reset successfully.');
    // return JSON response
    res.json({ message: 'Database reset successfully' });
  } catch (err) {
    console.error('Error during reset:', err);
    // 500 status + JSON error
    res.status(500).json({ message: 'Reset failed' });
  }
});

module.exports = router;
