import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'
import { model } from '../config/gemini.js';

async function execute(client, message, args) {
    try {
        //await chat.sendStateTyping();

        let prompt = `Voce foi marcado em um grupo, possivelmente para esclarecer uma duvida, verifique nas duas mensagens qual conteudo deve ser esclarecido, e fale de maneira profissional e cientifica`+
                    `\nMensagem enviada${message.body}`;
                    //`\nMensagem mencionada:${message.quotedMsg.body}`;
        let ansnwer;

        if (message.hasQuotedMsg) {
            // 2. Pega a mensagem citada de forma assíncrona
            const quotedMsg = await message.getQuotedMessage();
            
            // 3. Adiciona o corpo da mensagem citada ao prompt
            prompt += `\n\nContexto (mensagem respondida): ${quotedMsg.body}`;
        }

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
            //await chat.clearState();
        };

        await message.reply(`⏱️ Latência: ${timeDiff}ms`);
    } catch ( error ) {
        logError(`Erro interno no comando !gpt: ${error}`);
    };
}

export const gpt = ({
    name: 'gpt',
    description: 'Utiliza IA para gerar uma respota automatica do que foi perguntado',
    execute: execute
})