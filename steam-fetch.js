const fs = require('fs');
const xml2js = require('xml2js');

async function fetchSteamXML() {
    const accountId = 'pixwx';
    const url = `https://steamcommunity.com/id/${accountId}?xml=1`;

    try {
        console.log(`Buscando perfil da Steam...`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/xml,application/xml'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const xml = await response.text();
        const parser = new xml2js.Parser({ explicitArray: false });

        parser.parseString(xml, (err, result) => {
            if (err) {
                throw new Error('Falha ao processar XML da Steam');
            }

            if (result && result.profile && result.profile.mostPlayedGames && result.profile.mostPlayedGames.mostPlayedGame) {
                let games = result.profile.mostPlayedGames.mostPlayedGame;

                // Ensure array when there's only 1 item
                if (!Array.isArray(games)) {
                    games = [games];
                }

                const data = games.map(g => ({
                    name: g.gameName,
                    hours: g.hoursOnRecord || '0',
                    logo: g.gameLogo ? g.gameLogo.replace('media.steampowered.com', 'cdn.akamai.steamstatic.com') : '',
                    link: g.gameLink
                }));

                fs.writeFileSync('steam-data.json', JSON.stringify(data, null, 2), 'utf8');
                console.log('Dados da Steam atualizados com sucesso ({steam-data.json})');
            } else {
                console.log('Nenhum jogo recente ou perfil privado.');
            }
        });
    } catch (error) {
        console.error('Erro geral no Fetch da Steam:', error.message);
        process.exit(1);
    }
}

fetchSteamXML();
