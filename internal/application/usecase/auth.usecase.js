'use strict';

const { createUser } = require('../../domain/model/user.model');
const { hashPassword, comparePasswords, signToken } = require('../../domain/service/auth.service');
const { toPublicUser } = require('../dto/user.dto');

class AuthUseCase {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async register({ name, email, password, role }) {
    const alreadyExists = await this.userRepo.exists(email);
    if (alreadyExists) {
      const err = new Error('An account with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await hashPassword(password);
    const user = createUser({ name, email, passwordHash, role });
    await this.userRepo.save(user);

    const token = signToken({ userId: user.id, role: user.role });
    return { user: toPublicUser(user), token };
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const passwordMatch = await comparePasswords(password, user.passwordHash);
    if (!passwordMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = signToken({ userId: user.id, role: user.role });
    return { user: toPublicUser(user), token };
  }
}

module.exports = AuthUseCase;
