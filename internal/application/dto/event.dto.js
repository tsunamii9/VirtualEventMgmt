'use strict';

function toPublicEvent(event) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    createdBy: event.createdBy,
    participantCount: event.participants.length,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

module.exports = { toPublicEvent };
