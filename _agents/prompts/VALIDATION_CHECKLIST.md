# Validation Checklist Guided Prompt

> Structured walkthrough for SOP-01: Quick Validation scoring

**Use When:** User wants to validate an idea, check if an idea is worth building, or score an idea.

---

## Trigger Phrases

- "validate this idea"
- "is this worth building"
- "score this idea"
- "should I build this"
- "check if this is viable"

---

## Prerequisites Check

Before starting, verify:
> "Before we validate, I need to confirm:
> 1. Do you have an idea file created? (If not, let's capture it first)
> 2. Are you ready to potentially kill this idea if it doesn't score well?
> 
> Validation takes 1-2 hours of research. Ready to start?"

---

## Scoring Framework

**Total Possible: 125 points**
- Problem: 45 points
- Market: 35 points  
- Monetization: 45 points

**Decision Thresholds:**
- 90-125: 🟢 GREEN LIGHT → Proceed to scope
- 60-89: 🟡 YELLOW → Needs more research or pivot
- Below 60: 🔴 RED → Kill it

---

## Section 1: Problem Validation (Max 45 pts)

### Question 1.1: Evidence of Pain

**Ask:**
> "Let's find proof this problem exists. Search Reddit and Twitter/X for people complaining about this problem.
>
> Try searches like:
> - Reddit: `{problem keywords} frustrated`
> - Twitter: `{problem keywords} annoying`
> - Google: `{problem} solution`
>
> **What did you find?** Share 3+ links or quotes showing real people with this pain."

**Scoring:**
| Evidence Found | Points |
|----------------|--------|
| 3+ real complaints/requests found | +15 |
| Problem causes money loss or time waste | +10 |
| People actively searching for solutions | +10 |
| Problem is recurring (not one-time) | +5 |
| You personally have this problem | +5 |

**Guide response:**
> "Based on what you found:
> - Complaints found: [+15 or +0]
> - Causes money/time loss: [+10 or +0]
> - Active searching: [+10 or +0]
> - Recurring problem: [+5 or +0]
> - Personal pain: [+5 or +0]
>
> **Problem Score: X/45**"

---

## Section 2: Market Validation (Max 35 pts)

### Question 2.1: Target Audience

**Ask:**
> "Who exactly would buy this? Complete this sentence:
>
> 'My ideal customer is a [ROLE] who [DOES WHAT] and struggles with [SPECIFIC PAIN].'
>
> (Bad: 'Small business owners' — too vague)
> (Good: 'Solo freelance designers who spend 5+ hours/week on client invoicing')"

**Scoring:**
| Evidence Found | Points |
|----------------|--------|
| Clear, specific audience identified | +10 |
| 2+ communities where they gather | +10 |
| Audience already pays for software | +10 |
| You have access to this audience | +5 |

### Question 2.2: Find Their Communities

**Ask:**
> "Where do these people hang out online? Find at least 2 communities:
> - Subreddits?
> - Discord servers?
> - Twitter hashtags?
> - Facebook groups?
> - Industry forums?
>
> (This is where you'll launch, so be specific)"

**Guide response:**
> "Market Score:
> - Clear audience: [+10 or +0]
> - 2+ communities: [+10 or +0]
> - Already pays for software: [+10 or +0]
> - You have access: [+5 or +0]
>
> **Market Score: X/35**"

---

## Section 3: Monetization Validation (Max 45 pts)

### Question 3.1: Competitor Research

**Ask:**
> "Find existing paid solutions (competitors). For each, note:
> - Name & URL
> - Their pricing
> - Evidence they have customers
>
> No competitors? That's usually a RED FLAG, not an opportunity. Why isn't anyone solving this?"

**Competitor Template:**
```
Competitor: [Name]
URL: [link]
Pricing: [$/month or $/one-time]
Customers: [evidence - reviews, testimonials, "used by X"]
Gap: [what they do poorly that you'd do better]
```

**Scoring:**
| Evidence Found | Points |
|----------------|--------|
| Competitors exist and charge money | +15 |
| Competitors have visible customers | +10 |
| Gap in market you can exploit | +10 |
| Clear monetization path | +10 |

**Guide response:**
> "Monetization Score:
> - Competitors exist & charge: [+15 or +0]
> - Visible customers: [+10 or +0]
> - Exploitable gap: [+10 or +0]
> - Clear path to revenue: [+10 or +0]
>
> **Monetization Score: X/45**"

---

## Final Score Calculation

**Present:**
> "## Validation Complete
>
> | Category | Score |
> |----------|-------|
> | Problem | X/45 |
> | Market | X/35 |
> | Monetization | X/45 |
> | **TOTAL** | **X/125** |
>
> ### Verdict: [🟢 GREEN / 🟡 YELLOW / 🔴 RED]
>
> [If GREEN]: Ready to lock scope! Say 'scope this MVP' to continue.
> [If YELLOW]: Consider pivoting: [specific suggestions based on low scores]
> [If RED]: This idea should be killed. Here's why: [explain lowest scores]"

---

## Transition

**If GREEN (90+):**
> "This idea validates! Next step is locking the MVP scope so we don't over-build. Say **'scope this MVP'** when ready."

**If YELLOW (60-89):**
> "This needs work. Your weakest area is [X]. Would you like to:
> 1. Research more to improve that score
> 2. Pivot the idea to a stronger angle
> 3. Kill it and try another idea"

**If RED (<60):**
> "I recommend killing this idea. The [lowest category] score means [specific problem]. Move it to killed/ with a note about why, so you don't revisit it later."

---

*Next: SCOPE_INTERVIEW.md*

