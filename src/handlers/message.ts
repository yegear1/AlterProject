import { WASocket } from "baileys";
import { dedent } from 'ts-dedent';
import { isJidGroup } from 'baileys'; 
import { FormattedMessage } from "../utils/message.js";
import { model } from "../services/gemini.js";
import { Socket } from "dgram";
import { expectationFailed } from "@hapi/boom";
import { GroupMonitor } from "../objects/GroupMonitor.js";

interface UserState { // interface para o estado do usuario
    state: string;
    pausedUntil?: number; // Armazena o timestamp em milissegundos
    debounceTimer?: NodeJS.Timeout;
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let todo_mundo:string = '120363123456789012@g.us';
let outro_grupo:string = '120363123456789012@g.us';


const grupos = {
 //    '120363123456789012@g.us': new GroupMonitor('120363123456789012@g.us', 'Grupo 1', WASocket, model, todo_mundo),
//    '120363123456789999@g.us': new GroupMonitor('120363123456789999@g.us', 'Grupo 2', WASocket, model, outro_grupo)
};

// ID do grupo 120363196250059882@g.us
const MessageHandler = async (bot: WASocket, message: FormattedMessage) => {
    const groupId = message.key.remoteJid!;
    if (isJidGroup(groupId)) { // Identificador
        console.log(`\n \n--- ID DE GRUPO ENCONTRADO: ${groupId} ---\n \n`); 
        return;
    }

    //if (message.key.fromMe) { // Ignorador de mensagens
    //    return;
   // }

    const userId = message.key.remoteJid!;
    //const userStateObject = userStates[userId] || { state: '' };

}

export default MessageHandler;