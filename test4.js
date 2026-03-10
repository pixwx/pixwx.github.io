const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent("https://www.goodreads.com/review/list_rss/100645513?shelf=currently-reading");

fetch(proxyUrl).then(r => r.text()).then(t => {
    console.log("RSS contents:", t.substring(0, 300));
});
