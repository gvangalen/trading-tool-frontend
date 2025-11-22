#!/bin/bash
set -e

echo "📦 Start frontend deploy op $(date)"

# -------------------------
# 1. Load NVM + export PM2 path
# -------------------------
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Zorg dat PM2 altijd gevonden wordt
export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"

echo "🔧 PM2 pad: $(which pm2 || echo '❌ Niet gevonden')"

# -------------------------
# 2. Projectmap
# -------------------------
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }

# -------------------------
# 3. Stop PM2 proces vóór cleanup
# -------------------------
if pm2 list | grep -q frontend; then
  echo "🛑 Stop frontend..."
  pm2 stop frontend
fi

# -------------------------
# 4. Pull code
# -------------------------
echo "⬇️ Pull laatste code..."
git fetch origin main
git reset --hard origin/main

# -------------------------
# 5. Activeer Node 20
# -------------------------
nvm use 20 || { echo "❌ Node 20 niet beschikbaar"; exit 1; }
echo "Node: $(node -v)"

# -------------------------
# 6. Opschonen
# -------------------------
echo "🧨 Verwijder node_modules + .next..."
rm -rf node_modules .next package-lock.json

# -------------------------
# 7. Dependencies installeren
# -------------------------
echo "📦 Install dependencies..."
npm install

# -------------------------
# 8. Installeer extra libs (NOOIT overslaan)
# -------------------------
echo "➕ Install framer-motion + lucide-react"
npm install framer-motion lucide-react --legacy-peer-deps

# -------------------------
# 9. Build
# -------------------------
echo "🏗️ Build..."
npm run build || { echo "❌ Build faalde"; exit 1; }

# -------------------------
# 10. Check build
# -------------------------
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ Build ID ontbreekt"
  exit 1
fi

# -------------------------
# 11. Start PM2
# -------------------------
echo "🚀 Start frontend via PM2..."
pm2 start npm --name "frontend" -- run start

pm2 save

echo "✅ Deployment afgerond op $(date)"
