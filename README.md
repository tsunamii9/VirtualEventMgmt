# Virtual Event Management

A Node.js backend for managing virtual events, built with Express.js following clean architecture.

---

## Setup

```bash
npm install
npm start        # starts server on port 3000
npm run dev      # starts with nodemon (hot reload)
npm run test     # runs all jest tests
```

**Environment variables (optional):**

| Variable             | Default                     | Description               |
|----------------------|-----------------------------|---------------------------|
| PORT                 | 3000                        | HTTP port                 |
| JWT_SECRET           | dev-secret-change-in-prod   | JWT signing secret        |
| JWT_EXPIRES_IN       | 24h                         | Token expiry              |
| BCRYPT_SALT_ROUNDS   | 10                          | bcrypt cost factor        |
| NODE_ENV             | development                 | Environment               |

---

## API Endpoints

### Auth

| Method | Path      | Auth | Description               |
|--------|-----------|------|---------------------------|
| POST   | /register | No   | Create a new account      |
| POST   | /login    | No   | Login and receive a token |

### Events

| Method | Path                 | Auth | Role            | Description               |
|--------|----------------------|------|-----------------|---------------------------|
| GET    | /events              | No   | any             | List all events           |
| POST   | /events              | Yes  | organizer/admin | Create an event           |
| PUT    | /events/:id          | Yes  | organizer/admin | Update an event           |
| DELETE | /events/:id          | Yes  | organizer/admin | Delete an event           |
| POST   | /events/:id/register | Yes  | attendee        | Register for an event     |

---

## Example Requests

**Register as organizer:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Suman","email":"suman.kumar@gmail.com","password":"password@123","role":"organizer"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suman.kumar@gmail.com","password":"password@123"}'
```

**Create an event (organizer token required):**
```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Airtribe Hackathon","description":"An event for the Airtribe Hackathon","date":"2026-03-27","time":"10:00"}'
```

**Register as attendee (required to register for events):**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sam","email":"sam@gmail.com","password":"sam@123","role":"attendee"}'
```

**Register for an event (attendee token required):**
```bash
curl -X POST http://localhost:3000/events/EVENT_ID/register \
  -H "Authorization: Bearer ATTENDEE_TOKEN"
```

> Note: Only users with `role: "attendee"` can call this endpoint. Organizer and admin tokens will be rejected with 403.

---
## API Testing
- Import the Postman collection from:
- docs/postman_collection.json
---

## How to Run Tests

```bash
npm run test
```

Tests in `tests/` cover:
- Full auth flow (register, login, validation, duplicates)
- Event CRUD (create, update, delete, list)
- RBAC enforcement (organizer vs attendee vs unauthenticated)
- Event registration (duplicates and 404 cases)

---

## Assumptions

- Data is in-memory and resets on server restart (no database).
- Email sending is simulated via console log: `[Email] Sent to <email> for event <title>`.
- Admin role is supported — pass `"role": "admin"` during registration.
- Attendees can only register for events and cannot create, update, or delete them.
- Organizers cannot register as event attendees (strict role separation).
