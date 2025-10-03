async function sleep(ms: number, maxMs?: number): Promise<void> {
    let sleepTime = ms;

    // Se o segundo parâmetro (maxMs) foi passado, calcula um tempo aleatório
    if (maxMs) {
        sleepTime = ms + (Math.random() * (maxMs - ms));
        console.log(`[SLEEP] Esperando por ${Math.round(sleepTime)}ms (entre ${ms}ms e ${maxMs}ms)`);
    }

    return new Promise((resolve) => setTimeout(resolve, sleepTime));
}

export class GroupMonitor {
    jid: string;
    nome: string;
    mensagensRecentes: Array<{ remetente: string, conteudo: string }>;

    sock: any;
    model: any;
    botJid: string; // O ID do meu numero
    destinatarioJid?: string;
    
    constructor(jid: string, nome: string, sock: any, model: any, botJid: string) {
        this.jid = jid;
        this.nome = nome;
        this.mensagensRecentes = [];
        this.sock = sock;
        this.model = model;
        this.botJid = botJid;
    }

    adicionarMensagens(mensagem: { remetente:string, conteudo: string }) {
        this.mensagensRecentes.push(mensagem);
        if (this.mensagensRecentes.length > 10){
            this.mensagensRecentes.shift();
        }
    }

    obterContexto(): string{
        return this.mensagensRecentes.map (m =>
            `${m.remetente}: ${m.conteudo}`
        ).join('\n');
    }

    async responderSeMercado(message:any){
        const texto = message.message?.conversation || '';
        const mencionados = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
        if (message.key.remoteJid === this.jid && mencionados.includes(this.botJid)){
            const contexto = this.obterContexto();
            const prompt = `
Você foi marcado no grupo "${this.nome}". Aqui está o contexto das últimas mensagens:\n${contexto}\n\nResponda de forma engraçada, baseado no contexto informado ou relevante para esse grupo.
            `;

            const result = await this.model.generateContent(prompt);
            const resposta = result.response.text();

            await sleep(3000,10000);
            await this.sock.sendMessage(this.jid, {
                text: resposta,
                quoted: message
            });
        }

    }

    async resumirContextoDiario(destinatarioJid:string){
        const contexto = this.obterContexto();
        const prompt = `Resuma de forma curta e clara o que aconteceu nesse grupo hoje:
Grupo: ${this.nome}
Mensagens principais:\n${contexto}
        `;

        const result = await this.model.generateContent(prompt);
        const resumo = result.response.text();

        await this.sock.sendMessage(destinatarioJid, { text: resumo });
    }
}