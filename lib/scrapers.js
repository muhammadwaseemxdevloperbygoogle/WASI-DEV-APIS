const { tiktokDl } = require('./tiktok');
const axios = require('axios');

/**
 * Native TikTok Downloader (Wrapper)
 */
async function tiktok(url) {
    const res = await tiktokDl(url);
    if (res.status) {
        // Mapping native results to the common format for backward compatibility in this file
        return {
            status: true,
            creator: "Wasi Dev",
            title: res.result.title,
            video: res.result.no_wm,
            audio: res.result.music,
            author: res.result.author.nickname
        };
    }
    return res;
}

/**
 * Instagram Downloader (Placeholder - Still mirrors while we build native)
 */
async function instagram(url) {
    try {
        const apiUrl = `https://api.vreden.my.id/api/v1/download/instagram?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);
        if (response.data && response.data.status) {
            return {
                status: true,
                creator: "Wasi Dev",
                result: response.data.result
            };
        }
        return { status: false, message: "Failed to download" };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

module.exports = { tiktok, instagram };
