#!/bin/bash
set -e

echo "🧠 Init Node & PM2 via NVM (met logging)"
export NVM_DIR="$HOME/.nvm"
echo "🔍 NVM_DIR: $NVM_DIR"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  echo "✅ nvm.sh gevonden"
  source "$NVM_DIR/nvm.sh"
else
  echo "❌ nvm.sh niet gevonden"
fi

echo "📦 Gebruik Node 18 via NVM"
nvm use 18 || echo "⚠️ nvm use 18 faalt misschien"
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"

# Extra debug
echo "🔍 Node info:"
node -v || echo "❌ Node niet beschikbaar"
which node || echo "❌ Node pad onbekend"
echo "🔍 NPM versie:"
npm -v || echo "❌ NPM niet beschikbaar"
echo "🔍 PM2 info:"
which pm2 || echo "❌ pm2 niet gevonden"
pm2 -v || echo "❌ pm2 -v mislukt"

echo "👤 User: $(whoami)"
echo "📄 Shell: $SHELL"
echo "📂 Current dir: $(pwd)"

echo "📁 Ga naar projectmap"
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Git pull + reset"
git fetch origin main
git reset --hard origin/main

echo "📦 Install dependencies (npm ci)"
npm ci || {
  echo "❌ npm ci mislukt"
  exit 1
}

echo "🛠️ Build frontend"
npm run build || {
  echo "❌ Build mislukt"
  exit 1
}

echo "🛑 Stop oude frontend (PM2)"
pm2 delete frontend || echo "ℹ️ Geen actieve PM2-app"

echo "🚀 Start nieuwe frontend via PM2"
pm2 start "npm run start -- -H 0.0.0.0" --name frontend || {
  echo "❌ PM2 start mislukt"
  exit 1
}
pm2 save

echo "✅ Deployment afgerond!"
