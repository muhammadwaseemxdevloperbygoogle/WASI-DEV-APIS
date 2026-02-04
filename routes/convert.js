const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const converters = require('../lib/converters');

// Setup Multer for file uploads
const upload = multer({
    dest: 'temp/',
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/**
 * Image to URL
 * POST /api/convert/tourl (Upload file)
 */
router.post('/tourl', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ status: false, message: "No file uploaded" });

    const result = await converters.imageToUrl(req.file.path);

    // Cleanup
    fs.unlinkSync(req.file.path);

    res.json(result);
});

/**
 * Media to Sticker
 * POST /api/convert/sticker
 */
router.post('/sticker', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ status: false, message: "No file uploaded" });

    const isVideo = req.file.mimetype.includes('video');
    const outPath = path.join('temp', `sticker_${Date.now()}.webp`);

    try {
        await converters.mediaToSticker(req.file.path, outPath, isVideo);
        res.sendFile(path.resolve(outPath), () => {
            // Cleanup files after sending
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        });
    } catch (e) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ status: false, message: e.message });
    }
});

/**
 * Video to Audio
 */
router.post('/toaudio', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ status: false, message: "No file uploaded" });

    const outPath = path.join('temp', `audio_${Date.now()}.mp3`);

    try {
        await converters.videoToAudio(req.file.path, outPath);
        res.sendFile(path.resolve(outPath), () => {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
        });
    } catch (e) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ status: false, message: e.message });
    }
});

/**
 * PUBG Stalker
 * GET /api/convert/pubg?id=...
 */
router.get('/pubg', async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ status: false, message: "ID parameter is required" });
    const result = await converters.pubgStalk(id);
    res.json(result);
});

module.exports = router;
