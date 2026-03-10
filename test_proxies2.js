
const url = "https://pixwx.substack.com/api/v1/archive?limit=2";
async function run() {
  const p1 = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
  try {
    const resp = await fetch(p1);
    const data = await resp.json();
    console.log("Is array?", Array.isArray(data));
    console.log("Length:", data.length);
    if (data.length > 0) console.log("First item title:", data[0].title);
  } catch(e) {
    console.error(e.message);
  }
}
run();

