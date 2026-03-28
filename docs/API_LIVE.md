## API Usage Examples

### Base URL

```
https://virtualeventmgmt.onrender.com
```

---

## 1. Register User

```bash
curl --location 'https://virtualeventmgmt.onrender.com/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "Suman",
  "email": "suman.kumar@gmail.com",
  "password": "password123",
  "role": "organizer"
}'
```

---

## 2. Login User

```bash
curl --location 'https://virtualeventmgmt.onrender.com/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "suman.kumar@gmail.com",
  "password": "password123"
}'
```

> Save the `token` from response for authenticated APIs

---

## 3. Get All Events

```bash
curl --location 'https://virtualeventmgmt.onrender.com/events'
```

---

## 4. Create Event (Organizer Only)

```bash
curl --location 'https://virtualeventmgmt.onrender.com/events' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_TOKEN>' \
--data-raw '{
  "title": "Tech Meetup 2026",
  "description": "Backend architecture discussion",
  "date": "2026-04-10",
  "time": "18:00"
}'
```

---

## 5. Update Event

```bash
curl --location --request PUT 'https://virtualeventmgmt.onrender.com/events/<EVENT_ID>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_TOKEN>' \
--data-raw '{
  "title": "Updated Tech Meetup",
  "description": "Updated description",
  "date": "2026-04-11",
  "time": "19:00"
}'
```

---

## 6. Delete Event

```bash
curl --location --request DELETE 'https://virtualeventmgmt.onrender.com/events/<EVENT_ID>' \
--header 'Authorization: Bearer <YOUR_TOKEN>'
```

---

## 7. Register for Event (Attendee)

```bash
curl --location 'https://virtualeventmgmt.onrender.com/events/<EVENT_ID>/register' \
--header 'Authorization: Bearer <YOUR_TOKEN>'
```

---

## Notes

* Replace `<YOUR_TOKEN>` with JWT received from login
* Replace `<EVENT_ID>` with actual event ID
* Organizer role is required for creating/updating/deleting events
* Attendees can only register for events

---
