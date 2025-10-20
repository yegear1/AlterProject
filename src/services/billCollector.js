import fs from 'fs'
import cron from 'node-cron'

import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'
import { qrcodeGen } from '../utils/qrcodeGen.js';

async function billColector( client ) {
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

            if (bill.frequency === 'mensal' && diaDoMes === bill.dia){
                deveCobrar = true;
            } else if (bill.frequency === 'semanal' && diaDaSemana  === bill.dia ){
                deveCobrar = true;
            }

            if (deveCobrar) {
                logInfo(`Gerando cobranca para ${bill.pessoa.nome}`)

                const pix = await qrcodeGen(bill.valor);

                const mensagem = 
                    `Olá, ${cobranca.pessoa.nome}! 👋\n\n` +
                    `Estou passando para lembrar da sua cobrança ${cobranca.frequencia} no valor de R$ ${cobranca.valor.toFixed(2)}.\n\n` +
                    `Você pode pagar diretamente pelo QR Code ou usando o código PIX Copia e Cola abaixo:\n\n` +
                    `\`\`\`${pix.copiaECola}\`\`\``;

                await client.sendMessage(cobranca.pessoa.telefone, mensagem);
                await client.sendMessage(cobranca.pessoa.telefone, pix.qrCodeMedia);    
            };
        };
    } catch ( error ) {
        logError(`Erro ao processar arquivo de cobrancas: ${error}`)
    };
};

function billSchedule() {
    cron.schedule('0 8 * * *', billColector, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

    logInfo(`Agendador de cobrancas iniciado. Verificacao diaria as 9:00`)
}

export { billSchedule, billColector }