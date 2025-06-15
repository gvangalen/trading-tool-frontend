#!/bin/bash
set -e  # ❗ Stop bij fout

echo "📦 Start frontend deploy op $(date)"

# ✅ Stap 1: Ga naar projectmap
cd ~/trading-tool-frontend

echo "⬇️ Pull laatste code van GitHub..."
git fetch origin main
git reset --hard origin/main

# ✅ Stap 2: Activeer juiste Node versie
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 18
echo "🔢 Node versie: $(node -v)"

# ✅ Stap 3: Schoonmaak vóór install (laat lockfile staan!)
echo "🧨 Verwijder node_modules en .next..."
rm -rf node_modules
rm -rf .next
# ❌ Niet verwijderen: rm -f package-lock.json

# ✅ Stap 4: Dependencies installeren
echo "📦 Installeer dependencies (npm ci)..."
if ! npm ci; then
  echo "⚠️ npm ci faalde, probeer npm install"
  npm install || (echo "❌ npm install faalde" && exit 1)
fi

# ✅ Stap 5: Build project
echo "🏗️ Build Next.js project..."
npm run build

# ✅ Stap 6: Start of herstart frontend met PM2
echo "🚀 Herstart frontend via PM2..."
pm2 delete frontend || true
pm2 start npm --name frontend -- start

echo "✅ Frontend deployment succesvol afgerond op $(date)"
