# Edge Case Taxonomy

A canonical classification of edge cases to ensure complete risk coverage.

---

## 1. Boundary Values

| Category          | Examples                                                  |
|-------------------|-----------------------------------------------------------|
| Numeric bounds    | `0`, `-1`, `1`, `MAX_SAFE_INTEGER`, `-MAX_SAFE_INTEGER`  |
| String bounds     | `""`, `" "`, single char, max-length string, 1 over max   |
| Date/time bounds  | Unix epoch `0`, `Date.MAX`, leap day, DST transition      |
| Collection bounds | Empty array `[]`, single element, max-size collection     |
| Precision         | `0.1 + 0.2`, float overflow, integer division truncation  |

---

## 2. Null & Undefined

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| Explicit null     | `{ field: null }`                                         |
| Undefined         | `{ }` — field absent entirely                             |
| Empty string      | `{ field: "" }`                                           |
| Whitespace only   | `{ field: "   " }`                                        |
| Zero as falsy     | `{ count: 0 }` — must not be treated as missing           |

---

## 3. Type Coercion

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| String as number  | `{ age: "30" }` — should it coerce or reject?             |
| Number as boolean | `{ active: 1 }` — truthy, but is it valid?                |
| Array as object   | Sending `[]` where `{}` is expected                       |
| Object as string  | `{ name: { first: "Alice" } }` where string expected      |

---

## 4. Concurrency & Race Conditions

| Pattern           | Example                                                   |
|-------------------|-----------------------------------------------------------|
| Check-then-act    | Read stock → check > 0 → decrement (non-atomic)           |
| TOCTOU            | Validate file exists → delete → use (Time-of-Check-Time-of-Use) |
| Double submission | Two identical requests fired simultaneously               |
| Optimistic lock   | Read version 1 → update → conflict with concurrent update |
| Stale read        | Cached value read after DB update                         |

---

## 5. External Dependency Failures

| Failure Mode      | Example                                                   |
|-------------------|-----------------------------------------------------------|
| Network timeout   | API takes > configured timeout                            |
| HTTP 429          | Rate limit exceeded — should retry with backoff           |
| HTTP 503          | Dependency unavailable — should circuit break             |
| Partial response  | JSON truncated mid-stream                                 |
| Malformed response| API returns HTML error page instead of JSON               |
| DNS failure       | Cannot resolve host                                       |
| Certificate error | Expired TLS cert on dependency                            |

---

## 6. Security Edge Cases

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| SQL injection     | `'; DROP TABLE users; --`                                 |
| XSS payload       | `<script>alert(1)</script>` in any user input             |
| Path traversal    | `../../etc/passwd` in file path input                     |
| Oversized payload | 100MB JSON body                                           |
| Unicode injection | Right-to-left override character, null byte `\u0000`      |

---

## 7. State Machine Violations

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| Invalid transition| Cancel an already-shipped order                           |
| Replay attack     | Re-submitting a completed payment                         |
| Concurrent state  | Two transitions of same entity in parallel                |
| Orphaned state    | Record stuck in "PROCESSING" after crash                  |

---

## 8. Character Set & Encoding

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| Unicode input     | `用户名`, emoji `🎉`, RTL script                           |
| Null byte         | `"hello\u0000world"` in strings                           |
| HTML entities     | `&amp;`, `&lt;`, `&gt;` in input fields                   |
| URL encoding      | `%20`, `%00`, double-encoding `%2500`                     |
| BOM character     | `\uFEFF` at start of file or input                        |

---

## 9. Time & Timezone

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| DST transition    | 2am → 3am (spring forward) or 2am → 1am (fall back)      |
| Leap year         | February 29 on non-leap year input                        |
| Timezone offset   | UTC vs. UTC-3 for same logical date                       |
| Clock skew        | Server and client disagree on current time                |
| Past/future dates | Date in past (expired), far future (year 9999)            |

---

## 10. Performance Edge Cases

| Case              | Example                                                   |
|-------------------|-----------------------------------------------------------|
| N+1 queries       | Fetching list of 1000 users and making 1 DB call per user |
| Memory leak       | Processing 10k items without releasing references         |
| CPU spike         | Pathological regex on user input                          |
| Connection pool   | All DB connections exhausted under load                   |
| Cache stampede    | Cache expires simultaneously for 1000 users               |
