import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg;

//import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import express from 'express';
import 'dotenv/config';

import { messageHandler } from './src/handlers/messageHandler.js';
import { logInfo, logError, logSuccess } from './src/utils/logger.js';
import { qrcodeGen } from './src/utils/qrcodeGen.js';
import { createNotificationsRoutes } from './src/routes/notificationRoutes.js';


// Configuração do cliente com LocalAuth para salvar sessão
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: process.env.SESSION_NAME || 'my-session',
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Evento: Exibir QR Code para autenticação
client.on('qr', (qr) => {
    logInfo('QR Code recebido! Escaneie com seu Whatsapp:');
    qrcode.generate(qr, {small:true });
});

// Evento: Cliente autenticado
client.on('autehenticated', () => {
    logSuccess('Cliente autenticado com sucesso!');
});

// Evento: Falha na autenticação
client.on('auth_failure', (msg) => {
    logError('Falha na autentição:', msg);
});

// Evento: Cliente pronto para uso
client.on('ready', () => {
    logSuccess('Cliente está pronto para usar!');
    logInfo('Bot conectado e aguardando mensagens...');
});

// Evento: Cliente desconectado
client.on('disconnected', (reason) => {
    logError('Cliente desconectado:', reason);
});

// Evento: Receber mensagens
client.on('message', async (message) => {
    await messageHandler(client, message);
});

// Evento: Estado de carregamento
client.on('loading_screen', (percent, message) => {
    logInfo(`Carregando... ${percent}% - ${message}`);
});

client.initialize();

process.on('unhandledRejection', (error) => {
    logError('Unhandled Rejection:', error);
});

// --- CONFIGURAÇÃO DA API EXPRESS ---
const app = express();
const PORTA_API  = process.env.PORTA_API;

app.use(express.json());

const notificationRouter = createNotificationsRoutes(client, logInfo, logError);

app.use('/notificar', notificationRouter);

app.listen(PORTA_API, () => {
    logInfo(`API de notificacoes ouvindo na porta ${PORTA_API}`)
})