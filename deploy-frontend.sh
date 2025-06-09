#!/bin/bash
set -e  # Stop script bij fout

# ✅ 0. Node activeren via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }
echo "🔢 Node: $(node -v)"

# 📦 1. Laatste code ophalen
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# 📂 2. Dependencies installeren
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# 🏗️ 3. Build uitvoeren
rm -rf .next .output
npx next build || { echo "❌ Build faalde"; exit 1; }

# 🧱 4. Extra: kopieer static files naar juiste plek
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
cp -r .next/BUILD_ID .next/standalone/.next/
cp -r public .next/standalone/ || true

# 🧹 5. Stop oude PM2 proces en maak poort vrij
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# 🚀 Start correct
pm2 start .next/standalone/server.js --name frontend --time || { echo "❌ PM2 start faalde"; exit 1; }

# 📄 7. Laatste logs
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
