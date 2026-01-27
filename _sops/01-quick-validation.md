# 01-quick-validation.md

> **One-liner:** Validate problem, market, and monetization before building

**Version:** 1.0.0

---

## Which Validation SOP Should I Use?

```
┌─────────────────────────────────────────────────────────┐
│  New idea captured in vault                             │
└─────────────────────────┬───────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Do you have high conviction already?                   │
│  (Personal pain, customer request, obvious gap)         │
└────────────┬────────────────────────────┬───────────────┘
             │ YES                        │ NO / UNSURE
             ▼                            ▼
┌─────────────────────────┐  ┌────────────────────────────┐
│  01-quick-validation    │  │  01a-rigorous-idea-audit   │
│  (This SOP)             │  │  (Deep PMF validation)     │
│  • 1-4 hours            │  │  • 4-8 hours               │
│  • 125 points max       │  │  • 500 points max          │
│  • Good for filtering   │  │  • 70% kill rate target    │
└─────────────────────────┘  └────────────────────────────┘
```

**Rule of thumb:** If you'd bet $1,000 of your own money on this idea right now, use 01. Otherwise, use 01a.

---

## Overview

**Purpose:** Kill bad ideas fast. Before investing any development time, validate that the problem is real, people will pay, and you can reach them. This SOP prevents building products nobody wants.

**When to Use:**
- After capturing an idea in `00-idea-intake`
- Before committing to build anything
- When deciding which backlog idea to pursue next

**Expected Duration:** 1-4 hours (can span a day for research)

**Phase:** Ideation

---

## Prerequisites (Gates to Enter)

- [ ] Idea file exists in `_vault/backlog/` or `_vault/active/`
- [ ] Completed `00-idea-intake` for this idea
- [ ] Willing to kill the idea if it fails validation

**Cannot proceed without:** Completed idea intake file with problem statement defined.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Web Search | Market research | Google, Reddit, Twitter/X |
| Competitor Analysis | Existing solutions | Google, Product Hunt, G2 |
| Idea File | Update with findings | `_vault/[status]/IDEA-[slug].md` |
| Scoring Rubric | Objective evaluation | Below in this SOP |

---

## Step-by-Step Checklist

### Step 1: Problem Validation (Is the pain real?)
- [ ] Search Reddit for people complaining about this problem
- [ ] Search Twitter/X for people asking for solutions
- [ ] Find at least 3 real humans who have this problem (not hypothetical)
- [ ] Document quotes/links proving pain exists
- [ ] Rate problem severity: Mild Annoyance (1) → Hair on Fire (5)

**Scoring:**
| Evidence Found | Points |
|----------------|--------|
| 3+ real complaints/requests found | +15 |
| Problem causes money loss or time waste | +10 |
| People actively searching for solutions | +10 |
| Problem is recurring (not one-time) | +5 |
| You personally have this problem | +5 |

**Output:** Problem validation score (max 45 points)

### Step 2: Market Validation (Can you reach them?)
- [ ] Identify the target audience in one sentence
- [ ] Find where they hang out online (subreddits, communities, forums)
- [ ] Estimate market size (how many people have this problem?)
- [ ] Determine if they're reachable without paid ads

**Scoring:**
| Evidence Found | Points |
|----------------|--------|
| Clear, specific audience identified | +10 |
| 2+ communities where they gather | +10 |
| Audience already pays for software | +10 |
| You have access to this audience | +5 |

**Output:** Market validation score (max 35 points)

### Step 3: Monetization Validation (Will they pay?)
- [ ] Find existing paid solutions (competitors)
- [ ] Note their pricing (validates willingness to pay)
- [ ] Identify pricing model (subscription, one-time, usage)
- [ ] Estimate what you could charge (be realistic)

**Scoring:**
| Evidence Found | Points |
|----------------|--------|
| Competitors exist and charge money | +15 |
| Competitors have visible customers | +10 |
| Gap in market you can exploit | +10 |
| Clear monetization path | +10 |

**Output:** Monetization validation score (max 45 points)

### Step 4: Calculate Total Score
- [ ] Add all three scores together
- [ ] Maximum possible: 125 points
- [ ] Apply decision framework below

**Decision Framework:**
| Score | Action |
|-------|--------|
| 90-125 | **GREEN LIGHT** — Move to `_vault/active/`, proceed to scope |
| 60-89 | **YELLOW** — Needs more research or pivoting |
| Below 60 | **RED** — Kill it or move to `_vault/killed/` |

**Output:** Final score + decision

### Step 5: Update Idea File
- [ ] Add validation score to idea file
- [ ] Document key findings (quotes, links, competitor URLs)
- [ ] Move file to appropriate vault folder based on decision
- [ ] If killed, note why (helps avoid repeating mistakes)

**Output:** Updated idea file with validation data

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Validation Score | Number | In idea file | Score calculated with rubric |
| Research Evidence | Links/quotes | In idea file | At least 3 external sources cited |
| Decision | GREEN/YELLOW/RED | In idea file | Decision documented with reasoning |
| File Location | Moved file | `_vault/active/` or `_vault/killed/` | File in correct folder |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Score Calculated:** Used the rubric, not gut feeling
- [ ] **Evidence Documented:** Real links/quotes, not assumptions
- [ ] **Decision Made:** Clear GO/NO-GO, no "maybes" lingering
- [ ] **File Updated:** Idea file reflects validation findings

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Confirmation bias | You want the idea to work | Actively search for reasons it WON'T work |
| Skipping competitor research | Assuming you're unique | If no competitors, ask why (usually bad sign) |
| Hypothetical customers | "People would..." | Find REAL people, not imaginary ones |
| Inflating scores | Emotional attachment | Have someone else review your scoring |
| Analysis paralysis | Wanting 100% certainty | Time-box to 4 hours max, then decide |

---

## Competitor Analysis Template

When researching competitors, capture:

```markdown
## Competitor: [Name]

**URL:** [link]
**Pricing:** [their pricing model]
**Customers:** [evidence they have users]
**What they do well:** [strengths]
**What they do poorly:** [gaps/weaknesses]
**Your differentiation:** [how you'd be different]
```

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 01-quick-validation
Deliverables: Validation score [X]/125, decision [GREEN/YELLOW/RED]
Next: 02-mvp-scope-contract (if GREEN)
Blockers: [None / List any issues]
```

**Next SOP:** `02-mvp-scope-contract.md`

---

*Last Updated: 2026-01-26*
