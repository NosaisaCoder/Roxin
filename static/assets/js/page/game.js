// static/assets/js/page/game.js

// BACKTRACK: Stepping up two levels (out of page/, out of js/) to reach the correct js root folder path layout
import RoxinError from '../error.js'; 
import { loadProxyWorker } from '../utils.js'; 

const tiltEffectSettings = { 
    max: 8, 
    perspective: 1000, 
    scale: 1.05, 
    speed: 800, 
    easing: 'cubic-bezier(.03,.98,.52,.99)' 
}; 

let games = []; 
let filteredGames = []; 

const load = () => { 
    // FIXED: Adjusted fetch string schema to pull correctly from your static root directory branch paths
    fetch('../JSON/games.json')
        .then(res => {
            if (!res.ok) throw new Error('JSON load error');
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
            new RoxinError('Failed to load games catalog database source.');
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
        }

        if (game.popular === 'yes' && popularGamesContainer) { 
            const popularEl = document.createElement('div'); 
            popularEl.classList = 'game'; 
            popularEl.innerHTML = `<img loading='lazy' src='${game.image}' alt='${game.name}'><h3>${game.name}</h3>`; 
            popularGamesContainer.appendChild(popularEl); 
            
            popularEl.addEventListener('click', async () => { 
                await loadProxyWorker('uv'); 
                if (game.openinnewtab === 'yes') {
                    window.open(game.source); 
                } else { 
                    localStorage.setItem('frameData', JSON.stringify({ type: 'game', game })); 
                    // FIXED: Path tracks correctly to view page in subfolder layout
                    location.href = '../../../view.html'; 
                } 
            }); 
            
            popularEl.addEventListener('mouseenter', gameMouseEnter); 
            popularEl.addEventListener('mousemove', gameMouseMove); 
            popularEl.addEventListener('mouseleave', gameMouseLeave); 
        } 

        el.addEventListener('click', async () => { 
            await loadProxyWorker(); 
            const frameData = { type: 'game', game }; 
            if (game.openinnewtab === 'yes') { 
                window.open(game.source, '_blank'); 
            } else { 
                localStorage.setItem('frameData', JSON.stringify(frameData)); 
                // FIXED: Path tracks correctly to view page in subfolder layout
                location.href = '../../../view.html'; 
            } 
        }); 

        el.addEventListener('mouseenter', gameMouseEnter); 
        el.addEventListener('mousemove', gameMouseMove); 
        el.addEventListener('mouseleave', gameMouseLeave); 
    }); 
} 

function gameMouseEnter(event) { 
    setTransition(event); 
} 

function gameMouseMove(event) { 
    const game = event.currentTarget; 
    const gameWidth = game.offsetWidth; 
    const gameHeight = game.offsetHeight; 
    const centerX = game.offsetLeft + gameWidth / 2; 
    const centerY = game.offsetTop + gameHeight / 2; 
    const mouseX = event.clientX - centerX; 
    const mouseY = event.clientY - centerY; 
    
    const rotateXUncapped = (+1) * tiltEffectSettings.max * mouseY / (gameHeight / 2); 
    const rotateYUncapped = (-1) * tiltEffectSettings.max * mouseX / (gameWidth / 2); 
    
    const rotateX = rotateXUncapped < -tiltEffectSettings.max ? -tiltEffectSettings.max : (rotateXUncapped > tiltEffectSettings.max ? tiltEffectSettings.max : rotateXUncapped); 
    const rotateY = rotateYUncapped < -tiltEffectSettings.max ? -tiltEffectSettings.max : (rotateYUncapped > tiltEffectSettings.max ? tiltEffectSettings.max : rotateYUncapped); 
    
    game.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${tiltEffectSettings.scale}, ${tiltEffectSettings.scale}, ${tiltEffectSettings.scale})`; 
} 

function gameMouseLeave(event) { 
    event.currentTarget.style.transform = `perspective(${tiltEffectSettings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`; 
    setTransition(event); 
} 

function setTransition(event) { 
    const game = event.currentTarget; 
    clearTimeout(game.transitionTimeoutId); 
    game.style.transition = `transform ${tiltEffectSettings.speed}ms ${tiltEffectSettings.easing}`; 
    game.transitionTimeoutId = setTimeout(() => game.style.transition = '', tiltEffectSettings.speed); 
} 

export default { load };
