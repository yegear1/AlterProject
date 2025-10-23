import pkg from 'whatsapp-web.js'
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';
import express from 'express';
import cron from 'node-cron'
import 'dotenv/config';

import { createNotificationsRoutes } from './src/routes/notificationRoutes.js';
import { logInfo, logError, logSuccess } from './src/utils/logger.js';
import { messageHandler } from './src/handlers/messageHandler.js';
import { billSchedule } from './src/services/billCollector.js';


// Configuração do cliente com LocalAuth para salvar sessão
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: process.env.SESSION_NAME || 'my-session',
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: 'new',
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

    billSchedule(client)
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

app.use(express.json());

const notificationRouter = createNotificationsRoutes(client);
app.use('/notificar', notificationRouter);

app.listen(process.env.PORTA_API, () => {
    logInfo(`API de notificacoes ouvindo na porta ${process.env.PORTA_API}`)
})