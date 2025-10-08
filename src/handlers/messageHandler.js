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
            logInfo(`Mensagem de ${ chat.name }\nID: ${ chat.id }`)
            logInfo(Object.keys(chat.id));
        }
        logInfo(`Mensagem de ${ contact.name || contact.pushname}: ${message.body }`);

        // Verificar se é um comando
        const prefix = process.env.COMMAND_PREFIX || '!';
        if (message.body.startsWith(prefix)) {
            logInfo(`Detectado um comando:`, message.body)
            await commandHandler(client, message);
            return;
        };

        let wasMentioned = false;
        const msg = message.body.trim();
        if (msg.includes("@91968201838774") || msg.includes(botId)){wasMentioned = true;}

        if (wasMentioned === true) {
            logInfo(`🔔 Mencionado em: ${chat.isGroup ? chat.name : contact.pushname}`);

            const context = await getContext(chat, 10);
            logInfo(`O contexto do grupo: ${context}`);

            let prompt = `Você foi marcado no grupo "${chat.name}". Aqui está o contexto das últimas mensagens:\n${context}\n\nVocê esta se passando como o dono desse contato, Yegear, e está respondendo diretamente como se fosse ele, então crie um texto que faça sentido como uma pessoa comum.`
            let ansnwer;


            try {
                const result = await model.generateContent(prompt);
                ansnwer = result.response.text();
                
                logInfo(`Resposta automatica gerada: ${ansnwer}`);
            } catch (error) {
                logError(`Erro ao gerar Resposta automatica: ${error}`);
                ansnwer = "avisa";
            };

            if (ansnwer){
                await message.reply(ansnwer);
            };

        };

    } catch (error) {
        console.error('Erro ao processar mensagem:', error );
    };

};

export { messageHandler};