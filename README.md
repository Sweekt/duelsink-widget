# Duels.ink OBS Widget V2

Un widget OBS élégant, en temps réel et conteneurisé, conçu pour afficher tes statistiques et ton historique de matchs **Disney Lorcana** via l'API de [Duels.ink](https://duels.ink/).

Conçu spécifiquement pour le stream, avec un design "Glassmorphism" et des animations fluides.

## ✨ Fonctionnalités

* 🔄 **Temps Réel (SSE) :** Mise à jour instantanée du widget sur OBS dès qu'une partie se termine, sans rechargement de la page.
* 🎬 **Animations Avancées :** Transition fluide des rangs et carrousel d'historique (glissement et pulsation de la dernière partie) grâce à Framer Motion.
* 📊 **Filtrage Intelligent :** Isolation des statistiques par saison (`season_name`) pour un winrate précis.
* 🐳 **Conteneurisation :** Architecture multi-conteneurs (Node.js + Nginx) orchestrée par Docker Compose pour tourner de manière invisible en tâche de fond.
* 🎛️ **Stream Deck Ready :** Scripts VBS inclus pour démarrer/stopper le widget silencieusement afin d'économiser les requêtes API hors-stream.

## 🛠️ Stack Technique

* **Frontend :** React, Vite, Tailwind CSS v4, Framer Motion.
* **Backend :** Node.js, Express, Axios, Prisma ORM (SQLite).
* **Infrastructure :** Docker, Docker Compose, Nginx (pour servir le frontend).

---

## 🚀 Installation & Démarrage

### 1. Prérequis
* Docker et Docker Compose installés.
* Ton token d'API Duels.ink.

### 2. Configuration
Crée un fichier `.env` dans le dossier `/backend` avec les informations suivantes :

```env
DATABASE_URL="file:./dev.db"
DUELS_TOKEN=ton_token_api_ici
PORT=3001

# Couleurs du dégradé
THEME_COLOR_FROM=#142864
THEME_COLOR_TO=#64148c
```

### 3. Lancement via Docker
À la racine du projet (là où se trouve le `docker-compose.yml`), exécute la commande suivante pour construire et lancer l'application en arrière-plan :

```bash
docker compose up -d --build
```
*Le backend va automatiquement télécharger tout ton historique lors du premier lancement. Cela peut prendre quelques secondes.*

---

## 🎥 Intégration dans OBS

1. Ajoute une nouvelle **Source Navigateur**.
2. Coche la case "Fichier local" si applicable, ou utilise l'URL réseau.
3. Renseigne l'URL suivante : `http://localhost:5173/?queue=Core BO1 - Set 13`
   *(Tu peux changer la variable `queue` dans l'URL pour afficher les statistiques d'un mode de jeu différent, par exemple `?queue=Core BO3 - Set 13`)*.
4. Ajuste la largeur et la hauteur pour englober proprement le widget.
5. Coche "Actualiser le navigateur quand la scène devient active" pour plus de sécurité.

---

## 🎛️ Automatisation Stream Deck (Windows)

Pour éviter de surcharger l'API de Duels.ink quand tu ne streames pas, tu peux allumer et éteindre les conteneurs Docker via ton Stream Deck.

1. Crée deux fichiers `.vbs` sur ton PC hôte 
- Pour Windows + WSL2 :
 
   **`start_widget.vbs` :**
   ```vbscript
   CreateObject("WScript.Shell").Run "wsl bash -c ""cd /chemin/vers/duelsink-widget && docker compose start""", 0, False
   ```
   
   **`stop_widget.vbs` :**
   ```vbscript
   CreateObject("WScript.Shell").Run "wsl bash -c ""cd /chemin/vers/duelsink-widget && docker compose stop""", 0, False
   ```
- Pour Windows :

   **`start_widget.vbs` :**
   ```vbscript
   CreateObject("WScript.Shell").Run "cmd.exe /c cd /d ""\chemin\vers\duelsink-widget"" && docker compose start", 0, False
   ```
   
   **`stop_widget.vbs` :**
   ```vbscript
   CreateObject("WScript.Shell").Run "cmd.exe /c cd /d ""\chemin\vers\duelsink-widget"" && docker compose stop", 0, False
   ```

2. Sur ton Stream Deck, utilise un **Interrupteur Multi-Actions** (Hotkey Switch).
3. Assigne **Système > Ouvrir** au premier état avec `start_widget.vbs`.
4. Assigne **Système > Ouvrir** au second état avec `stop_widget.vbs`.

Un appui lance le moteur en arrière-plan avant le stream, un second appui coupe tout proprement !