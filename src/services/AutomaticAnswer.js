import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'

import { getContext } from '../utils/getContext.js'

const botId = "@558695416560"; // eu @91968201838774 eu tbm @558695416560

function sleep(minMs, maxMs) {
    const tempoAleatorio = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

    return new Promise(resolve => setTimeout(resolve, tempoAleatorio));
}

async function AutomaticAnswer(message, chat) {
    let wasMentioned = false;
    const msg = message.body.trim();

    if (msg.includes("@91968201838774") || msg.includes(botId)){wasMentioned = true;} // Verificao se foi marcado

    if (wasMentioned === true) {
        logInfo(`🔔 Mencionado em: ${chat.isGroup ? chat.name : contact.pushname}`);

        await chat.sendStateTyping();

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
            sleep(5000,10000)
            await message.reply(ansnwer);
            await chat.clearState();
        };

    };
};

export {AutomaticAnswer}