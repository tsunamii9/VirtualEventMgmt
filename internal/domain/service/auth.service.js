'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, config.bcrypt.saltRounds);
}

async function comparePasswords(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

function signToken(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

module.exports = { hashPassword, comparePasswords, signToken, verifyToken };
