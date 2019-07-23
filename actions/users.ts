import { Handler } from 'express';

import server from '../server';
import { User } from '../models/user';
import { Response } from '../tools/http';

export const Index: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);
  let users = await UserRepository.find({ relations: ['role'],  });
  res.status(200).json({ data: users } as Response);
};
