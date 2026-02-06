const axios = require('axios');
const fs = require('fs');

async function debug() {
    const matchId = '138680'; // Use the ID from previous test
    const url = `https://www.cricbuzz.com/live-cricket-scores/${matchId}`;
    console.log("Fetching:", url);

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                // Add Referer to look legit
                'Referer': 'https://www.cricbuzz.com/'
            }
        });
        fs.writeFileSync('debug_matches.html', data);
        console.log("Saved to debug_matches.html");
    } catch (e) {
        console.error("Error:", e.message);
    }
}

debug();
