import fs from 'fs';
import jwt from 'jsonwebtoken';

import { User } from '../../../models/User';
import { app } from '../../../server';
import { Token } from '../../../types/token';
import config from '../../../config';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

const updateAccount = async (obj, args, context) => {};

export default updateAccount;
