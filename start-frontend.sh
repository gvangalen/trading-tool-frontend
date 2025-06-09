#!/bin/bash
set -e

# ✅ 0. Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || echo "⚠️ nvm use 18 faalde"
echo "🔢 Node versie: $(node -v)"

# ✅ 1. Pull laatste code
echo "📦 1. Git pull..."
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 2. Dependencies controleren
echo "📂 2. node_modules controleren..."
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules niet gevonden, uitvoeren npm install..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
else
  echo "📦 node_modules al aanwezig, overslaan"
fi

# ✅ 3. Build
echo "⚙️ 3. Builden met Next.js..."
NEXT_TELEMETRY_DISABLED=1 npm run build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Clean oude PM2 processen
echo "🧹 4. Stop oude frontend + poort 3000..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was vrij"

# ✅ 5. Start met correcte node
echo "🚀 5. Start frontend via PM2..."
pm2 start .next/standalone/server.js \
  --name frontend \
  --time || { echo "❌ PM2 start faalde"; exit 1; }

echo "📄 Laatste logs:"
pm2 logs frontend --lines 20

echo "✅ Frontend draait op http://<IP>:3000"
