async function fetchShelf(shelf) {
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(`https://www.goodreads.com/review/list_rss/100645513?shelf=${shelf}&sort=date_read&order=d`);
    const r = await fetch(proxyUrl);
    const json = await r.json();
    const t = json.contents;
    const itemsStr = t.split('<item>');
    itemsStr.shift();
    return itemsStr.slice(0, 3).map(item => {
        const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
        const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/i) || item.match(/<link>(.*?)<\/link>/i);
        const imgMatch = item.match(/<book_image_url><!\[CDATA\[(.*?)\]\]><\/book_image_url>/i) || item.match(/<book_image_url>(.*?)<\/book_image_url>/i);
        return {
            title: titleMatch ? titleMatch[1] : '',
            link: linkMatch ? linkMatch[1] : '',
            image: imgMatch ? imgMatch[1] : ''
        };
    }).filter(b => b.title);
}

fetchShelf('currently-reading').then(b => { console.log("Currently Reading:", b); return fetchShelf('read'); }).then(b => { console.log("Read:", b); process.exit(0); }).catch(console.error);
