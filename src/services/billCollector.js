import fs from 'fs'
import cron from 'node-cron'

import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'
import { qrcodeGen } from '../utils/qrcodeGen';

async function billColector(contact, frequency, value) {
    logInfo('Verificando cobranças agendadas...');
    const hoje = new Date();
    const diaDoMes = hoje.getDate();
    const diaDaSemana = hoje.getDate();

    try {
        const dados = fs.readFileSync('./cobrancas.json', 'utf8');
        const bills = JSON.parse(dados);

        for (const bill of bills) {
            if (!bill.ativo) continue;

            let deveCobrar = false;

            if (bill.frequency === 'mensal' && diaDoMes === bill.dia){}
        }
    }
    chatId = "558698098493@c.us"

    getPayment();
}