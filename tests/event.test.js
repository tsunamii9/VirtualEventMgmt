'use strict';

const request = require('supertest');
const buildApp = require('../cmd/api/server');

let app;
let organizerToken;
let attendeeToken;
let createdEventId;

beforeAll(async () => {
  app = buildApp();

  // Register organizer
  const orgRes = await request(app).post('/register').send({
    name: 'Bob Organizer',
    email: 'bob@example.com',
    password: 'password123',
    role: 'organizer',
  });
  organizerToken = orgRes.body.token;

  // Register attendee
  const attRes = await request(app).post('/register').send({
    name: 'Carol Attendee',
    email: 'carol@example.com',
    password: 'password456',
    role: 'attendee',
  });
  attendeeToken = attRes.body.token;
});

describe('Event Management', () => {
  test('GET /events - returns empty list initially', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(res.body.events).toHaveLength(0);
  });

  test('POST /events - organizer can create an event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Node.js Summit 2026',
        description: 'A conference about Node.js and the ecosystem',
        date: '2026-06-15',
        time: '10:00',
      });

    expect(res.status).toBe(201);
    expect(res.body.event).toHaveProperty('id');
    expect(res.body.event.title).toBe('Node.js Summit 2026');
    createdEventId = res.body.event.id;
  });

  test('POST /events - attendee cannot create an event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({
        title: 'Attempt',
        description: 'Should fail',
        date: '2026-07-01',
        time: '09:00',
      });

    expect(res.status).toBe(403);
  });

  test('POST /events - unauthenticated request is rejected', async () => {
    const res = await request(app).post('/events').send({
      title: 'No auth event',
      description: 'Should fail',
      date: '2026-07-01',
      time: '09:00',
    });
    expect(res.status).toBe(401);
  });

  test('POST /events - validates missing fields', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({ title: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  test('PUT /events/:id - organizer can update an event', async () => {
    const res = await request(app)
      .put(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Node.js Summit 2026 - Updated',
        description: 'Updated description',
        date: '2026-06-16',
        time: '11:00',
      });

    expect(res.status).toBe(200);
    expect(res.body.event.title).toBe('Node.js Summit 2026 - Updated');
  });

  test('GET /events - reflects created events', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(res.body.events.length).toBeGreaterThan(0);
  });
});

describe('Event Registration', () => {
  test('POST /events/:id/register - attendee can register for an event', async () => {
    const res = await request(app)
      .post(`/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);

    expect(res.status).toBe(200);
    expect(res.body.event).toHaveProperty('id', createdEventId);
  });

  test('POST /events/:id/register - duplicate registration is rejected', async () => {
    const res = await request(app)
      .post(`/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);

    expect(res.status).toBe(409);
  });

  test('POST /events/:id/register - organizer cannot use attendee-only route', async () => {
    const res = await request(app)
      .post(`/events/${createdEventId}/register`)
      .set('Authorization', `Bearer ${organizerToken}`);

    expect(res.status).toBe(403);
  });

  test('POST /events/:id/register - returns 404 for unknown event', async () => {
    const res = await request(app)
      .post('/events/nonexistent-id/register')
      .set('Authorization', `Bearer ${attendeeToken}`);

    expect(res.status).toBe(404);
  });
});

describe('Event Deletion', () => {
  test('DELETE /events/:id - organizer can delete an event', async () => {
    const createRes = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'To Delete',
        description: 'Will be deleted',
        date: '2026-08-01',
        time: '09:00',
      });
    const eventId = createRes.body.event.id;

    const deleteRes = await request(app)
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`);

    expect(deleteRes.status).toBe(204);
  });

  test('DELETE /events/:id - returns 404 for already deleted event', async () => {
    const res = await request(app)
      .delete(`/events/ghost-id`)
      .set('Authorization', `Bearer ${organizerToken}`);

    expect(res.status).toBe(404);
  });
});
