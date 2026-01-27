# 02-mvp-scope-contract.md

> **One-liner:** Lock features, timeline, and success metrics in writing

**Version:** 1.0.0

---

## Overview

**Purpose:** Prevent scope creep by defining exactly what "done" looks like before writing code. This contract is a commitment—once signed, features don't get added without explicit renegotiation.

**When to Use:**
- After an idea passes validation (GREEN light)
- Before any design or development work begins
- When transitioning from "exploring" to "building"

**Expected Duration:** 30-60 minutes

**Phase:** Ideation

---

## Prerequisites (Gates to Enter)

- [ ] Idea passed validation with GREEN light (score 90+)
- [ ] Idea file moved to `_vault/active/`
- [ ] Clear understanding of the core problem being solved
- [ ] Completed `01-quick-validation` with documented findings

**Cannot proceed without:** Validated idea with documented market evidence.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| MVP Contract Template | Standardized scope doc | Below in this SOP |
| Idea File | Reference validation findings | `_vault/active/IDEA-[slug].md` |
| PRD Template | Optional detailed spec | `_templates/docs/PRD.md` |

---

## Step-by-Step Checklist

### Step 1: Define the Core Value Proposition
- [ ] Complete this sentence: "Users can [ACTION] so that [BENEFIT]"
- [ ] Identify the ONE thing this MVP must do well
- [ ] Write the "bar napkin pitch" (explain in 10 seconds)

**Output:** One-sentence value proposition

### Step 2: List MVP Features (Must-Have Only)
- [ ] List only features required for first paying customer
- [ ] Apply the "would someone pay for JUST this?" test
- [ ] Maximum 5 features for true MVP
- [ ] Each feature must map to the core value proposition

**Feature Prioritization Framework:**
| Priority | Criteria | Include in MVP? |
|----------|----------|-----------------|
| P0 | Cannot launch without it | Yes |
| P1 | First week feedback will demand it | Maybe |
| P2 | Nice to have | No |
| P3 | Future version | No |

**Output:** Numbered list of P0 features only

### Step 3: Define Explicit Non-Goals
- [ ] List 5+ features you will NOT build in v1
- [ ] Include obvious requests you'll say no to
- [ ] This prevents "while we're at it" additions

**Example Non-Goals:**
- No mobile app (web-only)
- No team features (single user)
- No integrations (standalone)
- No free tier (paid only)
- No admin dashboard (manual ops)

**Output:** Documented non-goals list

### Step 4: Set Success Metrics
- [ ] Define what "success" means for this MVP
- [ ] Metrics must be specific and measurable
- [ ] Include both launch metrics and 30-day metrics

**Metric Template:**
| Metric | Target | Timeframe |
|--------|--------|-----------|
| First paying customer | 1 | Launch day |
| Total revenue | $100 | First 30 days |
| Active users | 10 | First 30 days |
| Churn rate | <20% | First 30 days |

**Output:** Success metrics table

### Step 5: Create the MVP Contract
- [ ] Fill out the contract template below
- [ ] Save as `_vault/active/CONTRACT-[slug].md`
- [ ] This is a binding commitment—treat it seriously

**Output:** Signed MVP contract

---

## MVP Contract Template

```markdown
# MVP Contract: [Product Name]

**Date:** [Today's date]
**Status:** LOCKED

---

## Value Proposition

[One sentence: Users can [ACTION] so that [BENEFIT]]

---

## MVP Features (P0 Only)

1. [ ] [Feature 1 - specific and testable]
2. [ ] [Feature 2 - specific and testable]
3. [ ] [Feature 3 - specific and testable]
4. [ ] [Feature 4 - specific and testable]
5. [ ] [Feature 5 - specific and testable]

**Total Features:** [X] (max 5)

---

## Explicit Non-Goals (v1)

- [ ] [Thing we will NOT build]
- [ ] [Thing we will NOT build]
- [ ] [Thing we will NOT build]
- [ ] [Thing we will NOT build]
- [ ] [Thing we will NOT build]

---

## Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| First paying customer | 1 | Launch day |
| [Metric 2] | [Target] | [Timeframe] |
| [Metric 3] | [Target] | [Timeframe] |

---

## Scope Change Policy

Any feature addition requires:
1. Removing an existing P0 feature, OR
2. Explicit contract renegotiation with documented reasoning

**No exceptions. No "quick additions." No scope creep.**

---

## Signatures

- [ ] Dalton commits to this scope
- [ ] Claude commits to flagging scope creep

**Contract Date:** [Date]
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| MVP Contract | Markdown | `_vault/active/CONTRACT-[slug].md` | File exists with all sections |
| Feature List | Checklist | In contract | Max 5 P0 features listed |
| Non-Goals | List | In contract | At least 5 non-goals documented |
| Success Metrics | Table | In contract | Specific, measurable targets |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Features Capped:** No more than 5 P0 features
- [ ] **Non-Goals Listed:** At least 5 explicit things NOT being built
- [ ] **Metrics Defined:** Success criteria are specific numbers
- [ ] **Contract Saved:** File exists in `_vault/active/`

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Too many features | Excitement, fear of missing out | Hard cap at 5, no exceptions |
| Vague features | Avoiding commitment | Each feature must be testable (yes/no done) |
| No non-goals | Didn't think about boundaries | Force yourself to list 5+ things you won't do |
| Soft metrics | "Get some users" | Specific numbers: "10 users in 30 days" |
| Ignoring the contract | "Just one more thing" | Treat scope creep as contract violation |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 02-mvp-scope-contract
Deliverables: CONTRACT-[slug].md with [X] features, [Y] non-goals
Next: 03-revenue-model-lock
Blockers: [None / List any issues]
```

**Next SOP:** `03-revenue-model-lock.md`

---

*Last Updated: 2026-01-26*
