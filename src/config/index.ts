import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export type Config = {
  production: boolean;
  postgres_db: string;
  postgres_username: string;
  postgres_password: string;
  postgres_host: string;
  postgres_port: number;
  salt_rounds: number;
  jwt_public: string;
  jwt_private: string;
  port: number;
  db: ConnectionOptions;
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

config.db = {
  type: 'postgres',
  host: config.postgres_host || 'localhost',
  port: config.postgres_port || 5432,
  username: config.postgres_username || 'forge',
  password: config.postgres_password || 'forge',
  database: config.postgres_db || 'forge',
  entities: [__dirname + '/../models/*.ts'],
  synchronize: true,
  migrations: [__dirname + '/../migration/*.ts'],
};

export default config;
