# Prioritization Frameworks Reference

## RICE Score

```
RICE = (Reach × Impact × Confidence) / Effort
```

| Factor | Description | Scale |
|---|---|---|
| **Reach** | Number of users/customers affected per quarter | Absolute number |
| **Impact** | Effect on each user (retention, revenue, satisfaction) | 0.25 = minimal, 0.5 = low, 1 = medium, 2 = high, 3 = massive |
| **Confidence** | How sure are we about estimates | 100% = high, 80% = medium, 50% = low |
| **Effort** | Person-months (or person-sprints) to deliver | Absolute number (lower = better) |

### When to Use
- Comparing features from different domains
- Stakeholder alignment on priorities
- Quarterly/monthly planning

### Pitfalls
- Don't inflate Confidence without data
- Reach must be evidence-based, not guessed
- Effort should include maintenance, not just delivery

---

## WSJF (Weighted Shortest Job First)

```
WSJF = Cost of Delay / Job Size
```

**Cost of Delay** = User-Business Value + Time Criticality + Risk Reduction

| Component | Question | Scale (1-10) |
|---|---|---|
| **User-Business Value** | How much revenue/satisfaction does this generate? | 1-10 |
| **Time Criticality** | Does value decay if delayed? | 1-10 |
| **Risk Reduction** | Does this reduce operational/technical risk? | 1-10 |
| **Job Size** | How much effort to deliver? | 1-10 (lower = delivered faster) |

### When to Use
- SAFe / Agile environments
- When time-sensitivity matters (compliance deadlines, market windows)
- Continuous flow prioritization

---

## Kano Model

Classifies features by user satisfaction impact:

```
Category          Description                            Priority Implication
──────────────────────────────────────────────────────────────────────────────
Must-Be           Expected. Absence causes frustration.  Highest — do first
Performance       More = better. Linear satisfaction.     High — invest proportionally
Attractive        Unexpected delight. Absence is OK.      Medium — differentiate
Indifferent       No impact on satisfaction either way.   Low — avoid investing
Reverse           Presence causes dissatisfaction.        Drop — remove or hide
```

### Classification Method
Ask two questions per feature:
1. "How would you feel if this feature were present?" (Functional)
2. "How would you feel if this feature were absent?" (Dysfunctional)

Map answers to the matrix to classify.

### When to Use
- Customer-facing features
- Balancing "expected basics" vs. "innovation"
- Avoiding over-investment in indifferent features

---

## Opportunity Scoring (ODI — Outcome-Driven Innovation)

```
Opportunity Score = Importance + max(Importance - Satisfaction, 0)
```

| Factor | Description | Scale (1-10) |
|---|---|---|
| **Importance** | How important is this job/outcome to the user? | 1-10 |
| **Satisfaction** | How satisfied is the user with current solutions? | 1-10 |

### Interpretation
- **Score > 15**: Over-served (don't invest)
- **Score 12-15**: Appropriately served
- **Score 10-12**: Opportunity zone
- **Score < 10**: Under-served (high opportunity)

### When to Use
- Jobs-to-be-done analysis
- Market opportunity mapping
- Feature discovery from user research

---

## Framework Selection Guide

```
CONTEXT                                    → FRAMEWORK
──────────────────────────────────────────────────────
Comparing diverse features with data       → RICE
Time-sensitive prioritization              → WSJF
User satisfaction / delight analysis       → Kano
Market opportunity / unmet needs           → Opportunity Scoring
Quick triage without deep data             → RICE (simplified)
Multiple frameworks needed                 → Use 2+ and cross-validate
```

## Combining Frameworks

For high-stakes decisions, cross-validate:
1. Score with RICE for quantitative ranking
2. Classify with Kano for satisfaction alignment
3. Check WSJF if time-sensitivity is a factor
4. Use Opportunity Scoring for discovery-phase initiatives

If frameworks disagree, investigate the assumptions behind each score.
