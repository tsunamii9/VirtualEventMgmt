'use strict';

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },
  env: process.env.NODE_ENV || 'development',
};

module.exports = config;
