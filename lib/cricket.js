const axios = require('axios');
const cheerio = require('cheerio');

// Constants
const BASE_URL = 'https://www.cricbuzz.com';
const LIVE_SCORES_URL = '/cricket-match/live-scores';

/**
 * Fetch live cricket matches from Cricbuzz
 */
async function getLiveMatches() {
    try {
        // Broaden the request to look like a standard browser request
        const { data } = await axios.get(BASE_URL + LIVE_SCORES_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            validateStatus: () => true // Accept all status codes to debug
        });

        const $ = cheerio.load(data);
        let matches = [];

        // STRATEGY 0: Next.js Hydration Data
        const nextDataScript = $('#__NEXT_DATA__').html();
        if (nextDataScript) {
            try {
                const json = JSON.parse(nextDataScript);
                console.log("Found NEXT_DATA. PageProps keys:", Object.keys(json.props?.pageProps || {}));
            } catch (e) {
                console.log("Error parsing NEXT_DATA:", e.message);
            }
        }

        // STRATEGY 4: The "Find Links" Approach (Robust & Proven)
        $('a[href*="/live-cricket-scores/"]').each((i, linkTag) => {
            try {
                const href = $(linkTag).attr('href');
                if (!href) return;

                const parts = href.split('/');
                const matchId = parts[2];

                if (isNaN(matchId)) return;
                if (matches.some(m => m.id === matchId)) return;

                let title = $(linkTag).text().trim();

                if (title.length < 5 || title.includes("Scorecard")) {
                    const parent = $(linkTag).closest('.cb-col-100');
                    if (parent.length) {
                        const h3 = parent.find('h3, .cb-lv-scrs-well-match-nm').first();
                        if (h3.length) title = h3.text().trim();
                        else title = parent.text().trim().split('   ')[0];
                    } else {
                        title = $(linkTag).parent().text().trim().split('•')[0];
                    }
                }

                const container = $(linkTag).closest('div');
                let status = container.find('.cb-text-live').text() ||
                    container.find('.cb-text-complete').text() ||
                    container.find('.cb-text-preview').text();

                if (!status && container.text().includes("Won")) {
                    status = "Result Declared";
                }

                matches.push({
                    id: matchId,
                    title: title.replace(/\s+/g, ' ').substring(0, 100),
                    status: status || "Live / Info",
                    link: BASE_URL + href
                });

            } catch (e) { }
        });

        return {
            status: true,
            source: 'Cricbuzz',
            debug_count: matches.length,
            matches: matches
        };

    } catch (error) {
        console.error('Cricket Scraper Error:', error.message);
        return { status: false, message: error.message };
    }
}

// Helper to recursively find a key in a deep object
function findKey(obj, targetKey) {
    if (!obj || typeof obj !== 'object') return null;
    if (Object.prototype.hasOwnProperty.call(obj, targetKey)) return obj[targetKey];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const found = findKey(obj[key], targetKey);
            if (found) return found;
        }
    }
    return null;
}

async function getMatchDetails(matchId) {
    try {
        const url = `${BASE_URL}/live-cricket-scores/${matchId}`;

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            validateStatus: () => true
        });

        const $ = cheerio.load(data);
        let status = "";
        let score = "";
        let commentary = [];

        // STRATEGY 0: Deep JSON Search
        const nextDataScript = $('#__NEXT_DATA__').html();
        if (nextDataScript) {
            try {
                const json = JSON.parse(nextDataScript);

                const miniScore = findKey(json, 'miniScore');
                if (miniScore) {
                    const batTeam = miniScore.batTeam;
                    if (batTeam && batTeam.teamScore) {
                        score = `${batTeam.teamScore}/${batTeam.teamWkts} (${batTeam.teamOvs})`;
                    }
                    if (miniScore.matchScoreDetails && miniScore.matchScoreDetails.inningsScoreList) {
                        const inn = miniScore.matchScoreDetails.inningsScoreList[0];
                        if (inn) score = `${inn.score}/${inn.wickets} (${inn.overs})`;
                    }

                    if (miniScore.matchStatus || miniScore.status) {
                        status = miniScore.matchStatus || miniScore.status;
                    }
                }

                if (!status) {
                    const matchInfo = findKey(json, 'matchInfo');
                    if (matchInfo) {
                        status = matchInfo.status || matchInfo.matchStatus || matchInfo.state;
                        if (status === 'Preview' || status === 'Upcoming') {
                            score = "Match Yet To Start";
                        }
                    }
                }
            } catch (e) {
                console.log("JSON Parse Error:", e.message);
            }
        }

        // DOM Fallback
        if (!status) {
            status = $('.cb-min-stts, .cb-text-stump, .cb-text-live, .cb-text-complete, .cb-text-preview').first().text().trim();
        }

        if (!score) {
            score = $('.cb-font-20.text-bold').first().text().trim() ||
                $('.cb-min-bat-rw').text().trim() ||
                $('.cb-text-score').text().trim();
        }

        if (!score && (status.includes("Preview") || status.includes("Upcoming") || status.includes("Delay"))) {
            score = "0/0 (0.0)";
        }

        if (!score) {
            const title = $('title').text();
            if (title.includes("Live Cricket Score")) {
                let parts = title.split("Live Cricket Score");
                if (parts[0].match(/\d+\/\d+/)) {
                    score = parts[0].trim();
                }
            }
        }

        if (!score) {
            const scoreMatch = data.match(/(\d{1,3}\/\d{1,2}\s\(\d{1,3}(\.\d)?\))/);
            if (scoreMatch) score = scoreMatch[1];
        }

        if (!score || status.includes("not available")) {
            const metaDesc = $('meta[name="description"]').attr('content') || "";
            const ogTitle = $('meta[property="og:title"]').attr('content') || "";

            if (!score) {
                const titleScore = ogTitle.match(/(\d+\/\d+\s\(\d+(\.\d)?\))/);
                if (titleScore) score = titleScore[1];
                else if (ogTitle.includes("Live Cricket Score")) {
                    const parts = ogTitle.split(":");
                    if (parts.length > 1 && parts[1].match(/\d+\/\d+/)) {
                        score = parts[1].trim();
                    }
                }
            }

            if (!score) {
                const descScore = metaDesc.match(/(\d+\/\d+\s\(\d+(\.\d)?\sOvs\))/);
                if (descScore) score = descScore[1];
            }

            if (status.includes("not available")) {
                if (metaDesc.includes("to bat")) status = "Toss / Innings Break";
                else if (metaDesc.includes("won by")) status = "Result Declared";
                else if (metaDesc.length > 10 && metaDesc.length < 150) {
                    status = metaDesc.split('.')[0];
                }
            }
        }

        $('.cb-com-ln, .cb-com-para').each((i, el) => {
            if (i < 5) commentary.push($(el).text().trim());
        });

        if (commentary.length === 0) {
            const commContainer = $('div:contains("Commentary")').last().parent();
            commContainer.find('p').each((i, el) => {
                if (i < 5 && $(el).text().length > 15) commentary.push($(el).text().trim());
            });
        }

        if (status === "Preview" && !score) score = "Upcoming";

        // Fallback to Main List
        if ((!status || status.includes("not available")) && (!score || score.includes("not available"))) {
            try {
                const { data: listData } = await axios.get(BASE_URL + LIVE_SCORES_URL, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
                });
                const $list = cheerio.load(listData);
                const link = $list(`a[href*="/${matchId}/"]`).first();
                if (link.length) {
                    const matchBlock = link.closest('.cb-col-100');
                    if (matchBlock.length) {
                        const listStatus = matchBlock.find('.cb-text-live, .cb-text-complete, .cb-text-preview').text();
                        if (listStatus) status = listStatus;
                        const batTeamScore = matchBlock.find('.cb-hmscg-tm-nm+div').first().text();
                        if (batTeamScore) score = batTeamScore;
                    }
                }
            } catch (e) { }
        }

        let players = {};

        // Internal API Strategy
        if (status.includes("not available") || score.includes("not available") || Object.keys(players).length === 0) {
            try {
                console.log(`[${matchId}] Attempting Internal API Strategy...`);
                const { data: apiData } = await axios.get(`${BASE_URL}/api/cricket-match/commentary/${matchId}`, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36' }
                });

                if (apiData) {
                    if (apiData.matchHeader) {
                        status = apiData.matchHeader.status || apiData.matchHeader.state || status;
                        if (apiData.matchHeader.state === "Complete" && apiData.matchHeader.result) {
                            status = apiData.matchHeader.result.winningTeam ?
                                `${apiData.matchHeader.result.winningTeam} won` : "Match Complete";
                        }
                    }

                    if (apiData.miniscore) {
                        const bat = apiData.miniscore.batTeam;
                        if (bat && bat.teamScore) {
                            score = `${bat.teamScore}/${bat.teamWkts} (${bat.teamOvs})`;
                        }

                        const ms = apiData.miniscore;
                        players = { batting: [], bowling: [] };

                        if (ms.batsmanStriker) {
                            players.batting.push({
                                name: ms.batsmanStriker.batName, runs: ms.batsmanStriker.batRuns,
                                balls: ms.batsmanStriker.batBalls, fours: ms.batsmanStriker.bat4s,
                                sixes: ms.batsmanStriker.bat6s, striker: true
                            });
                        }
                        if (ms.batsmanNonStriker) {
                            players.batting.push({
                                name: ms.batsmanNonStriker.batName, runs: ms.batsmanNonStriker.batRuns,
                                balls: ms.batsmanNonStriker.batBalls, fours: ms.batsmanNonStriker.bat4s,
                                sixes: ms.batsmanNonStriker.bat6s, striker: false
                            });
                        }
                        if (ms.bowlerStriker) {
                            players.bowling.push({
                                name: ms.bowlerStriker.bowlName, overs: ms.bowlerStriker.bowlOvs,
                                wickets: ms.bowlerStriker.bowlWkts, runs: ms.bowlerStriker.bowlRuns
                            });
                        }
                        if (ms.bowlerNonStriker) {
                            players.bowling.push({
                                name: ms.bowlerNonStriker.bowlName, overs: ms.bowlerNonStriker.bowlOvs,
                                wickets: ms.bowlerNonStriker.bowlWkts, runs: ms.bowlerNonStriker.bowlRuns
                            });
                        }
                    } else {
                        if (apiData.matchHeader) {
                            if (!score || score.includes("available") || score === "0/0 (0.0)") {
                                score = apiData.matchHeader.stateDescription || apiData.matchHeader.state || "Match Not Started";
                            }
                        }
                        if (apiData.matchHeader?.result?.winningTeam) {
                            score = "Result: " + apiData.matchHeader.result.winningTeam + " won";
                        }
                    }

                    if (apiData.commentaryList && Array.isArray(apiData.commentaryList)) {
                        commentary = [];
                        apiData.commentaryList.slice(0, 5).forEach(c => {
                            if (c.commText) commentary.push(c.commText.replace(/\\n/g, ' ').trim());
                        });
                    }
                }
            } catch (e) {
                console.log(`[${matchId}] API Strategy Failed:`, e.message);
            }
        }

        return {
            status: true,
            matchId,
            liveStatus: status || "Status not available",
            liveScore: score || "Score not available",
            players: players,
            commentary: commentary
        };

    } catch (error) {
        return { status: false, message: "Failed to fetch details or invalid ID" };
    }
}

/**
 * Fetch upcoming cricket schedule
 */
async function getSchedule() {
    try {
        const url = `${BASE_URL}/cricket-schedule/upcoming-series/international`;
        console.log("Fetching Schedule from:", url);

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            validateStatus: () => true
        });

        const $ = cheerio.load(data);
        const schedule = [];
        const seenMatchIds = new Set();

        // STRATEGY: Iterate H3 headers (Dates)
        // Debug showed headers like: SAT, FEB 07 2026
        const dateHeaders = $('h3');

        dateHeaders.each((i, header) => {
            const $h3 = $(header);
            const dateText = $h3.text().trim();

            // Filter for valid date headers (must contain a year like 202x)
            if (!dateText.match(/202\d/)) return;

            const matchesOfDate = [];

            // Iterate siblings until the next H3
            $h3.nextUntil('h3').each((j, sibling) => {
                const $sib = $(sibling);

                // Find all live score links in this sibling container
                const links = $sib.find('a[href*="/live-cricket-scores/"]');

                links.each((k, link) => {
                    const $link = $(link);
                    const href = $link.attr('href');
                    const matchId = href.split('/')[2];

                    if (matchId && !seenMatchIds.has(matchId)) {
                        seenMatchIds.add(matchId);

                        const title = $link.text().trim();
                        // Try to find meta (venue/time) in specific classes or generic text-gray
                        const meta = $link.closest('div').find('.text-gray, .cb-text-gray, .cb-font-12').text().trim() ||
                            $link.closest('div').next().text().trim();

                        matchesOfDate.push({
                            title: title,
                            meta: meta.substring(0, 100).replace(/\s+/g, ' '),
                            link: BASE_URL + href
                        });
                    }
                });
            });

            if (matchesOfDate.length > 0) {
                // Check if we already have this date in schedule (merge if so)
                const existingDate = schedule.find(d => d.date === dateText);
                if (existingDate) {
                    existingDate.matches.push(...matchesOfDate);
                } else {
                    schedule.push({
                        date: dateText,
                        matches: matchesOfDate
                    });
                }
            }
        });

        console.log(`Schedule Found: ${schedule.length} days with matches.`);

        return {
            status: true,
            source: 'Cricbuzz',
            schedule: schedule
        };

    } catch (error) {
        console.error('Schedule Error:', error);
        return { status: false, message: error.message };
    }
}

module.exports = { getLiveMatches, getMatchDetails, getSchedule };
