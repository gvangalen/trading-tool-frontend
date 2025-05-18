FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# 🔥 Build pas bij runtime uitvoeren, niet tijdens build-fase
CMD npm run build && npm start
