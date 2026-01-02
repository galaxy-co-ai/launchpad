# 11-post-launch-monitoring.md

> **One-liner:** Watch for issues and collect early user feedback

---

## Overview

**Purpose:** Monitor the product's health after launch and gather early user feedback. The first 7-30 days are critical for catching issues, understanding user behavior, and iterating quickly.

**When to Use:**
- Immediately after launch day
- Throughout the first 30 days
- Ongoing for maintenance

**Expected Duration:** Daily check-ins (15-30 min) for first 7 days, then weekly

**Phase:** Post-Launch

---

## Prerequisites (Gates to Enter)

- [ ] Successful launch (`10-launch-day-protocol`)
- [ ] Error tracking active (Sentry)
- [ ] Analytics active (Vercel Analytics or similar)
- [ ] Users have started signing up

**Cannot proceed without:** Live product with real users.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Sentry | Error monitoring | sentry.io |
| Vercel Analytics | Traffic metrics | vercel.com |
| Stripe Dashboard | Revenue tracking | dashboard.stripe.com |
| Neon Console | Database health | console.neon.tech |
| Email/DM | User communication | inbox |

---

## Step-by-Step Checklist

### Step 1: Daily Health Check (First 7 Days)
- [ ] Check Sentry for new errors
- [ ] Check Vercel for deployment issues
- [ ] Check Stripe for payment issues
- [ ] Check database for anomalies
- [ ] Respond to any user messages

**Daily Health Check Template:**
```markdown
## Daily Health Check: [Date]

### Errors (Sentry)
- New errors: [0 / X]
- Action needed: [None / Describe]

### Performance (Vercel)
- Site status: [Operational / Issues]
- Avg response time: [X ms]
- Function errors: [0 / X]

### Payments (Stripe)
- New customers: [X]
- Failed payments: [0 / X]
- Revenue today: $[X]

### Database (Neon)
- Connection status: [Healthy / Issues]
- Query performance: [Normal / Slow]

### User Feedback
- Messages received: [X]
- Action needed: [None / Describe]

### Status: ✅ All Good / ⚠️ Needs Attention
```

**Output:** Daily health verified

### Step 2: Error Triage & Resolution
- [ ] Review all new Sentry errors
- [ ] Classify by severity
- [ ] Fix critical errors immediately
- [ ] Schedule non-critical fixes

**Error Classification:**

| Severity | Criteria | Response Time |
|----------|----------|---------------|
| Critical | Data loss, security breach, payments broken | Immediate |
| High | Core feature broken, many users affected | Same day |
| Medium | Minor feature broken, some users affected | This week |
| Low | Edge case, cosmetic, rare occurrence | Backlog |

**Error Response Template:**
```markdown
## Error: [Error Title]

**Severity:** [Critical/High/Medium/Low]
**First Seen:** [Date/Time]
**Affected Users:** [Count]

### Error Details
- Message: [Error message]
- Stack: [Key stack trace]
- Browser/Device: [If relevant]

### Root Cause
[What caused this]

### Fix
[What was done to fix it]

### Prevention
[How to prevent in future]
```

**Output:** Errors triaged and addressed

### Step 3: User Feedback Collection
- [ ] Set up feedback collection method
- [ ] Actively ask early users for feedback
- [ ] Document all feedback received
- [ ] Identify patterns and priorities

**Feedback Collection Methods:**

| Method | Best For | Setup |
|--------|----------|-------|
| Email prompt | Detailed feedback | Email users after 3 days |
| In-app feedback | Quick reactions | Add feedback button |
| User interviews | Deep insights | Schedule 15-min calls |
| Twitter/social | Public sentiment | Monitor mentions |

**Feedback Request Template:**
```
Subject: Quick question about [Product Name]

Hey [Name]!

Thanks for trying [Product Name]! I'd love to hear your honest feedback:

1. What made you sign up?
2. What's confusing or frustrating?
3. What's missing that you expected?

Even a one-line response helps. Reply to this email anytime!

[Your name]
```

**Feedback Tracking:**
```markdown
## User Feedback Log

| Date | User | Feedback | Category | Action |
|------|------|----------|----------|--------|
| [Date] | [Name/ID] | [Summary] | [Bug/UX/Feature] | [Done/Backlog] |
```

**Output:** Feedback collected and documented

### Step 4: Key Metrics Tracking
- [ ] Set up weekly metrics review
- [ ] Track key performance indicators
- [ ] Compare to success metrics from MVP Contract
- [ ] Identify trends

**Weekly Metrics Dashboard:**
```markdown
## Week [X] Metrics: [Date Range]

### Growth
| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Sign ups | [X] | [Y] | [+/-Z%] |
| Active users | [X] | [Y] | [+/-Z%] |
| Paying customers | [X] | [Y] | [+/-Z%] |

### Revenue
| Metric | This Week | Total |
|--------|-----------|-------|
| New revenue | $[X] | $[Y] |
| MRR | $[X] | — |
| Churn | [X]% | — |

### Engagement
| Metric | Value |
|--------|-------|
| Daily active users | [X] |
| Feature usage | [Top features used] |
| Support requests | [X] |

### Health
| Metric | Status |
|--------|--------|
| Uptime | [99.X%] |
| Avg response time | [X ms] |
| Error rate | [X%] |

### Progress vs Goals
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| 30-day revenue | $[X] | $[Y] | [On track / Behind] |
| 30-day users | [X] | [Y] | [On track / Behind] |
```

**Output:** Metrics tracked and reviewed

### Step 5: Iteration Planning
- [ ] Review collected feedback
- [ ] Identify quick wins (high impact, low effort)
- [ ] Plan bug fixes for next release
- [ ] Evaluate feature requests against scope

**Iteration Prioritization Matrix:**

| Priority | Criteria | Action |
|----------|----------|--------|
| P0 | Critical bug, blocks users | Fix immediately |
| P1 | High-impact improvement | This week |
| P2 | Nice-to-have improvement | Backlog |
| P3 | Feature request | Evaluate for v2 |

**Iteration Planning Template:**
```markdown
## Next Iteration Plan

### Bugs to Fix
1. [ ] [Bug 1] - [Severity]
2. [ ] [Bug 2] - [Severity]

### Improvements
1. [ ] [Improvement 1] - Feedback-driven
2. [ ] [Improvement 2] - Analytics-driven

### NOT Doing (Scope Creep Protection)
- [Feature request to defer]
- [Nice-to-have to skip]

### Success Criteria
- [What "done" looks like for this iteration]
```

**Output:** Next iteration planned

### Step 6: Stakeholder Update (Optional)
- [ ] Summarize launch results
- [ ] Share key learnings
- [ ] Outline next steps
- [ ] Celebrate wins

**Launch Update Template:**
```markdown
## [Product Name] Launch Update - Week [X]

### Summary
[2-3 sentence overview of how launch went]

### Key Metrics
- Total sign ups: [X]
- Paying customers: [X]
- Revenue: $[X]

### User Feedback Themes
- [Theme 1]: [Summary]
- [Theme 2]: [Summary]

### Wins
- 🎉 [Win 1]
- 🎉 [Win 2]

### Challenges
- ⚠️ [Challenge 1] → [Response]

### Next Steps
- [ ] [Priority 1]
- [ ] [Priority 2]
```

**Output:** Stakeholders updated

---

## Post-Launch Monitoring Schedule

| Timeframe | Activity | Frequency |
|-----------|----------|-----------|
| Days 1-7 | Full health check | Daily |
| Days 8-14 | Health check + metrics | Every 2-3 days |
| Days 15-30 | Metrics review | Weekly |
| Day 30+ | Ongoing maintenance | Weekly |

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Health Check Logs | Markdown | Documentation | Daily for first week |
| Feedback Log | Spreadsheet/Markdown | Documentation | All feedback captured |
| Weekly Metrics | Dashboard | Documentation | Weekly updates |
| Iteration Plan | Markdown | Documentation | Next steps defined |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Monitoring Active:** Daily checks happening
- [ ] **Errors Addressed:** No critical errors unresolved
- [ ] **Feedback Collected:** At least 5 user feedback items
- [ ] **Metrics Tracked:** Weekly dashboard updated
- [ ] **Plan Exists:** Next iteration is planned

**ALL gates should be maintained throughout post-launch.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Ignoring errors | "Probably fine" | Check Sentry daily, zero-tolerance for criticals |
| Not asking for feedback | Fear of criticism | Proactively ask, frame as helping you improve |
| Vanity metrics | Feels good | Focus on revenue and active usage |
| Reactive only | Waiting for problems | Proactive outreach and monitoring |
| Feature creep | User requests | Filter through MVP scope, most go to v2 |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 11-post-launch-monitoring (ongoing)
Deliverables: [X] days monitored, [Y] feedback items, metrics tracked
Next: 12-marketing-activation (to grow)
Blockers: [None / List any issues]
```

**Next SOP:** `12-marketing-activation.md`

---

*Last Updated: 2025-12-28*
