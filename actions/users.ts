import { Handler } from 'express';

import server from '../server';
import { User } from '../models/user';
import { Response } from '../tools/http';

export const Index: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);
  let users = await UserRepository.find({ relations: ['role'] });
  res.status(200).json({ data: users } as Response);
};

export const Show: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);

  let user = await UserRepository.findOne({
    where: { id: req.params.id },
  });

  if (user.id == 0) {
    return res.status(404).json({
      error: {
        meesage: "User doesn't exist",
      },
    });
  }

  res.status(200).json({ data: user } as Response);
};
