const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_scorecard.html', 'utf8');
const $ = cheerio.load(html);

console.log("Parsing Scorecard...");

// Cricbuzz Scorecards usually use 'cb-scrd-lft-col' or similar
// Search for tables
$('.cb-col.cb-col-100.cb-ltst-wgt-hdr').each((i, table) => {
    // Header (Innings Name)
    const inningsName = $(table).find('.cb-col.cb-col-100.cb-scrd-hdr-rw span').first().text().trim();
    if (inningsName) {
        console.log(`\nInnings: ${inningsName}`);

        // Rows
        $(table).find('.cb-col.cb-col-100.cb-scrd-itms').each((j, row) => {
            const rowText = $(row).text().trim();
            // Batsman extraction
            const batsmanName = $(row).find('.cb-col.cb-col-27').text().trim();
            const runs = $(row).find('.cb-col.cb-col-8.text-right.text-bold').text().trim();

            if (batsmanName && runs) {
                console.log(`  BAT: ${batsmanName} - ${runs}`);
            }
        });
    }
});
