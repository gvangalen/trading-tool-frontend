#!/bin/bash
set -e

# ✅ 0. Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }
echo "🔢 Node versie: $(node -v)"

# ✅ 1. Ga naar frontend directory
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 2. Installeer dependencies
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# ✅ 3. Build als standalone
rm -rf .next
npx next build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Stop vorige proces & start opnieuw
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"
pm2 start .next/standalone/server.js --name frontend --time

# ✅ 5. Toon logs
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
