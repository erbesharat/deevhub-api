import { Handler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';

import server from '../server';
import { User } from '../models/user';
import { Response } from '../tools/http';
import config from '../config';

let privateKEY = fs.readFileSync(config.jwt_private, 'utf8');

export const Register: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);

  // Encrypt the password using salt rounds from config
  let hash = bcrypt.hashSync(req.body.password, config.salt_rounds);

  // Create the user with an empty email or phone
  await UserRepository.save({
    email: req.body.email || '',
    password: hash,
    phone: req.body.phone || '',
    phoneVerified: false,
  });

  // Fetch back the user
  let user = await UserRepository.findOne({
    where: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  // Generate the JWT Token
  let token = jwt.sign({ email: user.email, phone: user.phone }, privateKEY, {
    algorithm: 'RS256',
  });

  // Delete password field from results
  delete user.password;

  // TODO: Send verification email or sms

  return res
    .status(201)
    .header('Authorization', 'Bearer ' + token)
    .json({ data: user } as Response);
};

export const Login: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);

  // Find the user with the given email or phone
  let user = await UserRepository.findOne({
    where: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  console.log(user);

  // Return 404 error if user is not in the database
  if (!user) {
    return res
      .status(404)
      .json({ error: { message: "Couldn't find the user" } });
  }

  // Authenticate user's password
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res
      .status(403)
      .json({ error: { message: "Password doesn't match" } });
  }

  // Send error if user is not verified
  if (!user.emailVerified || !user.phoneVerified) {
    return res.status(403).json({ error: { message: "User isn't verified" } });
  }

  // Generate the JWT Token
  let token = jwt.sign({ email: user.email, phone: user.phone }, privateKEY, {
    algorithm: 'RS256',
  });

  // Delete password field from results
  delete user.password;

  return res
    .status(200)
    .header('Authorization', 'Bearer ' + token)
    .json({ data: user } as Response);
};
