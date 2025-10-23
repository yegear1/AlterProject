async function execute(client, message, args) {
    await chat.sendStateTyping();

}

export const gpt = ({
    name: 'gpt',
    description: 'Utiliza IA para gerar uma respota automatica do que foi perguntado',
    execute: execute
})