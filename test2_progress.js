const fs = require('fs');
const xml2js = require('xml2js');

async function testFetch() {
    const res = await fetch('https://www.goodreads.com/user/updates_rss/100645513');
    const text = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(text);

    const items = result.rss.channel.item;
    const updates = Array.isArray(items) ? items : [items];
    
    let progressMap = {}; // book title -> progress string

    updates.forEach(u => {
        if (u.title && typeof u.title === 'string') {
            // "Gabriel is 8% done with Macuna\u00eema"
            // "Gabriel is on page 42 of 300 of Macuna\u00eema"
            const matchPerc = u.title.match(/is (\d+)% done with (.*)/i);
            const matchPage = u.title.match(/is on page (\d+) of (\d+) of (.*)/i);
            const matchPageOnly = u.title.match(/is on page (\d+) of (.*)/i);

            let title = null;
            let prog = null;

            if (matchPerc) {
                title = matchPerc[2].trim();
                prog = matchPerc[1] + '%';
            } else if (matchPage) {
                title = matchPage[3].trim();
                prog = Math.round((parseInt(matchPage[1]) / parseInt(matchPage[2])) * 100) + '%';
            } else if (matchPageOnly) {
                title = matchPageOnly[2].trim();
                prog = matchPageOnly[1] + ' pgs';
            }

            if (title && prog && !progressMap[title]) {
                progressMap[title] = prog;
            }
        }
    });

    console.log(progressMap);
}

testFetch();
