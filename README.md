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
├── _sops/            → Standard Operating Procedures (00-12)
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
| Ideation | `00-idea-intake.md` | Capture and route ideas to vault |
| Ideation | `01-quick-validation.md` | Score painkiller potential |
| Ideation | `02-mvp-scope-contract.md` | Lock scope, prevent creep |
| Ideation | `03-revenue-model-lock.md` | Define monetization model |
| Design | `04-design-brief.md` | Plan UI and user flows |
| Setup | `05-project-setup.md` | Scaffold from templates |
| Setup | `06-infrastructure-provisioning.md` | Connect services |
| Build | `07-development-protocol.md` | Build features with quality |
| Build | `08-testing-qa-checklist.md` | Ensure functionality |
| Launch | `09-pre-ship-checklist.md` | Pre-launch verification |
| Launch | `10-launch-day-protocol.md` | Go-live sequence |
| Post-Launch | `11-post-launch-monitoring.md` | Monitor and iterate |
| Post-Launch | `12-marketing-activation.md` | Acquire customers |

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
| `_vault/IDEAS.md` | Idea vault index |

## Philosophy

1. **100% airtight** — No gaps in templates, SOPs, or checklists
2. **Locked decisions** — Tech and design are decided once
3. **Automation first** — Scripts handle repetitive work
4. **Checkpoints are law** — Complete them all or don't ship

---

Built by Dalton @ [GalaxyCo.ai](https://galaxyco.ai)
