const fs = require('fs');
const xml2js = require('xml2js');

async function fetchShelf(url, limit = 3) {
    const urlWithCacheBust = url + (url.includes('?') ? '&' : '?') + '_cb=' + Date.now();
    const res = await fetch(urlWithCacheBust, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/xml,application/xml'
        }
    });

    if (!res.ok) {
        throw new Error(`Goodreads HTTP Error: ${res.status}`);
    }

    const text = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(text);

    if (!result || !result.rss || !result.rss.channel || !result.rss.channel.item) {
        console.warn(`Goodreads RSS parsing warning: No items found or invalid format for ${url}`);
        return [];
    }

    const items = result.rss.channel.item;
    const books = Array.isArray(items) ? items : [items];
    return books.slice(0, limit).map(b => ({
        title: b.title,
        link: b.link,
        image: b.book_image_url ? b.book_image_url.replace(/\._S[A-Z0-9_]+_/i, '') : '',
        author: b.author_name || '',
        year: b.book_published || ''
    }));
}

async function fetchProgress() {
    const url = `https://www.goodreads.com/user/updates_rss/100645513?_cb=${Date.now()}`;
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/xml,application/xml'
        }
    });

    if (!res.ok) {
        console.warn(`Goodreads Progress HTTP Error: ${res.status}`);
        return {};
    }

    const text = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(text);

    if (!result || !result.rss || !result.rss.channel || !result.rss.channel.item) {
        return {};
    }

    const items = result.rss.channel.item;
    const updates = Array.isArray(items) ? items : [items];
    let progressMap = {};

    updates.forEach(u => {
        if (u.title && typeof u.title === 'string') {
            const cleanTitle = u.title.replace(/\s+/g, ' ').trim();
            const matchPerc = cleanTitle.match(/is (\d+)% done with (.*)/i);
            const matchPage = cleanTitle.match(/is on page (\d+) of (\d+) of (.*)/i);

            let title = null;
            let progNum = null;

            if (matchPerc) {
                title = matchPerc[2].trim();
                progNum = matchPerc[1];
            } else if (matchPage) {
                title = matchPage[3].trim();
                progNum = Math.round((parseInt(matchPage[1]) / parseInt(matchPage[2])) * 100).toString();
            }

            if (title && progNum && !progressMap[title]) {
                progressMap[title] = progNum;
            }
        }
    });
    return progressMap;
}

async function main() {
    try {
        const lendo = await fetchShelf('https://www.goodreads.com/review/list_rss/100645513?shelf=currently-reading', 3);
        const lidos = await fetchShelf('https://www.goodreads.com/review/list_rss/100645513?shelf=read&sort=date_read&order=d', 100);
        
        const progressMap = await fetchProgress();
        lendo.forEach(b => {
            const matchingKey = Object.keys(progressMap).find(k => 
                b.title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(b.title.toLowerCase())
            );
            if (matchingKey) {
                b.progress = progressMap[matchingKey];
            }
        });

        const data = { lendo, lidos };
        fs.writeFileSync('goodreads-data.json', JSON.stringify(data, null, 2));

        const jsContent = `window.GOODREADS_DATA = ${JSON.stringify(data, null, 2)};\nif(typeof window.renderGoodreadsBooks === 'function') window.renderGoodreadsBooks();`;
        fs.writeFileSync('goodreads-data.js', jsContent);

        console.log("Goodreads data saved!");
    } catch (err) {
        console.error("Goodreads error:", err);
        process.exit(1);
    }
}

main();
