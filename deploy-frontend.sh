#!/bin/bash
set -e  # ⛑️ Stop direct bij fout

# 🧠 Zorg dat NVM, Node 18 en pm2 beschikbaar zijn (voor GitHub Actions of handmatig)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"
nvm use 18 || echo "⚠️ Let op: nvm use 18 faalde mogelijk buiten interactive shell"

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Git ophalen"
git fetch origin main
git reset --hard origin/main

echo "📦 Dependencies installeren"
npm ci || npm install

echo "🛠️ Build uitvoeren"
npm run build || {
  echo "❌ Build faalde"
  exit 1
}

echo "🚀 Herstart frontend via PM2"
pm2 delete frontend || echo "🟡 Frontend draaide nog niet"
pm2 start "npm run start -- -H 0.0.0.0" --name frontend

echo "💾 PM2 configuratie opslaan (voor reboot)"
pm2 save

echo "✅ Alles gelukt"
