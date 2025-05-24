#!/bin/bash
set -e  # Stop bij fout

echo "🔁 Init NVM + Node 18 + pad naar PM2"
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 18
export PATH="$NVM_DIR/versions/node/v18.20.8/bin:$PATH"

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code op (force)..."
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
pm2 start "npm run start -- -H 0.0.0.0" --name frontend || {
  echo "❌ Start mislukt."
  exit 1
}

echo "💾 Bewaar PM2 proceslijst..."
pm2 save

echo "✅ Frontend succesvol gedeployed!"
