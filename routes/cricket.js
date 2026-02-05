const express = require('express');
const router = express.Router();
const { getLiveMatches, getMatchDetails, getSchedule } = require('../lib/cricket');

// Get Live Matches
router.get('/live', async (req, res) => {
    try {
        const result = await getLiveMatches();
        res.json(result);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Get Match Details (Ball by Ball / Live Status)
router.get('/details', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ status: false, message: "Missing 'id' query parameter" });
        }
        const result = await getMatchDetails(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Get Upcoming Schedule
router.get('/schedule', async (req, res) => {
    try {
        const result = await getSchedule();
        res.json(result);
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = router;
