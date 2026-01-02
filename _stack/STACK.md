# Launchpad Tech Stack — LOCKED

> These decisions are final. Do not deviate. Every Micro-SaaS spawned from Launchpad uses this exact stack.

**Status:** LOCKED
**Last Updated:** 2025-12-28
**Owner:** Dalton @ GalaxyCo.ai

---

## Core Principle

**One way to do everything.** No debates, no "it depends," no bike-shedding. The stack is chosen. Build with it.

---

## The Stack

### Language & Runtime

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| **Language** | TypeScript | 5.x | Type safety, IDE support, catch errors at compile time |
| **Runtime** | Node.js | 20 LTS | Stable, long-term support |
| **Package Manager** | pnpm | Latest | Fast, disk-efficient, strict |

**TypeScript Rules:**
- `strict: true` — Always
- No `any` — Ever
- No `@ts-ignore` — Fix the type instead

---

### Framework

| Layer | Choice | Version | Rationale |
|-------|--------|---------|-----------|
| **Framework** | Next.js | 15.x | App Router, RSC, Vercel-native |
| **Router** | App Router | - | Not Pages Router |
| **Rendering** | RSC + Client | - | Server by default, client when needed |

**Next.js Rules:**
- Use App Router (`/app`) — never Pages Router (`/pages`)
- Server Components by default
- `"use client"` only when you need interactivity
- API routes in `/app/api/` using Route Handlers

---

### Styling & UI

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **CSS** | Tailwind CSS v4 | Utility-first, tree-shakable |
| **Components** | shadcn/ui | Copy-paste ownership, Radix primitives |
| **Primitives** | Radix UI | Accessibility-first, unstyled |
| **Icons** | Lucide React | shadcn default, tree-shakable |
| **Fonts** | Geist Sans/Mono | Vercel's font, Next.js native |

**Styling Rules:**
- No CSS modules
- No styled-components
- No CSS-in-JS libraries
- Tailwind utilities only
- Use CSS variables for theming (`--background`, `--foreground`)

---

### Data & State

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Database** | Neon PostgreSQL | Serverless Postgres, branching, Vercel integration |
| **ORM** | Drizzle | Type-safe, SQL-like, fast |
| **Cache** | Upstash Redis | Serverless Redis, rate limiting, sessions |
| **Vectors** | Upstash Vector | Serverless vector DB for AI features |
| **State (Client)** | React state + Context | Simple first, Zustand if needed |

**Data Rules:**
- No Prisma — use Drizzle
- No raw SQL in components — use Drizzle queries
- No MongoDB — relational data belongs in Postgres
- Cache aggressively with Upstash

---

### Authentication

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Auth Provider** | Clerk | Drop-in, multi-provider, webhooks |

**Auth Rules:**
- No NextAuth — use Clerk
- No custom auth — use Clerk
- Protect routes with Clerk middleware
- Use Clerk webhooks for user sync to database

---

### Validation

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Schema Validation** | Zod | TypeScript-first, runtime validation |
| **Form Handling** | React Hook Form | Performant, minimal re-renders |
| **Form + Zod** | @hookform/resolvers | Bridge between RHF and Zod |

**Validation Rules:**
- Validate ALL external input (API, forms, URL params)
- Define schemas in `/lib/schemas/`
- Share schemas between client and server

---

### Payments

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Payments** | Stripe | Industry standard, webhooks, subscriptions |

**Payment Rules:**
- Use Stripe Checkout for purchases
- Use Stripe Customer Portal for management
- Handle webhooks for subscription status
- Store subscription status in database

---

### AI

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **LLM** | Claude API | Best reasoning, our AI partner |
| **SDK** | @anthropic-ai/sdk | Official TypeScript SDK |
| **Embeddings** | Voyage AI or OpenAI | For vector search |
| **Parsing** | LlamaIndex | Document parsing, RAG pipelines |

**AI Rules:**
- Stream responses when possible
- Cache embeddings in Upstash Vector
- Use structured outputs (JSON mode) when parsing

---

### Animation

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Animation** | Motion (Framer) | Declarative, React-native, layout animations |

**Animation Rules:**
- Tailwind `transition-*` for simple hovers
- Motion for enter/exit, gestures, layout shifts
- Respect `prefers-reduced-motion`
- Keep durations 150-300ms

---

### Hosting & Infrastructure

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Hosting** | Vercel | Next.js native, edge functions |
| **Domains** | Porkbun | Cheap, API access |
| **DNS** | Vercel DNS | Integrated with hosting |
| **CI/CD** | Vercel | Auto-deploy on push |

**Hosting Rules:**
- One Vercel project per Micro-SaaS
- Use Vercel environment variables
- Preview deployments for PRs
- Production deploys from `main` branch only

---

### Error Tracking & Monitoring

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Errors** | Sentry | Industry standard, source maps |
| **Analytics** | Vercel Analytics | Built-in, privacy-friendly |
| **Logs** | Vercel Logs | Integrated with hosting |

---

### Desktop Apps

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Desktop Framework** | Tauri 2.0 | Rust core, small binaries, NOT Electron |

**Desktop Rules:**
- Never use Electron
- Tauri with web frontend
- Rust for native features

---

### Automation & Workflows

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Workflows** | n8n (self-hosted) | Visual automation, local-first |
| **Scheduling** | Vercel Cron | Serverless cron jobs |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  LAUNCHPAD STACK — LOCKED                               │
├─────────────────────────────────────────────────────────┤
│  Language:     TypeScript (strict)                      │
│  Framework:    Next.js 15 (App Router)                  │
│  Styling:      Tailwind + shadcn/ui                     │
│  Database:     Neon PostgreSQL + Drizzle                │
│  Cache:        Upstash Redis                            │
│  Auth:         Clerk                                    │
│  Payments:     Stripe                                   │
│  AI:           Claude API                               │
│  Animation:    Motion (Framer)                          │
│  Hosting:      Vercel                                   │
│  Errors:       Sentry                                   │
│  Desktop:      Tauri 2.0 (NOT Electron)                 │
└─────────────────────────────────────────────────────────┘
```

---

## Forbidden Technologies

These are **explicitly banned** from Launchpad projects:

| Banned | Use Instead |
|--------|-------------|
| Prisma | Drizzle |
| NextAuth | Clerk |
| Electron | Tauri 2.0 |
| MongoDB | Neon PostgreSQL |
| styled-components | Tailwind |
| CSS Modules | Tailwind |
| Emotion | Tailwind |
| Redux | React state / Zustand |
| MobX | React state / Zustand |
| Express | Next.js API routes |
| Pages Router | App Router |
| JavaScript | TypeScript |
| npm/yarn | pnpm |

---

*This document is LOCKED. Do not suggest alternatives. Do not deviate.*
