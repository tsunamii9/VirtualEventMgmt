'use strict';

const { v4: uuidv4 } = require('uuid');

const ROLES = {
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
  ADMIN: 'admin',
};

function createUser({ name, email, passwordHash, role }) {
  return {
    id: uuidv4(),
    name,
    email,
    passwordHash,
    role: role || ROLES.ATTENDEE,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { createUser, ROLES };
