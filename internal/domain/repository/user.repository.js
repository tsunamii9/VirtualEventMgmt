'use strict';

// Interface-like contract for user repository implementations.
// Each method documents what the concrete implementation must fulfill.

class UserRepository {
  async findByEmail(email) { throw new Error('not implemented'); }
  async findById(id) { throw new Error('not implemented'); }
  async save(user) { throw new Error('not implemented'); }
  async exists(email) { throw new Error('not implemented'); }
}

module.exports = UserRepository;
