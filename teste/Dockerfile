FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --no-cache curl
# peer-deps do Apollo
RUN npm install --production --legacy-peer-deps

COPY send_message.js .

COPY . .

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
