
fetch("https://api.codetabs.com/v1/proxy/?quest=" + encodeURIComponent("https://steamcommunity.com/id/pixwx/?xml=1"))
  .then(res => res.text())
  .then(xml => {
     let match = xml.match(/<mostPlayedGames>([\s\S]*?)<\/mostPlayedGames>/);
     if (match) {
        let games = match[1].match(/<game>([\s\S]*?)<\/game>/g);
        console.log("Games XML:", games ? games.slice(0, 2).join("\n") : "no games array");
     } else {
        console.log("No mostplayed games", xml.substring(0,250));
     }
  });

