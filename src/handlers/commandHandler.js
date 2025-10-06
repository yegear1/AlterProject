const pingCommand = require('../commands/ping');
const helpCommand = require('../commands/help');
const { logWarning, logInfo, logError, logSuccess } = require('../utils/logger');

const commands = {
    'ping': pingCommand,
    'help': helpCommand,
    'ajuda': helpCommand
}

async function commandHandler(client, message) {
    try {
        const prefix = process.env.COMMAND_PREFIX || '!';
        const args = message.body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        logInfo(`Comando recebido dentro do Handle: ${commandName}`);

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

module.exports = commandHandler;