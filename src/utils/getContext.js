
async function getContext(chat, limit=10) {
    try {
        const mensagens = await chat.fetchMessages({ limit: limit, fromMe:false})

        const context = {
            nomeGrupo: chat.name,
            totalParticipantes: chat.participants ? chat.participants.length : 0,
            mensagens: []
        };

        for (msg of mensagens) {
            const contact = await msg.getContact();

            if (msg.fromMe) continue;
            
            const mensagemInfo = {
                autor: contact.pushname || contact.name || contact.number,
                conteudo: msg.body || '[Mídia/Sticker]',
            };
            context.mensagens.push(mensagemInfo);
        };
    } catch (error) {
        console.error('Erro ao buscar contexto:', error);
        return null;
    };
};