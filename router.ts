import { Index as UsersIndex } from './actions/users';

const routes = {
  '/api/v1': {
    '/users': {
      'get /': UsersIndex,
    },
  },
};

export default routes;
