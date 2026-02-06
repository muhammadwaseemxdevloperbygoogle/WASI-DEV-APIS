const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_matches.html', 'utf8');
const $ = cheerio.load(html);

console.log("Searching for Player Stats...");

// Try to find the container with "Batsman"
// In new Cricbuzz, it might be using Tailwind classes or 'cb-col' classes
const batsmanHeader = $('*:contains("Batsman")').last(); // often there are multiple, get the one in the scorecard
if (batsmanHeader.length) {
    console.log("Found 'Batsman' text in:", batsmanHeader.prop('tagName'), "Class:", batsmanHeader.attr('class'));
    const parent = batsmanHeader.parent();
    console.log("Parent Class:", parent.attr('class'));

    // Check siblings (rows)
    parent.parent().children().each((i, el) => {
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        console.log(`Row ${i}: ${text}`);
    });
} else {
    console.log("'Batsman' text not found directly. Listing all tables or grid headers...");
    // Fallback: Dump text of plausible containers
    $('.cb-col-100').each((i, el) => {
        const txt = $(el).text().trim();
        if (txt.includes("Batsman") || txt.includes("Bowler")) {
            console.log("Container match:", txt.substring(0, 100));
        }
    });
}
