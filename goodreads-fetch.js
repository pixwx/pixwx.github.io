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

async function main() {
    try {
        const lendo = await fetchShelf('https://www.goodreads.com/review/list_rss/100645513?shelf=currently-reading', 3);
        const lidos = await fetchShelf('https://www.goodreads.com/review/list_rss/100645513?shelf=read&sort=date_read&order=d', 6);

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
