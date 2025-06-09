#!/bin/bash
set -e  # ❗ Stop direct bij fouten

# ✅ 1. Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }
echo "🔢 Node versie: $(node -v)"

# ✅ 2. Ga naar frontend map en haal nieuwste code op
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 3. Herinstalleer alles opnieuw
rm -rf node_modules package-lock.json .next
npm install || { echo "❌ npm install faalde"; exit 1; }
npm run build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Herstart frontend via standaard Next.js server
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"
pm2 start npm --name frontend -- run start || { echo "❌ PM2 start faalde"; exit 1; }

# ✅ 5. Toon logs
pm2 logs frontend --lines 20 || true
echo "✅ ✅ Frontend draait op http://localhost:3000"
