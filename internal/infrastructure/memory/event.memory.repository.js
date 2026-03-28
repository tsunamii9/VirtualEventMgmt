'use strict';

const EventRepository = require('../../domain/repository/event.repository');

class EventMemoryRepository extends EventRepository {
  constructor() {
    super();
    this._store = new Map();
  }

  async findAll() {
    return Array.from(this._store.values());
  }

  async findById(id) {
    return this._store.get(id) || null;
  }

  async save(event) {
    this._store.set(event.id, event);
    return event;
  }

  async update(id, updates) {
    const existing = this._store.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this._store.set(id, updated);
    return updated;
  }

  async delete(id) {
    return this._store.delete(id);
  }
}

module.exports = EventMemoryRepository;
