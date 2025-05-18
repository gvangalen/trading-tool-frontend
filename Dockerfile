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
ENV NODE_OPTIONS=--max-old-space-size=1536
RUN npm run build

# ✅ Expose poort en start de app
EXPOSE 3000
CMD ["npm", "start"]
