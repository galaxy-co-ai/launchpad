# MVP Scope Interview

> Structured walkthrough for SOP-02: Locking MVP scope to prevent creep

**Use When:** User wants to scope an MVP, define features, or lock what they're building.

---

## Trigger Phrases

- "scope this MVP"
- "define the MVP"
- "what features should I build"
- "lock the scope"
- "prevent scope creep"
- "start building" (redirect to scope first)

---

## Prerequisites Check

**Ask:**
> "Before we scope, confirm:
> 1. Has this idea been validated? (Score 90+ on SOP-01)
> 2. Do you have a validation file with research evidence?
>
> If not validated yet, let's do that first—building unvalidated ideas is the #1 cause of wasted effort."

---

## Section 1: Core Value Proposition

### Question 1.1: The One Thing

**Ask:**
> "Complete this sentence in 10 words or less:
>
> **'Users can __________ so that __________.'**
>
> Examples:
> - 'Users can generate invoices from Slack so that they get paid faster.'
> - 'Users can track habits visually so that they build consistency.'
>
> This is your entire product in one sentence. Everything else is noise."

**Validate:**
- [ ] Under 10 words
- [ ] Has clear action (verb)
- [ ] Has clear benefit (outcome)

**If too complex:**
> "That's describing multiple products. What's the ONE thing that makes someone pay you?"

### Question 1.2: Bar Napkin Pitch

**Ask:**
> "Imagine you have 10 seconds in an elevator. How do you explain this?
>
> Format: '[Product] helps [audience] [do thing] without [pain point].'
>
> Example: 'InvoiceAI helps freelancers create invoices in 30 seconds without manual data entry.'"

---

## Section 2: MVP Features (Max 5)

### Question 2.1: Feature Brainstorm

**Ask:**
> "List everything you COULD build. Don't filter yet—just brain dump. Include:
> - Core functionality
> - Nice-to-haves
> - Things users might ask for
> - Features competitors have
>
> We'll cut ruthlessly after this."

### Question 2.2: The Payment Test

**For each feature, ask:**
> "Would someone pay for JUST this feature, with nothing else?
>
> | Feature | Would Pay? | Priority |
> |---------|------------|----------|
> | [Feature 1] | Yes/No | P0/P1/P2 |
> | [Feature 2] | Yes/No | P0/P1/P2 |
> | ... | ... | ... |
>
> **P0** = Can't launch without it (max 5)
> **P1** = First week users will demand it
> **P2** = Nice to have, do later
> **P3** = Maybe never"

### Question 2.3: Lock the Five

**Ask:**
> "Based on the payment test, what are your **5 P0 features**?
>
> Rules:
> - Maximum 5 (no exceptions)
> - Each must be testable (yes/no: is it done?)
> - Each must connect to the core value proposition
>
> List them as checkboxes:
> - [ ] Feature 1: [specific, testable]
> - [ ] Feature 2: [specific, testable]
> - [ ] Feature 3: [specific, testable]
> - [ ] Feature 4: [specific, testable]
> - [ ] Feature 5: [specific, testable]"

---

## Section 3: Explicit Non-Goals

### Question 3.1: What You WON'T Build

**Ask:**
> "Now the hard part: What are you explicitly NOT building in v1?
>
> List at least 5 things you'll say NO to, even if users ask:
>
> Common non-goals:
> - No mobile app (web-only)
> - No team/collaboration features (single user)
> - No integrations (standalone)
> - No free tier (paid only from day 1)
> - No admin dashboard (manual ops)
> - No API (just the UI)
> - No white-labeling
> - No multi-language support
>
> **Your non-goals:**
> 1. No ___________
> 2. No ___________
> 3. No ___________
> 4. No ___________
> 5. No ___________"

**Why this matters:**
> "These non-goals are your shield against scope creep. When someone asks for teams support, you point to this list and say 'That's a v2 feature.'"

---

## Section 4: Success Metrics

### Question 4.1: Define Done

**Ask:**
> "How do you know if this MVP succeeded? Define specific, measurable targets:
>
> | Metric | Target | Timeframe |
> |--------|--------|-----------|
> | First paying customer | 1 | Launch day |
> | Total revenue | $??? | 30 days |
> | Active users | ??? | 30 days |
> | [Custom metric] | ??? | ??? |
>
> Be specific! 'Get some users' is not a metric."

---

## Section 5: Create the Contract

**Compile and present:**
> "## MVP Contract: {Product Name}
>
> **Locked:** {Today's Date}
>
> ### Value Proposition
> {One sentence from Question 1.1}
>
> ### P0 Features (5 max)
> 1. [ ] {Feature 1}
> 2. [ ] {Feature 2}
> 3. [ ] {Feature 3}
> 4. [ ] {Feature 4}
> 5. [ ] {Feature 5}
>
> ### Explicit Non-Goals
> - No {non-goal 1}
> - No {non-goal 2}
> - No {non-goal 3}
> - No {non-goal 4}
> - No {non-goal 5}
>
> ### Success Metrics
> | Metric | Target | Timeframe |
> |--------|--------|-----------|
> | {metric} | {target} | {time} |
>
> ### Scope Change Policy
> Any feature addition requires:
> 1. Removing an existing P0 feature, OR
> 2. Explicit contract renegotiation with documented reasoning
>
> **No exceptions. No 'quick additions.' No scope creep.**
>
> ---
>
> Ready to lock this contract? Once locked, we build exactly this—nothing more, nothing less."

---

## Transition

**On confirmation:**
> "Contract locked! Saved to `_vault/active/CONTRACT-{slug}.md`
>
> Next step: Lock your revenue model (pricing, payment flow). Say **'lock pricing'** when ready.
>
> After that, we'll design the UI and then start building!"

---

## Scope Creep Detection

**If user later says "can we also add...":**
> "⚠️ **Scope Creep Detected**
>
> You're asking to add '{feature}' to an MVP with a locked contract.
>
> Per the contract, you can:
> 1. **Remove** one of your P0 features to make room
> 2. **Renegotiate** the entire contract with documented reasoning
> 3. **Add to v2** backlog and build it after launch
>
> Which would you like to do?"

---

*These prompts enable AI-guided workflow through the critical ideation phase.*

