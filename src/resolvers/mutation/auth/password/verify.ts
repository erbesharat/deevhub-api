import fs from 'fs';
import jwt from 'jsonwebtoken';

import { app } from '../../../../server';
import { User } from '../../../../models/User';
import config from '../../../../config';
import { Token } from '../../../../types/token';

const privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

// Verify mutation resolver
const forgot = async (obj, args, context) => {};

export default forgot;
