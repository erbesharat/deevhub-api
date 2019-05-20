import chalk from 'chalk';
import * as Express from 'express';

import router from './router';

const server: {
  app: Express.Application;
  router: { [key: string]: Express.Router };
} = {
  app: null,
  router: {},
};

export const bootstrap = app => {
  server.app = app;

  registerRoutes('', app, router);
};

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
