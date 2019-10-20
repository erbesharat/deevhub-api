import { bootstrap } from './server';
import config from './config';

bootstrap()
  .then(app => {
    app.server.listen(config.port, () => {
      console.log(`🤘 API is running on ${config.port}! 🤘`);
    });
  })
  .catch(err => console.error('Error occurred:\n', err));
