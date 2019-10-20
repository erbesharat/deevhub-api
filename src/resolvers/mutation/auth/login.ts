import fs from 'fs';
import jwt from 'jsonwebtoken';

import { app } from '../../../server';
import { User } from '../../../models/User';
import config from '../../../config';
import { Token } from '../../../types/token';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

const login = async (obj, args, context) => {
  let UserRepository = app.db.getRepository(User);

  let user = await UserRepository.findOne({
    where: {
      email: args.input.email,
      password: args.input.password,
    },
  });

  if (!user) {
    return {
      code: 403,
      success: false,
      message: 'Email or Password is incorrect',
    };
  }

  // Generate the JWT Token
  let token =
    'Bearer ' +
    jwt.sign(
      { email: user.email, createdAt: new Date() } as Token,
      privateKEY,
      {
        algorithm: 'RS256',
      },
    );

  let result = { token, ...user };

  return {
    code: 200,
    success: true,
    message: 'User logged in',
    user: result,
  };
};

export default login;
