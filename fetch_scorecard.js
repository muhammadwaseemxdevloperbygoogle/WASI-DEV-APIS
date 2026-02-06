const axios = require('axios');
const fs = require('fs');

async function fetchScorecard() {
    const matchId = '138680';
    const url = `https://www.cricbuzz.com/live-cricket-scorecard/${matchId}`;
    console.log("Fetching Scorecard:", url);

    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        fs.writeFileSync('debug_scorecard.html', data);
        console.log("Saved to debug_scorecard.html");
    } catch (e) {
        console.error("Error:", e.message);
    }
}

fetchScorecard();
