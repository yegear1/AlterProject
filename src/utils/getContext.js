import { logInfo } from "./logger.js";

async function getContext(chat, limit=10) {
    logInfo('--- INSPECIONANDO O OBJETO "chat" ---');
    logInfo(chat);
    logInfo('--- MÉTODOS E PROPRIEDADES DISPONÍVEIS ---');
    logInfo(Object.keys(chat));

    try {
        let mensagens = await chat.fetchMessages({ limit: limit, fromMe:false});

        logInfo(`debug const mensagens: ${mensagens.length} mensagens encontradas.`);

        const contextArray = [];
 
        for (const msg of mensagens) {
            if (msg.type !== 'chat') continue;
            //if (msg.fromMe) continue;

            const contact = await msg.getContact();

            if (msg.fromMe) continue;
            
            const mensagemInfo = {
                autor: contact.pushname || contact.name || contact.number,
                conteudo: msg.body || '[Mídia/Sticker]',
            };
            contextArray.push(mensagemInfo);
        };

        // Formata o contexto como uma única string de texto, em ordem cronológica
        const contextString = contextArray
            .reverse() // Coloca as mensagens mais antigas primeiro
            .map(m => `${m.autor}: ${m.conteudo}`) // Formata "Autor: Mensagem"
            .join('\n'); // Junta tudo com quebras de linha

        // ✅ A CORREÇÃO CRÍTICA ESTÁ AQUI:
        logInfo("Entrega de contexto feita")
        return contextString;
    } catch (error) {
        console.error('Erro ao buscar contexto:', error);
        return null;
    };
};

export {getContext}