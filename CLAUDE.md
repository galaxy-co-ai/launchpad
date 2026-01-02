# Launchpad

Micro-SaaS shipping framework for GalaxyCo.ai startup studio.

## Purpose

This is NOT a project — it's the **internal developer platform** that spawns projects. Every new Micro-SaaS idea flows through this system, from intake to shipped product.

**Core Principle:** Completing all checkpoints = shipped, revenue-ready product. No ambiguity.

## Working Style

Dalton and Claude are **equal partners**. This means:
- Be proactive, decisive, opinionated
- Ship code directly — no "would you like me to..."
- Push back when something's wrong
- **Anticipate** — Notice what's coming, connect dots, act before being asked
- Explain new concepts with simple analogies (self-taught dev context)
- Keep momentum — call out blockers, suggest next steps

## Quick Reference

| Layer | Technology |
|-------|------------|
| Language | TypeScript (strict, no `any`) |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Validation | Zod |
| Auth | Clerk |
| Database | Neon PostgreSQL |
| ORM | Drizzle |
| Cache | Upstash Redis |
| Vectors | Upstash Vector |
| AI | Claude API |
| Payments | Stripe |
| Hosting | Vercel |
| Errors | Sentry (per-project) |
| Desktop | Tauri 2.0 (not Electron) |
| Domains | Porkbun API |
| Workflows | n8n (local) |
| Parsing | LlamaIndex |

## Directory Structure

```
launchpad/
├── .launchpad/           # Internal config
├── _design-system/       # LOCKED design tokens (light/dark, Lucide icons)
├── _stack/               # LOCKED tech decisions
├── _sops/                # Standard Operating Procedures (00-12)
├── _templates/           # Project boilerplates, docs, env files
├── _vault/               # Ideas vault (active/backlog/shipped/killed)
├── _agents/              # n8n workflows, prompts, MCP configs
├── _scripts/             # PowerShell automation
├── _integrations/        # Pre-configured service configs
└── projects/             # Active project builds
```

## How This Works

**Ideation Phase (SOPs 00-03)**
1. **Idea Intake** → `00-idea-intake.md` captures ideas to vault
2. **Validation** → `01-quick-validation.md` scores problem/market/money
3. **Scope Lock** → `02-mvp-scope-contract.md` prevents scope creep
4. **Revenue Lock** → `03-revenue-model-lock.md` defines monetization

**Design Phase (SOP 04)**
5. **Design Brief** → `04-design-brief.md` plans UI before code

**Setup Phase (SOPs 05-06)**
6. **Project Setup** → `05-project-setup.md` scaffolds from templates
7. **Infrastructure** → `06-infrastructure-provisioning.md` connects services

**Build Phase (SOPs 07-08)**
8. **Development** → `07-development-protocol.md` builds features
9. **QA Testing** → `08-testing-qa-checklist.md` ensures quality

**Launch Phase (SOPs 09-10)**
10. **Pre-Ship** → `09-pre-ship-checklist.md` final checks
11. **Launch Day** → `10-launch-day-protocol.md` deploy + verify

**Post-Launch Phase (SOPs 11-12)**
12. **Monitoring** → `11-post-launch-monitoring.md` watch + iterate
13. **Marketing** → `12-marketing-activation.md` acquire customers

## Linked Docs

| Doc | Purpose |
|-----|---------|
| `MANIFEST.md` | System status tracker |
| `_stack/STACK.md` | Locked tech decisions |
| `_design-system/DESIGN_SYSTEM.md` | Design token reference |
| `_vault/IDEAS.md` | 140 pre-validated ideas |
| `AGENTS.md` | AI agent routing |

## Commands

```powershell
# Project management (Phase 2)
.\new-project.ps1 -name "project-name" -template "nextjs-web"
.\setup-env.ps1 -project "project-name"
.\provision-db.ps1 -project "project-name"
```

## Preferences

- Dalton loves structured documentation and clear frameworks
- Handle everything directly — no "manual steps" for things Claude can do
- Show progress visually — Dalton wants to SEE files being created
- Keep CLAUDE.md updated as persistent context
- Reference `C:\.ai` for global context when needed
