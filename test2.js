const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent("https://www.goodreads.com/review/list/100645513-gabriel-alcantara-de-albuquerque?shelf=read&sort=date_read&order=d");

fetch(proxyUrl).then(r => r.text()).then(t => {
    const match = /<img alt="([^"]+)" src="([^"]+)"/g;
    let m;
    while ((m = match.exec(t)) !== null) {
        if (m[2].includes('books/')) console.log("Lidos:", m[1], m[2]);
    }
});
