FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Génération du client Prisma adapté à l'architecture Linux du conteneur
RUN npx prisma generate

# On lance le serveur Node
CMD ["node", "index.js"]