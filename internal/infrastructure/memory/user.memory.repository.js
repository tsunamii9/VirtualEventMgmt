'use strict';

const UserRepository = require('../../domain/repository/user.repository');

class UserMemoryRepository extends UserRepository {
  constructor() {
    super();
    this._store = new Map();
  }

  async findByEmail(email) {
    for (const user of this._store.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findById(id) {
    return this._store.get(id) || null;
  }

  async save(user) {
    this._store.set(user.id, user);
    return user;
  }

  async exists(email) {
    for (const user of this._store.values()) {
      if (user.email === email) return true;
    }
    return false;
  }
}

module.exports = UserMemoryRepository;
