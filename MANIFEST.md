# Launchpad Manifest

> System status tracker — what's built, what's pending.

**Last Updated:** 2025-12-28
**Version:** 0.7.0 (SOPs Complete)

---

## Build Status

### Core Files
| File | Status | Notes |
|------|--------|-------|
| `CLAUDE.md` | ✅ Complete | AI cofounder context |
| `CURSORRULES.md` | ✅ Complete | Cursor IDE rules |
| `AGENTS.md` | ✅ Complete | Agent routing constitution |
| `README.md` | ✅ Complete | Project overview |
| `MANIFEST.md` | ✅ Complete | This file |
| `GOVERNANCE.md` | ✅ Complete | Document hygiene rules |
| `.gitignore` | ✅ Complete | Standard ignores |

### Governance (`_archive/`, `_scratch/`, `.githooks/`)
| File | Status | Notes |
|------|--------|-------|
| `_archive/sessions/` | ✅ Complete | Session handoffs (15-day retention) |
| `_archive/sprints/` | ✅ Complete | Sprint plans (15-day retention) |
| `_archive/audits/` | ✅ Complete | Code reviews (15-day retention) |
| `_scratch/` | ✅ Complete | Temp notes (7-day retention) |
| `.githooks/pre-commit` | ✅ Complete | Orphan doc detection on commit |

### Stack (`_stack/`)
| File | Status | Notes |
|------|--------|-------|
| `STACK.md` | ✅ Complete | Locked tech decisions |
| `dependencies.md` | ✅ Complete | Approved packages |
| `patterns.md` | ✅ Complete | Code patterns |
| `anti-patterns.md` | ✅ Complete | What NOT to do |

### Design System (`_design-system/`)
| File | Status | Notes |
|------|--------|-------|
| `DESIGN_SYSTEM.md` | ✅ Complete | Master reference |
| `QUICK_REFERENCE.md` | ✅ Complete | Quick lookup guide |
| `tokens/colors.css` | ✅ Complete | Color tokens (OKLCH) |
| `tokens/typography.css` | ✅ Complete | Font tokens |
| `tokens/animations.css` | ✅ Complete | Animation tokens |
| `themes/light.css` | ✅ Complete | Light mode |
| `themes/dark.css` | ✅ Complete | Dark mode |
| `icons/ICONS.md` | ✅ Complete | Lucide reference |
| `components/PREMIUM_COMPONENTS.md` | ✅ Complete | Premium component guide |

### SOPs (`_sops/`)
| File | Status | Phase | Notes |
|------|--------|-------|-------|
| `00-idea-intake.md` | ✅ Complete | Ideation | Capture and catalog ideas into vault |
| `01-quick-validation.md` | ✅ Complete | Ideation | Validate problem, market, monetization |
| `02-mvp-scope-contract.md` | ✅ Complete | Ideation | Lock features, timeline, success metrics |
| `03-revenue-model-lock.md` | ✅ Complete | Ideation | Define how product makes first dollar |
| `04-design-brief.md` | ✅ Complete | Design | Plan user flows and UI |
| `05-project-setup.md` | ✅ Complete | Setup | Scaffold repo and dev environment |
| `06-infrastructure-provisioning.md` | ✅ Complete | Setup | Connect DB, auth, payments, services |
| `07-development-protocol.md` | ✅ Complete | Build | Build features with quality |
| `08-testing-qa-checklist.md` | ✅ Complete | Build | Ensure functionality, UX, performance |
| `09-pre-ship-checklist.md` | ✅ Complete | Launch | Final checks before production |
| `10-launch-day-protocol.md` | ✅ Complete | Launch | Deploy and verify everything works |
| `11-post-launch-monitoring.md` | ✅ Complete | Post-Launch | Watch for issues, collect feedback |
| `12-marketing-activation.md` | ✅ Complete | Post-Launch | Get first users, generate revenue |

### Ideas Vault (`_vault/`)
| File | Status | Notes |
|------|--------|-------|
| `IDEAS.md` | ⏳ Pending | 140 pre-validated ideas |

### Templates (`_templates/`)
| File | Status | Notes |
|------|--------|-------|
| `env/.env.example` | ✅ Complete | All env vars documented |
| `env/.env.local.template` | ✅ Complete | Developer setup template |
| `docs/PRD.md` | ✅ Complete | Product requirements template |
| `docs/PITCH.md` | ✅ Complete | One-pager pitch template |
| `project/nextjs-web/` | 🔨 Scaffolded | Structure ready, implementation tomorrow |

### Integrations (`_integrations/`)
| File | Status | Notes |
|------|--------|-------|
| `INTEGRATIONS.md` | ✅ Complete | Setup guides for all services |

### Scripts (`_scripts/`)
| File | Status | Notes |
|------|--------|-------|
| `directory-qco.ps1` | ✅ Complete | Quality control cleanup script |
| `setup-hooks.ps1` | ✅ Complete | Configure git to use .githooks/ |
| `new-project.ps1` | ⏳ Pending | |
| `setup-env.ps1` | ⏳ Pending | |
| `provision-db.ps1` | ⏳ Pending | |

---

## Progress Summary

```
Priority 1: Core Files        [7/7]  ██████████ 100% ✅
Priority 2: Governance        [5/5]  ██████████ 100% ✅
Priority 3: Stack             [4/4]  ██████████ 100% ✅
Priority 4: Design System     [9/9]  ██████████ 100% ✅
Priority 5: SOPs              [13/13] ██████████ 100% ✅
Priority 6: Ideas Vault       [0/1]  ░░░░░░░░░░ 0%
Priority 7: Templates         [4/5]  ████████░░ 80%
Priority 8: Integrations      [1/1]  ██████████ 100% ✅
Priority 9: Scripts           [2/5]  ████░░░░░░ 40%

Overall: 45/50 files (90%)
```

---

## Recent Changes

| Date | Change |
|------|--------|
| 2025-12-28 | Rebuilt SOP system: 13 SOPs (00-12) with Universal SOP Framework |
| 2025-12-28 | Scaffolded nextjs-web boilerplate (20+ files, ready for implementation) |
| 2025-12-28 | Added PRD.md and PITCH.md doc templates |
| 2025-12-28 | Added INTEGRATIONS.md — setup guides for all services |
| 2025-12-28 | Added env templates — .env.example, .env.local.template |
| 2025-12-28 | Completed `_stack/` — STACK.md, dependencies.md, patterns.md, anti-patterns.md |
| 2025-12-28 | Added pre-commit hook for orphan doc detection |
| 2025-12-28 | Added `setup-hooks.ps1` script |
| 2025-12-28 | Deleted `_stack/DESIGN_SYSTEM_LOCKED.md` (superseded) |
| 2025-12-28 | Added GOVERNANCE.md with document hygiene rules |
| 2025-12-28 | Created `_archive/` folder structure (sessions, sprints, audits) |
| 2025-12-28 | Created `_scratch/` folder for temporary notes |
| 2025-12-28 | Added `directory-qco.ps1` cleanup script |
| 2025-12-27 | Initial manifest created |

---

## Pending Decisions

- [ ] **Design system restructure:** Implement foundation/expansions architecture for modular theme packs

---

## Setup Instructions

After cloning, run:
```powershell
.\_scripts\setup-hooks.ps1
```
This enables the pre-commit QCO hook.

---

*Update this manifest as files are created.*
