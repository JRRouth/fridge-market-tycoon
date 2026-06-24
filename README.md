# 🧊 Fridge Market Tycoon Pro ⚡

A fast-paced, cyberpunk-themed progressive web app (PWA) incremental game. Click your hardware grid to extract high-yield cargo, speculate on a real-time volatile trading simulator, and scale your tech assets to dominate the persistent global server leaderboard.

---

## 🕹️ Gameplay & Mechanics

* **The Extraction Chamber:** Spend credits ($2 per peek) to scan your fridge. Randomized drop matrices determine whether you pull basic survival slices or high-tier exotic luxury assets.
* **Live Volatility Desk:** Asset prices fluctuate dynamically every 7 seconds via a bounded delta-shift algorithm. Watch for market crashes to accumulate cargo, or liquidate during hyperinflation peaks.
* **Hardware Evolution Matrix:** Re-invest your capital into 6 tiers of specialized cooling units. Higher hardware tiers fundamentally alter drop probabilities, swapping out high-common drops for exotic endgame luxury assets.

---

## 🛠️ The Tech Stack Architecture

The game leverages a streamlined 3-Tier System engineered for zero-lag performance, low memory footprints, and instant offline processing. The frontend viewport representation is managed via HTML5 DOM Tree structures, while cybernetic interface skins use a CSS3 3D Perspective Matrix. The main thread core state machine runs on JavaScript ES6, which updates local storage client caches and syncs asynchronous JSON payloads via REST pipelines to a persistent PostgreSQL datastore table on Supabase.

### Key Technical Systems Built-in:
* **Glitch-Proof 3D Graphics:** Built entirely out of native CSS perspective rules and absolute HTML structural elements—rendering realistic 3D door swing arcs with zero heavy image assets or WebGL overhead.
* **Self-Healing Data Sync:** Utilizes atomic database upsert queries. If a server reset wipes the backend tables, the client automatically re-provisions missing row spaces without crashing the runtime.
* **Server-Vaporization Purge:** Includes a local hardware memory optimization trigger. Changing a player tag sends an explicit DELETE call to the server to instantly wipe the old data footprint, keeping database memory clear.

---

## 📋 Repository Directory Structure

* **📁 Your-Repository-Root**
  * 📄 index.html (Core Game Shell containing HTML, CSS, and JS States)
  * 📄 manifest.json (Mobile Application Configuration Layer)
  * 📄 service-worker.js (Network Intercept Cache Engine for Offline Play)

---

## 🚀 Local Deployment & Setup

### Prerequisites
To hook into the cloud leaderboard systems, your database table must match this exact structural schema:
* **Table Name:** Leaderboard
* **Column 1:** username (Text, Set as Primary Key / Unique constraint)
* **Column 2:** high_score (BigInt or Numeric, Default: 0)

### Running the App
1. Clone this repository directly onto your system.
2. Open `index.html` inside any modern web browser.
3. To host it globally with live PWA support, drop these three files into GitHub Pages or Vercel.

---

## 🌐 Live Deployment Link
Play the live build here: [https://jrrouth.github.io/fridge-market-tycoon/](https://jrrouth.github.io/fridge-market-tycoon/)
