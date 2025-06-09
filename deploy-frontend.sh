#!/bin/bash

set -e  # Stop script bij fout

# ✅ 0. Node activeren (via NVM)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Kan Node 18 niet activeren via NVM"; exit 1; }
echo "🔢 Node-versie: $(node -v)"

# 📦 1. Laatste code ophalen
cd ~/trading-tool-frontend || { echo "❌ Map trading-tool-frontend bestaat niet"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# 📂 2. Dependencies installeren
echo "📦 Dependencies installeren/verversen..."
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# 🏗️ 3. Build uitvoeren
echo "🏗️ Build uitvoeren..."
rm -rf .next
npm run build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Kopieer public & .next/static naar standalone-map
echo "📁 Kopieer assets naar standalone-map..."
cp -r public .next/standalone/ || echo "⚠️ Geen public map om te kopiëren"
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/ || echo "⚠️ Geen static map om te kopiëren"

# 🧹 5. PM2 stoppen + poort 3000 vrijmaken
echo "🧹 Stop oude PM2-proces & maak poort vrij..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was vrij"

# 🚀 6. Start frontend standalone via PM2
echo "🚀 Start frontend met PM2..."
pm2 start node --name frontend --time -- .next/standalone/server.js || { echo "❌ PM2 start faalde"; exit 1; }

# 📄 7. Laatste logs
pm2 logs frontend --lines 20 || true

echo "✅ Frontend succesvol gedeployed op http://localhost:3000"
