#!/bin/bash
set -e  # Stop script bij fout

# ✅ 0. Node activeren via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || { echo "❌ Node 18 niet actief"; exit 1; }
echo "🔢 Node: $(node -v)"

# 📦 1. Ga naar projectmap en haal laatste code op
cd ~/trading-tool-frontend || { echo "❌ Pad niet gevonden"; exit 1; }
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# 📂 2. Dependencies opnieuw installeren (schoon en betrouwbaar)
rm -rf node_modules package-lock.json
npm install || { echo "❌ npm install faalde"; exit 1; }

# 🏗️ 3. Build uitvoeren (standaard build, geen standalone)
rm -rf .next
npx next build || { echo "❌ Build faalde"; exit 1; }

# 🧹 4. Stop oude PM2 proces en maak poort vrij
pm2 delete frontend || true
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was al vrij"

# 🚀 5. Start frontend via standaard Next.js server
pm2 start npm --name frontend -- start || { echo "❌ PM2 start faalde"; exit 1; }

# 🧾 6. Laatste logs tonen
pm2 logs frontend --lines 20 || true

echo "✅ Frontend draait op http://localhost:3000"
