'use strict';

const { eventSchema, validate } = require('../../../domain/service/validation.service');

class EventHandler {
  constructor(eventUseCase) {
    this.eventUseCase = eventUseCase;
  }

  listEvents = async (req, res, next) => {
    try {
      const events = await this.eventUseCase.listEvents();
      return res.status(200).json({ events });
    } catch (err) {
      next(err);
    }
  };

  createEvent = async (req, res, next) => {
    const { errors, value } = validate(eventSchema, req.body);
    if (errors) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    try {
      const event = await this.eventUseCase.createEvent(value, req.user.id);
      return res.status(201).json({ event });
    } catch (err) {
      next(err);
    }
  };

  updateEvent = async (req, res, next) => {
    const { errors, value } = validate(eventSchema, req.body);
    if (errors) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    try {
      const event = await this.eventUseCase.updateEvent(req.params.id, value, req.user.id);
      return res.status(200).json({ event });
    } catch (err) {
      next(err);
    }
  };

  deleteEvent = async (req, res, next) => {
    try {
      await this.eventUseCase.deleteEvent(req.params.id, req.user.id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  registerForEvent = async (req, res, next) => {
    try {
      const event = await this.eventUseCase.registerForEvent(req.params.id, req.user.id);
      return res.status(200).json({ event });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = EventHandler;
