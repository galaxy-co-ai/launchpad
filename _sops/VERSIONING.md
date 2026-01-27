# SOP Versioning Policy

> How we version and track changes to Launchpad SOPs

---

## Version Format

All SOPs use semantic versioning: `MAJOR.MINOR.PATCH`

**Example:** `Version: 1.2.3`

---

## Bump Guidelines

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| **Major (X.0.0)** | Breaking changes | Steps removed, reordered, or fundamentally changed; SOP renamed; incompatible with previous workflow |
| **Minor (1.X.0)** | New content | New steps added, significant sections expanded, new templates or checklists, quality gates changed |
| **Patch (1.0.X)** | Small fixes | Typos corrected, clarifications added, links updated, formatting fixed, dates updated |

---

## When to Bump

### Major Version (Breaking)
- Renaming or removing an SOP step
- Changing the order of steps
- Removing required deliverables
- Changing quality gates in a way that invalidates previous work
- Splitting an SOP into multiple SOPs

### Minor Version (New Content)
- Adding a new step (e.g., "Step 5.5: Automated Testing")
- Adding a significant new section (e.g., Product Hunt playbook)
- Adding new templates or checklists
- Changing coverage requirements or thresholds
- Adding new quality gates

### Patch Version (Fixes)
- Fixing typos or grammar
- Updating "Last Updated" dates
- Clarifying existing instructions
- Fixing broken links
- Minor formatting improvements

---

## Header Format

Each SOP should include version information in this format:

```markdown
# XX-sop-name.md

> **One-liner:** [Brief description]

**Version:** 1.0.0
**Last Updated:** YYYY-MM-DD

---
```

---

## Changelog

Each SOP may optionally include a changelog section at the bottom:

```markdown
---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | 2026-02-15 | Added accessibility checklist |
| 1.0.1 | 2026-01-28 | Fixed typo in step 3 |
| 1.0.0 | 2026-01-26 | Initial versioned release |
```

---

## Tracking

The `MANIFEST.md` file in the repository root contains a version table for all SOPs. Update this table when bumping any SOP version.

---

## Initial Versioning

All SOPs start at `1.0.0` as of 2026-01-26. This represents the first versioned release of the complete Launchpad SOP system.

---

*Last Updated: 2026-01-26*
