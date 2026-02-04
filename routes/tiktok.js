const express = require('express');
const router = express.Router();
const tiktok = require('../lib/tiktok');

/**
 * TikTok Download
 * GET /api/tiktok/download?url=...
 */
router.get('/download', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL is required" });

    const result = await tiktok.tiktokDl(url);
    res.json(result);
});

/**
 * TikTok Stalk
 * GET /api/tiktok/stalk?username=...
 */
router.get('/stalk', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ status: false, message: "Username is required" });

    const result = await tiktok.tiktokStalk(username);
    res.json(result);
});

module.exports = router;
