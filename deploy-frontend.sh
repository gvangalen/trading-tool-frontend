#!/bin/bash
set -e

# 🧠 Zet Node 18 actief + pm2 beschikbaar
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"
nvm use 18 || echo "⚠️ Let op: nvm use 18 faalde mogelijk buiten interactive shell"

# ✅ Poort/host voor Next.js
export HOST=0.0.0.0
export PORT=3000
export NEXT_PUBLIC_API_BASE_URL=http://143.47.186.148:5002/api

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

echo "🧹 Verwijder oude build..."
rm -rf .next

echo "🛠️ Build uitvoeren..."
npm run build || {
  echo "❌ Build faalde"
  exit 1
}

echo "✨ Kopieer statische bestanden naar standalone..."
cp -r .next/static .next/standalone/.next/static

if [ ! -f ".next/standalone/server.js" ]; then
  echo "❌ Build is niet standalone of ontbreekt — check next.config.js"
  exit 1
fi

echo "💀 Stop bestaande PM2-proces (indien actief)..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"

echo "🚀 Start standalone frontend via PM2..."
pm2 start .next/standalone/server.js --name frontend --update-env

echo "💾 PM2-config bewaren..."
pm2 save

PUBLIC_IP=$(curl -s ifconfig.me || echo "<jouw-public-ip>")
echo "✅ Frontend bereikbaar via: http://$PUBLIC_IP:$PORT"
