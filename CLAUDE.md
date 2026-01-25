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
├── _assets/              # Static assets (logos, images)
├── _design-system/       # LOCKED design tokens (light/dark, Lucide icons)
├── _stack/               # LOCKED tech decisions
├── _sops/                # Standard Operating Procedures (00-12 + 01a)
├── _templates/           # Project boilerplates, docs, env files
├── _vault/               # Ideas vault (active/backlog/shipped/killed/audits)
├── _agents/              # n8n workflows, prompts, MCP configs
├── _scripts/             # PowerShell automation
├── _integrations/        # Pre-configured service configs
├── _archive/             # Historical records (15-day retention)
├── _scratch/             # Temporary notes (7-day retention)
└── projects/             # Active project builds
```

## How This Works

**Ideation Phase (SOPs 00-03)**
1. **Idea Intake** → `00-idea-intake.md` captures ideas to vault
2. **Quick Validation** → `01-quick-validation.md` fast check (125 pts)
3. **Rigorous Audit** → `01a-rigorous-idea-audit.md` deep PMF validation (500 pts, 70% kill rate)
4. **Scope Lock** → `02-mvp-scope-contract.md` prevents scope creep
5. **Revenue Lock** → `03-revenue-model-lock.md` defines monetization

**Design Phase (SOP 04)**
6. **Design Brief** → `04-design-brief.md` plans UI before code

**Setup Phase (SOPs 05-06)**
7. **Project Setup** → `05-project-setup.md` scaffolds from templates
8. **Infrastructure** → `06-infrastructure-provisioning.md` connects services

**Build Phase (SOPs 07-08)**
9. **Development** → `07-development-protocol.md` builds features
10. **QA Testing** → `08-testing-qa-checklist.md` ensures quality

**Launch Phase (SOPs 09-10)**
11. **Pre-Ship** → `09-pre-ship-checklist.md` final checks
12. **Launch Day** → `10-launch-day-protocol.md` deploy + verify

**Post-Launch Phase (SOPs 11-12)**
13. **Monitoring** → `11-post-launch-monitoring.md` watch + iterate
14. **Marketing** → `12-marketing-activation.md` acquire customers

## Linked Docs

| Doc | Purpose |
|-----|---------|
| `DIRECTORY.md` | Navigation guide for AI/devs |
| `MANIFEST.md` | System status tracker |
| `_stack/STACK.md` | Locked tech decisions |
| `_design-system/DESIGN_SYSTEM.md` | Design token reference |
| `_vault/IDEAS.md` | Ideas index |
| `AGENTS.md` | AI agent routing |

## Commands

```powershell
# Project scaffolding
.\_scripts\new-project.ps1 -Name "project-name" -Template "nextjs-web"
.\_scripts\setup-env.ps1 -Project "project-name"
.\_scripts\provision-db.ps1 -Project "project-name"

# Idea validation
.\_scripts\audit-idea.ps1 -Slug "idea-slug"
```

## Preferences

- Dalton loves structured documentation and clear frameworks
- Handle everything directly — no "manual steps" for things Claude can do
- Show progress visually — Dalton wants to SEE files being created
- Keep CLAUDE.md updated as persistent context
- Reference `C:\.ai` for global context when needed
