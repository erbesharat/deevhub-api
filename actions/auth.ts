import { Handler } from 'express';
import bcrypt from 'bcrypt';

import server from '../server';
import { User } from '../models/user';
import { Response } from '../tools/http';
import config from '../config';

export const Register: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);

  // Encrypt the password using salt rounds from config
  let hash = bcrypt.hashSync(req.body.password, config.salt_rounds);

  // Create the user with an empty email or phone
  let user = await UserRepository.create({
    email: req.body.email || '',
    password: hash,
    phone: req.body.phone || '',
    phoneVerified: false,
  });

  // TODO: Send verification email or sms

  return res.status(201).json({ data: user } as Response);
};

export const Login: Handler = async (req, res) => {
  let UserRepository = server.orm.getRepository(User);

  // Find the user with the given email or phone
  let user = await UserRepository.findOne({
    where: [{ email: req.body.email }, { phone: req.body.phone }],
  });

  // Return 404 error if user is not in the database
  if (user.id == 0) {
    return res
      .status(404)
      .json({ error: { message: "Couldn't find the user" } });
  }

  // Send error if user is not verified
  if (!user.emailVerified || !user.phoneVerified) {
    return res.status(403).json({ error: { message: "User isn't verified" } });
  }

  return res.status(200).json({ data: user } as Response);
};
