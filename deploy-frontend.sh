#!/bin/bash
set -e  # Stop direct bij fout

echo "📦 Start frontend deploy op $(date)"

# -------------------------
# 1. Projectmap
# -------------------------
cd ~/trading-tool-frontend || { echo "❌ Map niet gevonden"; exit 1; }

# -------------------------
# 2. Stop bestaande PM2 proces (indien actief)
# -------------------------
if pm2 list | grep -q frontend; then
  echo "🛑 Stop frontend..."
  pm2 stop frontend
fi

# -------------------------
# 3. Pull laatste Git code
# -------------------------
echo "⬇️ Pull laatste code van GitHub..."
git fetch origin main
git reset --hard origin/main

# -------------------------
# 4. NVM + Node 20 activeren
# -------------------------
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

nvm use 20 || { echo "❌ Node 20 niet beschikbaar"; exit 1; }

echo "🔢 Node versie: $(node -v)"
echo "📦 NPM versie: $(npm -v)"

# -------------------------
# 5. Opschonen
# -------------------------
echo "🧨 Verwijder node_modules + build folders..."
rm -rf node_modules .next package-lock.json
rm -rf node_modules/.cache 2>/dev/null || true

# -------------------------
# 6. Dependencies installeren
# -------------------------
echo "📦 Install dependencies..."
npm install || { echo "❌ npm install faalde"; exit 1; }

# -------------------------
# 7. Build
# -------------------------
echo "🏗️ Build Next.js project..."
npm run build || { echo "❌ Build faalde"; exit 1; }

# -------------------------
# 8. Build check
# -------------------------
if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ .next/BUILD_ID ontbreekt → build mislukt"
  exit 1
fi

# -------------------------
# 9. Start PM2 proces opnieuw
# -------------------------
echo "🚀 Start frontend via PM2..."

pm2 start npm --name "frontend" -- run start

# -------------------------
# 10. PM2 Save
# -------------------------
pm2 save

echo "✅ Frontend deployment succesvol afgerond op $(date)"
