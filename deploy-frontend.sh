#!/bin/bash
set -e  # ❗ Stop direct bij fout

echo "📦 Start frontend deploy op $(date)"

# 1. Projectmap
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }

# 2. Pull code
echo "⬇️ Pull laatste code van GitHub..."
git fetch origin main
git reset --hard origin/main

# 3. Node 20 activeren
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 20 || { echo "❌ Node 20 niet beschikbaar"; exit 1; }

echo "🔢 Node versie: $(node -v)"
echo "📦 NPM versie: $(npm -v)"

# 4. Schoonmaak
echo "🧨 Verwijder node_modules en .next..."
rm -rf node_modules .next package-lock.json

# 5. Dependencies
echo "📦 Install dependencies..."
npm install || { echo "❌ npm install faalde"; exit 1; }

# 6. Build
echo "🏗️ Build Next.js project..."
npm run build || { echo "❌ Build faalde"; exit 1; }

# 7. Build-check
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ .next/BUILD_ID ontbreekt → build mislukt"
  exit 1
fi

# 8. PM2 start/restart
echo "🚀 Start of restart frontend via PM2..."

pm2 describe frontend &>/dev/null
if [ $? -ne 0 ]; then
  echo "🔁 Start frontend (eerste keer)"
  pm2 start npm --name "frontend" -- run start
else
  echo "🔁 Restart frontend"
  pm2 restart frontend --update-env
fi

# 9. PM2 save
pm2 save

echo "✅ Frontend deployment succesvol afgerond op $(date)"
