#!/bin/bash
set -e  # Stop script bij fouten

echo "🧠 Initialiseer NVM + Node 18 + pad naar pm2"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"
nvm use 18

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code op (force)..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installeer/updaten van dependencies..."
npm install

echo "🔧 Productie build uitvoeren..."
npm run build || {
  echo "❌ Build mislukt."
  exit 1
}

echo "🛑 Stop bestaande frontend (indien actief)..."
pm2 delete frontend || echo "ℹ️ Frontend draaide nog niet"

echo "🚀 Start frontend via PM2..."
pm2 start "npm run start -- -H 0.0.0.0" --name frontend

echo "💾 Sla PM2 configuratie op voor reboot"
pm2 save

echo "✅ Frontend succesvol gedeployed!"
