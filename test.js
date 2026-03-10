const fs = require('fs');

async function test() {
    const proxyUrl = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent("https://www.goodreads.com/review/list/100645513-gabriel-alcantara-de-albuquerque?shelf=read&sort=date_read&order=d");
    const res = await fetch(proxyUrl);
    const text = await res.text();
    console.log("Length of text:", text.length);
    const regex = /<a title="([^"]+)" href="(\/book\/show[^"]+)"><img alt="[^"]*" src="([^"]+)"/g;
    let match;
    let count = 0;
    while ((match = regex.exec(text)) !== null && count < 5) {
        console.log(match[1], match[2], match[3]);
        count++;
    }
}
test();
