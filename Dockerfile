# ✅ Veilige, stabiele base image
FROM node:20

WORKDIR /app

# ✅ Eerst alleen package info kopiëren
COPY package.json package-lock.json* ./

# ✅ Installeer afhankelijkheden
RUN npm install

# ✅ Kopieer alle overige bestanden
COPY . .

# ✅ Expose poort en start de app (met build bij opstart)
EXPOSE 3000
CMD npm run build && npm run start
