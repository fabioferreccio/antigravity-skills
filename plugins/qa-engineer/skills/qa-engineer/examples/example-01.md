# Example 01 — REST API Edge Case Analysis & Test Generation

## Scenario

A Node.js/Express REST API for user registration has been shipped with only happy-path tests. The team requests a full edge case analysis and test generation before enabling the endpoint for public traffic.

---

## Trigger Phrase

```
@qa-engineer what edge cases am I missing for this user registration endpoint?
```

---

## Context Provided

**src/routes/register.js**
```js
app.post('/register', async (req, res) => {
  const { username, email, password, age } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existing = await db.users.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const user = await db.users.create({ username, email, password, age });
  res.status(201).json({ id: user.id });
});
```

**Existing test:**
```js
it('registers a valid user', async () => {
  const res = await request(app).post('/register').send({
    username: 'alice',
    email: 'alice@example.com',
    password: 'Secret123',
    age: 30,
  });
  expect(res.status).toBe(201);
});
```

---

## Expected Agent Output

---
## Scenario: Missing Required Fields — Partial Presence

| Field             | Value                                                      |
|-------------------|------------------------------------------------------------|
| Component         | `POST /register` — input validation                        |
| Risk Level        | HIGH                                                       |
| Risk Description  | Only checks for all-missing; partial missing fields bypass validation |
| Test Strategy     | Unit                                                       |
| Framework         | Jest / Supertest                                           |

### Edge Cases
- `username` present, `email` missing
- `password` present, `username` missing
- All fields present but `password` is an empty string `""`
- `email` is `null` explicitly vs `undefined`

### Test Code
```js
describe('POST /register — partial missing fields', () => {
  it('returns 400 when email is missing', async () => {
    const res = await request(app).post('/register').send({
      username: 'alice',
      password: 'Secret123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/missing/i);
  });

  it('returns 400 when password is an empty string', async () => {
    const res = await request(app).post('/register').send({
      username: 'alice',
      email: 'alice@example.com',
      password: '',
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is explicitly null', async () => {
    const res = await request(app).post('/register').send({
      username: 'alice',
      email: null,
      password: 'Secret123',
    });
    expect(res.status).toBe(400);
  });
});
```

### Expected Result
Each test must return HTTP 400. Failing means the validation guard is bypassable.

### Acceptance Criteria
- [ ] Every field combination with at least one missing/empty/null returns 400
- [ ] Error message is consistent and non-leaking

---

---
## Scenario: Email Format Boundary Values

| Field             | Value                                              |
|-------------------|----------------------------------------------------|
| Component         | `POST /register` — email validation                |
| Risk Level        | MEDIUM                                             |
| Risk Description  | No email format validation; malformed emails stored in DB |
| Test Strategy     | Unit                                               |
| Framework         | Jest / Supertest                                   |

### Edge Cases
- `" "` (whitespace-only)
- `"not-an-email"`
- `"user@"` (incomplete domain)
- `"user@.com"` (leading dot in domain)
- `"a".repeat(320) + "@example.com"` (max RFC 5321 length exceeded)
- `"user+tag@example.com"` (valid — must pass)
- Unicode email: `"用户@例子.广告"`

### Test Code
```js
describe('POST /register — email validation', () => {
  const INVALID_EMAILS = [
    '   ',
    'not-an-email',
    'user@',
    'user@.com',
    'a'.repeat(320) + '@example.com',
  ];

  INVALID_EMAILS.forEach((email) => {
    it(`returns 400 for invalid email: "${email.slice(0, 30)}"`, async () => {
      const res = await request(app).post('/register').send({
        username: 'alice',
        email,
        password: 'Secret123',
      });
      expect(res.status).toBe(400);
    });
  });

  it('accepts valid email with plus-tag', async () => {
    const res = await request(app).post('/register').send({
      username: 'alice',
      email: 'user+tag@example.com',
      password: 'Secret123',
    });
    expect(res.status).toBe(201);
  });
});
```

### Expected Result
Invalid emails rejected at validation layer; valid variants accepted.

### Acceptance Criteria
- [ ] All invalid email formats return 400
- [ ] `user+tag@example.com` and similar valid formats are accepted
- [ ] No database write occurs for invalid emails

---

---
## Scenario: Concurrent Duplicate Registration (Race Condition)

| Field             | Value                                                            |
|-------------------|------------------------------------------------------------------|
| Component         | `POST /register` — duplicate email check                         |
| Risk Level        | CRITICAL                                                         |
| Risk Description  | Two simultaneous requests with the same email can both pass the `findOne` check before either creates the record — resulting in duplicate users |
| Test Strategy     | Integration                                                      |
| Framework         | Jest + Supertest (parallel requests)                             |

### Edge Cases
- Two identical registrations fired simultaneously (Promise.all)
- Three concurrent requests for the same email
- Race between a registration and a deletion of the same email

### Test Code
```js
describe('POST /register — concurrent duplicate registration', () => {
  it('creates only one user when two requests race', async () => {
    const payload = {
      username: 'alice',
      email: `race-${Date.now()}@example.com`,
      password: 'Secret123',
    };

    const [res1, res2] = await Promise.all([
      request(app).post('/register').send(payload),
      request(app).post('/register').send(payload),
    ]);

    const statuses = [res1.status, res2.status].sort();
    // One must succeed (201), the other must fail (409)
    expect(statuses).toEqual([201, 409]);

    // Verify only one DB record exists
    const users = await db.users.findAll({ where: { email: payload.email } });
    expect(users).toHaveLength(1);
  });
});
```

### Expected Result
Exactly one user is created. One request succeeds with 201, the other returns 409. **If both return 201, a race condition is confirmed.**

### Acceptance Criteria
- [ ] Database has a unique constraint on `email`
- [ ] At most one 201 response per email in concurrent scenarios
- [ ] No orphaned or duplicate records under load

---

## Coverage Summary

| Layer        | Before | After | Gap Closed          |
|--------------|--------|-------|---------------------|
| Unit         | 10%    | 85%   | Validation, formats |
| Integration  | 0%     | 60%   | Race conditions, DB |
| E2E          | 0%     | 0%    | Pending             |
| Performance  | 0%     | 0%    | Pending             |

**Confidence Level**: 🟡 YELLOW — unit/integration improved; E2E and load testing remain open.
**Next Action**: Add a unique DB constraint on `email` column, then run concurrent test to confirm race condition is closed.
