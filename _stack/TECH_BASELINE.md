# Launchpad Tech Baseline

> Canonical versions and alignment rules for all Launchpad projects.

**Status:** ACTIVE
**Last Updated:** 2026-01-24
**Owner:** Dalton @ GalaxyCo.ai

---

## Purpose

This document consolidates the locked stack into an explicit, versioned baseline for:
- All templates in `_templates/project/`
- All live apps in `projects/`
- Any tooling or automation that depends on versioned behavior

If a version here conflicts with `_stack/STACK.md` or `_stack/dependencies.md`, those files win. Update them first, then update this file.

---

## Canonical Baseline

### Language & Runtime

| Layer | Baseline | Notes |
|-------|----------|-------|
| Language | TypeScript 5.x | `strict: true`, no `any` |
| Runtime | Node.js 20 LTS | Match CI |
| Package Manager | pnpm (latest) | Required |

### Framework & Rendering

| Layer | Baseline | Notes |
|-------|----------|-------|
| Framework | Next.js 15.x | App Router only |
| React | 19.x | Paired with Next 15 |
| Rendering | RSC + Client | Server by default |

### Styling & UI

| Layer | Baseline | Notes |
|-------|----------|-------|
| CSS | Tailwind CSS 4.x | Utility-only |
| Components | shadcn/ui | Copy-paste, Radix primitives |
| Icons | Lucide React | Only icon set |
| Fonts | Geist Sans/Mono | Next.js native |

### Data & State

| Layer | Baseline | Notes |
|-------|----------|-------|
| Database | Neon PostgreSQL | Serverless Postgres |
| ORM | Drizzle 0.38.x | Required |
| Cache | Upstash Redis | Rate limiting + sessions |
| Vector DB | Upstash Vector | Optional for AI |
| Client State | React + Context | Zustand when needed |

### Auth, Payments, AI

| Layer | Baseline | Notes |
|-------|----------|-------|
| Auth | Clerk 6.x | Required |
| Payments | Stripe 17.x | Checkout + Portal |
| AI SDK | @anthropic-ai/sdk 0.32.x | Claude API |
| Parsing | LlamaIndex | RAG parsing |

### Desktop

| Layer | Baseline | Notes |
|-------|----------|-------|
| Desktop | Tauri 2.x | Never Electron |

---

## Alignment Rules

- Templates must match the baseline for Next.js, React, and TypeScript.
- Live apps may only deviate during an active migration. Track variance in `MANIFEST.md`.
- New dependencies must be added to `_stack/dependencies.md` first, then mirrored here.

---

## Drift Handling

When a project diverges from this baseline:
1. Log the variance in `MANIFEST.md` with a date and owner.
2. Create a migration plan to return to baseline or explicitly update the stack.
3. Close the loop by updating templates and app versions together.

---

## Known Variances (as of 2026-01-24)

- None recorded. Any divergence must be logged in `MANIFEST.md` and resolved.

---

## Upgrade Protocol (if baseline changes)

1. Update `_stack/STACK.md` and `_stack/dependencies.md`.
2. Update this document to reflect the new baseline.
3. Migrate templates in `_templates/project/`.
4. Migrate all active apps in `projects/`.
5. Run CI (lint, type-check, build) and Tauri build where applicable.
6. Update `MANIFEST.md` with the migration record.

---

*This baseline is enforceable. If it drifts, fix it.*
