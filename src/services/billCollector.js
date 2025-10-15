import fs from 'fs'
import cron from 'node-cron'

import { logInfo, logError, logSuccess } from './utils/logger.js';
import { qrcodeGen } from '../utils/qrcodeGen';

async function billColector(contact, frequency, value) {
    logInfo('⏰ Verificando cobranças agendadas...');
    chatId = "558698098493@c.us"

    getPayment();
}