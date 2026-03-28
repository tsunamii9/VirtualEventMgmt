'use strict';

const express = require('express');
const config = require('../../internal/config/config');

const requestLogger = require('../../internal/delivery/http/middleware/logger.middleware');

const UserMemoryRepository = require('../../internal/infrastructure/memory/user.memory.repository');
const EventMemoryRepository = require('../../internal/infrastructure/memory/event.memory.repository');

const AuthUseCase = require('../../internal/application/usecase/auth.usecase');
const EventUseCase = require('../../internal/application/usecase/event.usecase');

const AuthHandler = require('../../internal/delivery/http/handler/auth.handler');
const EventHandler = require('../../internal/delivery/http/handler/event.handler');

const authRoutes = require('../../internal/delivery/http/routes/auth.routes');
const eventRoutes = require('../../internal/delivery/http/routes/event.routes');

function buildApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Dependency wiring
  const userRepo = new UserMemoryRepository();
  const eventRepo = new EventMemoryRepository();

  const authUseCase = new AuthUseCase(userRepo);
  const eventUseCase = new EventUseCase(eventRepo, userRepo);

  const authHandler = new AuthHandler(authUseCase);
  const eventHandler = new EventHandler(eventUseCase);

  // Routes
  app.use('/', authRoutes(authHandler));
  app.use('/events', eventRoutes(eventHandler));

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // Central error handler
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = status < 500 ? err.message : 'An unexpected error occurred';
    if (status >= 500) {
      console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
    }
    res.status(status).json({ message });
  });

  return app;
}

if (require.main === module) {
  const app = buildApp();
  app.listen(config.port, () => {
    console.log(`[Server] Running on port ${config.port} (${config.env})`);
  });
}

module.exports = buildApp;
