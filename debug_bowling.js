const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('debug_scorecard.html', 'utf8');
const $ = cheerio.load(html);

console.log("Analyzing Bowling Section...");

// Find the header "Bowler"
$('*:contains("Bowler")').each((i, el) => {
    const txt = $(el).text().trim();
    if (txt === "Bowler") {
        console.log(`Found 'Bowler' Header at ${$(el).prop('tagName')}.${$(el).attr('class')}`);

        // Go 3-4 levels up to find the container
        const container = $(el).closest('.bg-white'); // assuming card style
        // Or look at siblings of the header row

        let parent = $(el).parent();
        console.log(`Parent: ${parent.prop('tagName')}.${parent.attr('class')}`);

        let grandParent = parent.parent();
        console.log(`GrandParent: ${grandParent.prop('tagName')}.${grandParent.attr('class')}`);

        // Print usage
        console.log("--- Siblings/Rows ---");
        grandParent.nextAll().each((j, row) => {
            if (j < 5) {
                console.log(`Row ${j}: ${$(row).text().replace(/\s+/g, ' ')}`);
                console.log(`  Class: ${$(row).attr('class')}`);
            }
        });
    }
});
