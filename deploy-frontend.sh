#!/bin/bash
set -e

# ✅ 0. Node activeren via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet beschikbaar"; exit 1; }
echo "🔢 Node versie: $(node -v)"

# 📦 1. Laatste code ophalen
cd ~/trading-tool-frontend || exit 1
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# 📂 2. Install dependencies
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# 🏗️ 3. Maak standalone productie-build
rm -rf .next
rm -rf .output
npx next build || { echo "❌ Next.js build faalde"; exit 1; }

# ✨ 4. Zet juiste structuur voor standalone server
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/ || true
cp -r .next/BUILD_ID .next/standalone/.next/ || true

# 🧹 5. PM2 opnieuw starten
pm2 delete frontend || true
fuser -k 3000/tcp || true

# 🚀 6. Start via standalone-server.js
pm2 start node --name frontend --time -- .next/standalone/server.js || { echo "❌ Start faalde"; exit 1; }

# 📋 7. Laatste logs
pm2 logs frontend --lines 20 || true

echo "✅ Deployment afgerond op http://localhost:3000"
