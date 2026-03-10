
const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Remove Bootstrap icons
html = html.replace(/<link rel="stylesheet" href="https:\/\/cdn.jsdelivr.net\/npm\/bootstrap-icons@1.10.5\/font\/bootstrap-icons.css">/, `<script src="https://unpkg.com/@phosphor-icons/web"></script>`);

const map = {
  "bi bi-justify": "ph-bold ph-list",
  "bi bi-bell-fill": "ph-fill ph-bell-ringing",
  "bi bi-envelope-at-fill": "ph-fill ph-envelope-simple",
  "bi bi-link-45deg": "ph-bold ph-link",
  "bi bi-youtube": "ph-fill ph-youtube-logo",
  "bi bi-discord": "ph-fill ph-discord-logo",
  "bi bi-instagram": "ph-fill ph-instagram-logo",
  "bi bi-twitch": "ph-fill ph-twitch-logo",
  "bi bi-spotify": "ph-fill ph-spotify-logo",
  "bi bi-journal-text": "ph-fill ph-article",
  "bi bi-steam": "ph-fill ph-steam-logo",
  "bi bi-book": "ph-fill ph-book-open-text",
  "bi bi-play-btn-fill": "ph-fill ph-play-circle",
  "bi bi-suit-heart-fill": "ph-fill ph-heart",
  "bi bi-clipboard": "ph-bold ph-clipboard-text",
  "bi bi-calendar-event": "ph-bold ph-calendar-blank",
  "bi bi-arrows-fullscreen": "ph-bold ph-corners-out",
  "bi bi-film": "ph-fill ph-film-strip",
  "bi bi-x-square-fill": "ph-fill ph-x-square",
  "bi bi-list": "ph-bold ph-list-dashes",
  "bi bi-person-fill": "ph-fill ph-user",
  "bi bi-info-circle": "ph-fill ph-info",
  "bi bi-box-arrow-up-right": "ph-bold ph-arrow-up-right",
  "bi bi-clock": "ph-bold ph-clock",
  "bi bi-hdd-network-fill": "ph-fill ph-hard-drives",
  "bi bi-exclamation-triangle-fill": "ph-fill ph-warning"
};

for (const [key, value] of Object.entries(map)) {
  html = html.replace(new RegExp(key, "g"), value);
}

fs.writeFileSync("index.html", html);

