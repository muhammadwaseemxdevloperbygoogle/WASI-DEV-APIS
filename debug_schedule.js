const axios = require('axios');
const cheerio = require('cheerio');
const URL = 'https://www.cricbuzz.com/cricket-schedule/upcoming-series/international';

async function run() {
    try {
        const { data } = await axios.get(URL, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } });
        const $ = cheerio.load(data);
        const links = $('a[href*="/live-cricket-scores/"]');

        console.log("Links Found:", links.length);
        if (links.length > 0) {
            const el = links.first();
            console.log("Link Text:", el.text().trim());
            let p = el.parent();
            console.log("P1:", p.prop("tagName"), p.attr("class"));
            p = p.parent();
            console.log("P2:", p.prop("tagName"), p.attr("class"));
            p = p.parent();
            console.log("P3:", p.prop("tagName"), p.attr("class"));
            p = p.parent();
            console.log("P4:", p.prop("tagName"), p.attr("class"));
        }

        // Check for headers (Date strips)
        const dateHeaders = $('div[class*="lv-grn"], h3, h4');
        console.log("Potential Date Headers:", dateHeaders.length);
        dateHeaders.slice(0, 3).each((i, el) => {
            console.log(`H${i}:`, $(el).prop("tagName"), $(el).attr("class"), $(el).text().trim());
        });

    } catch (e) { console.log(e.message); }
}
run();
