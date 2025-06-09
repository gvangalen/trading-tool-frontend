#!/bin/bash
set -e  # Stop script bij fout

# ✅ 0. Activeer Node 18 via NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18 || echo "⚠️ nvm use 18 faalde — controleer of Node 18 actief is"
echo "🔢 Actieve Node-versie: $(node -v)"

# ✅ 1. Git pull laatste versie
echo "📦 1. Git pull laatste versie..."
git reset --hard HEAD
git pull origin main || { echo "❌ Git pull faalde"; exit 1; }

# ✅ 2. node_modules controleren
echo "📂 2. node_modules controleren..."
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules niet gevonden, uitvoeren npm install..."
  npm install || { echo "❌ npm install faalde"; exit 1; }
else
  echo "📦 node_modules al aanwezig, overslaan"
fi

# ✅ 3. Build
echo "⚙️ 3. Bouwen van frontend (Next.js)..."
npm run build || { echo "❌ Build faalde"; exit 1; }

# ✅ 4. Stop oude processen + poort 3000
echo "🧹 4. Opruimen oude processen en poort 3000..."
pm2 delete frontend || echo "ℹ️ Geen bestaand PM2-proces"
fuser -k 3000/tcp || echo "ℹ️ Poort 3000 was vrij"

# ✅ 5. Start nieuwe frontend zonder interpreter
echo "🚀 5. Start frontend via PM2..."
pm2 start .next/standalone/server.js \
  --name frontend \
  --time || { echo "❌ PM2 start faalde"; exit 1; }

# ✅ 6. Laatste logs
echo "📄 Laatste 20 regels log:"
pm2 logs frontend --lines 20 || true

echo "✅ Frontend succesvol gestart op poort 3000"
