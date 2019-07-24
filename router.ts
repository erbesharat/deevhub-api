import { Index as UsersIndex } from './actions/users';
import { Register, Login } from './actions/auth';

const routes = {
  '/api/v1': {
    '/users': {
      'get /': UsersIndex,
    },
    '/auth': {
      'post /register': Register,
      'post /login': Login,
    },
  },
};

export default routes;
