#!/bin/bash

set -e  # ⛑️ Stop script bij fouten

# ✅ Zorg dat PM2 en NVM correct werken
export PATH="$(npm bin -g):$PATH"
source ~/.nvm/nvm.sh
nvm install 18
nvm use 18

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code op..."
git fetch origin main
git reset --hard origin/main

echo "🚧 Stop frontend (indien actief)..."
pm2 delete frontend || echo "ℹ️ Frontend draaide nog niet"

echo "📦 Installeer/updaten van dependencies..."
npm install

echo "🔧 Productie build uitvoeren..."
npm run build || {
  echo "❌ Build mislukt."
  exit 1
}

echo "🚀 Start frontend via PM2..."
pm2 start "npm run start -- -H 0.0.0.0" --name frontend

echo "✅ Frontend succesvol gedeployed!"
