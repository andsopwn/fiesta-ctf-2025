FROM node:18-alpine

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
RUN npm i multer

COPY server ./server
EXPOSE 3000
CMD ["node", "server/app.js"]
