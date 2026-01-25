# {{PROJECT_NAME}}

API-only backend built with Next.js App Router, deployed on Vercel Edge.

## Stack

- **Framework**: Next.js 15 (App Router, Edge Runtime)
- **Database**: Neon Postgres + Drizzle ORM
- **Auth**: Clerk
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Fill in your credentials

# Push database schema
pnpm db:push

# Start development
pnpm dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (public) |
| GET | `/api/v1/[resource]` | Get resource |
| POST | `/api/v1/[resource]` | Create resource |
| DELETE | `/api/v1/[resource]` | Delete resource |

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
pnpm db:generate  # Generate migrations
```

## Environment Variables

See `.env.example` for required variables.

## Deployment

```bash
vercel --prod
```

Set environment variables in Vercel dashboard before deploying.
