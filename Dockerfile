# ✅ Stabiele Node-versie
FROM node:20

# ✅ Werkmap instellen
WORKDIR /app

# ✅ Alleen package-info kopiëren en dependencies installeren
COPY package.json package-lock.json* ./
RUN npm install

# ✅ Overige bestanden kopiëren
COPY . .

# ✅ 🔧 Productie build uitvoeren (verplicht voor next start)
RUN npm run build

# ✅ Poort openen
EXPOSE 3000

# ✅ Productie starten
CMD ["npm", "start"]
