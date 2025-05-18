#!/bin/bash

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || exit 1

echo "📥 Haal laatste code op..."
git pull origin main

echo "📦 Installeer/updaten van dependencies..."
npm install

echo "🐳 Stop bestaande container (indien actief)..."
docker compose down || true

echo "🐳 Start frontend opnieuw (build gebeurt bij start)..."
docker compose up -d --build
