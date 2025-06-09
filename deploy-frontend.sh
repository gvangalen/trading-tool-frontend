#!/bin/bash
set -e  # ❗ Stop direct bij fouten

echo "📦 Start frontend deploy op $(date)"

# ✅ Ga naar projectfolder
cd ~/trading-tool-frontend

# ✅ Haal laatste code op van GitHub
echo "⬇️ Pull laatste code van GitHub..."
git reset --hard HEAD
git pull origin main

# ✅ Zorg dat juiste Node-versie actief is
echo "🔢 Activeer juiste Node versie via NVM..."
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 18

echo "🔢 Node versie: $(node -v)"
echo "🧼 Verwijder cache en oude bestanden (indien nodig)..."

# ✅ Clean install met fallback
echo "📦 Installeer dependencies (npm ci)..."
if ! npm ci; then
  echo "⚠️ npm ci faalde, probeer npm install"
  npm install
fi

# ✅ Build project (voor productie)
echo "🏗️ Build Next.js project..."
npm run build

# ✅ Herstart frontend met PM2
echo "🔁 Herstart frontend via PM2..."
pm2 delete frontend || true
pm2 start npm --name frontend -- start

echo "✅ Deploy voltooid op $(date)"
