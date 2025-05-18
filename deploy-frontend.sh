#!/bin/bash

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || exit 1

echo "📥 Haal laatste code op..."
git reset --hard origin/main
git pull origin main

echo "📦 Installeer/updaten van dependencies..."
npm install

echo "🏗️ Build frontend app..."
npm run build

echo "🐳 Stop bestaande container (indien actief)..."
docker compose down || true

echo "🚀 Start frontend opnieuw..."
docker compose up -d
