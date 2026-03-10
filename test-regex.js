const fs = require('fs');
const text = fs.readFileSync('gr-read.xml', 'utf8');

const itemsStr = text.split('<item>');
itemsStr.shift(); // remove channel header
const books = itemsStr.slice(0, 3).map(item => {
    const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
    const linkMatch = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/) || item.match(/<link>(.*?)<\/link>/);
    const imgMatch = item.match(/<book_image_url><!\[CDATA\[(.*?)\]\]><\/book_image_url>/) || item.match(/<book_image_url>(.*?)<\/book_image_url>/);

    return {
        title: titleMatch ? titleMatch[1] : '',
        link: linkMatch ? linkMatch[1] : '',
        image: imgMatch ? imgMatch[1] : ''
    };
});

console.log(books);
