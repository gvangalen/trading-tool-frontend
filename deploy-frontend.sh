#!/bin/bash

set -e  # ⛑️ Stop bij fouten

# ✅ Zorg dat NVM beschikbaar is
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# ✅ Gebruik Node 18 (voor Next.js compatibiliteit)
nvm install 18
nvm use 18

# ✅ Zorg dat globale npm binaries (zoals pm2) beschikbaar zijn
export PATH="$HOME/.npm-global/bin:$PATH"

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code op (force)..."
git fetch origin main
git reset --hard origin/main

# 🔧 (Optioneel) Stop PM2 frontend proces als je dat ooit gebruikt:
echo "🚧 Stop frontend (indien actief via PM2)..."
command -v pm2 >/dev/null && pm2 delete frontend || echo "ℹ️ Geen PM2 of frontend draaide niet"

echo "📦 Installeer/updaten van dependencies..."
npm install

echo "🔧 Productie build uitvoeren (Next.js)..."
npm run build || {
  echo "❌ Build mislukt."
  exit 1
}

echo "🐳 Stop bestaande Docker container (indien actief)..."
docker compose down || echo "⚠️ Geen actieve container om te stoppen."

echo "🧼 Opschonen oude Docker cache..."
docker builder prune -af || echo "⚠️ Geen oude cache gevonden."

echo "🛠️ Docker-image opnieuw builden..."
docker compose build --no-cache || {
  echo "❌ Docker build mislukt."
  exit 1
}

echo "🚀 Start frontend container..."
docker compose up -d || {
  echo "❌ Docker Compose start mislukt."
  exit 1
}

echo "✅ Frontend succesvol gedeployed!"
