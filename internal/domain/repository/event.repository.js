'use strict';

// Interface-like contract for event repository implementations.

class EventRepository {
  async findAll() { throw new Error('not implemented'); }
  async findById(id) { throw new Error('not implemented'); }
  async save(event) { throw new Error('not implemented'); }
  async update(id, updates) { throw new Error('not implemented'); }
  async delete(id) { throw new Error('not implemented'); }
}

module.exports = EventRepository;
