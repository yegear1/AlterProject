async function execute(client, message, args) {
    const startTime = Date.now();
    await message.reply('🏓 Pong!');
    const endTime = Date.now();

    const timeDiff = endTime - startTime;

    await message.reply(`⏱️ Latência: ${timeDiff}ms`);
}

export const ping = execute({
    name: 'ping',
    description: 'Responde com pong e mostra a latência',
    execute: execute
})