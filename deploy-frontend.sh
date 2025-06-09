#!/bin/bash

set -e  # Stop bij fout

# ✅ 0. Node activeren (via NVM)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || echo "⚠️ nvm use 18 faalde — controleer versie"
echo "🔢 Node-versie: $(node -v)"

# 📦 1. Pull laatste code
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# 📂 2. Dependencies checken
if [ ! -d "node_modules" ]; then
  echo "📦 npm install uitvoeren..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
else
  echo "📦 node_modules aanwezig, overslaan"
fi

# 🏗️ 3. Build uitvoeren (Next.js standalone)
rm -rf .next
npm run build || { echo "❌ Build faalde"; exit 1; }

# 🧹 4. Stop oude PM2 + poort opruimen
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was vrij"

# 🚀 5. Start standalone via PM2 (correct)
pm2 start .next/standalone/server.js \
  --name frontend \
  --time \
  --env production || { echo "❌ PM2 start faalde"; exit 1; }

# 📄 6. Laatste logs tonen
pm2 logs frontend --lines 20 || true

echo "✅ Frontend succesvol gedeployed op http://localhost:3000"
