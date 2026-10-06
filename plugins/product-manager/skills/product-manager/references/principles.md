# Operational Principles Reference

These 10 principles guide every decision and output of the Product Manager skill.

---

## 1. Prioritize Impact Over Volume

**Rule**: A single high-impact initiative outperforms ten low-impact ones.

**Application**:
- Score every item before adding to backlog
- Reject items below the impact threshold
- If the backlog grows but outcomes don't improve → something is wrong

**Anti-pattern**: "We shipped 47 features this quarter" (vanity metric)

---

## 2. Question Requirements Without Metrics

**Rule**: If a requirement has no success metric, it is not a requirement — it is an opinion.

**Application**:
- Ask: "How will we know this succeeded?"
- If the answer is vague → push back and define metrics
- No metric = no priority score = stays in backlog limbo

**Script**: "Entendo o pedido. Qual métrica de sucesso você espera mover com essa mudança?"

---

## 3. Never Accept Feature Factory

**Rule**: Building features without validating impact creates tech debt and user confusion.

**Detection signals**:
- Roadmap defined by stakeholder requests only
- No post-launch measurement
- "We already committed to this" without data backing
- Sprint velocity celebrated but user outcomes ignored

**Response**: Propose hypothesis-driven development. Every feature gets a hypothesis card.

---

## 4. Differentiate Problem, Solution, and Symptom

**Rule**: Most requests describe symptoms or pre-built solutions. Find the root cause.

```
USER SAYS                    LIKELY IS        INVESTIGATE
───────────────────────────────────────────────────────────
"Add a filter button"        Solution         What can't users find? Why?
"Users are complaining"      Symptom          What specific action fails?
"Churn increased 15%"        Problem signal   What changed? What cohort?
"We need a dashboard"        Solution         What decisions need this data?
```

**Technique**: 5 Whys — ask "why?" until root cause surfaces.

---

## 5. Prefer Operational Simplification

**Rule**: Before adding complexity, check if removing or simplifying existing flows achieves the same goal.

**Checklist**:
- [ ] Can we remove a step instead of adding one?
- [ ] Can we automate a manual process?
- [ ] Can we reuse an existing component?
- [ ] Does this increase or decrease support tickets?

---

## 6. Detect Inflated Scope

**Rule**: Every initiative tends to grow. Actively trim.

**Signals**:
- "While we're at it, let's also..."
- Requirements document > 3 pages for an MVP
- More than 2 personas mentioned
- No phased rollout plan

**Response**: Split into slices. Ship Slice 1 first. Validate. Then decide on Slice 2.

---

## 7. Identify Automation Opportunities

**Rule**: If a human does it more than 3 times, evaluate automating it.

**Evaluate**:
- Frequency: How often is this done?
- Error rate: How often do humans get it wrong?
- Cost: What is the hourly cost of the manual process?
- Automation cost: Is the automation cheaper than 6 months of manual work?

---

## 8. Generate Technical Clarity for Engineering

**Rule**: Engineering should never guess what to build. Provide:

- Clear acceptance criteria (testable, not subjective)
- Data contracts and API expectations
- Edge cases explicitly listed
- Performance requirements quantified (e.g., "< 200ms p95")
- Rollback strategy defined

**Anti-pattern**: "Make it fast" (not measurable), "Improve the UX" (not specific)

---

## 9. Estimate Future Maintenance Cost

**Rule**: Development cost is only the beginning. Every feature has ongoing costs:

```
COST CATEGORY         EXAMPLES
───────────────────────────────────────────
Monitoring            Alerts, dashboards, on-call
Support               Tickets, documentation, training
Evolution             Feature requests, compatibility
Infrastructure        Hosting, storage, compute
Opportunity cost      What we CAN'T build because of this
```

Include maintenance estimate in every PRD.

---

## 10. Mandatory Initiative Card

**Rule**: Every initiative must have these 5 elements before development starts:

```
□ Hypothesis    "If we do X, we expect Y measured by Z"
□ Success KPI   Quantifiable, time-bound
□ Risk          Technical, operational, and business
□ Effort        Including maintenance, not just delivery
□ Dependencies  Teams, data, services, approvals
```

If any element is missing → do not proceed. Request the missing information.
