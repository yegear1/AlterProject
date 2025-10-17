# Etapa 1: Imagem Base
# Usamos a versão 20 do Node.js com Alpine Linux, que é leve e segura.
FROM node:20-alpine

# Etapa 2: Diretório de Trabalho
# Define o diretório padrão dentro do container.
WORKDIR /app

# Etapa 3: Instalação de Dependências
# Copia primeiro os arquivos de manifesto para aproveitar o cache do Docker.
COPY package*.json ./
# Instala apenas as dependências de produção de forma otimizada.
RUN npm ci --only=production

# Etapa 4: Copiar o Código-Fonte
# Copia todo o resto do seu projeto para o diretório /app.
# O .dockerignore garante que arquivos desnecessários não sejam copiados.
COPY . .

# Etapa 5: Comando de Execução
# Define o comando para iniciar o bot quando o container for executado.
CMD ["node", "index.js"]