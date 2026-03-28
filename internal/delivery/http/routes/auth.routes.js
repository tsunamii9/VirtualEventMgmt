'use strict';

const { Router } = require('express');

function authRoutes(authHandler) {
  const router = Router();

  router.post('/register', authHandler.register);
  router.post('/login', authHandler.login);

  return router;
}

module.exports = authRoutes;
