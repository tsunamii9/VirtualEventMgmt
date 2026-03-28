'use strict';

const request = require('supertest');
const buildApp = require('../cmd/api/server');

let app;

beforeAll(() => {
  app = buildApp();
});

describe('Auth Flow', () => {
  const user = {
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'secret123',
    role: 'attendee',
  };

  test('POST /register - creates a new user', async () => {
    const res = await request(app).post('/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  test('POST /register - rejects duplicate email', async () => {
    const res = await request(app).post('/register').send(user);
    expect(res.status).toBe(409);
  });

  test('POST /register - validates missing fields', async () => {
    const res = await request(app).post('/register').send({ email: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('POST /login - returns token for valid credentials', async () => {
    const res = await request(app).post('/login').send({
      email: user.email,
      password: user.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /login - rejects wrong password', async () => {
    const res = await request(app).post('/login').send({
      email: user.email,
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  test('POST /login - rejects unknown email', async () => {
    const res = await request(app).post('/login').send({
      email: 'nobody@example.com',
      password: 'anything',
    });
    expect(res.status).toBe(401);
  });
});
