# Reusable Prompts

> Pre-built prompt templates for common Launchpad tasks.

**Last Updated:** 2026-01-03

---

## How to Use

1. Find the prompt you need below
2. Copy the template
3. Fill in the `{VARIABLES}` with your specific context
4. Use with Claude or other LLMs

---

## Prompt Index

| Name | Use Case | Variables |
|------|----------|-----------|
| Idea Validator | Quick validation scoring | `{IDEA_NAME}`, `{PROBLEM}`, `{SOLUTION}` |
| Code Review | Review code for patterns | `{CODE}`, `{CONTEXT}` |
| SOP Checker | Verify SOP completion | `{SOP_NUMBER}`, `{DELIVERABLES}` |

---

## Prompts

### Idea Validator

**Use Case:** Score an idea through SOP-01 Quick Validation criteria.

```
You are evaluating a Micro-SaaS idea for GalaxyCo.ai.

**Idea:** {IDEA_NAME}
**Problem:** {PROBLEM}
**Solution:** {SOLUTION}

Score this idea on three dimensions (1-10 each):

1. **Problem Score** - How painful is this problem?
   - 10 = "Hair on fire" - people desperately need this solved
   - 5 = "Nice to have" - would help but not urgent
   - 1 = "Imaginary problem" - no real pain

2. **Market Score** - Is there a reachable market?
   - 10 = Clear target, easy to find, willing to pay
   - 5 = Vague target, hard to reach
   - 1 = No clear market

3. **Monetization Score** - Can this make money quickly?
   - 10 = Clear pricing, existing willingness to pay
   - 5 = Possible revenue but unclear path
   - 1 = No obvious monetization

Provide:
- Individual scores with reasoning
- Total score (out of 30)
- GO/NO-GO recommendation (24+ = GO)
- Top risk if we proceed
```

---

### Code Review

**Use Case:** Review code against Launchpad patterns.

```
Review this code against Launchpad standards:

**Context:** {CONTEXT}

**Code:**
```
{CODE}
```

Check for:
1. TypeScript strict compliance (no `any`, no `@ts-ignore`)
2. Server vs Client component correctness
3. Zod validation on external inputs
4. Error handling with try-catch
5. Proper loading/error states
6. Accessibility (ARIA, keyboard nav)
7. Following patterns from `_stack/patterns.md`

For each issue found:
- Quote the problematic code
- Explain why it violates standards
- Provide the corrected version
```

---

### SOP Checker

**Use Case:** Verify all deliverables from an SOP are complete.

```
I've completed SOP-{SOP_NUMBER}. Verify my deliverables are complete.

**Deliverables I'm claiming:**
{DELIVERABLES}

Cross-reference against the SOP requirements:
1. Are all required deliverables present?
2. Do they meet the quality gates?
3. What's missing or incomplete?

Provide a PASS/FAIL verdict with specific gaps if any.
```

---

## Adding New Prompts

When adding a prompt:

1. Give it a clear, action-oriented name
2. Describe the use case in one sentence
3. List all variables that need filling
4. Provide the complete prompt template
5. Add to the index table above

---

*Prompts evolve with use. Update when you find improvements.*

