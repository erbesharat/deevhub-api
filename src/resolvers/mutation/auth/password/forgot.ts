import Dataval from 'dataval';
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

  const token = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  // Set expiry date for 1 hour for the token
  let expire = new Date();
  expire.setHours(new Date().getHours() + 1);

  let otp = await OTPRepository.save(
    OTPRepository.create({
      token,
      expirationDate: expire,
      user: user,
    }),
  );

  // Send OTP SMS
  app.sms.Send({
    message: `کد تایید تغییر رمزعبور بنچ‌شیر شما: ${otp.token}`,
    sender: '1000596446',
    receptor: user.phone,
  });

  user = await UserRepository.save(user);

  return {
    code: '201',
    message: 'OTP code sent to user for forgot password confirmation',
    success: true,
    user,
  };
};

export default forgot;
