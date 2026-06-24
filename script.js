// --- DATABASE INITIALIZATION ---
const SUPABASE_URL = "https://jypzclhjorqfddwjspiw.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5cHpjbGhqb3JxZmRkd2pzcGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzYzOTUsImV4cCI6MjA5Nzg1MjM5NX0.MxC1e7ReQjG3ms3CCTPHBb3jONTUZyoSnRtHhFD3tyQ";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- GLOBAL GAME VARIABLES ---
let playerCoins = 50;
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

// --- USER MANAGEMENT SUBSYSTEM ---
window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('fridge_tycoon_username');
    if (savedName) {
        playerUsername = savedName;
        document.getElementById('username-modal').style.display = 'none';
        gameStatus.textContent = `Welcome back, ${playerUsername}!`;
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
    gameStatus.textContent = `Welcome, ${playerUsername}! Initializing market scanner...`;
    
    try {
        // FIXED: Targeted capitalized 'Leaderboard'
        await db.from('Leaderboard').insert([{ username: playerUsername, high_score: playerCoins }]);
    } catch (err) {
        console.error("Database connection registration error:", err);
    }
    
    // Wait half a second for Supabase to write the data, then pull the fresh leaderboard
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
        gameStatus.textContent = `Liquidated ${itemKey} at market peak for +$${marketPrices[itemKey]}!`;
    } else {
        gameStatus.textContent = `❌ Transaction failed: Zero '${itemKey}' units.`;
    }
}

function purchaseFridgeUpgrade() {
    const currentConfig = fridgeTiers[currentFridgeTier];
    const cost = currentConfig.upgradeCost;
    if (cost === null) return;
    
    if (playerCoins >= cost) {
        playerCoins -= cost;
        currentFridgeTier++;
        
        const newConfig = fridgeTiers[currentFridgeTier];
        document.getElementById('fridge-name').textContent = newConfig.name;
        document.getElementById('tier-number').textContent = currentFridgeTier;
        fridge.setAttribute('data-tier', currentFridgeTier); 
        
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (newConfig.upgradeCost === null) {
            upgradeBtn.textContent = "MAXIMUM EVOLUTION REACHED";
            upgradeBtn.style.background = "#334155";
        } else {
            upgradeBtn.textContent = `Buy ${fridgeTiers[currentFridgeTier + 1].name} ($${newConfig.upgradeCost})`;
        }
        updateUI();
    } else {
        gameStatus.textContent = `❌ Missing funds! You require $${cost} to advance.`;
    }
}

// --- CLOCK WORK: REALTIME MARKETS ---
setInterval(function() {
    marketPrices.pizza = Math.max(3, marketPrices.pizza + (Math.floor(Math.random() * 9) - 4));
    marketPrices.milk = Math.max(1, marketPrices.milk + (Math.floor(Math.random() * 5) - 2));
    marketPrices.caviar = Math.max(40, marketPrices.caviar + (Math.floor(Math.random() * 61) - 30));
    updateUI();
}, 7000);

// --- SYNC ENGINE LAYER ---
async function updateUI() {
    document.getElementById('wallet').textContent = `Balance: $${playerCoins}`;
    document.getElementById('inv-pizza').textContent = inventory.pizza;
    document.getElementById('inv-milk').textContent = inventory.milk;
    document.getElementById('inv-caviar').textContent = inventory.caviar;
    document.getElementById('price-pizza').textContent = `$${marketPrices.pizza}`;
    document.getElementById('price-milk').textContent = `$${marketPrices.milk}`;
    document.getElementById('price-caviar').textContent = `$${marketPrices.caviar}`;
    
    if (playerUsername) {
        try {
            // FIXED: Targeted capitalized 'Leaderboard'
            await db.from('Leaderboard').update({ high_score: playerCoins }).eq('username', playerUsername);
        } catch (e) {
            console.warn("Background score update skipped structural frames:", e);
        }
    }
}

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
