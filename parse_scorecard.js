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

        // Check for Bowling Table
        const headerText = $(table).text();
        if (headerText.includes("Bowler") && headerText.includes("O") && headerText.includes("W")) {
            console.log(`\nBOWLING TABLE FOUND`);
            $(table).find('.cb-col.cb-col-100.cb-scrd-itms').each((j, row) => {
                const name = $(row).find('.cb-col-40, .cb-col-27').first().text().trim(); // Name often in largest col
                const overs = $(row).find('.cb-col-8, .cb-col-10').first().text().trim();
                const wickets = $(row).find('.cb-col-8.text-right.text-bold').text().trim(); // Wickets usually bold or end?
                const runs = $(row).find('.cb-col-10').eq(1).text().trim(); // Checks specific cols

                // Dump all cols to debug
                const cols = [];
                $(row).find('div').each((k, col) => cols.push($(col).text().trim()));
                console.log("Row Cols:", cols);
            });
        }
    }
});
