#!/bin/bash

set -e  # ⛑️ Stop script bij fouten (beveiliging)

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code op (force)..."
git fetch origin main
git reset --hard origin/main

echo "🐳 Stop bestaande Docker container (indien actief)..."
docker compose down || echo "⚠️ Geen actieve container om te stoppen."

echo "🧼 Opschonen oude Docker cache..."
docker builder prune -af || echo "⚠️ Geen oude cache gevonden."

echo "🛠️ Docker-image opnieuw builden..."
docker compose build --no-cache || {
  echo "❌ Docker build mislukt."
  exit 1
}

echo "🚀 Start frontend container..."
docker compose up -d || {
  echo "❌ Docker Compose start mislukt."
  exit 1
}

echo "✅ Frontend succesvol gedeployed!"
