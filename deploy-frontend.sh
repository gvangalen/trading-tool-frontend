#!/bin/bash

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Kan map ~/trading-tool-frontend niet vinden."
  exit 1
}

echo "📥 Haal laatste code op (force)..."
git fetch origin
git reset --hard origin/main || {
  echo "❌ Git reset mislukt."
  exit 1
}

echo "📦 Installeer of update dependencies (npm install)..."
npm install || {
  echo "❌ NPM install mislukt."
  exit 1
}

echo "🏗️ Build frontend app (lokaal)..."
npm run build || {
  echo "❌ Build mislukt (Next.js)."
  exit 1
}

echo "🐳 Stop bestaande Docker container (indien actief)..."
docker compose down || echo "⚠️ Geen actieve container om te stoppen."

echo "🚀 Start frontend met Docker (zonder opnieuw te builden)..."
docker compose up -d || {
  echo "❌ Docker Compose start mislukt."
  exit 1
}

echo "✅ Frontend succesvol gedeployed!"
