# [Project Name]

> Built with Launchpad — GalaxyCo.ai

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in your values (see _integrations/INTEGRATIONS.md)

# Push database schema
pnpm db:push

# Start dev server
pnpm dev
```

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Clerk |
| Database | Neon PostgreSQL + Drizzle |
| Payments | Stripe |
| AI | Claude API |
| Cache | Upstash Redis |

## Project Structure

```
├── app/
│   ├── (auth)/           # Sign-in/sign-up pages
│   ├── (dashboard)/      # Protected app routes
│   ├── (marketing)/      # Public marketing pages
│   └── api/webhooks/     # Clerk + Stripe webhooks
├── components/ui/        # shadcn/ui components
├── lib/
│   ├── db/              # Drizzle schema + queries
│   ├── utils.ts         # Helpers
│   └── env.ts           # Env validation
└── middleware.ts        # Auth middleware
```

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## Deployment

Push to `main` branch → Vercel auto-deploys.

Set environment variables in Vercel Dashboard before first deploy.
