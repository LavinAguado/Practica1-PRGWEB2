const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const jwt = require('jsonwebtoken');
const config = require('../../config');

async function startApolloServer(app) {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      let user = null;
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          user = jwt.verify(token, config.jwtSecret);
        } catch (e) {
          // Token invalido ignorado, user queda null
        }
      }
      return { user };
    }
  }));
  console.log('🚀 GraphQL listo en /graphql');
}

module.exports = startApolloServer;
