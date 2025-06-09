#!/bin/bash
set -e

# ✅ Node activeren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || exit 1
echo "🔢 Node versie: $(node -v)"

# ✅ Code ophalen
cd ~/trading-tool-frontend
git reset --hard HEAD
git pull origin main

# ✅ Dependencies
rm -rf node_modules package-lock.json .next .output
npm install

# ✅ Build
npx next build

# ✅ Kopieer static & BUILD_ID voor standalone
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
cp .next/BUILD_ID .next/standalone/.next/
cp -r public .next/standalone/ || true

# ✅ Start via PM2
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 vrij"
pm2 start .next/standalone/server.js --name frontend --time

# ✅ Logs
pm2 logs frontend --lines 20 || true
