const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

/**
 * Truly Native TikTok Scraper (Scraping SSSTIK.io)
 * No 3rd Party JSON API used.
 * @param {string} url - The TikTok Video URL
 */
async function tiktokDl(url) {
    try {
        // 1. Get the landing page to extract the 'tt' token dynamically
        const base = await axios.get('https://ssstik.io/en', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $base = cheerio.load(base.data);
        // The token is often in a script or a hidden input, but SSSTik often uses a dynamic value in their JS.
        // However, a common trick is that many scrapers work by just passing the URL if we mimic the HTMX headers.

        // 2. Prepare Form Data - We'll try to get 'tt' from the page if possible, else use a fallback
        const tt = base.data.match(/\"tt\":\"([^\"]*)\"/)?.[1] || 'UXdnZ3Yy';

        const params = new URLSearchParams();
        params.append('id', url);
        params.append('locale', 'en');
        params.append('tt', tt);

        // 3. POST to the fetch endpoint
        const response = await axios.post('https://ssstik.io/abc?url=dl', params, {
            headers: {
                'hx-current-url': 'https://ssstik.io/en',
                'hx-request': 'true',
                'hx-target': 'target',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        });

        const $ = cheerio.load(response.data);

        // 4. Extract Data from the returned HTML
        const title = $('.maintext').text().trim() || $('#share-description').text().trim();
        const no_wm = $('a[href*="tiktokv.com"]').first().attr('href') || $('.download_link.without_watermark').attr('href');
        const wm = $('.download_link.watermark').last().attr('href') || $('.download_link.watermark').attr('href');
        const music = $('.download_link.music').attr('href') || $('a[href*="music"]').first().attr('href');

        // Refined Author extraction
        const nickname = $('.result_author h2').text().trim() || $('.author b').text().trim() || $('img.author-avatar').attr('alt') || "";
        const avatar = $('.result_author img').attr('src') || $('img.author-avatar').attr('src') || "";

        if (!no_wm) {
            return { status: false, message: "Could not extract video link. The video might be private or deleted. Or SSSTik changed their structure." };
        }

        return {
            status: true,
            creator: "Wasi Dev",
            method: "Native HTML Scraping",
            result: {
                title: title || "TikTok Video",
                no_wm: no_wm,
                wm: wm || no_wm,
                music: music,
                author: {
                    nickname: nickname,
                    avatar: avatar
                }
            }
        };
    } catch (e) {
        return { status: false, message: "Native Scraper Failed: " + e.message };
    }
}

/**
 * TikTok Stalker (Native Scraping)
 * Scrapes the TikTok user page directly
 * @param {string} username 
 */
async function tiktokStalk(username) {
    try {
        const user = username.startsWith('@') ? username : `@${username}`;
        const url = `https://www.tiktok.com/${user}`;

        const response = await axios.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);

        // TikTok keeps profile data in a JSON script tag called SIGI_STATE or __UNIVERSAL_DATA_FOR_REHYDRATION__
        const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        if (!scriptData) return { status: false, message: "Could not find profile data. User might be private or doesn't exist." };

        const json = JSON.parse(scriptData);
        const userData = json.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo;

        if (!userData) return { status: false, message: "User data extraction failed." };

        const u = userData.user;
        const s = userData.stats;

        return {
            status: true,
            creator: "Wasi Dev",
            method: "Native Web Scraping",
            result: {
                user: {
                    id: u.id,
                    username: u.uniqueId,
                    nickname: u.nickname,
                    avatar: u.avatarLarger,
                    bio: u.signature,
                    verified: u.verified,
                    region: u.region
                },
                stats: {
                    following: s.followingCount,
                    followers: s.followerCount,
                    heart: s.heartCount,
                    video: s.videoCount
                }
            }
        };
    } catch (e) {
        return { status: false, message: "Native Stalk Error: " + e.message };
    }
}

module.exports = { tiktokDl, tiktokStalk };
