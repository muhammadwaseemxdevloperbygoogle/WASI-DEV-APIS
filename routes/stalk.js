const express = require('express');
const router = express.Router();
const axios = require('axios');

/**
 * GitHub Stalk
 * GET /api/stalk/github?username=...
 */
router.get('/github', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ status: false, message: "Username parameter is required" });

    try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        const data = response.data;

        res.json({
            status: true,
            creator: "Wasi Dev",
            result: {
                username: data.login,
                name: data.name,
                bio: data.bio,
                avatar: data.avatar_url,
                repos: data.public_repos,
                followers: data.followers,
                following: data.following,
                created_at: data.created_at
            }
        });
    } catch (e) {
        res.status(500).json({ status: false, message: "User not found or GitHub API error" });
    }
});

/**
 * Instagram Stalk
 * GET /api/stalk/instagram?username=...
 */
router.get('/instagram', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ status: false, message: "Username parameter is required" });

    const extra = require('../lib/extra_scrapers');
    const result = await extra.igStalk(username);
    res.json(result);
});

module.exports = router;
