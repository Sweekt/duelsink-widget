# Étape 1 : Build de l'app Vite
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Serveur web léger
FROM nginx:alpine
# On copie le résultat du build Vite dans le dossier public de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]