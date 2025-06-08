#!/bin/bash

set -e  # Stop script bij elke fout

# 🧠 Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || echo "⚠️ nvm use 18 faalde — controleer je Node versie"

echo "📦 1. Git pull laatste versie..."
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

echo "📂 2. node_modules controleren..."
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules niet gevonden, uitvoeren npm install..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
else
  echo "📦 node_modules al aanwezig, overslaan"
fi

echo "⚙️ 3. Bouwen van frontend (Next.js)..."
npm run build || { echo "❌ Build faalde"; exit 1; }

echo "🧹 4. Opruimen oude processen en poort 3000..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was vrij"

echo "🚀 5. Start frontend via PM2 (standalone build)..."
pm2 start node \
  --name frontend \
  --interpreter bash \
  --time \
  -- .next/standalone/server.js || { echo "❌ PM2 start faalde"; exit 1; }

echo "✅ Frontend succesvol gestart op poort 3000"
pm2 logs frontend --lines 20
