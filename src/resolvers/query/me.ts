import { User } from '../../models/User';
import { ForbiddenError } from 'apollo-server-express';

const me = (obj, args, context) => {
  if (!context.user) {
    return {
      code: 403,
      success: false,
      message: 'لطفا وارد حساب کاربری خود شوید',
    };
  }
  return {
    code: 200,
    success: true,
    message: "Holy moly! You're the user!",
    user: context.user as User,
  };
};

export default me;
