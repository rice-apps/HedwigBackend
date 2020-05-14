const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
import Schema from './schema';

require('./db');

const server = new ApolloServer({ schema: Schema });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);