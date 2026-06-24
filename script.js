// --- DATABASE INITIALIZATION ---
const SUPABASE_URL = "https://jypzclhjorqfddwjspiw.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cHpjbGhqb3JxZmRkd2pzcGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzYzOTUsImV4cCI6MjA5Nzg1MjM5NX0.MxC1e7ReQjG3ms3CCTPHBb3jONTUZyoSnRtHhFD3tyQ";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- GLOBAL GAME VARIABLES ---
let playerCoins = 50;
let dbHighScore = 0; // Tracks historical high score baseline from the server
let currentFridgeTier = 1;
let playerUsername = "";

let inventory = { pizza: 0, milk: 0, caviar: 0 };
let marketPrices = { pizza: 10, milk: 5, caviar: 100 };

const fridgeTiers = {
    1: { name: "Rusty Mini-Fridge", upgradeCost: 150, pizzaChance: 0.70, milkChance: 0.25, caviarChance: 0.05 },
    2: { name: "Electric Smart Fridge", upgradeCost: 400, pizzaChance: 0.55, milkChance: 0.35, caviarChance: 0.10 },
    3: { name: "Copper Deluxe Locker", upgradeCost: 900, pizzaChance: 0.45, milkChance: 0.40, caviarChance: 0.15 },
    4: { name: "Neon Amethyst Vault", upgradeCost: 2000, pizzaChance: 0.35, milkChance: 0.40, caviarChance: 0.25 },
    5: { name: "Ruby Matrix Chamber", upgradeCost: 5000, pizzaChance: 0.20, milkChance: 0.45, caviarChance: 0.35 },
    6: { name: "Cosmic Obsidian Singularity", upgradeCost: null, pizzaChance: 0.05, milkChance: 0.35, caviarChance: 0.60 }
};

const fridge = document.getElementById('myFridge');
const foodDisplay = document.getElementById('food-item');
const gameStatus = document.getElementById('game-status');

// --- USER MANAGEMENT SUBSYSTEM (AUTHENTICATION LOOP) ---
window.addEventListener('DOMContentLoaded', async () => {
    const savedName = localStorage.getItem('fridge_tycoon_username');
    if (savedName) {
        playerUsername = savedName;
        document.getElementById('username-modal').style.display = 'none';
        gameStatus.textContent = "Connecting to high score records...";
        
        try {
            // Fetch database record to extract peak high score
            const { data } = await db.from('Leaderboard').select('high_score').eq('username', playerUsername).maybeSingle();
            if (data) {
                dbHighScore = data.high_score;
            }
        } catch(e) {
            console.error("Failed to load historical database record:", e);
        }
        
        // Arcade Reset Setup: Pocket balance resets to $50 baseline on launch
        playerCoins = 50; 
        updateUI();
        gameStatus.textContent = `Welcome back, ${playerUsername}! All-time high: $${dbHighScore}`;
        fetchLeaderboard();
    } else {
        gameStatus.textContent = "Awaiting credentials identification access...";
    }
});

document.getElementById('save-username-btn').addEventListener('click', async () => {
    const nameInput = document.getElementById('username-input').value.trim();
    if (nameInput.length < 3) {
        alert("Username must be at least 3 characters long!");
        return;
    }
    
    playerUsername = nameInput;
    localStorage.setItem('fridge_tycoon_username', playerUsername);
    document.getElementById('username-modal').style.display = 'none';
    gameStatus.textContent = `Syncing profile layer for ${playerUsername}...`;
    
    try {
        // Dynamic check for user historical records
        const { data } = await db.from('Leaderboard').select('high_score').eq('username', playerUsername).maybeSingle();
        
        if (data) {
            dbHighScore = data.high_score;
            gameStatus.textContent = `Tag recognized! Personal Best: $${dbHighScore}. Session reset to $50.`;
        } else {
            dbHighScore = 50;
            // Upsert baseline profile records safely
            await db.from('Leaderboard').upsert({ username: playerUsername, high_score: 50 }, { onConflict: 'username' });
            gameStatus.textContent = `Welcome, ${playerUsername}! Initializing new market scanner...`;
        }
    } catch (err) {
        console.error("Database connection registration error:", err);
    }
    
    playerCoins = 50;
    updateUI();
    setTimeout(fetchLeaderboard, 500);
});

// --- CORE INTERACTION ENGINE ---
fridge.addEventListener('click', function() {
    if (fridge.classList.contains('open')) {
        fridge.classList.remove('open');
        gameStatus.textContent = "Fridge closed. Scanner idle.";
        setTimeout(() => { foodDisplay.textContent = "❓"; }, 500);
    } else {
        if (playerCoins < 2) {
            gameStatus.textContent = "⚠️ INSIGNIFICANT CREDIT! Liquidate goods.";
            return;
        }
        playerCoins -= 2;
        determineLoot();
        fridge.classList.add('open');
    }
});

function determineLoot() {
    const roll = Math.random();
    const currentConfig = fridgeTiers[currentFridgeTier];
    
    if (roll < currentConfig.caviarChance) {
        inventory.caviar++;
        foodDisplay.textContent = "👑";
        gameStatus.textContent = "💎 EXOTIC ASSET OUTLET! Found Black Caviar!";
    } else if (roll < (currentConfig.caviarChance + currentConfig.milkChance)) {
        inventory.milk++;
        foodDisplay.textContent = "🥛";
        gameStatus.textContent = "Acquired Fresh Milk cargo.";
    } else {
        inventory.pizza++;
        foodDisplay.textContent = "🍕";
        gameStatus.textContent = "Pulled Standard Pizza portion.";
    }
    updateUI();
}

function sellItem(itemKey) {
    if (inventory[itemKey] > 0) {
        inventory[itemKey]--;
        playerCoins += marketPrices[itemKey];
        updateUI();
        gameStatus.textContent = `Liquidated ${itemKey} for
async function fetchLeaderboard() {
    try {
        // FIXED: Targeted capitalized 'Leaderboard'
        const { data, error } = await db.from('Leaderboard').select('username, high_score').order('high_score', { ascending: false }).limit(5);
        if (error || !data) return;
        
        const listElement = document.getElementById('leaderboard-list');
        listElement.innerHTML = "";
        
        data.forEach((p, i) => {
            let prefix = i === 0 ? "🥇 " : i === 1 ? "🥈 " : i === 2 ? "🥉 " : "";
            listElement.innerHTML += `<li><span>${prefix}${p.username}</span><strong>$${p.high_score}</strong></li>`;
        });
    } catch (err) {
        console.error("Leaderboard engine connection dropped:", err);
    }
}

// Change from 20000 to 10000 for faster background updates
setInterval(fetchLeaderboard, 10000);
