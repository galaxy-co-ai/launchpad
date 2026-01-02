# 05-project-setup.md

> **One-liner:** Scaffold project repo and development environment

---

## Overview

**Purpose:** Create the project repository with all boilerplate in place. After this SOP, you have a running local dev environment with the full tech stack ready—no more setup, just building.

**When to Use:**
- After design brief is complete
- When ready to start actual development
- Transitioning from planning phase to build phase

**Expected Duration:** 30-60 minutes

**Phase:** Setup

---

## Prerequisites (Gates to Enter)

- [ ] Design Brief completed (`04-design-brief`)
- [ ] MVP Contract exists with locked features
- [ ] Revenue Model locked with pricing
- [ ] All ideation phase docs in `_vault/active/`

**Cannot proceed without:** Completed design brief with screen inventory.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Node.js 20+ | Runtime | nodejs.org |
| pnpm | Package manager | pnpm.io |
| Git | Version control | git-scm.com |
| VS Code / Cursor | IDE | code.visualstudio.com |
| Next.js Template | Boilerplate | `_templates/project/nextjs-web/` |
| GitHub CLI | Repo creation | cli.github.com |

---

## Step-by-Step Checklist

### Step 1: Create Project Directory
- [ ] Navigate to `launchpad/projects/`
- [ ] Create project folder with kebab-case name
- [ ] Initialize git repository

**Commands:**
```powershell
cd C:\Users\Owner\workspace\launchpad\projects
mkdir [project-name]
cd [project-name]
git init
```

**Output:** Empty git repository created

### Step 2: Scaffold Next.js Project
- [ ] Create Next.js app with TypeScript
- [ ] Use App Router (not Pages)
- [ ] Include Tailwind CSS
- [ ] Use pnpm as package manager

**Command:**
```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Selections:**
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: @/*

**Output:** Next.js project scaffolded

### Step 3: Install Core Dependencies
- [ ] Install shadcn/ui CLI
- [ ] Initialize shadcn/ui with defaults
- [ ] Install required base components

**Commands:**
```bash
# Initialize shadcn/ui
pnpm dlx shadcn@latest init

# Install common components
pnpm dlx shadcn@latest add button card input label toast dialog
```

**shadcn/ui Init Selections:**
- Style: Default
- Base color: Neutral
- CSS variables: Yes

**Output:** shadcn/ui configured with base components

### Step 4: Install Stack Dependencies
- [ ] Install Clerk (auth)
- [ ] Install Drizzle (ORM)
- [ ] Install Zod (validation)
- [ ] Install other required packages

**Command:**
```bash
pnpm add @clerk/nextjs drizzle-orm zod @tanstack/react-query
pnpm add -D drizzle-kit @types/node
```

**Full Dependency List:**
```json
{
  "dependencies": {
    "@clerk/nextjs": "latest",
    "drizzle-orm": "latest",
    "zod": "latest",
    "@tanstack/react-query": "latest",
    "@neondatabase/serverless": "latest",
    "stripe": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest"
  }
}
```

**Output:** All dependencies installed

### Step 5: Set Up Project Structure
- [ ] Create folder structure per stack patterns
- [ ] Add placeholder files for core modules
- [ ] Set up path aliases

**Folder Structure:**
```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/           # shadcn components
│   └── [feature]/    # feature components
├── lib/
│   ├── db/
│   │   ├── index.ts  # db connection
│   │   └── schema.ts # drizzle schema
│   ├── stripe.ts     # stripe client
│   └── utils.ts      # utilities
├── hooks/            # custom hooks
└── types/            # TypeScript types
```

**Output:** Project structure created

### Step 6: Create Environment Files
- [ ] Copy `.env.example` from templates
- [ ] Create `.env.local` for local development
- [ ] Add all required environment variables

**Required Environment Variables:**
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Neon)
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

**Output:** Environment files configured

### Step 7: Create GitHub Repository
- [ ] Create remote repository on GitHub
- [ ] Push initial commit
- [ ] Set up branch protection (optional for MVP)

**Commands:**
```bash
# Create initial commit
git add .
git commit -m "Initial project setup with Next.js 15, Tailwind, shadcn/ui"

# Create GitHub repo and push
gh repo create [project-name] --private --source=. --push
```

**Output:** GitHub repository created with initial code

### Step 8: Verify Local Development
- [ ] Start development server
- [ ] Verify app loads at localhost:3000
- [ ] Check no console errors
- [ ] Verify Tailwind styles work

**Commands:**
```bash
pnpm dev
# Open http://localhost:3000
```

**Output:** Development server running without errors

---

## Project Setup Checklist Template

```markdown
# Project Setup: [Project Name]

**Date:** [Today's date]
**Repo:** github.com/[org]/[project-name]

## Checklist

- [ ] Project directory created
- [ ] Next.js scaffolded with App Router
- [ ] shadcn/ui initialized
- [ ] Core dependencies installed
- [ ] Folder structure created
- [ ] Environment files configured
- [ ] GitHub repo created
- [ ] Local dev server verified

## Environment Variables Status

| Variable | Status | Notes |
|----------|--------|-------|
| CLERK keys | ⏳ Pending | Need to create Clerk app |
| DATABASE_URL | ⏳ Pending | Need Neon project |
| STRIPE keys | ⏳ Pending | Need Stripe account |

## Next Steps

→ Proceed to `06-infrastructure-provisioning.md` to set up services
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Project Folder | Directory | `projects/[name]/` | Folder exists |
| Git Repository | Git | GitHub | Repo accessible |
| Package.json | JSON | Project root | All dependencies listed |
| Env Files | .env | Project root | Template created |
| Dev Server | Running | localhost:3000 | Page loads |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Repo Created:** GitHub repository exists and is accessible
- [ ] **Dependencies Installed:** `pnpm install` completes without errors
- [ ] **Dev Server Runs:** `pnpm dev` starts without errors
- [ ] **Page Loads:** localhost:3000 shows Next.js page
- [ ] **Tailwind Works:** Styles are applied correctly

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Node version mismatch | Old Node installed | Use Node 20+ (check with `node -v`) |
| pnpm not found | Not installed globally | `npm install -g pnpm` |
| Port 3000 in use | Other app running | Kill process or use `pnpm dev -p 3001` |
| Git not initialized | Forgot step | `git init` in project root |
| Wrong Next.js options | Accepted defaults | Delete and re-run with correct flags |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 05-project-setup
Deliverables: [project-name] repo created, dev server running
Next: 06-infrastructure-provisioning
Blockers: [None / List any issues]
```

**Next SOP:** `06-infrastructure-provisioning.md`

---

*Last Updated: 2025-12-28*
