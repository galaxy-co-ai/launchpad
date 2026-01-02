# Integrations Setup Guide

> Step-by-step setup for every service in the Launchpad stack.

**Last Updated:** 2025-12-28

---

## Setup Order

Follow this order for new projects:

1. **Neon** — Database (required first for user sync)
2. **Clerk** — Authentication
3. **Upstash Redis** — Cache & rate limiting
4. **Stripe** — Payments (when ready)
5. **Anthropic** — AI features (when ready)
6. **Sentry** — Error tracking (before production)
7. **Vercel** — Hosting (for deployment)

---

## 1. Neon PostgreSQL

**What:** Serverless Postgres database with branching.

### Setup Steps

1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign in with GitHub
3. Click **New Project**
4. Name it: `{project-name}-db`
5. Select region: `us-east-2` (or closest to your users)
6. Click **Create Project**

### Get Connection String

1. In your project, go to **Dashboard**
2. Copy the **Connection string** (pooled)
3. Add to `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Drizzle Setup

```bash
# Generate migrations
pnpm drizzle-kit generate

# Push to database
pnpm drizzle-kit push

# Open Drizzle Studio (optional)
pnpm drizzle-kit studio
```

### Branching (for previews)

Neon supports database branching for preview deployments:

1. Go to **Branches** in Neon console
2. Create branch from `main`
3. Use branch connection string for preview env

---

## 2. Clerk Authentication

**What:** Drop-in auth with social logins, MFA, and user management.

### Setup Steps

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign in with GitHub
3. Click **Create application**
4. Name it: `{project-name}`
5. Select auth methods (Google, GitHub, Email recommended)
6. Click **Create**

### Get API Keys

1. Go to **API Keys** in sidebar
2. Copy keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxx"
CLERK_SECRET_KEY="sk_test_xxxxx"
```

### Configure Routes

Add to `.env.local`:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### Add Middleware

Create `middleware.ts` in project root:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
```

### Setup Webhook (User Sync)

1. Go to **Webhooks** in Clerk Dashboard
2. Click **Add Endpoint**
3. URL: `https://your-domain.com/api/webhooks/clerk`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy **Signing Secret** to `.env.local`:

```env
CLERK_WEBHOOK_SECRET="whsec_xxxxx"
```

6. Create webhook handler:

```ts
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { createUser, updateUser, deleteUser } from "@/lib/db/queries"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    return new Response("Invalid signature", { status: 400 })
  }

  switch (evt.type) {
    case "user.created":
      await createUser({
        clerkId: evt.data.id,
        email: evt.data.email_addresses[0]?.email_address ?? "",
        name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim(),
      })
      break
    case "user.updated":
      await updateUser(evt.data.id, {
        email: evt.data.email_addresses[0]?.email_address,
        name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim(),
      })
      break
    case "user.deleted":
      if (evt.data.id) await deleteUser(evt.data.id)
      break
  }

  return new Response("OK", { status: 200 })
}
```

---

## 3. Upstash Redis

**What:** Serverless Redis for caching, rate limiting, sessions.

### Setup Steps

1. Go to [console.upstash.com](https://console.upstash.com)
2. Sign in with GitHub
3. Click **Create Database**
4. Name: `{project-name}-redis`
5. Type: **Regional**
6. Region: `us-east-1` (or closest)
7. Click **Create**

### Get Credentials

1. Go to database **Details**
2. Scroll to **REST API**
3. Copy to `.env.local`:

```env
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxxx"
```

### Usage Example

```ts
// lib/redis.ts
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiting
import { Ratelimit } from "@upstash/ratelimit"

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
})
```

---

## 4. Stripe Payments

**What:** Payment processing, subscriptions, customer portal.

### Setup Steps

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create account or sign in
3. Complete account setup (for live payments later)

### Get API Keys

1. Go to **Developers → API Keys**
2. Use **Test mode** for development
3. Copy to `.env.local`:

```env
STRIPE_SECRET_KEY="sk_test_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
```

### Create Products

1. Go to **Products**
2. Click **Add Product**
3. Create your pricing (monthly, yearly)
4. Copy Price IDs to `.env.local`:

```env
STRIPE_PRICE_ID_MONTHLY="price_xxxxx"
STRIPE_PRICE_ID_YEARLY="price_xxxxx"
```

### Setup Webhook

1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy **Signing secret** to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

### Local Testing

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 5. Anthropic (Claude API)

**What:** Claude AI for chat, analysis, and generation.

### Setup Steps

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account
3. Add payment method (pay-as-you-go)

### Get API Key

1. Go to **API Keys**
2. Click **Create Key**
3. Copy to `.env.local`:

```env
ANTHROPIC_API_KEY="sk-ant-xxxxx"
```

### Usage Example

```ts
// lib/ai.ts
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function chat(prompt: string) {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })

  return message.content[0].type === "text" ? message.content[0].text : ""
}

// Streaming
export async function streamChat(prompt: string) {
  return anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })
}
```

---

## 6. Upstash Vector

**What:** Serverless vector database for AI/RAG features.

### Setup Steps

1. Go to [console.upstash.com](https://console.upstash.com)
2. Click **Vector** tab
3. Click **Create Index**
4. Name: `{project-name}-vectors`
5. Dimensions: `1536` (for OpenAI embeddings) or `1024` (for Voyage)
6. Similarity: **Cosine**

### Get Credentials

```env
UPSTASH_VECTOR_REST_URL="https://xxxxx.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="xxxxx"
```

### Usage Example

```ts
// lib/vector.ts
import { Index } from "@upstash/vector"

export const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// Upsert vectors
await vectorIndex.upsert([
  { id: "doc-1", vector: embedding, metadata: { title: "Doc 1" } },
])

// Query similar
const results = await vectorIndex.query({
  vector: queryEmbedding,
  topK: 5,
  includeMetadata: true,
})
```

---

## 7. Sentry Error Tracking

**What:** Error tracking, performance monitoring, session replay.

### Setup Steps

1. Go to [sentry.io](https://sentry.io)
2. Create account
3. Create new project → **Next.js**

### Get DSN

1. Go to **Settings → Projects → {project} → Client Keys**
2. Copy DSN to `.env.local`:

```env
SENTRY_DSN="https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
```

### Get Auth Token (for source maps)

1. Go to **Settings → Auth Tokens**
2. Create token with `project:write` scope
3. Add to `.env.local`:

```env
SENTRY_AUTH_TOKEN="sntrys_xxxxx"
SENTRY_ORG="your-org"
SENTRY_PROJECT="your-project"
```

### Install & Configure

```bash
pnpm add @sentry/nextjs

# Run wizard (creates config files)
pnpm sentry-wizard -i nextjs
```

---

## 8. Vercel Hosting

**What:** Edge hosting for Next.js with auto-deploys.

### Setup Steps

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **Add New → Project**
4. Import your repository
5. Configure environment variables (copy from `.env.local`)
6. Click **Deploy**

### Environment Variables

Add all production values in Vercel Dashboard:
- **Settings → Environment Variables**
- Add each variable for **Production**, **Preview**, and **Development**

### Custom Domain

1. Go to **Settings → Domains**
2. Add your domain
3. Update DNS:
   - If using Vercel DNS: Update nameservers at registrar
   - If using external DNS: Add CNAME record

### Preview Deployments

Every PR automatically gets a preview deployment with its own URL.

For database branching with previews:
1. Create Neon branch for preview
2. Add `DATABASE_URL` override in Vercel preview environment

---

## 9. Resend (Email)

**What:** Developer-first email API.

### Setup Steps

1. Go to [resend.com](https://resend.com)
2. Create account
3. Verify your domain (required for production)

### Get API Key

```env
RESEND_API_KEY="re_xxxxx"
```

### Usage Example

```ts
// lib/email.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: "hello@yourdomain.com",
    to,
    subject: "Welcome!",
    html: `<p>Hey ${name}, welcome aboard!</p>`,
  })
}
```

---

## 10. UploadThing (File Uploads)

**What:** File uploads for Next.js.

### Setup Steps

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create account
3. Create new app

### Get Credentials

```env
UPLOADTHING_SECRET="sk_live_xxxxx"
UPLOADTHING_APP_ID="xxxxx"
```

### Setup

```bash
pnpm add uploadthing @uploadthing/react
```

See [docs.uploadthing.com](https://docs.uploadthing.com) for full setup.

---

## Quick Reference

| Service | Dashboard | Docs |
|---------|-----------|------|
| Neon | [console.neon.tech](https://console.neon.tech) | [neon.tech/docs](https://neon.tech/docs) |
| Clerk | [dashboard.clerk.com](https://dashboard.clerk.com) | [clerk.com/docs](https://clerk.com/docs) |
| Upstash | [console.upstash.com](https://console.upstash.com) | [upstash.com/docs](https://upstash.com/docs) |
| Stripe | [dashboard.stripe.com](https://dashboard.stripe.com) | [stripe.com/docs](https://stripe.com/docs) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) | [docs.anthropic.com](https://docs.anthropic.com) |
| Sentry | [sentry.io](https://sentry.io) | [docs.sentry.io](https://docs.sentry.io) |
| Vercel | [vercel.com](https://vercel.com) | [vercel.com/docs](https://vercel.com/docs) |
| Resend | [resend.com](https://resend.com) | [resend.com/docs](https://resend.com/docs) |
| UploadThing | [uploadthing.com](https://uploadthing.com) | [docs.uploadthing.com](https://docs.uploadthing.com) |

---

*Follow this guide exactly. No freelancing on service choices.*
