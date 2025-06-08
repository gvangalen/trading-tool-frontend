#!/bin/bash

echo "📦 1. Git pull laatste versie..."
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

echo "📂 2. Controleren of node_modules bestaat..."
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules niet gevonden, installeren..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
fi

echo "⚙️ 3. Bouwen van frontend (Next.js build)..."
npm run build || { echo "❌ Build faalde"; exit 1; }

echo "🧹 4. Opruimen oude processen en poort 3000..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"
killall node || echo "ℹ️ Geen losse node-processen"

echo "🚀 5. Start frontend via PM2 (standalone)..."
pm2 start node --name frontend -- .next/standalone/server.js || { echo "❌ PM2 start faalde"; exit 1; }

echo "✅ Frontend succesvol gestart op poort 3000"
pm2 logs frontend --lines 20
