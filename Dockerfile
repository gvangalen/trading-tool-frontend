# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 4. Copy rest of the app
COPY . .

# 5. Build Next.js app
RUN npm run build

# 6. Expose port and start app
EXPOSE 3000
CMD ["npm", "start"]
