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

        // DOM Fallback (Updated for 2026 Redesign)
        if (!status) {
            // New design: <div class="text-cbTextLink">India U19 won by 100 runs</div>
            const statusNode = $('.text-cbTextLink').first();
            if (statusNode.length) status = statusNode.text().trim();

            // Old fallback
            if (!status) {
                status = $('.cb-min-stts, .cb-text-stump, .cb-text-live, .cb-text-complete, .cb-text-preview').first().text().trim();
            }
        }

        if (!score) {
            // New design: Search for the score container
            // <div class="text-lg font-bold"> ... </div>
            const scoreContainer = $('.text-lg.font-bold').first();
            if (scoreContainer.length) {
                const lines = [];
                scoreContainer.find('.flex.flex-row').each((i, el) => {
                    lines.push($(el).text().trim());
                });
                if (lines.length > 0) score = lines.join(' vs '); // "INDU19 411/9 (50) vs ENGU19 311 (40.2)"
            }

            // Fallback to old selectors
            if (!score) {
                score = $('.cb-font-20.text-bold').first().text().trim() ||
                    $('.cb-min-bat-rw').text().trim() ||
                    $('.cb-text-score').text().trim();
            }
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

            if (status.includes("not available") || !status) {
                if (metaDesc.includes("to bat")) status = "Toss / Innings Break";
                else if (metaDesc.includes("won by")) {
                    // Extract "India won by X runs" from meta description
                    const wonMatch = metaDesc.match(/([a-zA-Z0-9\s]+won by [a-zA-Z0-9\s]+)/);
                    if (wonMatch) status = wonMatch[1];
                    else status = "Result Declared";
                }
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

        /*
        // Internal API Strategy (Disabled: Returns HTML/Blocked)
        if (status.includes("not available") || score.includes("not available") || Object.keys(players).length === 0) {
            try {
                // ... code commented out ...
            } catch (e) {
                console.log(`[${matchId}] API Strategy Failed:`, e.message);
            }
        }
        */

        // If players list is empty (common for complete matches or new UI), fetch Scorecard
        if (!players.batting || players.batting.length === 0) {
            try {
                console.log(`[${matchId}] Fetching full scorecard...`);
                // Construct scorecard URL (replace live-cricket-scores with live-cricket-scorecard)
                const scorecardUrl = url.replace('live-cricket-scores', 'live-cricket-scorecard');
                const { data: scData } = await axios.get(scorecardUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    },
                    validateStatus: () => true
                });

                const $sc = cheerio.load(scData);
                players = {
                    batting: [],
                    bowling: []
                };

                // Parse Scorecard Rows (Generic Approach for New UI)
                // Pattern: Name + Dismissal + Runs + (Balls) ... 
                // OR Name + Runs + (Balls)
                // We search for divs that look like player rows

                // Helper to clean text
                const clean = (t) => t ? t.replace(/\s+/g, ' ').trim() : '';

                // Try to identify "Innings" blocks
                // Logic: Search for blocks containing "Batter" or "Bowler"
                // Then iterate rows

                // Fallback: iterate all flex rows and match patterns
                $sc('div[class*="flex"]').each((i, el) => {
                    const txt = clean($(el).text());

                    // Batting Row Match: Name Matches Runs(Balls)
                    // Ex: "Vaibhav Sooryavanshi 175 (115)"
                    // Regex: ^([a-zA-Z\s]+)(\d+)\((\d+)\)
                    // Note: Dismissal info might be in between

                    // Simple parser for "Name Runs(Balls)" which often appears in new UI mobile views
                    // or "Name c Fielder b Bowler Runs (Balls)"

                    // We look for the robust table structure if it exists:
                    // usually .cb-col .cb-col-100 .cb-scrd-itms
                    if ($(el).hasClass('cb-scrd-itms')) {
                        const name = clean($(el).find('.cb-col-27').text());
                        const dismissal = clean($(el).find('.cb-col-33').text());
                        const runs = clean($(el).find('.cb-col-8').first().text()); // R
                        const balls = clean($(el).find('.cb-col-8').eq(1).text()); // B

                        if (name && runs) {
                            players.batting.push({ name, dismissal, runs, balls });
                        }
                        return; // Continue
                    }
                });

                // If specialized .cb-scrd-itms class not found (Tailwind redesign), attempt text parsing
                if (players.batting.length === 0) {
                    $sc('div').each((i, row) => {
                        const txt = clean($(row).text());
                        // Regex for "Name ... Runs(Balls)"
                        // Ex: "Vaibhav Sooryavanshi 175(115)"
                        const match = txt.match(/^([a-zA-Z\s\.]+)(\d+)\((\d+)\)$/);
                        if (match && txt.length < 50) { // Limit length to avoid long paragraphs
                            players.batting.push({
                                name: match[1].trim(),
                                runs: match[2],
                                balls: match[3]
                            });
                        }
                    });
                }

            } catch (e) {
                console.log(`[${matchId}] Scorecard Fetch Failed:`, e.message);
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
