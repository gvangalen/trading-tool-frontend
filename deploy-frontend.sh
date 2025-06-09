#!/bin/bash
set -e  # ❗ Stop direct bij fouten

# ✅ 0. Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }
echo "🔢 Node versie: $(node -v)"

# ✅ 1. Ga naar frontend map en haal laatste code op
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 2. Herinstalleer dependencies
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# ✅ 3. Build als standalone (voor PM2)
rm -rf .next
npx next build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Kopieer output naar standalone map (incl. CSS/public)
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
cp .next/BUILD_ID .next/standalone/.next/BUILD_ID
cp -r public .next/standalone/public || true

# ✅ 5. Stop bestaand frontend proces
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# ✅ 6. Start frontend opnieuw via PM2
pm2 start .next/standalone/server.js --name frontend --time

# ✅ 7. Toon logs
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
