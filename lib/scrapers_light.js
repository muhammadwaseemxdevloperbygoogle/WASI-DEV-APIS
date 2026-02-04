const axios = require('axios');
const googleIt = require('google-it');
const cheerio = require('cheerio');

/**
 * Google Search Scraper
 * @param {string} query 
 */
async function googleSearch(query) {
    try {
        const results = await googleIt({ query, disableConsole: true });
        return {
            status: true,
            creator: "Wasi Dev",
            results: results.slice(0, 10).map(item => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet
            }))
        };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

/**
 * Weather Scraper (Using a public weather API)
 * @param {string} city 
 */
async function weather(city) {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=892973f039f39c1d8a4369e909569093`); // Using a common public key for demo, should be user's ideally
        const data = response.data;
        return {
            status: true,
            creator: "Wasi Dev",
            result: {
                city: data.name,
                country: data.sys.country,
                temp: data.main.temp + "°C",
                feel: data.main.feels_like + "°C",
                humidity: data.main.humidity + "%",
                description: data.weather[0].description,
                wind: data.wind.speed + " m/s"
            }
        };
    } catch (e) {
        return { status: false, message: "City not found or API error" };
    }
}

/**
 * Pinterest Search Scraper
 * @param {string} query 
 */
async function pinterest(query) {
    try {
        const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
            }
        });

        const $ = cheerio.load(response.data);

        // Pinterest uses a script tag with ID "__PJS_STATE__" to store its data as JSON
        const scriptData = $('#__PJS_STATE__').html();
        if (!scriptData) return { status: false, message: "Could not find Pinterest data. Try a different query." };

        const json = JSON.parse(scriptData);
        // Navigate through Pinterest's complex JSON structure
        const pins = Object.values(json.resourceResponses?.[0]?.response?.data ||
            json.v3Resources?.SearchResource?.data?.results || []);

        const results = pins.map(pin => ({
            title: pin.title || pin.pinner?.full_name || "Pinterest Pin",
            image: pin.images?.orig?.url || pin.images?.['736x']?.url,
            link: `https://www.pinterest.com/pin/${pin.id}/`
        })).filter(p => p.image);

        return {
            status: true,
            creator: "Wasi Dev",
            method: "Native Pinterest Scraping",
            result: results.slice(0, 15)
        };
    } catch (e) {
        return { status: false, message: "Pinterest Native Scraper Error: " + e.message };
    }
}

/**
 * Pinterest Downloader (Specific Pin)
 * @param {string} url - Pinterest Pin URL
 */
async function pinterestDl(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const scriptData = $('script[id="__PJS_STATE__"]').html() || $('script[data-zim-id="relay-data"]').html();

        if (!scriptData) {
            // Fallback: Check for meta tags
            const img = $('meta[property="og:image"]').attr('content');
            if (img) return { status: true, creator: "Wasi Dev", type: 'image', result: img.replace('736x', 'originals') };
            return { status: false, message: "Could not find Pin data." };
        }

        const data = JSON.parse(scriptData);
        // Find the specific Pin data in the relay/state blob
        // This is complex, but we can usually find it in PinResource
        const pinId = url.split('/pin/')[1].split('/')[0];
        const pins = data.resourceResponses?.[0]?.response?.data || {};

        // Simple search for the highest quality image or video
        const image = $('meta[property="og:image"]').attr('content')?.replace('736x', 'originals');
        const video = $('video').attr('src') || $('meta[property="og:video"]').attr('content');

        return {
            status: true,
            creator: "Wasi Dev",
            type: video ? 'video' : 'image',
            result: video || image
        };
    } catch (e) {
        return { status: false, message: "Pinterest Download Error: " + e.message };
    }
}

/**
 * Simple AI Chatbot (Using a free public endpoint)
 * @param {string} message 
 */
async function chatbot(message) {
    try {
        const apiUrl = `https://api.simsimi.vn/v1/simtalk`;
        const params = new URLSearchParams();
        params.append('text', message);
        params.append('lc', 'en');
        const response = await axios.post(apiUrl, params);

        if (response.data && response.data.message) {
            return {
                status: true,
                creator: "Wasi Dev",
                reply: response.data.message
            };
        }
        return { status: false, message: "Chatbot error" };
    } catch (e) {
        return { status: false, message: e.message };
    }
}

module.exports = { googleSearch, weather, pinterest, pinterestDl, chatbot };
