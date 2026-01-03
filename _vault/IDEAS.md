# Ideas Vault

> Centralized index of all Micro-SaaS ideas for GalaxyCo.ai

**Last Updated:** January 3, 2026  
**Total Ideas:** 1

---

## How This Works

Ideas flow through the Launchpad system:

```
Capture (SOP 00) → Validate (SOP 01) → Scope (SOP 02) → Build → Ship
       ↓                ↓                    ↓
   backlog/         active/              shipped/
                                        or killed/
```

---

## Status Definitions

| Status | Location | Meaning |
|--------|----------|---------|
| **backlog** | `_vault/backlog/` | Captured, not yet validated |
| **active** | `_vault/active/` | Validated, in development |
| **shipped** | `_vault/shipped/` | Launched and live |
| **killed** | `_vault/killed/` | Decided not to pursue |

---

## Active Ideas (0)

*No active ideas currently in development.*

---

## Backlog Ideas (1)

### 1. QuickClaims.ai

**Problem:** Insurance claim supplement processing is slow and manual  
**Solution:** AI-powered document parsing and automation for supplement estimators  
**Target:** Roofing contractors and supplement adjustment teams  
**Source:** Rise Roofing Supplements + ServiceTitan  
**File:** `backlog/IDEA-quickclaims-ai.md`

---

## Shipped Ideas (0)

*No shipped products yet.*

---

## Killed Ideas (0)

*No killed ideas yet.*

---

## Adding New Ideas

Use SOP 00 (Idea Intake):

```bash
# Manual capture
1. Create file: _vault/backlog/IDEA-{kebab-case-name}.md
2. Use frontmatter template (see below)
3. Run through SOP 00 checklist
```

### Frontmatter Template

```yaml
---
name: "Product Name"
problem: "One sentence problem statement"
solution: "How we solve it"
source: "Where this idea came from"
status: "backlog"
created_at: "2026-01-03T12:00:00Z"
updated_at: "2026-01-03T12:00:00Z"
---
```

---

## Validation Pipeline

Before moving from backlog to active:

1. Run SOP 01 (Quick Validation)
2. Score problem (1-10)
3. Score market (1-10)
4. Score monetization (1-10)
5. Must score 24+ to proceed

---

## Maintenance

- Update this index when ideas move between folders
- Archive old killed ideas after 90 days
- Review backlog quarterly for new opportunities

---

*This vault tracks every idea that flows through Launchpad.*

