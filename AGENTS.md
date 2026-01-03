# Launchpad Agent Constitution

> Operating system for AI agents working on GalaxyCo.ai Micro-SaaS projects.

**Owner:** Dalton  
**Version:** 1.1  
**Updated:** 2026-01-03

---

## How This Works

**If you're an AI agent:** Read this document first. It tells you what to load based on context.

**If you're Dalton:** This defines how AI agents should behave across the Launchpad system.

---

## System Architecture

```
launchpad/
├── _agents/              # Agent configurations
│   ├── n8n/workflows/    # Automated workflows
│   ├── prompts/          # Reusable prompt templates
│   └── mcp/              # MCP server configs
├── _sops/                # Process documentation (load by phase)
├── _stack/               # Tech decisions (always reference)
├── _design-system/       # Design tokens (always reference)
├── _templates/           # Boilerplates (load when scaffolding)
└── projects/             # Active projects (load by project)
```

---

## Loading Priority

| Tier | What | Load When | Override? |
|------|------|-----------|-----------|
| 0 | `CLAUDE.md` | Always | Never |
| 1 | `_stack/STACK.md` | Always | Never |
| 2 | `_design-system/DESIGN_SYSTEM.md` | Building UI | Never |
| 3 | `_sops/{phase}.md` | Based on workflow phase | Project can extend |
| 4 | `projects/{name}/CLAUDE.md` | Working on specific project | Adds specifics |

---

## Quick Routing

**"I have a new idea"**  
→ Load `_sops/00-idea-intake.md` → Route to `_vault/`

**"I'm validating an idea"**  
→ Load `_sops/01-quick-validation.md` → Score painkiller potential

**"I'm scoping an MVP"**  
→ Load `_sops/02-mvp-scope-contract.md` + `_sops/03-revenue-model-lock.md`  
→ Lock features and monetization

**"I'm designing the product"**  
→ Load `_sops/04-design-brief.md` + `_design-system/DESIGN_SYSTEM.md`  
→ Plan UI before code

**"I'm starting a new project"**  
→ Load `_sops/05-project-setup.md` + `_sops/06-infrastructure-provisioning.md`  
→ Run `_scripts/new-project.ps1`

**"I'm building a feature"**  
→ Load `_sops/07-development-protocol.md` + `_stack/STACK.md`  
→ Reference `_design-system/` for UI

**"I'm testing/QA"**  
→ Load `_sops/08-testing-qa-checklist.md` → Ensure quality

**"I'm ready to ship"**  
→ Load `_sops/09-pre-ship-checklist.md` → No gaps allowed

**"I'm launching"**  
→ Load `_sops/10-launch-day-protocol.md` → Go-live sequence

**"I'm monitoring/iterating"**  
→ Load `_sops/11-post-launch-monitoring.md` → Watch + iterate

**"I'm marketing"**  
→ Load `_sops/12-marketing-activation.md` → Acquire customers

---

## Tool Integrations

All integration setup guides are consolidated in `_integrations/INTEGRATIONS.md`.

| Tool | Purpose | Setup Guide Section |
|------|---------|---------------------|
| Neon | PostgreSQL database | Section 1 |
| Clerk | Authentication | Section 2 |
| Upstash Redis | Cache + rate limiting | Section 3 |
| Stripe | Payments | Section 4 |
| Anthropic | Claude AI | Section 5 |
| Upstash Vector | Vector DB for AI | Section 6 |
| Sentry | Error tracking | Section 7 |
| Vercel | Hosting + deploy | Section 8 |
| Resend | Email | Section 9 |
| UploadThing | File uploads | Section 10 |

**Agent Tooling:**
| Tool | Purpose | Config Location |
|------|---------|-----------------|
| n8n | Workflow automation | `_agents/n8n/workflows/` |
| MCP Servers | AI tool access | `_agents/mcp/` |
| Prompts | Reusable templates | `_agents/prompts/` |

---

## Agent Behavior Rules

### Always Do
- Reference `_stack/STACK.md` before suggesting any technology
- Use Lucide icons only (design system locked)
- Validate all inputs with Zod
- Check `_design-system/` before building UI
- Run through relevant SOP checklist before marking complete
- Keep `CLAUDE.md` and project docs updated

### Never Do
- Suggest technologies outside the locked stack
- Skip validation phases (no shortcuts)
- Leave environment variables undocumented
- Ship without Sentry configured
- Use Electron (Tauri only for desktop)
- Ignore accessibility requirements

### Decision Escalation
If uncertain about:
- **Tech choice** → Check `_stack/STACK.md`, then ask
- **Design choice** → Check `_design-system/`, then ask
- **Process** → Check relevant `_sops/`, then ask
- **Scope** → Reference `_sops/02-mvp-scope-contract.md`

---

## Global Context

For broader context about Dalton, GalaxyCo, and cross-project patterns:
→ Reference `C:\.ai` (agent constitution for entire machine)

---

## Project-Specific Agents

Each project in `projects/` should have its own:
- `CLAUDE.md` — Project-specific context
- `.cursorrules` — Any project-specific rules
- `README.md` — Setup and documentation

These extend (never override) the Launchpad foundation.

---

*When in doubt: Load Launchpad CLAUDE.md, check the relevant SOP, then ask.*
