const express = require('express');
const router = express.Router();
const scrapers = require('../lib/scrapers');

/**
 * TikTok Download
 * GET /api/download/tiktok?url=...
 */
router.get('/tiktok', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const result = await scrapers.tiktok(url);
    res.json(result);
});

/**
 * Instagram Download
 * GET /api/download/instagram?url=...
 */
router.get('/instagram', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const result = await scrapers.instagram(url);
    res.json(result);
});

/**
 * Pinterest Download
 * GET /api/download/pinterest?url=...
 */
router.get('/pinterest', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const scraperLight = require('../lib/scrapers_light');
    const result = await scraperLight.pinterestDl(url);
    res.json(result);
});

module.exports = router;
