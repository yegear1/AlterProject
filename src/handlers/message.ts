import { WASocket } from "baileys";
import { dedent } from 'ts-dedent';
import { isJidGroup } from 'baileys'; 
import { FormattedMessage } from "../utils/message.js";
import { model } from "../services/gemini.js";
import { Socket } from "dgram";
import { expectationFailed } from "@hapi/boom";

interface UserState { // interface para o estado do usuario
    state: string;
    pausedUntil?: number; // Armazena o timestamp em milissegundos
    debounceTimer?: NodeJS.Timeout;
}

const userStates: { [key: string]: UserState } = {};

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processMessageLogic(bot: WASocket, message: FormattedMessage) {
    const userId = message.key.remoteJid!;
    const messageContent = message.content!//.trim().toLowerCase();
    const userStateObject = userStates[userId];
    const currentState = userStateObject?.state;

    


    if (currentState){
        switch (currentState){
            // Estado 1 - Inicial
            case 'aguardando_opcao_inicial':
                await sleep(1000);
                if (messageContent === '1'){ // 1 - Usuario Externo
                    await bot.sendMessage(userId, { text: ``}); 
                    userStates[userId] =  {state: 'fluxo_externo'}
                }
                else{
                    await bot.sendMessage(userId, { text: `Opção inválida. Por favor, digite 1 ou 2.`});
                }
                break;
            case 'fluxo_externo':
                await sleep(1000);
                if (messageContent === '1'){ // fluxo_externo/ 1 - Criar usuario externo
                    await bot.sendMessage(userId, { text:``});
                    //userStates[userId] =  {state: 'fluxo_externo_passo_1'}
                    delete userStates[userId]
                }

                else if (messageContent === '3'){ // fluxo_externo/ 3 - Duvidas acesso SEI
                    await bot.sendMessage(userId, { text:``});
                    const nomeUsuario = message.pushName
                    const notificacaoParaEquipe = dedent(`
                        *Nova Dúvida para o Suporte SEI!*
                        *De:* ${nomeUsuario}
                        *Contato:* ${userId.split('@')[0]}

                        O usuário solicitou ajuda com "Dúvidas acesso SEI ( Externo )" e aguarda um atendente.
                    `)
                    
                    await bot.sendMessage(ID_GROUP_SUPORTE, {text:notificacaoParaEquipe})

                    userStates[userId] =  {
                        state: '', 
                        pausedUntil: Date.now() + umDia
                    }

                }
                else {
                    await bot.sendMessage(userId, { text:`Nao entendi o seu comando, escolha uma opcao valida`});
                }
                break;

                //
                //
                //

            case 'fluxo_interno':
                await sleep(1000);
                if (messageContent === '1'){ // fluxo_interno/ 1 - Suporte SEI  Geral
                    await bot.sendMessage(userId, { text:``});
                    delete userStates[userId]
                }
                else if (messageContent === '2'){ // fluxo_interno/ 2 - Outras demandas SEI
                    await bot.sendMessage(userId, { text:`Informe sua duvida que a equipe de suporte responderá o mais breve possivel!`});
                    const nomeUsuario = message.pushName
                    const notificacaoParaEquipe = dedent(`
                        *Nova Dúvida para o Suporte SEI!*
                        *De:* ${nomeUsuario}
                        *Contato:* ${userId.split('@')[0]}

                        O usuário solicitou ajuda com "Dúvidas acesso SEI ( interno )" e aguarda um atendente.
                    `)
                    
                    await bot.sendMessage(ID_GROUP_SUPORTE, {text:notificacaoParaEquipe})
                    
                    userStates[userId] =  {state: 'aguardando_opcao_inicial', pausedUntil: Date.now() + umDia}

                }
                else {
                    await bot.sendMessage(userId, { text:`Nao entendi o seu comando, escolha uma opcao valida`});
                }
                break;
            }

    } 
    else { // Quando não está em nenhum fluxo
        await sleep(1000);

        await bot.sendPresenceUpdate('composing', userId)

        try{
            const result = await model.generateContent(messageContent);
            const response: string = result.response.text();

            await bot.sendMessage(userId, { text:response });
        }
        catch (error){
            if (error instanceof Error) {
            console.error("\nErro ao enviar mensagem gerada por IA:", error.message);
            } 
            else {
            console.error("\nErro desconhecido:", error);
            }
            await bot.sendMessage(userId, { text:`avisa`});
        }

        // const welcomeMessage = ``;

        //userStates[userId] = {state: 'aguardando_opcao_inicial'}
    }
}


// ID do grupo 120363196250059882@g.us
const MessageHandler = async (bot: WASocket, message: FormattedMessage) => {
    const groupId = message.key.remoteJid!;
    if (isJidGroup(groupId)) {
        // ADICIONE A LINHA ABAIXO TEMPORARIAMENTE
        console.log(`\n \n--- ID DE GRUPO ENCONTRADO: ${groupId} ---\n \n`); 
        return;
    }

    if (message.key.fromMe || isJidGroup(message.key.remoteJid!) || !message.content) {
        return;
    }

    const userId = message.key.remoteJid!;
    const userStateObject = userStates[userId] || { state: '' };

    if (userStateObject.pausedUntil && Date.now() < userStateObject.pausedUntil) {
        console.log(`[PAUSED] Usuário ${userId} está pausado. Mensagem ignorada.`);
        return;
    }

    if (userStateObject.debounceTimer){
        clearTimeout(userStateObject.debounceTimer);
        console.log(`[DEBOUNCE] Timer anterior para ${userId} cancelado`);
    }

    const newTimer = setTimeout(() => {
        console.log(`[DEBOUNCE] Timer para ${userId} finalizado. Processando a mensagem`);
        processMessageLogic(bot, message);
    }, 2000);
    userStates[userId] = {...userStateObject, debounceTimer: newTimer};
}

export default MessageHandler;