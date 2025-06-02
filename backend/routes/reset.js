// backend/routes/reset.js

const express = require('express');
const router  = express.Router();
const pool    = require('../db-connector');

// Route to reset all data
router.get('/reset-all', async (req, res) => {
  try {
    await pool.query('CALL ResetRelationshipTracker();');
    console.log("Database reset successfully.");

    // Send back JSON
    res.json({ message: 'Database reset successfully' });
  } catch (err) {
    console.error("Error during reset:", err);

    // 500 status + JSON error message
    res.status(500).json({ message: 'Reset failed' });
  }
});

// Route to delete sample player
router.get('/delete-sample-player', async (req, res) => {
  try {
    await pool.query('CALL DeleteSamplePlayer();');
    console.log("Sample player deleted.");

    // Send back JSON
    res.json({ message: 'Sample player deleted. Use RESET to restore.' });
  } catch (err) {
    console.error("Error during delete:", err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
