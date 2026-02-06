const express = require('express');
const router = express.Router();
const { searchBooks, getBookDetails } = require('../lib/kitabnagri');

/**
 * Search KitabNagri
 * GET /api/kitabnagri/search?q=...
 */
router.get('/search', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: "Query parameter 'q' is required" });

    const result = await searchBooks(q);
    res.json({
        status: result.status,
        creator: "Wasi Dev",
        results: result.results || [],
        msg: result.msg
    });
});

/**
 * Get Book Details
 * GET /api/kitabnagri/details?url=...
 */
router.get('/details', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL parameter is required" });

    const result = await getBookDetails(url);
    res.json({
        ...result,
        creator: "Wasi Dev"
    });
});

module.exports = router;
