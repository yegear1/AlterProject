async function execute(client, message, args) {
    const startTime = Date.now();
    const msg = await message.reply('🏓 Pong!');
    const endTime = Date.now();

    const timeDiff = endTime - startTime;

    await msg.edit(`⏱️ Latência: ${timeDiff}ms`);
    await message.reply(`⏱️ Latência: ${timeDiff}ms`);
}

export const ping = ({
    name: 'ping',
    description: 'Responde com pong e mostra a latência',
    execute: execute
})