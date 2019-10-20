import Dataval from 'dataval';
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
      email: args.email,
      password: args.password,
    },
  });

  if (!user) {
    return {
      code: 403,
      success: false,
      message: 'ایمیل یا رمز‌عبور نادرست می‌باشد',
    };
  }

  // Generate the JWT Token
  let token =
    'Bearer ' +
    jwt.sign({ email: user.email, phone: user.phone } as Token, privateKEY, {
      algorithm: 'RS256',
    });

  let result = { token, ...user };

  return {
    code: 200,
    success: true,
    message: 'User logged in',
    user: result,
  };
};

export default login;
