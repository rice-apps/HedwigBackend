const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import http from 'http';
import ws from 'ws';
import Schema from './schema';
import { pubsub } from './pubsub';

// Initialize database (mongoose)
require('./db');

const server = new ApolloServer({ 
  schema: Schema,
});

const app = express();
server.applyMiddleware({ app });

// Create WebSockets server for subscriptions: https://stackoverflow.com/questions/59254814/apollo-server-express-subscriptions-error
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Need to call httpServer.listen instead of app.listen so that the WebSockets (subscriptions) server runs
httpServer.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`);
});