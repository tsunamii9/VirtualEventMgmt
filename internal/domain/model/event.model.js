'use strict';

const { v4: uuidv4 } = require('uuid');

function createEvent({ title, description, date, time, createdBy }) {
  return {
    id: uuidv4(),
    title,
    description,
    date,
    time,
    createdBy,
    participants: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

module.exports = { createEvent };
