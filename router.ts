import { Index } from './actions';

const routes = {
  '/v3': {
    '/resorts': {
      'get /:id/bookings': Index,
    },
  },
};

export default routes;
