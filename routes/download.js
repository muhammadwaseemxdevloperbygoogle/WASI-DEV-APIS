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
 * Google Drive Download
 * GET /api/download/gdrive?url=...
 */
router.get('/gdrive', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const extra = require('../lib/extra_scrapers');
    const result = await extra.gdriveDl(url);
    res.json(result);
});

/**
 * Terabox Download
 * GET /api/download/terabox?url=...
 */
router.get('/terabox', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const extra = require('../lib/extra_scrapers');
    const result = await extra.teraboxDl(url);
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

/**
 * Git Clone Download
 * GET /api/download/gitclone?url=...
 */
router.get('/gitclone', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const extra = require('../lib/extra_scrapers');
    const result = await extra.gitClone(url);
    res.json(result);
});

/**
 * Mediafire Download
 * GET /api/download/mediafire?url=...
 */
router.get('/mediafire', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const extra = require('../lib/extra_scrapers');
    const result = await extra.mediafireDl(url);
    res.json(result);
});

/**
 * YouTube Video Download
 * GET /api/download/youtube/video?url=...
 */
router.get('/youtube/video', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const youtube = require('../lib/youtube');
    const result = await youtube.youtubeDl(url, 'video');
    res.json(result);
});

/**
 * YouTube Audio Download
 * GET /api/download/youtube/audio?url=...
 */
router.get('/youtube/audio', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const youtube = require('../lib/youtube');
    const result = await youtube.youtubeDl(url, 'audio');
    res.json(result);
});

module.exports = router;
