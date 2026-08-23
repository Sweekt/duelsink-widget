const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const RANK_IMAGES = {
    common: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%2011%2011'%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%201.2813%205.9883%20C%201.9922%207.0586%203.1055%207.5235%204.0743%207.8672%20C%203.0352%206.5195%202.8516%204.7149%203.7032%203.1055%20C%204.3868%201.8203%205.4962%201.0039%206.8321%200.8164%20C%207.1602%200.7695%207.4923%200.7656%207.8126%200.8008%20C%207.5782%200.6875%207.336%200.5938%207.0821%200.5156%20C%204.7696%20-0.1797%202.336%200.8867%201.1719%202.9453%20C%200.625%203.9726%200.6524%205.043%201.2813%205.9883%20'%20style='stroke:none;fill-rule:nonzero;fill:%23a4a4a7;fill-opacity:1'/%3e%3c/g%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%205.8204%2010.1055%20C%205.9259%209.8047%205.8712%209.3633%205.4024%209.043%20V%209.0469%20C%205.2032%208.9102%204.6719%208.6992%204.1915%208.5352%20C%203.0782%208.1485%201.6915%207.6719%200.797%206.3243%20C%200.672%206.1329%200.5665%205.9376%200.4806%205.7384%20C%200.547%207.8986%201.9415%209.8517%204.0783%2010.4962%20C%204.3361%2010.5743%204.5978%2010.629%204.8556%2010.6642%20C%205.4064%2010.7033%205.7189%2010.3986%205.8204%2010.1056%20'%20style='stroke:none;fill-rule:nonzero;fill:%23a4a4a7;fill-opacity:1'/%3e%3c/g%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%2010.4571%206.9728%20C%2010.9649%205.2892%2010.5938%203.5509%209.6133%202.2736%20C%208.9688%201.59%207.9336%201.2541%206.9063%201.4025%20C%205.7618%201.5627%204.8047%202.2697%204.211%203.383%20C%203.2462%205.2072%203.8282%207.3244%205.5977%208.4689%20C%206.4063%208.9337%206.5665%209.7228%206.3672%2010.297%20C%206.3203%2010.4259%206.2578%2010.547%206.1719%2010.6642%20C%208.1172%2010.4064%209.8438%209.0119%2010.4571%206.9728'%20style='stroke:none;fill-rule:nonzero;fill:%23a4a4a7;fill-opacity:1'/%3e%3c/g%3e%3c/svg%3e",
    uncommon: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20viewBox='0%200%2011%2012'%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%205.8773%209.0195%20C%206.807%207.4804%208.6195%206.207%2010.9281%205.4453%20V%200.2578%20L%205.8773%202.2539%20'%20style='stroke:none;fill-rule:nonzero;fill:%23fff;fill-opacity:1'/%3e%3c/g%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%205.1859%209.0195%20V%202.2539%20L%200.1312%200.2578%20V%205.4414%20C%202.4398%206.2031%204.2562%207.4805%205.1859%209.0195%20'%20style='stroke:none;fill-rule:nonzero;fill:%23fff;fill-opacity:1'/%3e%3c/g%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%205.1859%2011.3789%20C%205.1859%209.1875%203.1546%207.1992%200.1312%206.1523%20V%209.5625%20L%205.1859%2011.5586%20'%20style='stroke:none;fill-rule:nonzero;fill:%23fff;fill-opacity:1'/%3e%3c/g%3e%3cg%20clip-rule='nonzero'%3e%3cpath%20d='M%205.8773%2011.3789%20V%2011.5586%20L%2010.9281%209.5625%20V%206.1523%20C%207.9047%207.1992%205.8773%209.1875%205.8773%2011.3789'%20style='stroke:none;fill-rule:nonzero;fill:%23fff;fill-opacity:1'/%3e%3c/g%3e%3c/svg%3e",
    rare: "https://duels.ink/assets/rare-BikOZ7t2.svg",
    superrare: "https://duels.ink/assets/super_rare-jEWoo9Pq.svg",
    legendary: "https://duels.ink/assets/legendary-OXueFywM.svg",
    epic: "data:image/webp;base64,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",
    enchanted: "https://duels.ink/assets/enchanted-IxlBb3bm.webp",
    iconic: "https://duels.ink/assets/iconic-CX59FqNu.webp"
};

function getRankImageSrc(mmr) {
    if (mmr >= 1900) return RANK_IMAGES.iconic;
    if (mmr >= 1750) return RANK_IMAGES.enchanted;
    if (mmr >= 1600) return RANK_IMAGES.epic;
    if (mmr >= 1450) return RANK_IMAGES.legendary;
    if (mmr >= 1300) return RANK_IMAGES.superrare;
    if (mmr >= 1150) return RANK_IMAGES.rare;
    if (mmr >= 1000) return RANK_IMAGES.uncommon;
    return RANK_IMAGES.common;
}

app.get('/widget', async (req, res) => {
    try {
        const targetQueue = req.query.queue || 'core-bo1';

        const response = await axios.get('https://duels.ink/api/me/match-history', {
            headers: { 'Authorization': `Bearer ${process.env.DUELS_TOKEN}` }
        });

        const allGames = response.data.games || [];
        const filteredGames = allGames.filter(game => game.queue_id === targetQueue);
        const last10Games = filteredGames.slice(0, 10);
        const currentMmr = last10Games.length > 0 ? last10Games[0].mmr_after : 0;
        const rankImageSrc = getRankImageSrc(currentMmr);

        const historyHtml = last10Games.reverse().map((game, index, arr) => {
            const isWin = game.result === 'win';
            const bgColor = isWin ? '#22c55e' : '#ef4444';
            const glow = isWin ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';

            const isLatest = (index === arr.length - 1);

            let style = `background-color: ${bgColor}; box-shadow: 0 0 8px ${glow};`;

            if (isLatest) {
                const animName = isWin ? 'pulse-win' : 'pulse-loss';
                style += ` animation: ${animName} 2s infinite; border: 1px solid rgba(255,255,255,0.8); transform: scale(1.05);`;
            } else {
                style += ` border: 1px solid rgba(255,255,255,0.15);`;
            }

            return `<div class="match-badge" style="${style}"></div>`;
        }).join('');

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="refresh" content="60">
                <!-- Import de la police Rajdhani depuis Google Fonts -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&display=swap" rel="stylesheet">
                
                <style>
                    body { 
                        background: transparent; 
                        /* Application de la nouvelle police */
                        font-family: 'Rajdhani', sans-serif; 
                        margin: 15px; 
                    }
                    
                    @keyframes pulse-win {
                        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                        70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                    }
                    @keyframes pulse-loss {
                        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                        70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                    }

                    .widget { 
                        background: linear-gradient(135deg, rgba(20, 40, 100, 0.65) 0%, rgba(100, 20, 140, 0.65) 100%); 
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                        
                        padding: 12px 22px; /* Léger ajustement du padding pour la nouvelle police */
                        border-radius: 16px; 
                        display: flex;
                        align-items: center;
                        gap: 18px;
                        width: fit-content;
                        
                        border: 1px solid rgba(160, 80, 255, 0.3);
                        border-top: 1px solid rgba(120, 180, 255, 0.4);
                        border-left: 1px solid rgba(120, 180, 255, 0.3);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.05);
                    }
                    .rank-icon {
                        width: 55px;
                        height: 55px;
                        object-fit: contain;
                        filter: drop-shadow(0px 0px 10px rgba(180, 120, 255, 0.6));
                    }
                    .info { 
                        display: flex; 
                        flex-direction: column; 
                        gap: 4px; /* Un peu moins d'espace car la police Rajdhani est assez haute */
                        justify-content: center;
                    }
                    .mmr { 
                        font-size: 1.4rem; /* Légèrement plus grand pour bien faire ressortir les chiffres */
                        font-weight: 700; 
                        margin: 0; 
                        color: #ffffff; 
                        text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                        letter-spacing: 1px; /* Espacement des lettres pour le style tech */
                        text-transform: uppercase;
                    }
                    .history { 
                        display: flex; 
                        gap: 5px;
                        align-items: center;
                    }
                    .match-badge {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%; 
                        transition: all 0.3s ease;
                    }
                </style>
            </head>
            <body>
                <div class="widget">
                    <img class="rank-icon" src="${rankImageSrc}" alt="Rank">
                    <div class="info">
                        <div class="mmr">MMR : ${currentMmr}</div>
                        <div class="history">
                            ${historyHtml}
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Erreur API :", error.message);
        res.status(500).send('<div style="color:red; background:rgba(0,0,0,0.8); padding:10px;">Erreur</div>');
    }
});

app.listen(port, () => {
    console.log(`Widget OBS dispo sur http://localhost:${port}/widget`);
});