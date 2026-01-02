# Product Requirements Document

> **Project:** [Project Name]
> **Version:** 1.0
> **Last Updated:** [Date]
> **Owner:** [Name]

---

## 1. Problem

### What problem are we solving?
[One sentence. If you can't say it in one sentence, you don't understand it yet.]

### Who has this problem?
| Segment | Description | Size Estimate |
|---------|-------------|---------------|
| Primary | | |
| Secondary | | |

### How do they solve it today?
| Current Solution | Pain Points |
|------------------|-------------|
| | |
| | |

### Why now?
[What changed that makes this problem worth solving today?]

---

## 2. Solution

### One-liner
[Complete this sentence: "{Product} helps {audience} {achieve outcome} by {mechanism}."]

### Core Insight
[What do we believe that others don't? What's our unfair advantage?]

### Key Differentiators
| Us | Competitors |
|----|-------------|
| | |
| | |

---

## 3. Users

### Primary Persona

**Name:** [Descriptive name, e.g., "Busy Freelancer"]

| Attribute | Details |
|-----------|---------|
| Role | |
| Goal | |
| Frustration | |
| Tech Comfort | Low / Medium / High |
| Willingness to Pay | $ / $$ / $$$ |

### User Journey (Current State)
```
Trigger → [What prompts them to act?]
    ↓
Action → [What do they do today?]
    ↓
Pain → [Where does it break down?]
    ↓
Outcome → [What do they settle for?]
```

### User Journey (With Our Product)
```
Trigger → [Same trigger]
    ↓
Action → [They use our product]
    ↓
Experience → [What's different?]
    ↓
Outcome → [What do they achieve?]
```

---

## 4. Scope

### In Scope (MVP)
| Feature | Priority | Rationale |
|---------|----------|-----------|
| | P0 | |
| | P0 | |
| | P1 | |
| | P1 | |

### Out of Scope (Post-MVP)
| Feature | Why Deferred |
|---------|--------------|
| | |
| | |

### Non-Goals
[What are we explicitly NOT trying to do?]
-
-

---

## 5. Requirements

### Functional Requirements

#### [Feature 1 Name]
**Purpose:** [Why does this exist?]

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F1.1 | | Given... When... Then... |
| F1.2 | | Given... When... Then... |

#### [Feature 2 Name]
**Purpose:** [Why does this exist?]

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| F2.1 | | Given... When... Then... |
| F2.2 | | Given... When... Then... |

### Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| Performance | Page load time | < 2s |
| Performance | API response time | < 200ms |
| Availability | Uptime | 99.9% |
| Security | Auth | Clerk (OAuth + MFA) |
| Security | Data | Encrypted at rest |
| Accessibility | WCAG | 2.1 AA |

---

## 6. Success Metrics

### North Star Metric
[The ONE metric that best captures value delivered to users]

**Metric:**
**Target (30 days):**
**Target (90 days):**

### Supporting Metrics

| Metric | Definition | Target | Tracking |
|--------|------------|--------|----------|
| Activation | [What action = activated user?] | | |
| Retention | [D7 / D30 return rate] | | |
| Revenue | [MRR / transactions] | | |
| Satisfaction | [NPS / CSAT] | | |

### Anti-Metrics
[What should NOT increase?]
| Metric | Ceiling |
|--------|---------|
| Support tickets per user | |
| Churn rate | |

---

## 7. Technical Approach

### Architecture Overview
```
[Simple diagram or description]
```

### Key Technical Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Database | Neon PostgreSQL | [Why] |
| Auth | Clerk | [Why] |
| Hosting | Vercel | [Why] |

### Data Model (Core Entities)
| Entity | Key Fields | Relationships |
|--------|------------|---------------|
| User | id, email, name | has many [X] |
| | | |

### Third-Party Dependencies
| Service | Purpose | Criticality |
|---------|---------|-------------|
| | | Required / Nice-to-have |

---

## 8. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| | Low/Med/High | Low/Med/High | |
| | | | |

---

## 9. Launch Plan

### Pre-Launch Checklist
- [ ] Core features complete
- [ ] Error tracking (Sentry) configured
- [ ] Analytics in place
- [ ] Security review done
- [ ] Performance tested
- [ ] Legal (Terms, Privacy) in place

### Launch Sequence
| Phase | Actions | Success Criteria |
|-------|---------|------------------|
| Soft Launch | | |
| Public Launch | | |
| Post-Launch | | |

---

## 10. Open Questions

| Question | Owner | Due Date | Resolution |
|----------|-------|----------|------------|
| | | | |
| | | | |

---

## Appendix

### A. Competitive Analysis
[Link or embed]

### B. User Research
[Link or embed]

### C. Mockups/Wireframes
[Link or embed]

---

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product | | | |
| Engineering | | | |
| Design | | | |

---

*This PRD is a living document. Update as decisions are made.*
