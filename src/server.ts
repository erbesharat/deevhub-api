import { createConnection, Connection } from 'typeorm';
import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import multer from 'multer';

import resolvers from './resolvers';
import config from './config';
import { User } from './models/User';
import { Token } from './types/token';
import upload from './jobs/image/upload';
import fetchImages from './jobs/image/fetch-images';

const publicKEY = fs.readFileSync(config.jwt_public, 'utf8');

export const app: {
  db: Connection;
  server: express.Express;
  sms: any;
} = {
  db: null,
  server: null,
  sms: null,
};

export const bootstrap = async () => {
  const typeDefs = gql(readFileSync(__dirname + '/schema.graphql').toString());

  app.db = await createConnection(config.db);

  await app.db.runMigrations();

  let apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => ({
      auth: req.headers.authorization,
      user: await getUser(req.headers.authorization),
    }),
  });

  app.server = express();

  let uploader = multer({ dest: 'public/img' });

  app.server.get('/images/:image/:width?/:height?', fetchImages);
  app.server.post('/images', uploader.array('images'), upload);

  apollo.applyMiddleware({ app: app.server });

  return app;
};

const getUser = async (token: String) => {
  if (token && token.split(' ').length == 2) {
    let user = jwt.verify(token.slice('Bearer '.length), publicKEY, {
      algorithms: ['RS256'],
    }) as Token;

    const UserRepository = app.db.getRepository(User);
    const result = await UserRepository.findOne({
      where: { phone: user.phone },
    });

    return result;
  }
};
