#!/bin/bash
set -e  # Stop bij fout

# ✅ 0. Node activeren via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }
echo "🔢 Node versie: $(node -v)"

# ✅ 1. Ga naar projectfolder en haal laatste versie op
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 2. Herinstalleer dependencies
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# ✅ 3. Verwijder oude .next output en build opnieuw in standalone
rm -rf .next/standalone
npx next build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Kopieer vereiste files naar juiste plek in standalone
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
cp .next/BUILD_ID .next/standalone/.next/BUILD_ID
cp -r public .next/standalone/ || true

# ✅ 5. Stop vorige frontend proces (indien bestaat)
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# ✅ 6. Start frontend via PM2
pm2 start .next/standalone/server.js --name frontend --time

# ✅ 7. Laat logs zien
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
