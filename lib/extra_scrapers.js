const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Native Instagram Stalk
 * Scrapes from Imginn (Public IG Viewer) to avoid login requirements
 * @param {string} username
 */
async function igStalk(username) {
    try {
        const url = `https://imginn.com/${username}/`;
        const response = await axios.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'cookie': 'unit_of_measurement=m'
            }
        });

        const $ = cheerio.load(response.data);

        // Extract Data
        const fullname = $('.user-name').text().trim();
        const bio = $('.user-bio').text().trim();
        const photo_profile = $('.user-icon img').attr('src');

        // Stats parsing (followers, following, posts)
        // Imginn structure: .user-info span
        // Usually: [0] Posts, [1] Followers, [2] Following
        const stats = $('.user-info span.value').map((i, el) => $(el).text().trim()).get();

        // If stats are empty, user might be private or not found
        if (stats.length === 0 && !fullname) {
            return { status: false, message: "User not found or unavailable." };
        }

        return {
            status: true,
            creator: "Wasi Dev",
            type: "Instagram Profile",
            result: {
                username: username,
                fullname: fullname,
                photo_profile: photo_profile ? (photo_profile.startsWith('//') ? 'https:' + photo_profile : photo_profile) : "",
                bio: bio,
                posts: stats[0] || "0",
                followers: stats[1] || "0",
                following: stats[2] || "0"
            }
        };

    } catch (e) {
        return { status: false, message: "Native Scraper Error: " + e.message };
    }
}

/**
 * Google Drive Downloader
 * Handles public file links
 * @param {string} url
 */
async function gdriveDl(url) {
    try {
        // Extract File ID
        let fileId = null;
        const patterns = [
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /id=([a-zA-Z0-9_-]+)/,
            /\/open\?id=([a-zA-Z0-9_-]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                fileId = match[1];
                break;
            }
        }

        if (!fileId) return { status: false, message: "Invalid Google Drive URL" };

        // For GDrive, we return the direct download format that clients can use
        // or we can use a service to resolve the direct link if it's large
        const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

        return {
            status: true,
            creator: "Wasi Dev",
            type: "Google Drive",
            result: {
                fileName: "Google Drive File", // Hard matches require OAuth or API Key
                mimeType: "application/octet-stream",
                downloadUrl: exportUrl,
                fileId: fileId
            }
        };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

/**
 * Terabox Downloader
 * @param {string} url
 */
async function teraboxDl(url) {
    try {
        // Terabox usually requires cookies, so we route through a working specialized API
        // This is "native" in the sense that our API is the one doing the work relative to the bot
        const apiUrl = `https://terabox-dl.qtcloud.workers.dev/api/get-download?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.downloadLink) {
            return {
                status: true,
                creator: "Wasi Dev",
                type: "Terabox",
                result: {
                    fileName: response.data.filename || "Terabox File",
                    size: response.data.size,
                    downloadUrl: response.data.downloadLink,
                    shareId: response.data.shareid,
                    fastDownload: response.data.fastDownloadLink
                }
            };
        }

        return { status: false, message: "Failed to resolve Terabox link" };
    } catch (e) {
        return { status: false, message: "Terabox Error: " + e.message };
    }
}

/**
 * Git Clone / Repo Downloader
 * Resolves the ZIP download link for a GitHub repository
 * @param {string} url
 */
async function gitClone(url) {
    try {
        // Regex to identify GitHub repo URLs
        const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

        if (!regex.test(url)) {
            return { status: false, message: "Invalid GitHub Repository URL" };
        }

        // Clean URL (remove .git extension if present)
        let cleanUrl = url.replace(/\.git$/, '');

        // Construct ZIP URL
        // GitHub ZIPs are always at: https://github.com/user/repo/archive/refs/heads/main.zip 
        // OR master.zip. We need to check which one exists.

        const mainZip = `${cleanUrl}/archive/refs/heads/main.zip`;
        const masterZip = `${cleanUrl}/archive/refs/heads/master.zip`;

        // Check if Main exists
        try {
            await axios.head(mainZip);
            return {
                status: true,
                creator: "Wasi Dev",
                type: "Git Clone",
                result: {
                    url: mainZip,
                    filename: cleanUrl.split('/').pop() + '.zip'
                }
            };
        } catch (e) {
            // If main fails, try master
            return {
                status: true,
                creator: "Wasi Dev",
                type: "Git Clone",
                result: {
                    url: masterZip,
                    filename: cleanUrl.split('/').pop() + '.zip'
                }
            };
        }
    } catch (e) {
        return { status: false, message: "Git Clone Error: " + e.message };
    }
}

/**
 * Mediafire Downloader
 * @param {string} url 
 */
async function mediafireDl(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);

        const downloadUrl = $('#downloadButton').attr('href');
        const fileName = $('.dl-info .promo_t1').text().trim() || $('.dl-btn-label').attr('title') || $('.filename').text().trim() || 'Downloaded File';
        const fileSize = $('.dl-info .promo_t2').text().trim() || $('.dl-btn-label span').text().replace(/[()]/g, '').trim() || 'Unknown';
        const fileType = fileName.split('.').pop().toUpperCase();

        if (!downloadUrl) return { status: false, message: "Could not find download button" };

        return {
            status: true,
            creator: "Wasi Dev",
            type: "MediaFire",
            result: {
                fileName,
                fileSize,
                fileType,
                downloadUrl
            }
        };
    } catch (e) {
        return { status: false, message: "MediaFire Error: " + e.message };
    }
}

module.exports = { igStalk, gdriveDl, teraboxDl, gitClone, mediafireDl };
