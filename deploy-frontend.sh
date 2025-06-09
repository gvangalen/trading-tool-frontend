#!/bin/bash
set -e

# ✅ Node activeren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }

# ✅ Naar repo en laatste code ophalen
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ Dependencies + build
rm -rf node_modules package-lock.json .next
npm install || { echo "❌ npm install faalde"; exit 1; }
npx next build || { echo "❌ Build faalde"; exit 1; }

# ✅ Check build
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ BUILD_ID ontbreekt"
  exit 1
fi

# ✅ Kopieer correcte output (voor App Router!)
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
cp -r .next/server/app .next/standalone/.next/server/app
cp .next/BUILD_ID .next/standalone/.next/BUILD_ID
cp -r public .next/standalone/public || true

# ✅ Start frontend opnieuw
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"
pm2 start .next/standalone/server.js --name frontend --time || { echo "❌ PM2 start faalde"; exit 1; }

pm2 logs frontend --lines 20 || true
echo "✅ Frontend draait op http://localhost:3000"
