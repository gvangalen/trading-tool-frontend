FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# ⚙️ Alleen starten — niet builden!
CMD ["npm", "start"]
