import { Handler } from 'express';
import server from '../server';
import config from '../config';

export const Index: Handler = (req, res) => {
  res.status(200).send('Hello World');
};

// export const AuthController: Handler = (req, res, next) => {
//   if (req.header('authentication') !== '1') {
//     res.status(401).send('You are not authorized');
//     return;
//   }
//   next();
// };
