#!/bin/bash

echo "📦 1. Git pull laatste versie..."
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

echo "📂 2. Controleren of node_modules bestaat..."
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules niet gevonden, installeren..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
fi

echo "⚙️ 3. Bouwen van frontend (Next.js build)..."
npm run build || { echo "❌ Build faalde"; exit 1; }

echo "🧹 4. Eventuele processen op poort 3000 beëindigen (indien nodig)..."
PID=$(lsof -ti:3000)
if [ -n "$PID" ]; then
  echo "⚠️ Poort 3000 is bezet door PID $PID — wordt gestopt..."
  kill -9 $PID || { echo "❌ Kon proces $PID niet stoppen"; exit 1; }
else
  echo "✅ Poort 3000 is vrij"
fi

echo "🚦 5. Eventuele bestaande PM2-processen stoppen..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces gevonden"

echo "🚀 6. Start frontend via PM2 (standalone)..."
pm2 start node --name frontend -- .next/standalone/server.js || { echo "❌ PM2 start faalde"; exit 1; }

echo "✅ Frontend succesvol gestart op poort 3000"
pm2 logs frontend --lines 20
