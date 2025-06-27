# Etapa 1: build com Node
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Aqui, Vite vai gerar /app/dist
RUN npm run build

# Etapa 2: runtime enxuto com Alpine
FROM node:18-alpine

WORKDIR /app
# instala apenas o serve global
RUN npm install -g serve

# copia só a pasta dist do build
COPY --from=build /app/dist ./dist

EXPOSE 3000
# serve precisa apontar para `dist`, não `build`
CMD ["serve", "-s", "dist", "-l", "3000"]
