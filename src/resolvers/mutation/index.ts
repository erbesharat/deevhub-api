import auth from './auth';
import user from './user';

const Mutation = {
  ...auth,
  ...user,
};

export default Mutation;
