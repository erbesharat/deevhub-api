import { User } from '../../../models/User';
import { OTP } from '../../../models/OTP';
import { app } from '../../../server';

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

  return {
    code: '201',
    message: 'OTP code sent to user for update account confirmation',
    success: true,
    user,
  };
};

export default updateAccount;
