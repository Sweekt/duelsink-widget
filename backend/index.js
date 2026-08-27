require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());

// --- 1. FONCTION DE POLLING AVEC PAGINATION ---
async function fetchAndStoreGames() {
    let cursor = null;
    let totalInserted = 0;
    let keepFetching = true;

    while (keepFetching) {
        try {
            const url = cursor
                ? `https://duels.ink/api/me/match-history?cursor=${encodeURIComponent(cursor)}`
                : 'https://duels.ink/api/me/match-history';

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${process.env.DUELS_TOKEN}` }
            });

            const games = response.data.games || [];
            if (games.length === 0) break; // Fin des données

            const matchmakingGames = games.filter(game => game.mode === 'matchmaking');

            const formattedGames = matchmakingGames.map(game => ({
                id: game.game_id,
                queueId: game.season_name || game.queue_name || 'unranked',
                result: game.result,
                mmrAfter: game.mmr_after || 0,
                playedAt: new Date(game.ended_at)
            }));

            let newGames = [];
            let hasExistingGamesInPage = false;

            if (formattedGames.length > 0) {
                const existingGames = await prisma.match.findMany({
                    where: { id: { in: formattedGames.map(g => g.id) } },
                    select: { id: true }
                });
                const existingIds = existingGames.map(g => g.id);

                newGames = formattedGames.filter(g => !existingIds.includes(g.id));
                hasExistingGamesInPage = existingIds.length > 0;
            }

            if (newGames.length > 0) {
                const result = await prisma.match.createMany({
                    data: newGames
                });
                totalInserted += result.count;

                const updatedQueues = [...new Set(newGames.map(g => g.queueId))];
                notifyClients(updatedQueues);
            }

            if (response.data.next_cursor && !hasExistingGamesInPage) {
                cursor = response.data.next_cursor;
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                keepFetching = false;
            }

        } catch (error) {
            console.error("Erreur lors du fetch API Duels :", error.message);
            keepFetching = false;
        }
    }

    if (totalInserted > 0) {
        console.log(`[${new Date().toLocaleTimeString()}] Synchronisation terminée : ${totalInserted} nouvelle(s) partie(s) ajoutée(s).`);
    } else {
        console.log(`[${new Date().toLocaleTimeString()}] À jour. Aucune nouvelle partie.`);
    }
}

setInterval(fetchAndStoreGames, 60000);
fetchAndStoreGames();

// --- 2. ENDPOINTS POUR LE FRONTEND REACT ---

// --- GESTION DU TEMPS RÉEL (SSE) ---
let clients = [];

app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Établit la connexion SSE

    clients.push(res);
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

function notifyClients(updatedQueues) {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify({ queues: updatedQueues })}\n\n`);
    });
}

// Route pour récupérer la config (Couleurs du thème)
app.get('/api/config', (req, res) => {
    res.json({
        colorFrom: process.env.THEME_COLOR_FROM || '#142864',
        colorTo: process.env.THEME_COLOR_TO || '#64148c'
    });
});

// Route pour récupérer les stats de la queue demandée
app.get('/api/stats', async (req, res) => {
    try {
        const queue = req.query.queue || 'Core BO1 - Set 13';

        const last10Games = await prisma.match.findMany({
            where: { queueId: queue },
            orderBy: { playedAt: 'desc' },
            take: 10
        });

        const allQueueGames = await prisma.match.findMany({
            where: { queueId: queue },
            select: { result: true }
        });

        const totalGames = allQueueGames.length;
        const wins = allQueueGames.filter(g => g.result === 'win').length;
        const winrate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
        const currentMmr = last10Games.length > 0 ? last10Games[0].mmrAfter : 0;

        res.json({
            queue,
            currentMmr,
            winrate,
            totalGames,
            last10Games
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend démarré sur http://localhost:${PORT}`);
});