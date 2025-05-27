#!/bin/bash
set -e  # ⛑️ Stop direct bij fout

# 🧠 Zorg dat NVM, Node 18 en pm2 beschikbaar zijn
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"
nvm use 18 || echo "⚠️ Let op: nvm use 18 faalde mogelijk buiten interactive shell"

# ✅ Poort en host instellen
export HOST=0.0.0.0
export PORT=3100

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code van GitHub..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installeer dependencies..."
npm ci || npm install

echo "🧹 Verwijder oude build-cache..."
rm -rf .next

echo "🛠️ Bouw project..."
npm run build || {
  echo "❌ Build faalde"
  exit 1
}

echo "🚀 Herstart frontend via PM2..."
pm2 delete frontend || echo "ℹ️ Geen bestaande PM2-processen"
pm2 start "npm run start -- -p $PORT -H $HOST" --name frontend

echo "💾 Bewaar PM2-configuratie..."
pm2 save

# Haal het publieke IP op via metadata service of Oracle CLI
PUBLIC_IP=$(curl -s ifconfig.me || echo "<jouw-public-ip>")

echo "✅ Frontend succesvol gedeployed op: http://$PUBLIC_IP:$PORT"
