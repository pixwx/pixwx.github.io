const fs = require('fs');

async function fetchSubstackNotes() {
    const handle = 'pixwx';
    const url = `https://${handle}.substack.com/api/v1/notes?limit=10`;

    try {
        console.log(`Buscando notes do Substack (${handle})...`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        let notesData = [];
        if (data && data.items) {
            notesData = data.items
                .filter(item => item.type === 'comment' && item.comment && item.comment.body)
                .map(item => {
                    return {
                        id: item.comment.id,
                        date: item.comment.date,
                        body: item.comment.body,
                        likes: item.comment.reaction_count || 0,
                        replies: item.comment.children_count || 0,
                        restacks: item.comment.restacks || 0,
                        url: `https://substack.com/@${item.comment.handle || handle}/note/c-${item.comment.id}`,
                        user_photo: item.comment.photo_url || '',
                        user_name: item.comment.name || '',
                        user_handle: item.comment.handle || ''
                    };
                });
        }

        fs.writeFileSync('substack-data.json', JSON.stringify(notesData, null, 2), 'utf8');

        // Escaping body text for safe JS insertion
        const jsContent = `window.SUBSTACK_NOTES = ${JSON.stringify(notesData, null, 2)};\nif(typeof window.renderSubstackNotes === 'function') window.renderSubstackNotes();`;
        fs.writeFileSync('substack-data.js', jsContent, 'utf8');

        console.log(`Dados do Substack atualizados com sucesso: ${notesData.length} notes encontrados.`);
    } catch (error) {
        console.error('Erro geral no Fetch do Substack:', error.message);
    }
}

fetchSubstackNotes();
