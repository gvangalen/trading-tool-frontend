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

echo "🐳 Stop bestaande Docker container (indien actief)..."
docker compose down || echo "⚠️ Geen actieve container om te stoppen."

echo "🛠️ Docker-image opnieuw builden inclusief next build..."
docker builder prune -af
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
