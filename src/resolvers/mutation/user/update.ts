import { User } from '../../../models/User';
import { app } from '../../../server';

const update = async (obj, args, context) => {
  if (!context.user)
    return {
      code: 403,
      success: false,
      message: 'کاربر به منابع درخواستی دسترسی ندارد یا معتبر نمی‌باشد',
    };

  let user = context.user as User;

  const UserRepository = app.db.getRepository(User);

  let result = await UserRepository.update(user.id, args.input);
  if (result.affected < 1) {
    return {
      code: 402,
      success: false,
      message:
        'بروزرسانی کاربر با خطا رو به رو شد. لطفا موارد ورودی را بررسی کنید.',
    };
  }

  return {
    code: 200,
    success: true,
    message: 'اطلاعات با موفقیت بروزرسانی شد',
    user: await UserRepository.findOne(user.id),
  };
};

export default update;
