#!/bin/bash
set -e  # ❗ Stop direct bij fout

echo "📦 Start frontend deploy op $(date)"

# ✅ 1. Ga naar juiste projectmap
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }

# ✅ 2. Update codebase
echo "⬇️ Pull laatste code van GitHub..."
git fetch origin main
git reset --hard origin/main

# ✅ 3. Activeer Node 20 (via NVM)
export NVM_DIR="$HOME/.nvm"
# laad nvm
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ NVM niet gevonden in $NVM_DIR"
  exit 1
fi

# Probeer Node 20 te gebruiken, anders eerst installeren
if ! nvm use 20 >/dev/null 2>&1; then
  echo "ℹ️ Node 20 nog niet geïnstalleerd, installeren..."
  nvm install 20
  nvm use 20
fi

echo "🔢 Node versie: $(node -v)"
echo "📦 NPM versie: $(npm -v)"

# ✅ 4. Schoonmaak vóór installatie
echo "🧨 Verwijder node_modules en .next..."
rm -rf node_modules .next package-lock.json

# ✅ 5. Installeer dependencies
echo "📦 Install dependencies..."
npm install || { echo "❌ npm install faalde"; exit 1; }

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

if ! pm2 describe frontend >/dev/null 2>&1; then
  echo "🔁 Start frontend (eerste keer)"
  pm2 start "npm run start" \
    --name frontend \
    --cwd "$HOME/trading-tool-frontend" \
    --interpreter bash \
    --output "/var/log/pm2/frontend.log" \
    --error "/var/log/pm2/frontend.err.log"
else
  echo "🔁 Restart frontend"
  pm2 restart frontend
fi

# ✅ 9. PM2 configuratie opslaan
pm2 save

echo "✅ Frontend deployment succesvol afgerond op $(date)"
