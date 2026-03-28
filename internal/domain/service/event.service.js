'use strict';

const { ROLES } = require('../model/user.model');

const ORGANIZER_ROLES = new Set([ROLES.ORGANIZER, ROLES.ADMIN]);

function canManageEvents(role) {
  return ORGANIZER_ROLES.has(role);
}

function canRegisterForEvent(role) {
  return role === ROLES.ATTENDEE;
}

module.exports = { canManageEvents, canRegisterForEvent };
