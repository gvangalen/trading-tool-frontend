#!/bin/bash
set -e

# ✅ Node activeren (NVM)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }

echo "🔢 Node versie: $(node -v)"

# 📦 Ga naar juiste map
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }

# 📥 Laatste code ophalen
git reset --hard HEAD
git pull origin main

# 📂 Dependencies opnieuw installeren
rm -rf node_modules package-lock.json
npm install

# 🏗️ Build uitvoeren
rm -rf .next .output .next/standalone
npx next build

# 🧱 Correcte structuur opbouwen voor standalone
cp -r .next/standalone .
cp -r public .next/standalone/ || true
cp -r .next/static .next/standalone/.next/static || true
cp .next/BUILD_ID .next/standalone/.next/BUILD_ID || true

# 🧹 Stop vorige PM2 proces & maak poort vrij
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# 🚀 Start frontend opnieuw via PM2
pm2 start .next/standalone/server.js --name frontend --time

# 🪵 Laatste logs tonen
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
