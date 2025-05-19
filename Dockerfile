# ✅ Stabiele Node image
FROM node:20

WORKDIR /app

# ✅ Installeer dependencies
COPY package.json package-lock.json* ./
RUN npm install

# ✅ Kopieer volledige app
COPY . .

# ✅ Expose Next.js poort
EXPOSE 3000

# ✅ Alleen starten (geen build!)
CMD ["npm", "start"]
