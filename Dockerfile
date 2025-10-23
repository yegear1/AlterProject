FROM node:20-slim

ARG UID=1000
ARG GID=1000

USER root

ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update && apt-get install -y \
  chromium \
  wget \
  gnupg \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN if [ "$UID" != "1000" ] || [ "$GID" != "1000" ]; then \
        groupmod -g $GID node && \
        usermod -u $UID -g $GID node; \
    fi

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --chown=node:node . .

RUN mkdir -p /app/.wwebjs_auth /app/.wwebjs_cache && \
    chown -R node:node /app

EXPOSE 3000

USER node

CMD ["node", "index.js"]