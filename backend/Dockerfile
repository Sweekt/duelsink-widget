FROM node:22-slim

# Installation de OpenSSL, requis par Prisma sur les distributions Debian
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Génération du client Prisma
RUN npx prisma generate

# On lance le serveur Node
CMD ["node", "index.js"]