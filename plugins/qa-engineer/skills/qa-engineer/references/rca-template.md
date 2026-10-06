# Root Cause Analysis (RCA) Template

Use this template for every escaped defect, production incident, or recurring bug.

---

## RCA Report

### Incident Summary

| Field              | Value                                              |
|--------------------|----------------------------------------------------|
| Incident ID        | INC-XXXX                                           |
| Date/Time          | YYYY-MM-DD HH:MM UTC                               |
| Duration           | X hours Y minutes                                  |
| Severity           | SEV-1 / SEV-2 / SEV-3                              |
| Affected Component | `<service/module/endpoint>`                        |
| Impact             | `<users affected, revenue lost, data at risk>`     |
| Reported By        | `<name or system>`                                 |

---

### Timeline

| Time (UTC) | Event                                                   |
|------------|---------------------------------------------------------|
| HH:MM      | Incident begins (first symptom or alert triggered)      |
| HH:MM      | On-call engineer notified                               |
| HH:MM      | Root cause identified                                   |
| HH:MM      | Mitigation applied                                      |
| HH:MM      | Service fully restored                                  |

---

### Root Cause

**Single-sentence root cause:**
> `<The specific technical condition that directly caused the failure>`

**Technical explanation:**
```
<Detailed description of the failure mechanism. Include:
- The code path or configuration that failed
- The specific input, state, or condition that triggered it
- Why the existing safeguards did not catch it>
```

---

### Contributing Factors

List ALL factors that made this incident possible or worse:

1. **Missing validation** — `<description>`
2. **No monitoring** — `<description>`
3. **Architectural gap** — `<description>`
4. **Process gap** — `<description>`

---

### Why Tests Didn't Catch It

| Gap                              | Root Cause of Gap                              |
|----------------------------------|------------------------------------------------|
| No edge case test for `X`        | Happy-path-only test culture                   |
| Mocked dependency hid the bug    | Mock didn't simulate the real failure mode     |
| E2E test was skipped in CI       | Test marked as flaky, not fixed                |

---

### Corrective Actions

| Action                              | Type         | Owner   | Due Date   |
|-------------------------------------|--------------|---------|------------|
| Add regression test for this scenario | Prevention | QA Team | YYYY-MM-DD |
| Add monitoring alert for metric X   | Detection    | DevOps  | YYYY-MM-DD |
| Fix the root cause in code          | Elimination  | Dev     | YYYY-MM-DD |
| Add circuit breaker for dependency  | Resilience   | Arch    | YYYY-MM-DD |
| Update runbook for on-call response | Process      | Lead    | YYYY-MM-DD |

---

### Regression Test Generated

```
// Test file: regression/<incident-id>.test.<ext>
// Linked to: INC-XXXX
// Purpose: Ensures this exact failure mode never reaches production again

<test code here>
```

---

### Lessons Learned

1. `<What we learned about the system>`
2. `<What we learned about our process>`
3. `<What assumption was wrong>`

---

### Prevention Checklist

- [ ] Regression test added and merged
- [ ] Alert/monitoring added for the failure signal
- [ ] Runbook updated
- [ ] Post-mortem shared with team
- [ ] Similar patterns checked in other services (blast radius assessment)
