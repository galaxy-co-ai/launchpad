# Idea Intake Guided Questions

> Structured questions for SOP-00: Capturing and cataloging ideas

**Use When:** User says they have a new idea, want to capture an idea, or mentions a problem they want to solve.

---

## Trigger Phrases

- "I have an idea"
- "new idea"
- "I want to build"
- "what if we made"
- "there should be a tool for"
- "I noticed a problem"

---

## Question Flow

### Step 1: Problem Statement (Required)

**Ask:**
> "Let's capture this idea properly. First, tell me about the **problem** you're solving:
> 
> **Who** has this problem, and **what pain** does it cause them?
> 
> (Example: 'Freelance developers waste 2-3 hours per week manually creating invoices instead of coding.')"

**Validate:** Response must include:
- [ ] A specific person/role (not "people" or "everyone")
- [ ] A concrete pain point (time, money, frustration)

**If vague, probe:**
> "Can you be more specific? Who exactly experiences this, and how does it hurt them?"

---

### Step 2: Proposed Solution (Required)

**Ask:**
> "Now, what would you build to solve this? Describe it in **one sentence**.
> 
> (Example: 'An AI tool that generates professional invoices from Slack messages about completed work.')"

**Validate:** Response should be:
- [ ] One sentence (not a feature list)
- [ ] Actionable (starts with "A tool that..." or "An app that...")

**If too complex, simplify:**
> "That sounds like multiple products. What's the ONE core thing it does?"

---

### Step 3: Source (Required)

**Ask:**
> "Where did this idea come from?
> 
> Options:
> - Personal pain (you have this problem)
> - Someone told you about it
> - Saw it online (Reddit, Twitter, etc.)
> - Competitor gap
> - Random thought
> 
> (This helps us validate later)"

---

### Step 4: Initial Signals (Quick Check)

**Ask these rapid-fire:**

1. > "Have you searched for existing solutions? (Yes/No)"
   - If Yes: "What did you find? Any gaps?"
   - If No: "Let's note that for validation phase."

2. > "Would YOU pay for this if someone else built it? How much?"

3. > "Do you personally know anyone with this problem? (Name not needed, just yes/no)"

---

### Step 5: Confirm & Create

**Summarize:**
> "Here's what I captured:
> 
> **Idea:** {name}
> **Problem:** {problem_statement}
> **Solution:** {proposed_solution}
> **Source:** {source}
> 
> Ready to save this to the vault? I'll create the idea file and we can move to validation when you're ready."

**On confirmation:**
- Create idea in database
- Generate `IDEA-{slug}.md` file structure
- Update IDEAS.md index

---

## Output Artifact

```markdown
# IDEA: {Name}

**Captured:** {Date}
**Source:** {source}
**Status:** Backlog

## Problem Statement
{Who has this problem? What pain does it cause? How do they currently solve it?}

## Proposed Solution
{What would we build? One paragraph max.}

## Initial Signals
- **Searched for solutions?** {Yes/No + notes}
- **Would you pay for this?** {Yes/No/Maybe + price point}
- **Know someone with this pain?** {Yes/No}

## Raw Notes
{Any additional context from conversation}
```

---

## Transition

After idea is captured:
> "Idea saved! When you're ready, say **'validate this idea'** and I'll guide you through the scoring process (SOP-01). This takes about 1-2 hours of research."

---

*Next: VALIDATION_CHECKLIST.md*

