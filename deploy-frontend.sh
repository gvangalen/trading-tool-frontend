#!/bin/bash
set -e

echo "🔧 Init Node & PM2 pad"
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 18
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"

echo "📁 Ga naar projectmap"
cd ~/trading-tool-frontend || exit 1

echo "📥 Haal laatste code op"
git fetch origin main
git reset --hard origin/main

echo "📦 Dependencies installeren"
npm ci

echo "🛠️ Builden"
npm run build

echo "🛑 Stop oude instance"
pm2 delete frontend || echo "Geen actieve PM2-app"

echo "🚀 Start nieuwe instance"
pm2 start "npm run start -- -H 0.0.0.0" --name frontend
pm2 save

echo "✅ Done"
