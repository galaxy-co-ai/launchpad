# Launchpad Governance

> Document hygiene, organizational rules, and quality control standards.

**Status:** ACTIVE
**Last Updated:** 2025-12-28
**Enforced By:** All AI agents, all contributors

---

## Purpose

This document defines the organizational rules that keep Launchpad clean, consistent, and navigable. As the codebase grows, these rules prevent entropy — no orphan docs, no mystery files, no "where does this go?" decisions.

**Core Principle:** Every file has exactly one correct location. No exceptions.

---

## Document Placement Rules

### Permanent Documents (Root Level)

These files live in the project root and are **never** deleted:

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `README.md` | Project overview, quick start | As needed |
| `CLAUDE.md` | AI cofounder context | Each session |
| `MANIFEST.md` | System status tracker | After each build phase |
| `AGENTS.md` | Agent routing constitution | As agents are added |
| `GOVERNANCE.md` | This file | Rarely |
| `CURSORRULES.md` | Cursor IDE rules | Rarely |
| `.gitignore` | Git ignore patterns | As needed |

**Rule:** No other markdown files in root. Period.

---

### System Directories

| Directory | Contains | Lifespan |
|-----------|----------|----------|
| `_design-system/` | Design tokens, components, expansions | Permanent |
| `_stack/` | Tech decisions, dependencies, patterns | Permanent |
| `_sops/` | Standard Operating Procedures | Permanent |
| `_templates/` | Project boilerplates, doc templates | Permanent |
| `_vault/` | Ideas (active, backlog, shipped, killed) | Permanent |
| `_agents/` | n8n workflows, prompts, MCP configs | Permanent |
| `_scripts/` | PowerShell automation | Permanent |
| `_integrations/` | Service configs, API setups | Permanent |
| `projects/` | Active project builds | Permanent |

---

### Temporary Directories

| Directory | Contains | Lifespan | Auto-Delete |
|-----------|----------|----------|-------------|
| `_archive/sessions/` | Session handoffs, context transfers | 15 days | Yes |
| `_archive/sprints/` | Sprint plans, retrospectives | 15 days | Yes |
| `_archive/audits/` | Code reviews, project audits | 15 days | Yes |
| `_scratch/` | Throwaway notes, temp exploration | 7 days | Yes |

**Rule:** If you need a doc to survive longer than 15 days, it belongs somewhere permanent.

---

## Document Types & Their Homes

### Session Documents

When an AI agent or human completes a work session:

```
_archive/sessions/YYYY-MM-DD-handoff.md
_archive/sessions/YYYY-MM-DD-context.md
```

**Never:** `SESSION_HANDOFF_20251228.md` in root or random folders.

### Sprint Documents

```
_archive/sprints/YYYY-MM-DD-sprint-plan.md
_archive/sprints/YYYY-MM-DD-retrospective.md
```

**Never:** `SPRINT_PLAN_PHASE_2.md` anywhere.

### Audit Documents

```
_archive/audits/YYYY-MM-DD-code-review.md
_archive/audits/YYYY-MM-DD-project-audit.md
```

### Scratch Notes

For true temporary work — exploring ideas, debugging notes, quick references:

```
_scratch/YYYY-MM-DD-note.md
_scratch/YYYY-MM-DD-debug-log.md
```

**Rule:** Never reference `_scratch/` files from permanent docs. They will disappear.

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Permanent docs | `ALLCAPS.md` | `MANIFEST.md` |
| Dated docs | `YYYY-MM-DD-description.md` | `2025-12-28-session-handoff.md` |
| Config files | `lowercase.ext` | `colors.css` |
| Scripts | `kebab-case.ps1` | `directory-qco.ps1` |

### Rules

- No spaces in filenames (use hyphens)
- No special characters except hyphens and underscores
- Dates always ISO format: `YYYY-MM-DD`
- Lowercase for code files, ALLCAPS for permanent docs

### Directories

- System directories: `_prefixed` (underscore prefix)
- Regular directories: `lowercase`
- No spaces, no special characters

---

## Forbidden Practices

### Never Do This

```
# Docs in wrong places
/SESSION_HANDOFF.md              # Root is for permanent docs only
/src/SPRINT_PLAN.md              # Code directories are for code
/_design-system/MEETING_NOTES.md # System folders have specific purposes

# Bad naming
/Phase 2 Plan.md                 # Spaces, no date
/sprint-plan-v2-FINAL.md         # Version suffixes, "FINAL"
/notes_temp_delete_later.md      # Informal naming

# Orphan docs
/random-thoughts.md              # No category
/TODO.md                         # Use MANIFEST.md instead
/CHANGELOG.md                    # In root (goes in project folders)
```

### Why This Matters

At 200,000+ lines of code:
- 47 orphan docs = hours wasted finding current info
- Inconsistent naming = broken search
- Mixed temp/permanent = stale info treated as current
- Root clutter = cognitive overload

---

## Quality Control Process

### Directory QCO Script

Run `_scripts/directory-qco.ps1` to:

1. **Detect orphan docs** — Markdown in forbidden locations
2. **Flag expired files** — Archive >15 days, scratch >7 days
3. **Check naming violations** — Non-compliant file names
4. **Generate report** — Summary of issues found

```powershell
# Run manually
.\_scripts\directory-qco.ps1

# Run with auto-clean (deletes expired files)
.\_scripts\directory-qco.ps1 -AutoClean
```

### When to Run

- After major work sessions
- Before commits
- Weekly as maintenance

---

## AI Agent Instructions

All AI agents operating in Launchpad must follow these rules:

### When Creating Documents

1. **Determine document type** — Is it permanent or temporary?
2. **Use correct location** — Consult the tables above
3. **Use correct naming** — Date prefix for temp, ALLCAPS for permanent
4. **Never clutter root** — Only the 7 allowed files go in root

### When Finishing Sessions

1. Move any handoff docs to `_archive/sessions/`
2. Move any sprint docs to `_archive/sprints/`
3. Delete anything in `_scratch/` you created
4. Update `MANIFEST.md` if system status changed
5. Update `CLAUDE.md` if context needs preserving

### When Unsure

Ask: "Where would I look for this doc in 6 months?"

- If the answer is "I wouldn't" → `_scratch/`
- If the answer is "maybe" → `_archive/`
- If the answer is "definitely" → Find the correct permanent home

---

## Enforcement

### Automated

- `directory-qco.ps1` catches violations
- Pre-commit hooks can block non-compliant files (optional)

### Manual

- Code reviews include doc hygiene check
- MANIFEST.md updates require governance compliance

### Violations

Files in wrong locations will be:
1. Flagged by QCO script
2. Moved to `_archive/` with original path noted
3. Deleted after 15 days if not properly rehomed

---

## Changelog

| Date | Change |
|------|--------|
| 2025-12-28 | Initial governance rules established |

---

*These rules are non-negotiable. A clean codebase is a fast codebase.*
