#!/bin/bash
set -e

echo "📦 Start frontend deploy op $(date)"

# -------------------------
# 1. Load NVM + export PM2 path
# -------------------------
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

export PATH="$HOME/.nvm/versions/node/v20.19.5/bin:$PATH"
echo "🔧 PM2 pad: $(which pm2 || echo '❌ Niet gevonden')"

# -------------------------
# 2. Ga naar project
# -------------------------
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }

# -------------------------
# 3. PM2 volledig verwijderen
# -------------------------
if pm2 list | grep -q frontend; then
  echo "🧹 Verwijder PM2 proces 'frontend'..."
  pm2 delete frontend || true
fi

# -------------------------
# 4. Pull code
# -------------------------
echo "⬇️ Pull laatste code..."
git fetch origin main
git reset --hard origin/main

# -------------------------
# 5. Node activeren
# -------------------------
nvm use 20 || { echo "❌ Node 20 niet beschikbaar"; exit 1; }
echo "Node: $(node -v)"

# -------------------------
# 6. Opschonen
# -------------------------
echo "🧨 Verwijder node_modules + .next + lockfile..."
rm -rf node_modules .next package-lock.json

# -------------------------
# 7. Install dependencies
# -------------------------
echo "📦 Install dependencies..."
npm install --legacy-peer-deps

# -------------------------
# 8. EXTRA: UI dependencies
# -------------------------
echo "➕ Install framer-motion + lucide-react + clsx"
npm install framer-motion lucide-react clsx --legacy-peer-deps

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
# 11. Start PM2 (schoon)
# -------------------------
echo "🚀 Start frontend via PM2..."
pm2 start npm --name frontend -- run start
pm2 save

echo "✅ Deployment afgerond op $(date)"
