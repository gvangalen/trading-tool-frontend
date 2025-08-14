#!/bin/bash
set -e  # ❗ Stop direct bij fout

echo "📦 Start frontend deploy op $(date)"

# ✅ 1. Ga naar juiste projectmap
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }

# ✅ 2. Update codebase
echo "⬇️ Pull laatste code van GitHub..."
git fetch origin main
git reset --hard origin/main

# ✅ 3. Activeer Node 18 (via NVM)
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet beschikbaar via NVM"; exit 1; }

echo "🔢 Node versie: $(node -v)"
echo "📦 NPM versie: $(npm -v)"

# ✅ 4. Schoonmaak vóór installatie
echo "🧨 Verwijder node_modules en .next..."
rm -rf node_modules .next

# ✅ 5. Installeer dependencies
echo "📦 Probeer 'npm ci'..."
if ! npm ci; then
  echo "⚠️ npm ci faalde, probeer 'npm install'..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
fi

# ✅ 6. Build project
echo "🏗️ Build Next.js project..."
npm run build || { echo "❌ Build faalde. Stop script."; exit 1; }

# ✅ 7. Controleer of build is geslaagd
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ .next/BUILD_ID ontbreekt → build waarschijnlijk mislukt!"
  exit 1
fi

# ✅ 8. Start of herstart frontend via PM2
echo "🚀 Start of herstart frontend via PM2..."

pm2 describe frontend > /dev/null
if [ $? -ne 0 ]; then
  echo "🔁 Start frontend (eerste keer)"
  pm2 start npm --name frontend -- start
else
  echo "🔁 Restart frontend"
  pm2 restart frontend
fi

echo "✅ Frontend deployment succesvol afgerond op $(date)"
