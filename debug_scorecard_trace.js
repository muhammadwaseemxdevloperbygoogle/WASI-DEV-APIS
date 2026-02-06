const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_scorecard.html', 'utf8');
const $ = cheerio.load(html);

console.log("Deep Search for Scorecard Data...");

// Search for Vaibhav Sooryavanshi to find where he's listed
const player = $('*:contains("Vaibhav Sooryavanshi")').last();
if (player.length) {
    console.log("Found Player Element:", player.prop('tagName'), player.attr('class'));
    console.log("Parent:", player.parent().attr('class'));
    console.log("Grandparent:", player.parent().parent().attr('class'));

    // Print the whole row text
    console.log("Row Text:", player.closest('div').parent().text());
} else {
    console.log("Player not found in DOM.");
}

// Dump generic structure if possible
$('div[class*="flex"]').each((i, el) => {
    const txt = $(el).text();
    if (txt.includes("Vaibhav Sooryavanshi") && txt.length < 200) {
        console.log("Potential Row:", txt);
        console.log("Classes:", $(el).attr('class'));
    }
});
