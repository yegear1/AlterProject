import fs from 'fs'
import cron from 'node-cron'

import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'
import { qrcodeGen } from '../utils/qrcodeGen.js';

async function billColector( client ) {
    logInfo('Verificando cobranças agendadas...');
    const hoje = new Date();
    const diaDoMes = hoje.getDate();
    const diaDaSemana = hoje.getDate();

    logger.info(`Hoje e dia ${hoje}`)

    try {
        
        const dados = fs.readFileSync('./cobrancas.json', 'utf8');
        const bills = JSON.parse(dados);

        for (const bill of bills) {
            logInfo(`A ${bill.pessoa.nome} sera cobrada ${bill.day} na frequencia ${bill.frequency} no valor ${bill.valor}`)
            if (!bill.ativo) continue;

            let deveCobrar = false;

            if (bill.frequency === 'mensal' && diaDoMes === bill.day){
                deveCobrar = true;
            } else if (bill.frequency === 'semanal' && diaDaSemana  === bill.day ){
                deveCobrar = true;
            }
            logInfo(`${bill.pessoa.nome} ${deveCobrar}`);

            if (deveCobrar) {
                logInfo(`Gerando cobranca para ${bill.pessoa.nome}`)

                const pix = await qrcodeGen(bill.valor);

                const mensagem = 
                    `Olá, ${bill.pessoa.nome}! ??\n\n` +
                    `Estou passando para lembrar da sua cobrança ${bill.frequencia} no valor de R$ ${bill.valor.toFixed(2)}.\n\n` +
                    `Você pode pagar diretamente pelo QR Code ou usando o código PIX Copia e Cola abaixo:\n\n` +
                    `\`\`\`${pix.copiaECola}\`\`\``;

                await client.sendMessage(bill.pessoa.telefone, mensagem);
                await client.sendMessage(bill.pessoa.telefone, pix.qrCodeMedia);    
            };
        };
    } catch ( error ) {
        logError(`Erro ao processar arquivo de cobrancas: ${error}`)
    };
    logInfo('Terminado exeucao de billColector');
};

function billSchedule() {
    cron.schedule('0 8 * * *', billColector, {
        scheduled: true,
        timezone: "America/Sao_Paulo"
    });

    logInfo(`Agendador de cobrancas iniciado. Verificacao diaria as 11:55`)
}

export { billSchedule, billColector }