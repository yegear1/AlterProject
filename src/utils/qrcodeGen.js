import { logError, logInfo, logSuccess, logWarning } from '../utils/logger.js'

import { QrCodePix } from "qrcode-pix";
import qrcode from "qrcode";

const chave_pix = process.env.CHAVE_PIX;
const nome_recebedor = process.env.NOME_RECEBEDOR;
const cidade_recebedor = process.env.CIDADE_RECEBEDOR;

// PASSO DE DEPURAÇÃO 1: VERIFICAR OS VALORES CARREGADOS
// =============================================================================
console.log("--- Verificando Variáveis Carregadas do .env ---");
console.log(`CHAVE_PIX: "${chave_pix}"`);
console.log(`NOME_RECEBEDOR: "${nome_recebedor}"`);
console.log(`CIDADE_RECEBEDOR: "${cidade_recebedor}"`);
console.log("-------------------------------------------------");

if (!chave_pix || !nome_recebedor || !cidade_recebedor) {
  logError("Erro: Uma ou mais variáveis de ambiente (CHAVE_PIX, NOME_RECEBEDOR, CIDADE_RECEBEDOR) não foram definidas no arquivo .env");
  process.exit(1);
}


async function qrcodeGen(valor) {
    try {
        if (typeof valor !== 'number' || valor <= 0) {
            logError('O valor para o QR Code deve ser um número maior que zero.');
            return;
        }
        // 1. Gerar o Payload (BR Code)
        const qrCodePix = QrCodePix({
        version: '01',
        key: chave_pix,
        name: nome_recebedor,
        city: cidade_recebedor,
        value: valor,
        });

        const br_code_payload = qrCodePix.payload();
        logInfo("PIX Copia e Cola (BR Code):");
        logInfo(br_code_payload);

        // 2. Gerar a imagem do QR Code

        // Opção A: Salvar em um arquivo
        //const nome_arquivo = `pix_qrcode_${valor}`;
        //await qrcode.toFile(nome_arquivo, br_code_payload);
        //logInfo(`\nQR Code salvo com sucesso no arquivo: ${nome_arquivo}`)
        
    } catch ( error ){
        logError(`Erro ao gerar qrcode:`)
        console.error(error);
    }
}

export {qrcodeGen}