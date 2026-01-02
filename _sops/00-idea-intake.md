# 00-idea-intake.md

> **One-liner:** Capture and catalog ideas systematically into the vault

---

## Overview

**Purpose:** Ensure no idea gets lost. Every spark—whether from a shower thought, customer complaint, or competitive analysis—gets captured in a structured format that enables future evaluation.

**When to Use:**
- When you have a new product/feature idea
- When you spot a problem worth solving
- When a customer pain point surfaces
- When competitive research reveals a gap

**Expected Duration:** 5-15 minutes per idea

**Phase:** Ideation

---

## Prerequisites (Gates to Enter)

- [ ] Access to the `_vault/` directory
- [ ] Basic understanding of the problem space (even if vague)
- [ ] Idea is software-related (Micro-SaaS, tool, automation)

**Cannot proceed without:** An actual idea to capture. Vague feelings of "something should exist" don't count—you need at least a rough problem statement.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Vault Directory | Store idea files | `_vault/backlog/` |
| Idea Template | Standardized format | Below in this SOP |
| IDEAS.md | Quick reference index | `_vault/IDEAS.md` |

---

## Step-by-Step Checklist

### Step 1: Quick Capture
- [ ] Write the raw idea in one sentence (problem or solution framing)
- [ ] Note the source (where did this idea come from?)
- [ ] Capture immediately—don't wait, ideas decay

**Output:** Raw idea sentence + source

### Step 2: Create Idea File
- [ ] Create file: `_vault/backlog/IDEA-[slug].md`
- [ ] Use kebab-case for slug (e.g., `IDEA-ai-invoice-generator.md`)
- [ ] Fill in the Idea Template below

**Idea Template:**
```markdown
# IDEA: [Name]

**Captured:** [Date]
**Source:** [Where this came from]
**Status:** Backlog

## Problem Statement
[Who has this problem? What pain does it cause? How do they currently solve it?]

## Proposed Solution
[What would we build? One paragraph max.]

## Initial Signals
- **Searched for solutions?** [Yes/No - did you look for existing tools?]
- **Would you pay for this?** [Yes/No/Maybe + price point guess]
- **Know someone with this pain?** [Yes/No - real person, not hypothetical]

## Raw Notes
[Dump any additional context, links, screenshots, quotes here]
```

**Output:** Idea file created in `_vault/backlog/`

### Step 3: Index the Idea
- [ ] Add one-line entry to `_vault/IDEAS.md` index
- [ ] Format: `| [Slug] | [One-liner] | Backlog | [Date] |`

**Output:** Idea indexed for quick reference

### Step 4: Initial Triage
- [ ] Does this solve a painful problem? (gut check)
- [ ] Is this technically feasible with our stack?
- [ ] Could this generate revenue within 30 days of launch?
- [ ] If all three = Yes, consider moving to `_vault/active/` immediately

**Output:** Triage decision documented

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Idea File | Markdown | `_vault/backlog/IDEA-[slug].md` | File exists with all template sections |
| Index Entry | Table row | `_vault/IDEAS.md` | Idea appears in index |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Problem Clarity:** Can explain the problem in one sentence without jargon
- [ ] **File Created:** Idea file exists in `_vault/backlog/` with template filled
- [ ] **Indexed:** Idea appears in `_vault/IDEAS.md`
- [ ] **Source Documented:** Know where this idea came from

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Solution-first thinking | Exciting tech blinds you to problem | Always write problem statement before solution |
| Idea hoarding | Fear of killing ideas later | Vault is cheap storage—capture everything, filter later |
| Over-detailing early | Premature optimization | Keep intake light; validation SOP does deep analysis |
| Forgetting the source | Memory fades | Capture source immediately, even if it's "random thought" |
| Duplicate ideas | Not checking index | Search IDEAS.md before creating new file |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 00-idea-intake
Deliverables: IDEA-[slug].md created, indexed in IDEAS.md
Next: 01-quick-validation
Blockers: None
```

**Next SOP:** `01-quick-validation.md`

---

*Last Updated: 2025-12-28*
