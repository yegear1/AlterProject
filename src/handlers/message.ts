import { WASocket } from "baileys";
import fs from 'fs';
import { dedent } from 'ts-dedent';
import { isJidGroup } from 'baileys'; 
import { FormattedMessage } from "../utils/message.js";
import { model } from "../services/gemini.js";
import { Socket } from "dgram";
import { expectationFailed } from "@hapi/boom";
import { GroupMonitor } from "../objects/GroupMonitor.js";
import { logger } from "../utils/logger.js";

async function sleep(ms: number, maxMs?: number): Promise<void> {
    let sleepTime = ms;

    // Se o segundo parâmetro (maxMs) foi passado, calcula um tempo aleatório
    if (maxMs) {
        sleepTime = ms + (Math.random() * (maxMs - ms));
        console.log(`[SLEEP] Esperando por ${Math.round(sleepTime)}ms (entre ${ms}ms e ${maxMs}ms)`);
    }

    return new Promise((resolve) => setTimeout(resolve, sleepTime));
}


let todo_mundo:string = '120363123456789012@g.us';
let outro_grupo:string = '120363123456789012@g.us';


const grupos = {
 //    '120363123456789012@g.us': new GroupMonitor('120363123456789012@g.us', 'Grupo 1', WASocket, model, todo_mundo),
//    '120363123456789999@g.us': new GroupMonitor('120363123456789999@g.us', 'Grupo 2', WASocket, model, outro_grupo)
};

const idsEncontrados = new Set();

const MessageHandler = async (bot: WASocket, message: FormattedMessage) => {
    const groupId = message.key.remoteJid!;

    if (isJidGroup(groupId)) { // Salvar IDs de grupos
        idsEncontrados.add(groupId)

        const info = {
            id: groupId,
            tipo: groupId.endsWith('@g.us') ? 'grupo' : 'pessoa',
            nome: message.pushName || 'Desconhecido',
            timestamp: new Date().toISOString()
        };

        const arquivo = './ids_descobertos.json';
        let dados = [];

        if (fs.existsSync(arquivo)) {
            dados = JSON.parse(fs.readFileSync(arquivo,'utf-8'))
        }

        dados.push(info);
        fs.writeFileSync(arquivo, JSON.stringify(dados,null,2));

        logger.info(`💾 Novo ID salvo: ${groupId}`);
    }

}

export default MessageHandler;