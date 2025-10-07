import { ping } from '../commands/ping.js';
import { help } from '../commands/help.js';
import { logWarning, logInfo, logError, logSuccess } from '../utils/logger.js';

const commands = {
    'ping': ping,
    'help': help, 
    'ajuda': help
}

async function commandHandler(client, message) {
    try {
        const prefix = process.env.COMMAND_PREFIX || '!';
        const args = message.body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        logInfo(`Comando recebido dentro do Handler: ${commandName}`);

        if (!commands[commandName]) {
            await message.reply(`❌ Comando não encontrado! Use ${prefix}help para ver os comandos disponíveis.`);
            return;
        }
    
        if (typeof commands[commandName].execute !== 'function') {
            logWarning(`Comandos ${commandName} não possui função execute!`);
            await message.reply('❌ Este comando está mal configurado.');
            return;
        }

        await commands[commandName].execute(client, message, args);

    } catch (error) {
        logWarning('Erro ao executar comando:', error);
        await message.reply('❌ Ocorreu um erro ao executar este comando.');
    }
}

export { commandHandler };