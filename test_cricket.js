const { getLiveMatches, getMatchDetails } = require('./lib/cricket');

async function test() {
    console.log("Fetching Live Matches...");
    const live = await getLiveMatches();
    console.log("Live Matches Status:", live.status);
    console.log("Count:", live.matches.length);

    if (live.matches.length > 0) {
        const matchId = live.matches[0].id;
        console.log(`Testing Details for Match ID: ${matchId}`);

        const start = Date.now();
        const details = await getMatchDetails(matchId);
        console.log(`Time taken: ${Date.now() - start}ms`);
        console.log("Details Status:", details.status);
        console.log("Live Status:", details.liveStatus);
        console.log("Score:", details.liveScore);
        console.log("Batting Players:", details.players.batting.slice(0, 3));
    } else {
        console.log("No live matches to test details.");
    }
}

test();
