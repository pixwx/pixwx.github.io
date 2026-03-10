async function fetchShelf(shelf) {
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(`https://www.goodreads.com/review/list_rss/100645513?shelf=${shelf}&sort=date_read&order=d`);
    const r = await fetch(proxyUrl);
    const t = await r.text();
    console.log("Response length:", t.length);
    console.log("Response text start:", t.substring(0, 50));
}

fetchShelf('currently-reading').then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
