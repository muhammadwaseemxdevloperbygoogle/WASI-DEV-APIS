const axios = require('axios');
const ytSearch = require('yt-search');

// Configuration - Multiple API Keys for redundancy
const SRIHUB_API_KEY = 'dew_STvVbGFwTS4lmZ61Eu0l5e9xzOIqrCLQ5Z8LitEZ';

/**
 * YouTube Scraper Service
 * Handles searching and downloading (Video/Audio)
 * MULTI-PROVIDER FALLBACK for maximum uptime
 */
class YouTubeService {
    constructor() {
        this.creator = "Wasi Dev";
    }

    /**
     * Search for videos using yt-search
     */
    async search(query) {
        try {
            const results = await ytSearch(query);
            return {
                status: true,
                creator: this.creator,
                results: results.videos.slice(0, 15).map(v => ({
                    title: v.title,
                    url: v.url,
                    id: v.videoId,
                    thumbnail: v.thumbnail,
                    duration: v.timestamp,
                    views: v.views,
                    ago: v.ago,
                    author: v.author.name
                }))
            };
        } catch (e) {
            return { status: false, message: e.message };
        }
    }

    /**
     * Download Video/Audio with Multiple Fallbacks
     * Priority: SriHub > AIO Downloader > Vreden > Y2mate Native
     */
    async download(url, type = 'video') {
        const errors = [];

        // ===== STRATEGY 1: SriHub API (MOST RELIABLE) =====
        try {
            console.log(`[YT] Strategy 1: SriHub`);
            const endpoint = type === 'audio' ? 'ytmp3' : 'ytmp4';
            const apiUrl = `https://api.srihub.store/download/${endpoint}?url=${encodeURIComponent(url)}&apikey=${SRIHUB_API_KEY}`;

            const { data } = await axios.get(apiUrl, { timeout: 25000 });

            if (data && (data.success || data.status === 200) && data.result) {
                return {
                    status: true,
                    creator: this.creator,
                    method: "SriHub",
                    title: data.result.title,
                    thumbnail: data.result.thumbnail,
                    quality: data.result.quality,
                    result: data.result.download_url || data.result.url || data.result.dl
                };
            }
            errors.push('SriHub: No valid response');
        } catch (err) {
            errors.push(`SriHub: ${err.message}`);
            console.log(`[YT] SriHub Failed: ${err.message}`);
        }

        // ===== STRATEGY 2: AIO Downloader API =====
        try {
            console.log(`[YT] Strategy 2: AIO Downloader`);
            const endpoint = type === 'audio' ? 'ytmp3' : 'ytmp4';
            const apiUrl = `https://aiodown.com/api/${endpoint}?url=${encodeURIComponent(url)}`;

            const { data } = await axios.get(apiUrl, { timeout: 15000 });

            if (data && data.status && data.data) {
                return {
                    status: true,
                    creator: this.creator,
                    method: "AIO Downloader",
                    title: data.data.title,
                    thumbnail: data.data.thumbnail,
                    result: data.data.url || data.data.dl || data.data.download
                };
            }
        } catch (err) {
            errors.push(`AIO: ${err.message}`);
            console.log(`[YT] AIO Failed: ${err.message}`);
        }

        // ===== STRATEGY 3: Vreden API =====
        try {
            console.log(`[YT] Strategy 3: Vreden`);
            const quality = type === 'video' ? '360' : '128';
            const endpoint = type === 'audio' ? 'mp3' : 'video';
            const apiUrl = `https://api.vreden.my.id/api/v1/download/youtube/${endpoint}?url=${encodeURIComponent(url)}&quality=${quality}`;

            const { data } = await axios.get(apiUrl, { timeout: 15000 });
            if (data && data.status) {
                const res = data.result || data.data || data;
                const dlUrl = res.download?.url || res.downloadUrl || res.url || res.dl;
                const dlStatus = res.download?.status ?? true;

                if (dlUrl && dlStatus !== false) {
                    return {
                        status: true,
                        creator: this.creator,
                        method: "Vreden",
                        title: res.metadata?.title || res.title || "YouTube Media",
                        thumbnail: res.metadata?.thumbnail || res.thumbnail,
                        result: dlUrl
                    };
                }
            }
        } catch (err) {
            errors.push(`Vreden: ${err.message}`);
            console.log(`[YT] Vreden Failed: ${err.message}`);
        }

        // ===== STRATEGY 4: SaveTube API =====
        try {
            console.log(`[YT] Strategy 4: SaveTube`);
            const apiUrl = `https://api.savetube.com/download?url=${encodeURIComponent(url)}&type=${type}`;

            const { data } = await axios.get(apiUrl, { timeout: 15000 });
            if (data && data.status && data.result) {
                return {
                    status: true,
                    creator: this.creator,
                    method: "SaveTube",
                    title: data.result.title,
                    thumbnail: data.result.thumbnail,
                    result: data.result.url || data.result.download
                };
            }
        } catch (err) {
            errors.push(`SaveTube: ${err.message}`);
            console.log(`[YT] SaveTube Failed: ${err.message}`);
        }

        // ===== STRATEGY 5: Native Y2mate Scraping (Last Resort) =====
        try {
            console.log(`[YT] Strategy 5: Y2mate Native`);
            const searchUrl = 'https://v6.www-y2mate.com/mates/en/ajaxSearch/index';
            const searchRes = await axios.post(searchUrl, new URLSearchParams({
                q_auto: '0', ajax: '1', url: url
            }), {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 8000
            });

            if (searchRes.data && searchRes.data.status === 'ok') {
                const vid = searchRes.data.vid;
                const links = searchRes.data.links;
                let k = '';

                if (type === 'audio') {
                    k = links.mp3?.['128']?.k || Object.values(links.mp3 || {})[0]?.k;
                } else {
                    k = links.mp4?.['22']?.k || links.mp4?.['18']?.k || Object.values(links.mp4 || {})[0]?.k;
                }

                if (k) {
                    const convRes = await axios.post('https://v6.www-y2mate.com/mates/en/ajaxConvert/index',
                        new URLSearchParams({ vid, k }), { timeout: 8000 });

                    if (convRes.data && convRes.data.status === 'ok' && convRes.data.dlink) {
                        return {
                            status: true,
                            creator: this.creator,
                            method: "Y2mate Native",
                            title: searchRes.data.title,
                            result: convRes.data.dlink
                        };
                    }
                }
            }
        } catch (err) {
            errors.push(`Y2mate: ${err.message}`);
            console.log(`[YT] Y2mate Failed: ${err.message}`);
        }

        // All strategies failed
        console.log(`[YT] ALL STRATEGIES FAILED:`, errors);
        return {
            status: false,
            message: "All YouTube providers failed. Please try again later.",
            errors: errors
        };
    }
}

const service = new YouTubeService();

module.exports = {
    youtubeSearch: (q) => service.search(q),
    youtubeDl: (url, type) => service.download(url, type)
};
/ /  
 R e b u i l d  
 t r i g g e r  
 