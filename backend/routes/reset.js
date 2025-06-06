const express = require('express');
const router = express.Router();
const pool = require('../db-connector');

// Route to reset all data
router.get('/reset-all', async (req, res) => {
  try {
    await pool.query('CALL ResetRelationshipTracker();');
    console.log("Database reset successfully.");

    res.redirect('/?message=Database reset successfully');
  } catch (err) {
    console.error("Error during reset:", err);
    res.redirect('/?message=Reset failed');
  }
});

// Route to delete sample player

router.get('/delete-sample-player', async (req, res) => {
  try {
    await pool.query('CALL DeleteSamplePlayer();');
    console.log("Sample player deleted.");

    res.redirect('/?message=Sample player deleted. Use RESET to restore.');
  } catch (err) {
    console.error("Error during delete:", err);
    res.redirect('/?message=Delete failed');
  }
});

module.exports = router;

