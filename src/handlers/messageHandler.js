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
        const contact = await message.getContact();
        const chat = await message.getChat();
        const botId = client.info.wid._serialized;

        // Ignorar mensagens de status e grupos (opcional)
        if (message.from === 'status@broadcast') return;

        //logInfo(`Mensagem de ${contact.name || contact.pushname}: ${message.body}`);
        
        // message.fromMe ||
        if (message.fromMe || !message.body) return;
        

        const wasMentioned = message.mentionedIds && message.mentionedIds.includes(botId);

        logInfo(`Mensagem de ${ chat.name }`)
        logInfo(`Mensagem de ${ contact.name || contact.pushname}: ${message.body }`);

        // Verificar se é um comando
        const prefix = process.env.COMMAND_PREFIX || '!';
        if (message.body.startsWith(prefix)) {
            logInfo(`Detectado um comando:`, message.body)
            await commandHandler(client, message);
            return;
        };

        if (wasMentioned) {
            logInfo(`🔔 Mencionado em: ${chat.isGroup ? chat.name : contact.pushname}`);

            const context = await getContext(chat, 10)
            logInfo(`O contexto do grupo: ${context}`)

            prompt = `Você foi marcado no grupo "${this.chat.name}". Aqui está o contexto das últimas mensagens:\n${context}\n\nResponda de forma engraçada, baseado no contexto informado ou relevante para esse grupo.`
        };

    } catch (error) {
        console.error('Erro ao processar mensagem:', error );
    };

};

export { messageHandler};