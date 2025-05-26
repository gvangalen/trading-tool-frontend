#!/bin/bash
set -e  # ⛑️ Stop direct bij fout

# 🧠 Zorg dat NVM, Node 18 en pm2 beschikbaar zijn
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"
nvm use 18 || echo "⚠️ Let op: nvm use 18 faalde mogelijk buiten interactive shell"

# ✅ Zorg dat de juiste omgeving gebruikt wordt
export HOST=0.0.0.0
export PORT=3100

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Git ophalen..."
git fetch origin main
git reset --hard origin/main

echo "📦 Dependencies installeren..."
npm ci || npm install

echo "🧹 Oude .next cache verwijderen..."
rm -rf .next

echo "🛠️ Build uitvoeren..."
npm run build || {
  echo "❌ Build faalde"
  exit 1
}

echo "🚀 Frontend herstarten via PM2..."
pm2 delete frontend || echo "🟡 Frontend draaide nog niet"
pm2 start "npm run start -- -p 3100 -H 0.0.0.0" --name frontend

echo "💾 PM2 configuratie opslaan..."
pm2 save

echo "✅ Frontend succesvol gedeployed op http://<public-ip>:3100"
