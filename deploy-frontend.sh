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

# ✅ 4. Verifieer of BUILD_ID bestaat, anders stoppen
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ BUILD_ID ontbreekt — build is niet correct."
  exit 1
fi

# ✅ 5. Stop bestaand frontend proces
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# ✅ 6. Start frontend vanuit standalone map (correcte rootpad)
cd .next/standalone
pm2 start server.js --name frontend --time || { echo "❌ PM2 start faalde"; exit 1; }

# ✅ 7. Toon logs
pm2 logs frontend --lines 20 || true

echo "✅ ✅ Frontend draait op http://localhost:3000"
