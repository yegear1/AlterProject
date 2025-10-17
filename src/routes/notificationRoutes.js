import express from 'express'
import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'
import { error } from 'qrcode-terminal';

function createNotificationsRoutes(client) {
    const router = express.Router();
    
    router.post('/', async (req, res)  => {
        const {targertID, message } = req.body;
        
        logInfo(`Notificacao recebida via API para o ID: ${targertID}`);

        if (!targertID || !message) {
            logError(`Requisicao para /notificar incompleta`);
            return res.status(400).json({ error: 'É necessário fornecer "targetId" e "message".' })
        }
        try {
            await client.sendMessage(targertID,message);
            res.status(200).json({ succes: `Message enviada para ${targertID}`});
        } catch ( error ) {
            logError(`Erro ao enviar mensagem via API: ${error}`);
            res.status(500).json({error:'Falha ao enviar a mensagem pelo Whatsapp'});
        };
    });

    return router;

};

export { createNotificationsRoutes };