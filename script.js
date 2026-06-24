// --- GAME STATE VARIABLES ---
let playerCoins = 50;
let currentFridgeTier = 1;

let inventory = {
    pizza: 0,
    milk: 0,
    caviar: 0
};

let marketPrices = {
    pizza: 10,
    milk: 5,
    caviar: 100
};

// Database configurations for tiers
const fridgeTiers = {
    1: { name: "Rusty Mini-Fridge", upgradeCost: 200, pizzaChance: 0.60, milkChance: 0.35, caviarChance: 0.05 },
    2: { name: "Stainless Steel Smart Fridge", upgradeCost: 800, pizzaChance: 0.40, milkChance: 0.40, caviarChance: 0.20 },
    3: { name: "Quantum Cyber-Fridge 9000", upgradeCost: null, pizzaChance: 0.20, milkChance: 0.30, caviarChance: 0.50 }
};

// --- DOM ELEMENT SELECTIONS ---
const fridge = document.getElementById('myFridge');
const foodDisplay = document.getElementById('food-item');
const gameStatus = document.getElementById('game-status');

// --- EVENT: CLICKING THE FRIDGE ---
fridge.addEventListener('click', function() {
    if (fridge.classList.contains('open')) {
        // CLOSE LOGIC
        fridge.classList.remove('open');
        gameStatus.textContent = "Fridge closed. Ready for next lookup.";
        setTimeout(() => {
            foodDisplay.textContent = "❓";
        }, 500);
    } else {
        // OPEN LOGIC
        if (playerCoins < 2) {
            gameStatus.textContent = "⚠️ Not enough coins to look inside! Sell something!";
            return;
        }
        
        playerCoins -= 2; // Look cost
        document.getElementById('wallet').textContent = `Balance: $${playerCoins}`;
        
        // Roll for dynamic loot based on odds configuration
        determineLoot();
        fridge.classList.add('open');
    }
});

// --- LOOT GENERATION MECHANISM ---
function determineLoot() {
    const roll = Math.random();
    const currentConfig = fridgeTiers[currentFridgeTier];
    
    // Check ranges based on cumulative probability
    if (roll < currentConfig.caviarChance) {
        inventory.caviar++;
        foodDisplay.textContent = "👑";
        gameStatus.textContent = "🚨 INSANE PULL! Found Legendary Caviar!";
    } else if (roll < (currentConfig.caviarChance + currentConfig.milkChance)) {
        inventory.milk++;
        foodDisplay.textContent = "🥛";
        gameStatus.textContent = "Found fresh Milk!";
    } else {
        inventory.pizza++;
        foodDisplay.textContent = "🍕";
        gameStatus.textContent = "Found a leftover slice of Pizza!";
    }
    
    updateUI();
}

// --- MARKET TRADING LOGIC ---
function sellItem(itemKey) {
    if (inventory[itemKey] > 0) {
        inventory[itemKey]--;
        playerCoins += marketPrices[itemKey];
        updateUI();
        gameStatus.textContent = `Sold 1 ${itemKey} for $${marketPrices[itemKey]}!`;
    } else {
        gameStatus.textContent = `❌ You don't have any ${itemKey} to sell!`;
    }
}

// --- UPGRADE MECHANISM ---
function purchaseFridgeUpgrade() {
    const currentConfig = fridgeTiers[currentFridgeTier];
    const cost = currentConfig.upgradeCost;
    
    if (cost === null) {
        gameStatus.textContent = "You already own the max tier fridge!";
        return;
    }
    
    if (playerCoins >= cost) {
        playerCoins -= cost;
        currentFridgeTier++;
        
        const newConfig = fridgeTiers[currentFridgeTier];
        document.getElementById('fridge-name').textContent = newConfig.name;
        
        // Adjust the upgrade shop button view text for next level
        const nextUpgradeBtn = document.getElementById('upgrade-btn');
        if (newConfig.upgradeCost === null) {
            nextUpgradeBtn.textContent = "MAX TIER REACHED";
            nextUpgradeBtn.style.background = "#64748b";
        } else {
            nextUpgradeBtn.textContent = `Upgrade Fridge ($${newConfig.upgradeCost})`;
        }
        
        updateUI();
        gameStatus.textContent = `🎉 Upgraded to ${newConfig.name}! Higher chance for Rares!`;
    } else {
        gameStatus.textContent = `❌ Missing funds! You need $${cost} to upgrade.`;
    }
}

// --- INTERVAL CLOCK: LIVE STOCK EXCHANGE ENGINE ---
setInterval(function() {
    // Pizza Price Variance (-4 to +4)
    marketPrices.pizza = Math.max(2, marketPrices.pizza + (Math.floor(Math.random() * 9) - 4));
    // Milk Price Variance (-2 to +2)
    marketPrices.milk = Math.max(1, marketPrices.milk + (Math.floor(Math.random() * 5) - 2));
    // Caviar Price Variance (-25 to +25)
    marketPrices.caviar = Math.max(30, marketPrices.caviar + (Math.floor(Math.random() * 51) - 25));
    
    updateUI();
}, 7000);

// --- AUXILIARY INTERFACE DRAW REFRESHER ---
function updateUI() {
    // Refresh wallets & stock tags
    document.getElementById('wallet').textContent = `Balance: $${playerCoins}`;
    
    document.getElementById('inv-pizza').textContent = inventory.pizza;
    document.getElementById('inv-milk').textContent = inventory.milk;
    document.getElementById('inv-caviar').textContent = inventory.caviar;
    
    document.getElementById('price-pizza').textContent = `$${marketPrices.pizza}`;
    document.getElementById('price-milk').textContent = `$${marketPrices.milk}`;
    document.getElementById('price-caviar').textContent = `$${marketPrices.caviar}`;
}