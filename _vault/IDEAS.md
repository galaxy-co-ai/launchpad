# Ideas Vault Index

> Master index of all captured ideas across the Launchpad system.

**Last Updated:** 2026-01-26

---

## Quick Stats

| Status | Count |
|--------|-------|
| Active | 0 |
| Backlog | 0 |
| Shipped | 0 |
| Killed | 0 |
| **Total** | **0** |

---

## Usage

### Adding a New Idea
1. Run `SOP 00-idea-intake.md`
2. Create file: `_vault/backlog/IDEA-[slug].md`
3. Add entry to the index table below
4. Update Quick Stats

### Moving Ideas Between Stages
- **Backlog → Active:** Passed validation (SOP 01), move file to `_vault/active/`
- **Active → Shipped:** Launched successfully (SOP 10), move file to `_vault/shipped/`
- **Any → Killed:** Failed validation or abandoned, move file to `_vault/killed/`

### Naming Convention
- File: `IDEA-[kebab-case-name].md`
- Slug: Use kebab-case, keep under 30 chars
- Examples: `IDEA-ai-invoice-tool.md`, `IDEA-saas-boilerplate.md`

---

## Index

### Active (In Development)

| Slug | One-liner | Started | Phase |
|------|-----------|---------|-------|
| *None yet* | — | — | — |

### Backlog (Awaiting Validation)

| Slug | One-liner | Captured | Source |
|------|-----------|----------|--------|
| *None yet* | — | — | — |

### Shipped (Live Products)

| Slug | One-liner | Shipped | Revenue |
|------|-----------|---------|---------|
| *None yet* | — | — | — |

### Killed (Rejected/Abandoned)

| Slug | One-liner | Killed | Reason |
|------|-----------|--------|--------|
| *None yet* | — | — | — |

---

## Idea Pipeline Flow

```
[Intake] → [Backlog] → [Validation] → [Active] → [Build] → [Ship] → [Shipped]
                ↓                         ↓
             [Kill]                    [Kill]
```

---

## Search Tips

- Use `Ctrl+F` to search by keyword
- Check slugs for similar ideas before creating duplicates
- Review killed ideas—sometimes timing changes viability

---

*This file is referenced by SOP 00-idea-intake.md*
