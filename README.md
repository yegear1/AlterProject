# ChatProject
 
Para rodar o projeto em sua máquina / produção é bem simples.

Instale os pacotes:
```
npm i
```
Rode em desenvolvimento:
```
npm run dev
```
Ou rode em produção:
```
npm start
```

    objects/
    Classes que encapsulam lógica e estado dos grupos (ex: contexto, resumo, processar respostas). Mantém separação clara de responsabilidades.

    handlers/
    Manipuladores diretos dos eventos do Baileys (ex: nova mensagem recebida), apenas direcionam o fluxo, chamando métodos nos objetos.

    services/
    Camada para lidar com integração externa, networking, API do Gemini, agendamentos.

    utils/
    Funções auxiliares e logs reutilizáveis, sem estado.

    config/
    Todas as configurações, listas de grupos monitorados, tokens, e dados sensíveis separados do código.
