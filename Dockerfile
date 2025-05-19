# ✅ Downgrade naar Node 18 voor compatibiliteit met ARM + Next.js
FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
