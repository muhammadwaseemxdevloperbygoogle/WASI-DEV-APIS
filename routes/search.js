const express = require('express');
const router = express.Router();
const scrapers = require('../lib/scrapers_light');

/**
 * Google Search
 * GET /api/search/google?q=...
 */
router.get('/google', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: "Query (q) is required" });
    const result = await scrapers.googleSearch(q);
    res.json(result);
});

/**
 * Weather Search
 * GET /api/search/weather?city=...
 */
router.get('/weather', async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ status: false, message: "City parameter is required" });
    const result = await scrapers.weather(city);
    res.json(result);
});

/**
 * Pinterest Search
 * GET /api/search/pinterest?q=...
 */
router.get('/pinterest', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: "Query (q) is required" });
    const result = await scrapers.pinterest(q);
    res.json(result);
});

/**
 * AI Chatbot
 * GET /api/search/chat?message=...
 */
router.get('/chat', async (req, res) => {
    const { message } = req.query;
    if (!message) return res.status(400).json({ status: false, message: "Message parameter is required" });
    const result = await scrapers.chatbot(message);
    res.json(result);
});

/**
 * YouTube Search
 * GET /api/search/youtube?q=...
 */
router.get('/youtube', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: "Query (q) is required" });
    const youtube = require('../lib/youtube');
    const result = await youtube.youtubeSearch(q);
    res.json(result);
});

module.exports = router;
