import express from 'express';
import chalk from 'chalk';

import { bootstrap } from './server';
import config from './config';

const app = express();
bootstrap(app);

app.listen(config.port, () =>
  console.log(
    '\nAll hail the server',
    chalk.bgBlue(`http://localhost:${config.port}`),
  ),
);
