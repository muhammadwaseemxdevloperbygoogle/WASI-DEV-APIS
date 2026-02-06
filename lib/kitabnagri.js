const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Simple similarity score between two strings
 */
function getSimilarity(s1, s2) {
    const n1 = normalize(s1);
    const n2 = normalize(s2);

    // Check if one contains the other (high relevance)
    if (n1.includes(n2) || n2.includes(n1)) return 0.9;

    let longer = n1;
    let shorter = n2;
    if (n1.length < n2.length) {
        longer = n2;
        shorter = n1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;

    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function normalize(str) {
    return str.toLowerCase()
        .replace(/aa/g, 'a')
        .replace(/ee/g, 'i')
        .replace(/oo/g, 'u')
        .replace(/ai/g, 'e')
        .replace(/ay/g, 'e')
        .replace(/y/g, 'i')
        .replace(/\b(by|novel|full|complete|the|pdf)\b/g, '') // Remove fluff
        .replace(/[^a-z0-9]/g, '')
        .trim();
}

/**
 * Search for books on KitabNagri
 * @param {string} query 
 */
async function searchBooks(query) {
    try {
        const url = `https://kitabnagri.org/?s=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        let results = [];

        $('.entry-title a').each((i, el) => {
            const title = $(el).text().trim();
            const link = $(el).attr('href');
            if (title && link) {
                const similarity = getSimilarity(title, query);
                results.push({ title, link, similarity });
            }
        });

        // Sort by similarity
        results.sort((a, b) => b.similarity - a.similarity);

        // If no good matches, try a broader search by splitting words
        if (results.length === 0 || results[0].similarity < 0.3) {
            // Try searching for the first word
            const words = query.split(' ');
            const firstWord = words[0];

            if (firstWord.length > 3 && firstWord !== query) {
                const retryRes = await searchBooks(firstWord);
                if (retryRes.status) {
                    const broader = retryRes.results.map(r => ({
                        ...r,
                        similarity: getSimilarity(r.title, query)
                    })).sort((a, b) => b.similarity - a.similarity);

                    results = broader;
                }
            }

            // If still no results, try replacing common phonetic errors in the query itself and searching again
            if (results.length === 0 || results[0].similarity < 0.2) {
                const fixedQuery = query
                    .replace(/pair/g, 'peer')
                    .replace(/pir/g, 'peer')
                    .replace(/abay/g, 'aab')
                    .replace(/abe /g, 'aab ')
                    .replace(/heyat/g, 'hayat')
                    .replace(/namel/g, 'namal')
                    .replace(/ai/g, 'e');

                if (fixedQuery !== query) {
                    const fixedRes = await searchBooks(fixedQuery);
                    if (fixedRes.status) results = fixedRes.results;
                }
            }
        }

        return { status: true, results };
    } catch (error) {
        console.error('KitabNagri Search Error:', error.message);
        return { status: false, msg: error.message };
    }
}

/**
 * Get download details for a specific book
 * @param {string} url 
 */
async function getBookDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const title = $('h1.entry-title').text().trim();
        const thumbnail = $('.entry-content img').first().attr('src');

        let downloadLink = '';
        let readOnlineLink = '';

        $('a').each((i, el) => {
            const text = $(el).text().toLowerCase();
            const href = $(el).attr('href');

            if (text.includes('download now') || text.includes('download pdf')) {
                downloadLink = href;
            } else if (text.includes('read online')) {
                readOnlineLink = href;
            }
        });

        // Fallback for download link
        if (!downloadLink) {
            $('a').each((i, el) => {
                const href = $(el).attr('href') || '';
                if (href.includes('mediafire.com') || href.includes('drive.google.com')) {
                    downloadLink = href;
                }
            });
        }

        return {
            status: true,
            title,
            thumbnail,
            downloadLink,
            readOnlineLink,
            url
        };
    } catch (error) {
        console.error('KitabNagri Details Error:', error.message);
        return { status: false, msg: error.message };
    }
}

module.exports = { searchBooks, getBookDetails };
