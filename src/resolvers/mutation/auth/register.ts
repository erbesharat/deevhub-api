import Dataval from 'dataval';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import { app } from '../../../server';
import { User } from '../../../models/User';
import config from '../../../config';
import { Token } from '../../../types/token';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

// Request validator
const dataval = Dataval({
  rules: {
    phone: 'isString|required',
    email: 'isString|required',
    password: 'isString|required',
    name: 'isString|required',
  },
});
// Verify mutation resolver
const register = async (obj, args, context) => {
  // Validate the request
  // TODO: Return error if not valid
  const isvalid = await dataval.validate(args);
  if (isvalid.valid) {
    let UserRepository = app.db.getRepository(User);

    let user = context.user as User;

    const { email, password, name } = args;
    user = { ...user, email, password, name, active: true };

    await UserRepository.save(user);

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
      message: 'User created and verified',
      user: result,
    };
  }
};

export default register;
