'use strict';

const { Router } = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');
const { ROLES } = require('../../../domain/model/user.model');

const ORGANIZER_ROLES = [ROLES.ORGANIZER, ROLES.ADMIN];

function eventRoutes(eventHandler) {
  const router = Router();

  router.get('/', eventHandler.listEvents);

  router.post(
    '/',
    authMiddleware,
    requireRole(...ORGANIZER_ROLES),
    eventHandler.createEvent
  );

  router.put(
    '/:id',
    authMiddleware,
    requireRole(...ORGANIZER_ROLES),
    eventHandler.updateEvent
  );

  router.delete(
    '/:id',
    authMiddleware,
    requireRole(...ORGANIZER_ROLES),
    eventHandler.deleteEvent
  );

  router.post(
    '/:id/register',
    authMiddleware,
    requireRole(ROLES.ATTENDEE),
    eventHandler.registerForEvent
  );

  return router;
}

module.exports = eventRoutes;
