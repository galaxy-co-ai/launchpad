# 03-revenue-model-lock.md

> **One-liner:** Define exactly how this product makes its first dollar

---

## Overview

**Purpose:** Lock in the revenue model before building. No more "we'll figure out monetization later." This SOP forces you to decide pricing, payment flow, and revenue targets upfront so the product is built revenue-ready from day one.

**When to Use:**
- Immediately after MVP scope is locked
- Before any design or development work
- When you need to validate willingness to pay

**Expected Duration:** 30-45 minutes

**Phase:** Ideation

---

## Prerequisites (Gates to Enter)

- [ ] MVP Contract completed (`02-mvp-scope-contract`)
- [ ] Contract saved in `_vault/active/CONTRACT-[slug].md`
- [ ] Competitor pricing research from validation phase
- [ ] Clear understanding of target customer

**Cannot proceed without:** Locked MVP scope with defined features.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Stripe | Payment processing | stripe.com |
| Competitor Pricing | Reference points | From validation research |
| Revenue Model Template | Standardized doc | Below in this SOP |

---

## Step-by-Step Checklist

### Step 1: Choose Revenue Model Type
- [ ] Select ONE primary revenue model
- [ ] Do not mix models in v1 (keep it simple)

**Revenue Model Options:**

| Model | Best For | Example |
|-------|----------|---------|
| **Subscription** | Ongoing value, SaaS | $19/month |
| **One-time Purchase** | Tools, utilities | $49 lifetime |
| **Usage-based** | APIs, credits | $0.01/request |
| **Freemium** | Land-and-expand | Free tier + $29/mo pro |
| **Pay-per-use** | Transactional value | $5/export |

**Recommendation for Micro-SaaS:** Start with simple subscription or one-time purchase. Avoid freemium in v1 (attracts freeloaders).

**Output:** Selected revenue model

### Step 2: Set Pricing
- [ ] Review competitor pricing from validation
- [ ] Price based on value delivered, not cost
- [ ] Start higher than you think (you can always discount)
- [ ] Pick a specific number, not a range

**Pricing Framework:**

| Factor | Consideration |
|--------|---------------|
| Competitor floor | Don't go below cheapest competitor |
| Value anchor | What pain are you solving? ($X/hour saved?) |
| Target customer | Enterprise pays more than indie |
| Simplicity | One price is better than tiers in v1 |

**Pricing Cheat Sheet:**
- Hobby/indie tools: $9-29/month or $49-149 lifetime
- Professional tools: $29-99/month
- Business tools: $99-299/month
- Enterprise: $299+/month (requires sales)

**Output:** Specific price point with reasoning

### Step 3: Define Payment Flow
- [ ] Map the exact purchase journey
- [ ] Decide: trial vs. no trial
- [ ] Decide: monthly vs. annual vs. both
- [ ] Document refund policy

**Payment Flow Template:**
```
1. User lands on [landing page / app]
2. User sees [pricing / paywall trigger]
3. User clicks [CTA button text]
4. User enters payment via [Stripe Checkout / embedded form]
5. User gets access to [what exactly]
6. Receipt sent via [Stripe / custom email]
```

**Trial Decision Framework:**

| Trial Type | Pros | Cons | Best For |
|------------|------|------|----------|
| No trial | Filters to serious buyers | Lower conversion | Simple tools |
| 7-day trial | Urgency | May not be enough time | Quick-value products |
| 14-day trial | Industry standard | Procrastination | Most SaaS |
| Freemium | Viral potential | Freeloaders | Network effects |

**Output:** Documented payment flow

### Step 4: Set Revenue Targets
- [ ] Define first-dollar goal (launch target)
- [ ] Define 30-day revenue target
- [ ] Define 90-day revenue target
- [ ] Calculate customers needed to hit targets

**Revenue Math:**
```
Price: $[X]/month
30-day target: $[Y]
Customers needed: [Y] / [X] = [Z] customers

If charging $29/month and targeting $500/month:
$500 / $29 = 18 customers needed
```

**Output:** Revenue targets with customer math

### Step 5: Create Revenue Model Document
- [ ] Fill out template below
- [ ] Save as `_vault/active/REVENUE-[slug].md`
- [ ] This locks in monetization decisions

**Output:** Revenue model document

---

## Revenue Model Template

```markdown
# Revenue Model: [Product Name]

**Date:** [Today's date]
**Status:** LOCKED

---

## Model Type

**Selected Model:** [Subscription / One-time / Usage-based / etc.]
**Reasoning:** [Why this model fits this product]

---

## Pricing

**Price Point:** $[X] / [month / one-time / per-unit]

**Justification:**
- Competitor A charges: $[X]
- Competitor B charges: $[Y]
- Our positioning: [Premium / Mid-market / Budget]
- Value delivered: [Saves X hours/month worth $Y]

---

## Payment Flow

1. User [trigger action]
2. User sees [paywall/pricing]
3. User clicks [CTA]
4. Payment via: Stripe Checkout
5. Access granted: [Immediately / After X]
6. Receipt: Stripe automatic email

**Trial:** [None / X days free]
**Refund Policy:** [X days money-back / No refunds]

---

## Revenue Targets

| Timeframe | Revenue Target | Customers Needed |
|-----------|----------------|------------------|
| Launch day | $[X] | [Y] |
| 30 days | $[X] | [Y] |
| 90 days | $[X] | [Y] |

---

## Stripe Setup Checklist

- [ ] Product created in Stripe
- [ ] Price created in Stripe
- [ ] Checkout link generated
- [ ] Webhook endpoint configured
- [ ] Test mode purchase verified

---

## Signatures

- [ ] Pricing locked—no second-guessing
- [ ] Payment flow defined—build exactly this

**Lock Date:** [Date]
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Revenue Model Doc | Markdown | `_vault/active/REVENUE-[slug].md` | File exists with all sections |
| Pricing Decision | Dollar amount | In document | Specific number, not range |
| Payment Flow | Step-by-step | In document | Clear user journey |
| Revenue Targets | Table | In document | Specific numbers with math |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Model Selected:** One clear revenue model chosen
- [ ] **Price Set:** Specific dollar amount locked
- [ ] **Flow Documented:** Know exactly how users pay
- [ ] **Targets Defined:** Revenue goals with customer math
- [ ] **Document Saved:** File exists in `_vault/active/`

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Pricing too low | Imposter syndrome | Look at competitors, match or exceed |
| "Free first" | Fear of rejection | Free users ≠ validation; charge from day 1 |
| Complex tiers | Overengineering | One price in v1, tiers come later |
| No refund policy | Didn't think about it | Decide now: 7-day refund is safe default |
| Vague targets | Avoiding commitment | Specific numbers force accountability |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 03-revenue-model-lock
Deliverables: REVENUE-[slug].md, pricing at $[X]/[period]
Next: 04-design-brief
Blockers: [None / List any issues]
```

**Next SOP:** `04-design-brief.md`

---

*Last Updated: 2025-12-28*
