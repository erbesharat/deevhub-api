import { Handler } from 'express';
import server from '../server';
import config from '../config';

export const Index: Handler = (req, res) => {
  res.status(200).send('Hello World');
};
