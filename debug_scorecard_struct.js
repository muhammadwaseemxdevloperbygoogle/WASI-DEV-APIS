const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_scorecard.html', 'utf8');
const $ = cheerio.load(html);

console.log("Analyzing Table Structure...");

// Find "Innings" Text
$('*:contains("Innings")').each((i, el) => {
    const txt = $(el).text().trim();
    if (txt.includes("Innings") && txt.length < 50) {
        console.log(`\nHeader Candidate: ${txt} (${$(el).prop('tagName')}.${$(el).attr('class')})`);

        // Look at next siblings
        let sibling = $(el).parent().next();
        // Traverse down a bit
        if (sibling.length) {
            console.log("Sibling Text:", sibling.text().substring(0, 100));
            // Check for rows
            sibling.find('div[class*="flex"]').each((j, row) => {
                if (j < 3) console.log(`  Row ${j}: ${$(row).text().trim()}`);
            });
        }
    }
});
