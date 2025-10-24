import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'
import { commandHandler } from '../handlers/commandHandler.js'
import { AutomaticAnswer } from '../services/AutomaticAnswer.js';
import { model } from '../config/gemini.js'


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function messageHandler(client, message) {
    //console.log(message);

    try{
        await sleep(1000);

        // Informacoes do Contato
        const contact = await message.getContact(message);
        const autorId = contact.id._serialized

        const chat = await message.getChat();

        // Ignorar mensagens de status e grupos (opcional)
        if (message.from === 'status@broadcast') return;

        //logInfo(`Mensagem de ${contact.name || contact.pushname}: ${message.body}`);
        
        // message.fromMe ||
        if (!message.body) return;
        

        if (chat.isGroup)  {
            const groupId = chat.id._serialized;
            logInfo(
                `-- Mensagem em Grupo --\n` +
                `Grupo: ${chat.name} | ID: ${groupId}\n` +
                `Autor: ${contact.pushname || contact.name} | ID: ${autorId}`
            )
        } else {
            logInfo(
                `-- Mensagem Privada --\n`+
                `De: ${contact.pushname || contact.name} | ID: ${autorId}`
            );
        }
        logInfo(`Conteúdo: ${message.body}\n--------------------`);

        // Verificar se é um comando
        const prefix = process.env.COMMAND_PREFIX || '!';
        if (message.body.startsWith(prefix)) {
            logInfo(`Detectado um comando:`, message.body)
            await commandHandler(client, message);
            return;
        };

        AutomaticAnswer(message, chat)

    } catch (error) {
        logError('Erro ao processar mensagem:', error );
    };

};

export { messageHandler };