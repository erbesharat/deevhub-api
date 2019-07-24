import chalk from 'chalk';
import 'reflect-metadata';
import * as Express from 'express';
import { createConnection, EntityManager } from 'typeorm';
import bodyParser from 'body-parser';

import router from './router';
import config from './config';

const server: {
  app: Express.Application;
  router: { [key: string]: Express.Router };
  orm: EntityManager;
} = {
  app: null,
  router: {},
  orm: null,
};

export const bootstrap = async app => {
  app.use(bodyParser());
  server.app = app;
  server.orm = await setupTypeORM();

  registerRoutes('', app, router);
};

async function setupTypeORM() {
  let orm: EntityManager;
  try {
    let connection = await createConnection({
      type: 'postgres',
      host: config.postgres_host,
      port: config.postgres_port,
      username: config.postgres_username,
      password: config.postgres_password,
      database: config.postgres_db,
      entities: [__dirname + '/models/*.ts'],
      synchronize: true,
      logging: !config.production,
    });
    orm = connection.manager;
  } catch (error) {
    console.error(error);
  }

  return orm;
}

function registerRoutes(base, router, routes) {
  Object.keys(routes).forEach(route => {
    if (route === '_middlewares') {
      // Register router middlewares
      router.use(
        Array.isArray(routes[route]) ? routes[route] : [routes[route]],
      );
    } else if (route.indexOf(' ') > -1) {
      // Register router routes
      const [method, path] = route.split(' ');
      const handlers = Array.isArray(routes[route])
        ? routes[route]
        : [routes[route]];
      router[method](path, handlers);

      console.log(
        chalk.bgGreen('Registered route:'),
        method.toUpperCase(),
        chalk.bgWhite(chalk.bgBlue(base + path)),
      );
    } else {
      // Register new router
      const newRouter = Express.Router();

      registerRoutes(base + route, newRouter, routes[route]);
      router.use(route, newRouter);

      server.router[(base + route).replace(/\//g, '_').slice(1)] = newRouter;
    }
  });
}

export default server;
