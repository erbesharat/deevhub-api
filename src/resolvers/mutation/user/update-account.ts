import fs from 'fs';
import jwt from 'jsonwebtoken';

import { User } from '../../../models/User';
import { OTP } from '../../../models/OTP';
import { app } from '../../../server';
import { Token } from '../../../types/token';
import config from '../../../config';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

const updateAccount = async (obj, args, context) => {
  const UserRepository = app.db.getRepository(User);
  const OTPRepository = app.db.getRepository(OTP);
  if (!context.user)
    return {
      code: 403,
      success: false,
      message: 'کاربر به منابع درخواستی دسترسی ندارد یا معتبر نمی‌باشد',
    };

  let user = context.user as User;

  let token = await OTPRepository.findOne({
    where: { user: user, token: args.code },
  });

  if (!token) {
    return {
      code: 403,
      success: false,
      message: 'کد ورود اشتباه است یا کاربر ساخته نشده است',
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

  if ((await UserRepository.update(user.id, args.input)).affected === 0) {
    return {
      code: '402',
      message: 'اطلاعات ورودی برای بروزرسانی حساب کاربری معتبر نمی‌باشند',
      success: false,
    };
  }

  user = await UserRepository.findOne(user.id);

  // Generate the JWT Token
  let jwtToken =
    'Bearer ' +
    jwt.sign({ email: user.email, phone: user.phone } as Token, privateKEY, {
      algorithm: 'RS256',
    });

  return {
    code: 200,
    success: true,
    message: 'User account updated',
    user: { token: jwtToken, ...user },
  };
};

export default updateAccount;
