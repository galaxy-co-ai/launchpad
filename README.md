# 🚀 Launchpad

**Micro-SaaS Shipping Framework** — GalaxyCo.ai Startup Studio

> Completing all checkpoints = shipped, revenue-ready product. No exceptions.

## What Is This?

Launchpad is an internal developer platform for rapidly shipping Micro-SaaS products. It eliminates the "75% completion trap" with structured SOPs, locked tech decisions, and automation.

**Not a project.** A meta-framework that spawns projects.

## Quick Start

```powershell
# 1. Create new project from template
.\_scripts\new-project.ps1 -name "my-saas" -template "nextjs-web"

# 2. Configure environment
.\_scripts\setup-env.ps1 -project "my-saas"

# 3. Provision database
.\_scripts\provision-db.ps1 -project "my-saas"

# 4. Start building
cd projects/my-saas
npm run dev
```

## Directory Structure

```
launchpad/
├── _design-system/   → LOCKED design tokens, components, themes
├── _stack/           → LOCKED tech decisions, patterns, anti-patterns
├── _sops/            → Standard Operating Procedures (0-7)
├── _templates/       → Project boilerplates, docs, env files
├── _vault/           → Ideas vault (active/backlog/shipped/killed)
├── _agents/          → n8n workflows, prompts, MCP configs
├── _scripts/         → PowerShell automation
├── _integrations/    → Pre-configured service credentials
└── projects/         → Active project builds
```

## The SOP Pipeline

| Phase | SOP | Purpose |
|-------|-----|---------|
| 0 | `00-idea-intake.md` | Capture and route ideas to vault |
| 1 | `01-validation.md` | Score painkiller potential |
| 2 | `02-mvp-scope-contract.md` | Lock scope, prevent creep |
| 3 | `03-project-setup.md` | Scaffold from templates |
| 4 | `04-build-sprint.md` | Structured dev with checkpoints |
| 5 | `05-ship-checklist.md` | Pre-launch verification |
| 6 | `06-launch.md` | Go-live sequence |
| 7 | `07-post-launch.md` | Monitor, iterate, grow |

## Tech Stack (LOCKED)

| Layer | Technology |
|-------|------------|
| Language | TypeScript (strict) |
| Framework | Next.js 15 |
| Styling | Tailwind + shadcn/ui |
| Validation | Zod |
| Auth | Clerk |
| Database | Neon PostgreSQL |
| ORM | Drizzle |
| Cache | Upstash Redis |
| AI | Claude API |
| Payments | Stripe |
| Hosting | Vercel |
| Errors | Sentry |
| Desktop | Tauri 2.0 |

## Key Docs

| Doc | Purpose |
|-----|---------|
| `CLAUDE.md` | AI cofounder context |
| `CURSORRULES.md` | Cursor IDE rules |
| `AGENTS.md` | Agent routing constitution |
| `MANIFEST.md` | System status tracker |
| `_vault/IDEAS.md` | 140 pre-validated ideas |

## Philosophy

1. **100% airtight** — No gaps in templates, SOPs, or checklists
2. **Locked decisions** — Tech and design are decided once
3. **Automation first** — Scripts handle repetitive work
4. **Checkpoints are law** — Complete them all or don't ship

---

Built by Dalton @ [GalaxyCo.ai](https://galaxyco.ai)
