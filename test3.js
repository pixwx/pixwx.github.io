const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent("https://www.goodreads.com/user/show/100645513-gabriel-alcantara-de-albuquerque");

fetch(proxyUrl).then(r => r.text()).then(t => {
    const regex = /<a title="([^"]+)" href="(\/book\/show[^"]+)"><img alt="[^"]*" src="([^"]+)"/g;
    let m;
    while ((m = regex.exec(t)) !== null) {
        console.log("Book:", m[1], m[2]);
    }
});
