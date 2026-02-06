const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_matches.html', 'utf8');
const $ = cheerio.load(html);

console.log("Searching for NEXT_DATA...");

// Look for script tag with id __NEXT_DATA__
const nextData = $('#__NEXT_DATA__').html();
if (nextData) {
    console.log("Found __NEXT_DATA__ script!");
    try {
        const json = JSON.parse(nextData);
        console.log("Parsed JSON successfully.");
        // dump keys of pageProps
        if (json.props && json.props.pageProps) {
            console.log("PageProps keys:", Object.keys(json.props.pageProps));

            // Try to find scorecard data
            const matchId = '138680';
            // Often under 'matchScoreData' or 'miniscore'
            const pp = json.props.pageProps;

            if (pp.matchScoreData) console.log("Found matchScoreData");
            if (pp.miniScore) console.log("Found miniScore");
            if (pp.scoreCard) console.log("Found scoreCard");

            // Recursively search for 'batsman' key
            function searchKey(obj, key, path = '') {
                if (!obj || typeof obj !== 'object') return;
                if (key in obj) {
                    console.log(`Found key '${key}' at path: ${path}`);
                    console.log("Value:", JSON.stringify(obj[key], null, 2).substring(0, 500));
                }
                for (const k in obj) {
                    searchKey(obj[k], key, path + '.' + k);
                }
            }

            console.log("Searching for 'batsman'...");
            searchKey(pp, 'batsman');
            console.log("Searching for 'batTeam'...");
            searchKey(pp, 'batTeam');

        } else {
            console.log("No pageProps found.");
        }
    } catch (e) {
        console.log("JSON Parse Error:", e.message);
    }
} else {
    console.log("__NEXT_DATA__ not found.");
    // Look for other script tags that might contain the data
    $('script').each((i, el) => {
        const content = $(el).html();
        if (content && content.includes('batsman')) {
            console.log(`Found 'batsman' in script index ${i}`);
            // console.log(content.substring(0, 200));
        }
    });
}
