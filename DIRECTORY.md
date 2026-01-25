# Launchpad Directory Guide

> Quick reference for navigating this codebase. For AI assistants and developers.

**Last Updated:** 2025-01-05

---

## Root Files (Start Here)

| File | Purpose | Read When |
|------|---------|-----------|
| `CLAUDE.md` | AI cofounder context, tech stack, preferences | First file to read |
| `MANIFEST.md` | System status, what's built, version info | Checking project status |
| `DIRECTORY.md` | This file - navigation guide | Getting oriented |
| `AGENTS.md` | Agent routing rules | Working with AI agents |
| `GOVERNANCE.md` | Document hygiene rules | Understanding file policies |
| `README.md` | Project overview for humans | New to the project |
| `CURSORRULES.md` | Cursor IDE configuration | Using Cursor |

---

## Directory Map

```
launchpad/
├── Root Files (see above)
│
├── _sops/                    # Standard Operating Procedures
│   ├── 00-idea-intake.md         # Capture ideas to vault
│   ├── 01-quick-validation.md    # Fast validation (125 pts)
│   ├── 01a-rigorous-idea-audit.md # Deep PMF audit (500 pts, 70% kill)
│   ├── 02-mvp-scope-contract.md  # Lock scope before building
│   ├── 03-revenue-model-lock.md  # Define monetization
│   ├── 04-design-brief.md        # Plan UI/UX
│   ├── 05-project-setup.md       # Scaffold new project
│   ├── 06-infrastructure-provisioning.md # Connect services
│   ├── 07-development-protocol.md # Build features
│   ├── 08-testing-qa-checklist.md # QA before ship
│   ├── 09-pre-ship-checklist.md  # Final checks
│   ├── 10-launch-day-protocol.md # Deploy + verify
│   ├── 11-post-launch-monitoring.md # Watch + iterate
│   └── 12-marketing-activation.md # Get customers
│
├── _vault/                   # Ideas Repository
│   ├── IDEAS.md                  # Master index
│   ├── backlog/                  # Ideas awaiting validation
│   ├── active/                   # Ideas in development
│   ├── shipped/                  # Successfully launched
│   ├── killed/                   # Rejected/abandoned
│   └── audits/                   # Rigorous audit reports
│
├── _templates/               # Project Scaffolding
│   ├── project/
│   │   ├── nextjs-web/           # Full-stack web app template
│   │   └── api-only/             # API-only backend template
│   ├── docs/
│   │   ├── PRD.md                # Product requirements template
│   │   ├── PITCH.md              # One-pager template
│   │   └── AUDIT-TEMPLATE.md     # PMF audit template
│   └── env/
│       ├── .env.example          # Master env reference
│       └── .env.local.template   # Developer setup template
│
├── _scripts/                 # PowerShell Automation
│   ├── new-project.ps1           # Create project + AI PRD generation
│   ├── setup-env.ps1             # Interactive env setup
│   ├── provision-db.ps1          # Database provisioning
│   ├── audit-idea.ps1            # PMF audit with AI scoring
│   ├── directory-qco.ps1         # Quality control cleanup
│   ├── setup-hooks.ps1           # Configure git hooks
│   └── modules/                  # PowerShell modules
│       └── Invoke-ClaudeApi.psm1     # Claude API integration
│
├── _stack/                   # Tech Decisions (LOCKED)
│   ├── STACK.md                  # Master tech stack reference
│   ├── dependencies.md           # Approved packages
│   ├── patterns.md               # Code patterns to follow
│   └── anti-patterns.md          # What NOT to do
│
├── _design-system/           # Design Tokens (LOCKED)
│   ├── DESIGN_SYSTEM.md          # Master design reference
│   ├── QUICK_REFERENCE.md        # Cheat sheet
│   ├── tokens/                   # CSS variables
│   │   ├── colors.css
│   │   ├── typography.css
│   │   └── animations.css
│   ├── themes/
│   │   ├── light.css
│   │   └── dark.css
│   ├── icons/
│   │   └── ICONS.md              # Lucide icon reference
│   └── components/
│       └── PREMIUM_COMPONENTS.md # Premium UI patterns
│
├── _integrations/            # Service Setup Guides
│   └── INTEGRATIONS.md           # All services: Clerk, Neon, Stripe, etc.
│
├── _agents/                  # AI/Automation
│   ├── mcp/                      # MCP server configs
│   ├── n8n/workflows/            # n8n workflow templates
│   │   ├── README.md                 # Setup guide
│   │   ├── health-monitor.json       # Daily health dashboard
│   │   ├── idea-intake-notify.json   # Audit result alerts
│   │   └── deploy-alert.json         # Vercel deploy notifications
│   └── prompts/                  # Reusable AI prompts
│       ├── audit-scoring.md          # PMF scoring analysis
│       └── prd-generation.md         # PRD generation prompt
│
├── _archive/                 # Historical Records
│   ├── sessions/                 # Session handoffs (15-day retention)
│   ├── sprints/                  # Sprint plans (15-day retention)
│   └── audits/                   # Code reviews (15-day retention)
│
├── _scratch/                 # Temporary Notes (7-day retention)
│
├── _assets/                  # Static Assets
│   └── launchpad_rocket_logo.png
│
├── .launchpad/               # Internal Config
├── .githooks/                # Git Hooks
│   └── pre-commit                # Orphan doc detection
├── .claude/                  # Claude Code Settings
│
└── projects/                 # Active Project Builds
    └── launchpad-app/            # The Launchpad desktop app itself
        ├── src/                  # Next.js frontend
        ├── src-tauri/            # Tauri Rust backend
        └── HANDOFF.md            # Project-specific context
```

---

## Quick Lookups

### "I need to..."

| Task | Go To |
|------|-------|
| Understand the project | `CLAUDE.md` → `MANIFEST.md` |
| Add a new idea | `_sops/00-idea-intake.md` |
| Validate an idea | `_sops/01a-rigorous-idea-audit.md` |
| Start a new product | `_sops/05-project-setup.md` |
| Find approved packages | `_stack/dependencies.md` |
| Look up design tokens | `_design-system/QUICK_REFERENCE.md` |
| Set up a service | `_integrations/INTEGRATIONS.md` |
| Check project status | `MANIFEST.md` |
| Run a script | `_scripts/` directory |

### "Where is the..."

| Looking For | Location |
|-------------|----------|
| Tech stack | `_stack/STACK.md` |
| Tech baseline | `_stack/TECH_BASELINE.md` |
| Security baseline | `_stack/SECURITY_BASELINE.md` |
| Color palette | `_design-system/tokens/colors.css` |
| Icon list | `_design-system/icons/ICONS.md` |
| Idea backlog | `_vault/backlog/` |
| Audit reports | `_vault/audits/` |
| API template | `_templates/project/api-only/` |
| Web app template | `_templates/project/nextjs-web/` |
| Environment vars | `_templates/env/.env.example` |
| n8n workflows | `_agents/n8n/workflows/` |

---

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| SOP files | `##-name.md` | `05-project-setup.md` |
| Idea files | `IDEA-slug.md` | `IDEA-quickclaims-ai.md` |
| Audit files | `AUDIT-slug.md` | `AUDIT-quickclaims-ai.md` |
| Scripts | `verb-noun.ps1` | `new-project.ps1` |
| Root docs | `SCREAMING_CASE.md` | `MANIFEST.md` |
| Templates | descriptive name | `PRD.md`, `PITCH.md` |

---

## File Lifecycle

```
Idea Flow:
[00-intake] → _vault/backlog/ → [01a-audit] → _vault/active/ → [build] → _vault/shipped/
                                     ↓
                              _vault/killed/

Document Retention:
- _archive/*: 15 days
- _scratch/*: 7 days
- _vault/*: Permanent
```

---

## For AI Assistants

**First:** Read `CLAUDE.md` for context about working style and preferences.

**Before creating files:**
1. Check if file exists in expected location
2. Prefer editing over creating
3. Follow naming conventions above
4. Update `MANIFEST.md` if adding system files

**Key patterns:**
- All config uses underscore prefix (`_sops/`, `_vault/`, etc.)
- `projects/` contains actual product builds
- Templates are in `_templates/project/`
- SOPs are numbered and sequential

---

*This file should be updated when directory structure changes.*
