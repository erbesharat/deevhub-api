import fs from 'fs';
import jwt from 'jsonwebtoken';

import { app } from '../../../../server';
import { User } from '../../../../models/User';
import config from '../../../../config';
import { Token } from '../../../../types/token';
import { OTP } from '../../../../models/OTP';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

// Verify mutation resolver
const forgot = async (obj, args, context) => {
  let UserRepository = app.db.getRepository(User);
  let OTPRepository = app.db.getRepository(OTP);

  let user = context.user as User;

  let token = await OTPRepository.findOne({
    where: { user: user, token: args.code },
  });

  if (!token) {
    return {
      code: 403,
      success: false,
      message: 'کد تاییدیه اشتباه است یا ساخته نشده است',
    };
  }

  if (token.expirationDate < new Date() || !token.active) {
    return {
      code: 403,
      success: false,
      message: 'کد قبلا استفاده یا منقضی شده است',
    };
  }

  // Deactivate the used OTP token
  token.active = false;
  token = await OTPRepository.save(token);

  user.password = args.password;

  user = await UserRepository.save(user);

  // Generate the JWT Token
  let jwtToken =
    'Bearer ' +
    jwt.sign({ email: user.email, phone: user.phone } as Token, privateKEY, {
      algorithm: 'RS256',
    });

  let result = { token: jwtToken, ...user };

  return {
    code: 200,
    success: true,
    message: 'Password got updated!',
    user: result,
  };
};

export default forgot;
