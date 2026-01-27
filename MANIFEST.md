# Launchpad Manifest

> System status tracker — what's built, what's pending.

**Last Updated:** 2026-01-26
**Version:** 1.8.0 (SOP Improvements Sprint)

---

## Build Status

### Core Files
| File | Status | Notes |
|------|--------|-------|
| `CLAUDE.md` | ✅ Complete | AI cofounder context |
| `DIRECTORY.md` | ✅ Complete | Navigation guide for AI/devs |
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
| `TECH_BASELINE.md` | ✅ Complete | Canonical version baseline |
| `SECURITY_BASELINE.md` | ✅ Complete | Credential + CI security rules |
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
| `VERSIONING.md` | ✅ Complete | — | SOP versioning policy |
| `00-idea-intake.md` | ✅ Complete | Ideation | Capture and catalog ideas into vault |
| `01-quick-validation.md` | ✅ Complete | Ideation | Validate problem, market, monetization |
| `01a-rigorous-idea-audit.md` | ✅ Complete | Ideation | Deep PMF validation (70% kill rate) |
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

#### SOP Version Table

All SOPs follow semantic versioning. See `_sops/VERSIONING.md` for bump policy.

| SOP | Version | Last Updated | Notable Changes |
|-----|---------|--------------|-----------------|
| `00-idea-intake` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `01-quick-validation` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `01a-rigorous-idea-audit` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `02-mvp-scope-contract` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `03-revenue-model-lock` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `04-design-brief` | 1.0.0 | 2026-01-26 | + Accessibility checklist (Step 2.5) |
| `05-project-setup` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `06-infrastructure-provisioning` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `07-development-protocol` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `08-testing-qa-checklist` | 1.0.0 | 2026-01-26 | + Automated testing section (Step 5.5) |
| `09-pre-ship-checklist` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `10-launch-day-protocol` | 1.0.0 | 2026-01-26 | + Product Hunt playbook |
| `11-post-launch-monitoring` | 1.0.0 | 2026-01-26 | Initial versioned release |
| `12-marketing-activation` | 1.0.0 | 2026-01-26 | Initial versioned release |

### Ideas Vault (`_vault/`)
| File | Status | Notes |
|------|--------|-------|
| `IDEAS.md` | ✅ Complete | Master index for idea tracking |
| `audits/` | ✅ Complete | Rigorous audit reports (AUDIT-[slug].md) |

### Templates (`_templates/`)
| File | Status | Notes |
|------|--------|-------|
| `env/.env.example` | ✅ Complete | All env vars documented |
| `env/.env.local.template` | ✅ Complete | Developer setup template |
| `docs/PRD.md` | ✅ Complete | Product requirements template |
| `docs/PITCH.md` | ✅ Complete | One-pager pitch template |
| `docs/AUDIT-TEMPLATE.md` | ✅ Complete | Rigorous audit report template |
| `project/nextjs-web/` | ✅ Complete | Full-stack web app boilerplate |
| `project/nextjs-web/lib/db/seed.ts` | ✅ Complete | Test users & subscriptions seed |
| `project/api-only/` | ✅ Complete | API-only backend (Edge, Clerk, Upstash) |
| `project/api-only/src/lib/db/seed.ts` | ✅ Complete | Items, API keys, usage events seed |

### Integrations (`_integrations/`)
| File | Status | Notes |
|------|--------|-------|
| `INTEGRATIONS.md` | ✅ Complete | Setup guides for all services |

### Scripts (`_scripts/`)
| File | Status | Notes |
|------|--------|-------|
| `directory-qco.ps1` | ✅ Complete | Quality control cleanup script |
| `setup-hooks.ps1` | ✅ Complete | Configure git to use .githooks/ |
| `new-project.ps1` | ✅ Complete | Create project + optional AI PRD generation |
| `setup-env.ps1` | ✅ Complete | Interactive environment setup |
| `provision-db.ps1` | ✅ Complete | Neon/Drizzle database provisioning |
| `audit-idea.ps1` | ✅ Complete | PMF audit with AI-assisted scoring |
| `sop-status.ps1` | ✅ Complete | SOP navigator for project progress tracking |
| `modules/Invoke-ClaudeApi.psm1` | ✅ Complete | Claude API PowerShell module |

### AI Prompts (`_agents/prompts/`)
| File | Status | Notes |
|------|--------|-------|
| `audit-scoring.md` | ✅ Complete | PMF scoring analysis prompt |
| `prd-generation.md` | ✅ Complete | PRD generation prompt |
| `sop-assistant.md` | ✅ Complete | SOP navigation assistant prompt |

### MCP Server (`_agents/mcp/launchpad-server/`)
| File | Status | Notes |
|------|--------|-------|
| `package.json` | ✅ Complete | Dependencies and scripts |
| `tsconfig.json` | ✅ Complete | TypeScript config |
| `src/index.ts` | ✅ Complete | Server entry point |
| `src/tools/sops.ts` | ✅ Complete | SOP tools (get, list, search) |
| `src/tools/ideas.ts` | ✅ Complete | Idea tools (CRUD) |
| `src/tools/audits.ts` | ✅ Complete | Audit tools |
| `src/tools/projects.ts` | ✅ Complete | Project tools |
| `src/tools/vault.ts` | ✅ Complete | Vault stats |
| `src/tools/sop-assistant.ts` | ✅ Complete | AI SOP Assistant (ask, suggest) |
| `src/resources/index.ts` | ✅ Complete | Resource handlers |
| `src/utils/paths.ts` | ✅ Complete | Path utilities |
| `src/utils/markdown.ts` | ✅ Complete | Markdown parsing |
| `README.md` | ✅ Complete | Setup instructions |

### n8n Workflows (`_agents/n8n/workflows/`)
| File | Status | Notes |
|------|--------|-------|
| `README.md` | ✅ Complete | Setup guide, import instructions |
| `health-monitor.json` | ✅ Complete | Daily health dashboard (Sentry, Stripe, Vercel, Neon) |
| `idea-intake-notify.json` | ✅ Complete | Audit result notifications (proceed/pivot/kill) |
| `deploy-alert.json` | ✅ Complete | Vercel deployment notifications |

### Assets (`_assets/`)
| File | Status | Notes |
|------|--------|-------|
| `launchpad_rocket_logo.png` | ✅ Complete | Launchpad logo |

### CI/CD (`.github/workflows/`)
| File | Status | Notes |
|------|--------|-------|
| `ci.yml` | ✅ Complete | Lint + type-check + build on PRs |
| `nextjs-web/.github/workflows/ci.yml` | ✅ Complete | CI template for web projects |
| `api-only/.github/workflows/ci.yml` | ✅ Complete | CI template for API projects |

---

## Progress Summary

```
Priority 1: Core Files        [8/8]   ██████████ 100% ✅
Priority 2: Governance        [5/5]   ██████████ 100% ✅
Priority 3: Stack             [6/6]   ██████████ 100% ✅
Priority 4: Design System     [9/9]   ██████████ 100% ✅
Priority 5: SOPs              [15/15] ██████████ 100% ✅
Priority 6: Ideas Vault       [2/2]   ██████████ 100% ✅
Priority 7: Templates         [9/9]   ██████████ 100% ✅
Priority 8: Integrations      [1/1]   ██████████ 100% ✅
Priority 9: Scripts           [8/8]   ██████████ 100% ✅
Priority 10: Assets           [1/1]   ██████████ 100% ✅
Priority 11: n8n Workflows    [4/4]   ██████████ 100% ✅
Priority 12: CI/CD            [3/3]   ██████████ 100% ✅
Priority 13: AI Prompts       [3/3]   ██████████ 100% ✅
Priority 14: MCP Server       [13/13] ██████████ 100% ✅

Overall: 87/87 files (100%) ✅
```

---

## Recent Changes

| Date | Change |
|------|--------|
| 2026-01-26 | SOP Improvements Sprint: Added Version 1.0.0 to all 14 SOPs |
| 2026-01-26 | Created _sops/VERSIONING.md versioning policy document |
| 2026-01-26 | Added accessibility checklist (Step 2.5) to SOP 04 |
| 2026-01-26 | Added automated testing section (Step 5.5) to SOP 08 |
| 2026-01-26 | Added comprehensive Product Hunt playbook to SOP 10 |
| 2026-01-26 | Created sop-status.ps1 navigator script for tracking project SOP progress |
| 2026-01-24 | Added TECH_BASELINE.md and SECURITY_BASELINE.md to lock canonical versions and security rules |
| 2026-01-24 | Created sprint plan for baseline alignment + security hardening |
| 2026-01-24 | Aligned launchpad-app package versions to the locked stack baseline |
| 2026-01-24 | Added CI secret scanning via gitleaks action |
| 2026-01-24 | Removed unused code warnings in launchpad-app and restored clean lint output |
| 2026-01-24 | Updated git remote to SSH to eliminate embedded token risk |
| 2025-01-05 | Added AI SOP Assistant: ask_sop_assistant, suggest_next_sop tools |
| 2025-01-05 | Added sop-assistant.md prompt template for AI navigation help |
| 2025-01-05 | Added MCP server: 12 tools for ideas, SOPs, audits, projects, vault |
| 2025-01-05 | Added Claude AI integration: Invoke-ClaudeApi.psm1 module |
| 2025-01-05 | Enhanced audit-idea.ps1 with AI-assisted scoring suggestions |
| 2025-01-05 | Enhanced new-project.ps1 with optional AI PRD generation |
| 2025-01-05 | Added prompt templates: audit-scoring.md, prd-generation.md |
| 2025-01-05 | Added database seed scripts (pnpm db:seed) to both templates |
| 2025-01-05 | Completed nextjs-web DB layer: schema.ts, index.ts, seed.ts |
| 2025-01-05 | Added GitHub Actions CI/CD: lint, type-check, build on PRs (Vercel handles deploy) |
| 2025-01-05 | Added n8n workflow templates: health-monitor, idea-intake-notify, deploy-alert |
| 2025-01-05 | Directory hygiene: Added DIRECTORY.md, moved logo to _assets/, added .gitkeep files |
| 2025-01-05 | Added api-only template (Edge runtime, Clerk, Upstash rate limiting) |
| 2025-01-05 | Added 01a-rigorous-idea-audit.md — 5-pillar PMF validation (70% kill rate) |
| 2025-01-05 | Added AUDIT-TEMPLATE.md and audit-idea.ps1 interactive script |
| 2025-01-05 | Created _vault/audits/ for rigorous audit reports |
| 2025-01-05 | Fixed all gaps: IDEAS.md, new-project.ps1, setup-env.ps1, provision-db.ps1 |
| 2025-01-05 | Cleaned up nextjs-web template (removed committed node_modules) |
| 2025-01-05 | Achieved 100% completion — all 50 files complete |
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

## Setup Instructions

After cloning, run:
```powershell
.\_scripts\setup-hooks.ps1
```
This enables the pre-commit QCO hook.

---

*Update this manifest as files are created.*
