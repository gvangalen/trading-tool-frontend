# ✅ Veilige, stabiele base image
FROM node:20

WORKDIR /app

# ✅ Eerst alleen package info kopiëren
COPY package.json package-lock.json* ./

# ✅ Installeer afhankelijkheden
RUN npm install

# ✅ Kopieer alle overige bestanden
COPY . .

# ✅ Build de Next.js app
RUN npm run build

# ✅ Expose poort en start de app
EXPOSE 3000
CMD ["npm", "start"]
