#!/bin/bash
set -e  # ⛑️ Stop script bij fouten

# ✅ Activeer NVM en selecteer Node 18
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 >/dev/null

# ✅ Voeg node & pm2 pad toe aan PATH (voor veiligheid bij GitHub Actions)
export PATH="$HOME/.nvm/versions/node/v18.20.8/bin:$PATH"

echo "📁 Ga naar frontend map..."
cd ~/trading-tool-frontend || {
  echo "❌ Map ~/trading-tool-frontend niet gevonden."
  exit 1
}

echo "📥 Haal laatste code op (force)..."
git fetch origin main
git reset --hard origin/main

echo "🚧 Stop frontend (indien actief)..."
if pm2 list | grep -q "frontend"; then
  pm2 delete frontend
else
  echo "ℹ️ Frontend draaide nog niet"
fi

echo "📦 Installeer/updaten van dependencies..."
npm install

echo "🔧 Productie build uitvoeren..."
npm run build || {
  echo "❌ Build mislukt."
  exit 1
}

echo "🚀 Start frontend via PM2..."
pm2 start "npm run start -- -H 0.0.0.0" --name frontend || {
  echo "❌ Start mislukt."
  exit 1
}

echo "✅ Frontend succesvol gedeployed!"
