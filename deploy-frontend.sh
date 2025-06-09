#!/bin/bash
set -e

echo ""
echo "🚀 Start deployment van frontend..."

# ✅ 0. Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief of niet geïnstalleerd"; exit 1; }
echo "🔢 Node versie actief: $(node -v)"

# ✅ 1. Ga naar frontend directory
cd ~/trading-tool-frontend || { echo "❌ Pad ~/trading-tool-frontend niet gevonden"; exit 1; }
echo "📁 In map: $(pwd)"

# ✅ 2. Haal laatste versie van GitHub op
echo "🔄 Git pull uitvoeren..."
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 3. Verwijder oude build + node_modules
echo "🧹 Verwijder oude build en node_modules..."
rm -rf .next node_modules package-lock.json
rm -rf node_modules/yaml/browser/* || true  # Extra fix voor ENOTEMPTY bug

# ✅ 4. Installeer opnieuw alle dependencies
echo "📦 Dependencies installeren..."
npm install || { echo "❌ npm install faalde"; exit 1; }

# ✅ 5. Build als standalone app
echo "🏗️ Builden als standalone..."
npx next build || { echo "❌ Build faalde"; exit 1; }

# ✅ 6. Stop vorige versie en maak poort vrij
echo "🛑 Stop PM2 proces & maak poort 3000 vrij..."
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# ✅ 7. Start nieuwe versie via PM2
echo "🚀 Start nieuwe frontend via PM2..."
pm2 start .next/standalone/server.js --name frontend --time

# ✅ 8. Toon logs (laatste 20 regels)
echo "📜 Laatste PM2 logs:"
pm2 logs frontend --lines 20 || true

echo ""
echo "✅ Frontend draait op http://localhost:3000"
