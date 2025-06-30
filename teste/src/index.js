// src/index.js
console.log("Iniciando orchard_api...");
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const { connectRabbitMQ } = require('./rabbitmq');

const app = express();
const PORT = process.env.PORT || 4000;
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log('✔ MongoDB conectado'))
  .catch(err => {
    console.error('✖ Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });

async function startApollo() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}${server.graphqlPath}`);
  });

  connectRabbitMQ();
}

startApollo();
