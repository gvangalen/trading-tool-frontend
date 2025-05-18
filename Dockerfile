FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 3000

# 🔥 Start alleen (geen build hier!)
CMD ["npm", "start"]
