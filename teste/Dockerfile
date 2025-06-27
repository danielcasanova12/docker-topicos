FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# peer-deps do Apollo
RUN npm install --production --legacy-peer-deps

COPY . .

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
