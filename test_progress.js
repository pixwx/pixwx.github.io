const fs = require('fs');

async function check() {
  const r = await fetch('https://www.goodreads.com/user/updates_rss/100645513');
  const t = await r.text();
  fs.writeFileSync('test_updates.xml', t);
  console.log("Written!");
}
check();
