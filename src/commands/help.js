async function execute(client, message, args) {
    const prefix = process.env.COMMAND_PREFIX || '!';
    
    const helpText = `
📋 *COMANDOS DISPONÍVEIS*

${prefix}ping - Verifica a latência do bot
${prefix}help - Mostra esta mensagem de ajuda
${prefix}ajuda - Mesma função do help

_Digite o comando desejado para executá-lo_
    `.trim();
    
    await message.reply(helpText);
}

module.exports = {
    name: 'help',
    description: 'Mostra todos os comandos disponíveis',
    execute:execute
};
