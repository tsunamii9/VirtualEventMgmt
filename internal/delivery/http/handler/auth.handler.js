'use strict';

const { registerSchema, loginSchema, validate } = require('../../../domain/service/validation.service');

class AuthHandler {
  constructor(authUseCase) {
    this.authUseCase = authUseCase;
  }

  register = async (req, res, next) => {
    const { errors, value } = validate(registerSchema, req.body);
    if (errors) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    try {
      const result = await this.authUseCase.register(value);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    const { errors, value } = validate(loginSchema, req.body);
    if (errors) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    try {
      const result = await this.authUseCase.login(value);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AuthHandler;
