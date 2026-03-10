const fs = require('fs');
const xml2js = require('xml2js');

async function fetchShelf(url) {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(text);

    const items = result.rss.channel.item;
    if (!items) return [];

    const books = Array.isArray(items) ? items : [items];
    return books.slice(0, 3).map(b => ({
        title: b.title,
        link: b.link,
        image: b.book_image_url
    }));
}

async function main() {
    try {
        const lendo = await fetchShelf('https://www.goodreads.com/review/list_rss/100645513?shelf=currently-reading');
        const lidos = await fetchShelf('https://www.goodreads.com/review/list_rss/100645513?shelf=read&sort=date_read&order=d');

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
