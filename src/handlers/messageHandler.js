import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'

import { commandHandler } from '../handlers/commandHandler.js'
import { getContext } from '../utils/getContext.js'
import { model } from '../config/gemini.js'


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function messageHandler(client, message) {
    try{
        sleep(1000);

        // Obter informações do contato e chat
        const contact = await message.getContact(message);
        const chat = await message.getChat();
        const botId = "@558695416560"; // eu @91968201838774 eu tbm @558695416560

        // Ignorar mensagens de status e grupos (opcional)
        if (message.from === 'status@broadcast') return;

        //logInfo(`Mensagem de ${contact.name || contact.pushname}: ${message.body}`);
        
        // message.fromMe ||
        if (!message.body) return;
        

        if (chat.isGroup)  {
            logInfo(`Mensagem de ${ chat.name }`)
        }
        logInfo(`Mensagem de ${ contact.name || contact.pushname}: ${message.body }`);

        // Verificar se é um comando
        const prefix = process.env.COMMAND_PREFIX || '!';
        if (message.body.startsWith(prefix)) {
            logInfo(`Detectado um comando:`, message.body)
            await commandHandler(client, message);
            return;
        };

        var wasMentioned = false;
        const msg = message.body.trim();
        logInfo(`var msg: ${msg}`)
        if (msg.includes("@91968201838774") || msg.includes(botId)){wasMentioned = true;}

        if (wasMentioned === true) {
            logInfo(`🔔 Mencionado em: ${chat.isGroup ? chat.name : contact.pushname}`);

            const context = await getContext(chat, 10)
            logInfo(`O contexto do grupo: ${context}`)

            let prompt = `Você foi marcado no grupo "${chat.name}". Aqui está o contexto das últimas mensagens:\n${context}\n\nResponda de forma engraçada, baseado no contexto informado ou relevante para esse grupo.`
            
            try {
                let result = await model.generateContent(prompt);
                let resposta = result.response.text()
                
                logInfo(`Resposta automatica gerada: ${resposta}`)
                return resposta;
            } catch (error) {
                logError(`Erro ao gerar Resposta automatica: ${error}`)
            }

            await message.reply(resposta)
        };

    } catch (error) {
        console.error('Erro ao processar mensagem:', error );
    };

};

export { messageHandler};