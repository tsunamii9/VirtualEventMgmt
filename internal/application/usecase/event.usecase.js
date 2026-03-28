'use strict';

const { createEvent } = require('../../domain/model/event.model');
const { toPublicEvent } = require('../dto/event.dto');
const { sendEventConfirmation } = require('../../domain/service/email.mock');

class EventUseCase {
  constructor(eventRepo, userRepo) {
    this.eventRepo = eventRepo;
    this.userRepo = userRepo;
  }

  async listEvents() {
    const events = await this.eventRepo.findAll();
    return events.map(toPublicEvent);
  }

  async createEvent({ title, description, date, time }, userId) {
    const event = createEvent({ title, description, date, time, createdBy: userId });
    await this.eventRepo.save(event);
    return toPublicEvent(event);
  }

  async updateEvent(id, updates, userId) {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }

    const allowed = ['title', 'description', 'date', 'time'];
    const safeUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) safeUpdates[key] = updates[key];
    }

    const updated = await this.eventRepo.update(id, safeUpdates);
    return toPublicEvent(updated);
  }

  async deleteEvent(id, userId) {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }
    await this.eventRepo.delete(id);
  }

  async registerForEvent(eventId, userId) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) {
      const err = new Error('Event not found');
      err.statusCode = 404;
      throw err;
    }

    if (event.participants.includes(userId)) {
      const err = new Error('You are already registered for this event');
      err.statusCode = 409;
      throw err;
    }

    const updated = await this.eventRepo.update(eventId, {
      participants: [...event.participants, userId],
    });

    const user = await this.userRepo.findById(userId);
    if (user) {
      await sendEventConfirmation(user, updated);
    }

    return toPublicEvent(updated);
  }
}

module.exports = EventUseCase;
