import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { app } from '../../../server';
import { User } from '../../../models/User';
import config from '../../../config';
import { Token } from '../../../types/token';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

const register = async (obj, args, context) => {
  let UserRepository = app.db.getRepository(User);

  const { email, password } = args.input;

  // Encrypt the password using salt rounds from config
  let hash = bcrypt.hashSync(password, config.salt_rounds);

  const user = await UserRepository.save(
    UserRepository.create({ email, password: hash }),
  );

  return {
    code: 200,
    success: true,
    message: 'User created',
    user,
  };
};

export default register;
