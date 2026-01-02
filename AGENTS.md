# Launchpad Agent Constitution

> Operating system for AI agents working on GalaxyCo.ai Micro-SaaS projects.

**Owner:** Dalton  
**Version:** 1.0  
**Updated:** 2025-12-27

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
→ Load `_sops/01-validation.md` → Score painkiller potential

**"I'm starting a new project"**  
→ Load `_sops/02-mvp-scope-contract.md` + `_sops/03-project-setup.md`  
→ Run `_scripts/new-project.ps1`

**"I'm building a feature"**  
→ Load `_sops/04-build-sprint.md` + `_stack/STACK.md`  
→ Reference `_design-system/` for UI

**"I'm ready to ship"**  
→ Load `_sops/05-ship-checklist.md` → No gaps allowed

**"I'm launching"**  
→ Load `_sops/06-launch.md` → Go-live sequence

**"I'm monitoring/iterating"**  
→ Load `_sops/07-post-launch.md` → Feedback loops

---

## Tool Integrations

| Tool | Purpose | Config Location |
|------|---------|-----------------|
| GitHub | Version control | `_integrations/github/` |
| Vercel | Hosting + deploy | `_integrations/vercel/` |
| Clerk | Authentication | `_integrations/clerk/` |
| Stripe | Payments | `_integrations/stripe/` |
| Sentry | Error tracking | `_integrations/sentry/` |
| Porkbun | Domain purchase | `_integrations/porkbun/` |
| Neon | PostgreSQL | `_integrations/neon/` |
| Upstash | Redis + Vector | `_integrations/upstash/` |
| Canva MCP | Brand generation | `_agents/mcp/` |
| n8n | Workflow automation | `_agents/n8n/workflows/` |

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
