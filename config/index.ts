import * as dotenv from 'dotenv';

dotenv.config();

export type Config = {
  production: boolean;
  postgres_db: string;
  postgres_username: string;
  postgres_password: string;
  postgres_host: string;
  postgres_port: number;
  port: number;
};

const baseConfig = process.env.PRODUCTION
  ? require('./prod.json')
  : require('./dev.json');

const config: Config = Object.keys(baseConfig).reduce((tmp, key) => {
  tmp[key] = baseConfig[key];
  if (process.env[key.toUpperCase()]) {
    tmp[key] = process.env[key.toUpperCase()];
  }
  return tmp;
}, {}) as Config;

export default config;
