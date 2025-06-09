#!/bin/bash
set -e

# ✅ Node activeren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }

echo "🔢 Node versie: $(node -v)"

# 📦 Code ophalen
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main

# 📂 Dependencies opnieuw installeren
rm -rf node_modules package-lock.json
npm install

# 🏗️ Build uitvoeren
rm -rf .next .output
npx next build

# 🧱 Zorg voor correcte structuur voor standalone start
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
cp .next/BUILD_ID .next/standalone/.next/
cp -r public .next/standalone/ || true

# 🧹 Stop vorige PM2 proces & maak poort vrij
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# 🚀 Start frontend opnieuw
pm2 start .next/standalone/server.js --name frontend --time

# 🪵 Laatste logs
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
