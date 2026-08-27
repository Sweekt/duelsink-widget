# OBS Widget - Duels.ink Match History

Un widget web ultra-léger conçu pour OBS Studio, permettant d'afficher en temps réel son MMR, son rang, et l'historique de ses 10 dernières parties sur la plateforme [Duels.ink](https://duels.ink/).

Construit avec Node.js et Express, et entièrement conteneurisé via Docker pour une exécution propre en local.

## ✨ Fonctionnalités

* **Affichage en temps réel :** Récupération automatique du MMR actuel et de l'icône de rang correspondante.
* **Historique visuel :** Affichage des 10 dernières parties sous forme de pastilles (Vert = Victoire, Rouge = Défaite).
* **Filtrage par Queue :** Possibilité de cibler une file spécifique (ex: `core-bo1`) directement via l'URL.
* **Sécurisé :** Le Token API est stocké côté serveur dans un `backend/.env`, sans jamais être exposé dans OBS.

## 🛠️ Prérequis

* [Docker](https://www.docker.com/) et Docker Compose installés sur votre machine (ou WSL).
* Un Token d'API Bearer valide pour Duels.ink.

## 🚀 Installation et Lancement

1. **Cloner ou créer le projet**
   Assurez-vous d'avoir les fichiers suivants dans votre répertoire : `server.js`, `package.json`, `Dockerfile`, et `docker-compose.yml`.

2. **Configurer les variables d'environnement**
   Créez un fichier `backend/.env` à la racine du projet et insérez votre token d'authentification :
   ```env
   DUELS_TOKEN=votre_bearer_token_ici
   ```

3. **Lancer le conteneur Docker**
   Ouvrez un terminal dans le dossier du projet et exécutez :
   ```bash
   docker compose up -d --build
   ```
   Le serveur local tournera sur le port `3000`.

## 📺 Configuration dans OBS Studio

1. Dans votre scène OBS, ajoutez une nouvelle source de type **Navigateur (Browser Source)**.
2. Configurez les paramètres suivants :
    * **URL :** `http://localhost:3000/widget?queue=core-bo1`
      *(Modifiez la valeur `queue` selon la file que vous souhaitez traquer).*
    * **Largeur :** `350`
    * **Hauteur :** `150` *(Laisse suffisamment de marge pour l'animation de pulsation).*
    * **Routage audio :** Désactivé (non nécessaire).
    * **Rafraîchir le navigateur quand la scène devient active :** Coché (recommandé).

## 🎨 Personnalisation (server.js)

* **Icônes de rang :** Le dictionnaire `RANK_IMAGES` en haut du fichier gère les images. Il accepte des chemins absolus (URL), des données SVG brutes, ou du Base64 (idéal pour limiter les requêtes).
* **Paliers de MMR :** Modifiez la fonction `getRankImageSrc(mmr)` pour ajuster le changement d'icône en fonction des paliers officiels de Duels.ink.

## 👤 Auteur

**Benjamin Roy**
*Développeur logiciel*