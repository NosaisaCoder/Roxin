// assets/js/page/game.js

import RoxinError from '../error.js'; 
import { loadProxyWorker } from '../utils.js'; 
import { hoverTilt } from '../effects.js';

let games = []; 
let filteredGames = []; 

const load = () => { 
    // Pulls from JSON folder located inside your root assets system
    fetch('assets/JSON/games.json')
        .then(res => {
            if (!res.ok) throw new Error('Catalog loading anomaly.');
            return res.json();
        })
        .then(data => { 
            games = data; 
            filteredGames = games; 
            renderGames(filteredGames); 
            
            const searchInput = document.getElementById('searchInput'); 
            if (searchInput) {
                searchInput.addEventListener('input', filterGames); 
            }
        }) 
        .catch(e => {
            console.error(e);
            new RoxinError('Failed to parse the catalog database array manifest.');
        }); 
}; 

function filterGames() { 
    const searchInput = document.getElementById('searchInput'); 
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase(); 
    filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm)); 
    renderGames(filteredGames); 
} 

function renderGames(gamesToRender) { 
    const gamesContainer = document.querySelector('.games'); 
    const popularGamesContainer = document.querySelector('.popular-games'); 
    
    if (gamesContainer) gamesContainer.innerHTML = ''; 
    if (popularGamesContainer) popularGamesContainer.innerHTML = ''; 
    
    gamesToRender.forEach(game => { 
        const el = document.createElement('div'); 
        el.classList = 'game'; 
        el.innerHTML = `<img loading='lazy' src='${game.image}' alt='${game.name}'><h3>${game.name}</h3>`; 
        
        if (gamesContainer) {
            gamesContainer.appendChild(el); 
            // Hooks the modular effect system onto the element instantly upon creation
            hoverTilt({}, el);
        }

        if (game.popular === 'yes' && popularGamesContainer) { 
            const popularEl = document.createElement('div'); 
            popularEl.classList = 'game'; 
            popularEl.innerHTML = `<img loading='lazy' src='${game.image}' alt='${game.name}'><h3>${game.name}</h3>`; 
            popularGamesContainer.appendChild(popularEl); 
            
            hoverTilt({}, popularEl);
            
            popularEl.addEventListener('click', async () => { 
                await loadProxyWorker(); 
                if (game.openinnewtab === 'yes') {
                    window.open(game.source, '_blank'); 
                } else { 
                    localStorage.setItem('frameData', JSON.stringify({ type: 'game', game })); 
                    location.href = 'view.html'; 
                } 
            }); 
        } 

        el.addEventListener('click', async () => { 
            await loadProxyWorker(); 
            const frameData = { type: 'game', game }; 
            if (game.openinnewtab === 'yes') { 
                window.open(game.source, '_blank'); 
            } else { 
                localStorage.setItem('frameData', JSON.stringify(frameData)); 
                location.href = 'view.html'; 
            } 
        }); 
    }); 
} 

export default { load };
