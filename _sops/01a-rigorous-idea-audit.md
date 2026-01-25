# 01a-rigorous-idea-audit.md

> **One-liner:** Deep PMF validation with market research—ideas MUST prove themselves

---

## Overview

**Purpose:** Most ideas should FAIL this audit. This is not a rubber stamp—it's a rigorous quality gate that protects your time from products nobody will pay for. If an idea can't survive this scrutiny, it won't survive the market.

**When to Use:**
- After `00-idea-intake` captures an idea
- Before committing ANY development time
- When an idea scores 60-89 (YELLOW) on quick validation
- When you want to de-risk a "gut feel" opportunity

**Expected Duration:** 4-8 hours (may span 2-3 days for thorough research)

**Phase:** Ideation → Pre-Build Gate

**Kill Rate Target:** 70%+ of ideas should fail this audit. If you're passing most ideas, you're not being rigorous enough.

---

## Automatic Disqualifiers (Instant Kill)

Check these FIRST. If any apply, KILL the idea immediately:

| Disqualifier | Why It Kills |
|--------------|--------------|
| No monetization path | Free tools aren't businesses |
| Market too small (<1,000 potential customers) | Can't sustain a business |
| Requires viral growth to work | You can't control virality |
| Needs $100K+ to build MVP | Not Micro-SaaS |
| Dominated by well-funded incumbents with network effects | Can't compete |
| Regulatory/legal barriers | Risk > reward |
| B2B Enterprise sales cycles (6+ months) | Too slow for Micro-SaaS |
| Requires hardware or physical fulfillment | Out of scope |

If any disqualifier applies → **Document why in idea file, move to `_vault/killed/`, STOP.**

---

## Audit Framework: 5 Pillars

Each pillar has strict scoring. Maximum score: 500 points.

**Passing threshold: 350+ points (70%)**

Ideas below 350 are KILLED. No exceptions. No "revisit later."

---

## Pillar 1: Problem Evidence (Max 100 points)

**Goal:** Prove real people have this problem and it causes quantifiable pain.

### Research Requirements

| Research Task | Minimum Evidence Required |
|---------------|---------------------------|
| Reddit search | 5+ posts where people describe this problem |
| Twitter/X search | 10+ tweets complaining or asking for solutions |
| Forum/community search | 3+ threads discussing this pain |
| Google Trends | Search volume exists (not zero) |
| Review mining | Check 1-star reviews of competitors for this pain |

### Scoring Rubric

| Criteria | Score | Evidence Required |
|----------|-------|-------------------|
| Problem documented in 10+ public complaints | +25 | Links to each |
| Problem causes financial loss (quantified) | +25 | Dollar amounts cited |
| Problem is recurring (weekly/monthly pain) | +15 | Pattern evidence |
| People actively searching for solutions | +15 | Google Trends screenshot |
| Current solutions have angry users | +10 | 1-star review quotes |
| You personally have this problem | +10 | Genuine, not forced |

**Pillar 1 Score: ___ / 100**

**Minimum to pass: 60 points.** Below 60 = KILL.

---

## Pillar 2: Market Sizing (Max 100 points)

**Goal:** Quantify the market. Vague "big market" claims = FAIL.

### TAM/SAM/SOM Analysis

You must calculate all three:

- **TAM (Total Addressable Market):** Everyone who could theoretically use this
- **SAM (Serviceable Addressable Market):** Segment you can realistically reach
- **SOM (Serviceable Obtainable Market):** Realistic first-year capture

**Formula for SOM (be conservative):**
```
SOM = SAM × 0.01 to 0.05 (1-5% capture in Year 1)
```

### Required Data Points

| Data Point | Source | Your Finding |
|------------|--------|--------------|
| Industry size | IBISWorld, Statista, or industry reports | $ |
| Number of potential customers | LinkedIn, Census, industry data | # |
| Average revenue per customer | Competitor pricing × 12 | $ |
| YoY growth rate | Industry reports | % |
| Geographic concentration | Where customers are | |

### Scoring Rubric

| Criteria | Score | Evidence Required |
|----------|-------|-------------------|
| TAM > $1B | +15 | Source linked |
| SAM > $100M | +20 | Calculation shown |
| SOM > $500K Year 1 revenue potential | +25 | Math documented |
| Market growing >5% YoY | +15 | Source linked |
| Clear customer segment identified | +15 | Specific, not "everyone" |
| Can reach customers without paid ads | +10 | Channel identified |

**Pillar 2 Score: ___ / 100**

**Minimum to pass: 50 points.** Below 50 = KILL.

---

## Pillar 3: Competitive Landscape (Max 100 points)

**Goal:** Map every competitor. Identify your differentiation. If you can't articulate why you'd win, you won't.

### Deep Competitive Analysis

For EVERY competitor found, document:

```markdown
### Competitor: [Name]
- **URL:**
- **Founded:**
- **Funding:** (if known)
- **Pricing:** [model + amounts]
- **Customer count:** (if public)
- **Rating:** (G2, Capterra, or similar)
- **Top 3 strengths:**
- **Top 3 weaknesses:** (from reviews)
- **Why customers leave:** (from 1-star reviews)
- **Your differentiation:**
```

Minimum: Analyze **5 competitors** or prove none exist.

### Scoring Rubric

| Criteria | Score | Evidence Required |
|----------|-------|-------------------|
| 5+ competitors analyzed in detail | +20 | Full profiles |
| Clear weakness identified across competitors | +20 | Pattern from reviews |
| Differentiation is NOT "cheaper" or "simpler" | +20 | Unique value prop |
| Gap in market validated by customer complaints | +15 | Direct quotes |
| No competitor has raised >$50M (avoidable) | +10 | Funding research |
| Differentiation defensible (not easily copied) | +15 | Moat explanation |

**If NO competitors exist:** This is a WARNING, not a win. Why hasn't anyone built this?
- If answer = regulatory/tech barrier that's now gone → Proceed
- If answer = nobody wants this → KILL

**Pillar 3 Score: ___ / 100**

**Minimum to pass: 50 points.** Below 50 = KILL.

---

## Pillar 4: Monetization Viability (Max 100 points)

**Goal:** Prove willingness to pay with evidence, not assumptions.

### Pricing Research

| Research Task | Finding |
|---------------|---------|
| Lowest competitor price | $ |
| Highest competitor price | $ |
| Most common price point | $ |
| Pricing model (subscription/usage/one-time) | |
| Free tier prevalence (Yes/No) | |
| Your planned price point | $ |
| Justification for your pricing | |

### Unit Economics (Required)

Calculate or estimate:

| Metric | Value | Source |
|--------|-------|--------|
| Average Revenue Per User (ARPU) | $ | Your pricing |
| Customer Acquisition Cost (CAC) | $ | Estimate from channels |
| Lifetime Value (LTV) | $ | ARPU × expected months |
| LTV:CAC Ratio | X | Must be >3:1 |
| Months to recover CAC | # | CAC / monthly ARPU |

### Scoring Rubric

| Criteria | Score | Evidence Required |
|----------|-------|-------------------|
| Competitors successfully charge for similar | +25 | Pricing pages linked |
| LTV:CAC ratio projected >3:1 | +25 | Math shown |
| Price point validated by market | +15 | Competitor comparison |
| Monthly recurring revenue model viable | +15 | Model defined |
| Can reach profitability with <100 customers | +10 | Break-even analysis |
| Path to $10K MRR clear | +10 | Customer # × price |

**Pillar 4 Score: ___ / 100**

**Minimum to pass: 60 points.** Below 60 = KILL.

---

## Pillar 5: Execution Risk (Max 100 points)

**Goal:** Assess what could go wrong and whether you can build this.

### Technical Feasibility

| Question | Answer |
|----------|--------|
| Can you build an MVP in <2 weeks? | Yes/No |
| Does it require tech you haven't used? | Yes/No |
| Does it need 3rd party APIs with risk? | Yes/No |
| Is the core feature technically proven? | Yes/No |
| Do you need data you don't have? | Yes/No |

### Risk Register

Identify the top 5 risks and mitigations:

| Risk | Likelihood (1-5) | Impact (1-5) | Mitigation |
|------|------------------|--------------|------------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

**Risk Score = Sum of (Likelihood × Impact)**
- Total < 25: Low risk (+30 points)
- Total 25-50: Medium risk (+15 points)
- Total > 50: High risk (+0 points)

### Scoring Rubric

| Criteria | Score | Evidence Required |
|----------|-------|-------------------|
| MVP buildable in <2 weeks | +25 | Scope estimate |
| Uses your existing stack | +15 | Tech confirmation |
| No critical single-point-of-failure dependencies | +15 | Dependency review |
| Risk register total <25 | +30 | Risk analysis |
| Clear first customer acquisition channel | +15 | Channel + strategy |

**Pillar 5 Score: ___ / 100**

**Minimum to pass: 50 points.** Below 50 = KILL.

---

## Final Scoring & Decision

### Score Summary

| Pillar | Score | Minimum | Pass? |
|--------|-------|---------|-------|
| Problem Evidence | /100 | 60 | |
| Market Sizing | /100 | 50 | |
| Competitive Landscape | /100 | 50 | |
| Monetization Viability | /100 | 60 | |
| Execution Risk | /100 | 50 | |
| **TOTAL** | **/500** | **350** | |

### Decision Matrix

| Total Score | Each Pillar Passes? | Decision |
|-------------|---------------------|----------|
| 400+ | All Yes | **STRONG GO** — Fast-track to scope |
| 350-399 | All Yes | **GO** — Proceed to scope with caution |
| 350+ | 1+ No | **CONDITIONAL** — Must fix failing pillar(s) |
| 300-349 | — | **WEAK** — Requires pivot or enhancement |
| <300 | — | **KILL** — Move to `_vault/killed/` |

### Final Verdict

```
□ STRONG GO (400+, all pillars pass)
□ GO (350-399, all pillars pass)
□ CONDITIONAL (350+, pillar(s) failing)
□ WEAK (300-349)
□ KILL (<300 or automatic disqualifier)
```

---

## Deliverables

| Deliverable | Format | Location |
|-------------|--------|----------|
| Audit Report | Markdown | `_vault/audits/AUDIT-[slug].md` |
| Research Evidence | Links + screenshots | Within audit report |
| Competitor Profiles | Structured analysis | Within audit report |
| Score Summary | Table | Within audit report |
| Final Decision | GO/KILL | Audit report + idea file |

---

## Output Locations

**If KILL:**
1. Create `_vault/audits/AUDIT-[slug].md` with full analysis
2. Move idea to `_vault/killed/`
3. Update `_vault/IDEAS.md` status

**If GO:**
1. Create `_vault/audits/AUDIT-[slug].md` with full analysis
2. Move idea to `_vault/active/`
3. Update `_vault/IDEAS.md` status
4. Proceed to `02-mvp-scope-contract.md`

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 01a-rigorous-idea-audit
Score: [X]/500
Pillars: Problem [X], Market [X], Competition [X], Money [X], Risk [X]
Decision: [GO/KILL]
Next: 02-mvp-scope-contract (if GO)
Evidence: AUDIT-[slug].md contains full research
```

**Next SOP:** `02-mvp-scope-contract.md` (only if GO)

---

*This SOP replaces casual validation with rigorous PMF analysis. If it feels hard, that's intentional—building the wrong product is harder.*

---

*Last Updated: 2025-01-05*
