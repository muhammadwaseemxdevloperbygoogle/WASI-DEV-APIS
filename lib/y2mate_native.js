const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Native Y2Mate Scraper
 * Tries to find the available formats and then converts the selected one.
 */
class Y2Mate {
    constructor() {
        this.baseUrl = 'https://www.y2mate.com';
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }

    async search(url) {
        try {
            // Try different AJAX paths as they change often
            const paths = [
                '/mates/en/ajaxSearch/index',
                '/mates/en100/ajax/index/ajaxSearch/ajax',
                '/mates/analyzeV2/ajax'
            ];

            for (const path of paths) {
                try {
                    const res = await axios.post(this.baseUrl + path,
                        new URLSearchParams({
                            q_auto: '0',
                            ajax: '1',
                            url: url
                        }), {
                        headers: {
                            'User-Agent': this.userAgent,
                            'X-Requested-With': 'XMLHttpRequest',
                            'Origin': this.baseUrl,
                            'Referer': this.baseUrl
                        },
                        timeout: 10000
                    });

                    if (res.data && res.data.status === 'ok') {
                        return res.data;
                    }
                } catch (e) {
                    continue;
                }
            }
            return { status: false, message: "Could not analyze URL" };
        } catch (e) {
            return { status: false, message: e.message };
        }
    }

    async convert(vid, k) {
        try {
            const res = await axios.post(this.baseUrl + '/mates/en/ajaxConvert/index',
                new URLSearchParams({
                    vid: vid,
                    k: k
                }), {
                headers: {
                    'User-Agent': this.userAgent,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': this.baseUrl,
                    'Referer': this.baseUrl
                },
                timeout: 10000
            });

            if (res.data && res.data.status === 'ok') {
                return res.data;
            }
            return { status: false, message: "Conversion failed" };
        } catch (e) {
            return { status: false, message: e.message };
        }
    }
}

module.exports = new Y2Mate();
