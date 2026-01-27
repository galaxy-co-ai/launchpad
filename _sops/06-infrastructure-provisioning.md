# 06-infrastructure-provisioning.md

> **One-liner:** Connect database, auth, payments, and external services

**Version:** 1.0.0

---

## Overview

**Purpose:** Provision and connect all external services the app needs. After this SOP, auth works, database is connected, and Stripe is ready to accept payments—all before writing feature code.

**When to Use:**
- Immediately after project setup is complete
- Before starting feature development
- When all env vars need to be populated

**Expected Duration:** 1-2 hours

**Phase:** Setup

---

## Prerequisites (Gates to Enter)

- [ ] Project setup completed (`05-project-setup`)
- [ ] Local dev server runs without errors
- [ ] GitHub repository exists
- [ ] `.env.local` file created (empty values OK)

**Cannot proceed without:** Working local development environment.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Clerk Dashboard | Auth service | clerk.com |
| Neon Console | Database | neon.tech |
| Stripe Dashboard | Payments | dashboard.stripe.com |
| Vercel Dashboard | Hosting | vercel.com |
| Integration Guide | Setup reference | `_integrations/INTEGRATIONS.md` |

---

## Step-by-Step Checklist

### Step 1: Set Up Clerk Authentication
- [ ] Log in to Clerk Dashboard
- [ ] Create new application
- [ ] Name it: `[project-name]-prod`
- [ ] Select sign-in methods (Email + Google recommended)
- [ ] Copy API keys to `.env.local`

**Clerk Setup:**
```
1. Go to clerk.com → Dashboard
2. Click "Create Application"
3. Name: [project-name]-prod
4. Select: Email, Google (minimum)
5. Copy keys from "API Keys" section
```

**Environment Variables:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**Verification:**
```bash
# Restart dev server
pnpm dev

# Visit /sign-in - Clerk UI should appear
```

**Output:** Clerk authentication working locally

### Step 2: Provision Neon Database
- [ ] Log in to Neon Console
- [ ] Create new project
- [ ] Name: `[project-name]-db`
- [ ] Select region (closest to users)
- [ ] Copy connection string to `.env.local`

**Neon Setup:**
```
1. Go to neon.tech → Console
2. Click "New Project"
3. Name: [project-name]-db
4. Region: US East (or closest)
5. Copy connection string from Dashboard
```

**Environment Variable:**
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Create Initial Schema:**
```typescript
// src/lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

**Push Schema:**
```bash
pnpm drizzle-kit push
```

**Output:** Database connected with initial schema

### Step 3: Configure Stripe Payments
- [ ] Log in to Stripe Dashboard
- [ ] Use Test Mode for development
- [ ] Create product and price
- [ ] Copy API keys to `.env.local`
- [ ] Set up webhook endpoint

**Stripe Setup:**
```
1. Go to dashboard.stripe.com
2. Ensure "Test mode" toggle is ON
3. Go to Developers → API Keys
4. Copy Publishable key and Secret key
```

**Create Product:**
```
1. Go to Products → Add Product
2. Name: [Product Name]
3. Price: $[X]/month (or one-time)
4. Copy Price ID (starts with price_)
```

**Environment Variables:**
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_... (set up in Step 6)
```

**Output:** Stripe API keys configured

### Step 4: Set Up Stripe Webhook (Local)
- [ ] Install Stripe CLI
- [ ] Forward webhooks to local server
- [ ] Copy webhook secret to `.env.local`

**Stripe CLI Setup:**
```bash
# Install Stripe CLI (Windows)
scoop install stripe

# Or download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Copy Webhook Secret:**
```
The CLI will output: whsec_xxxxx
Copy this to STRIPE_WEBHOOK_SECRET in .env.local
```

**Create Webhook Handler:**
```typescript
// src/app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      break;
  }

  return NextResponse.json({ received: true });
}
```

**Output:** Local webhook forwarding working

### Step 5: Deploy to Vercel (Staging)
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables
- [ ] Deploy to preview URL
- [ ] Verify deployment works

**Vercel Setup:**
```
1. Go to vercel.com → Dashboard
2. Click "Add New Project"
3. Import from GitHub: [project-name]
4. Framework: Next.js (auto-detected)
5. Add environment variables (all from .env.local)
6. Deploy
```

**Environment Variables to Add:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET (use production webhook after setup)
```

**Output:** App deployed to Vercel preview URL

### Step 6: Set Up Production Stripe Webhook
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://[your-vercel-url]/api/webhooks/stripe`
- [ ] Select events: `checkout.session.completed`, `customer.subscription.updated`
- [ ] Copy signing secret to Vercel env vars

**Output:** Production webhook configured

### Step 7: Set Up Sentry Error Tracking
- [ ] Create Sentry project (Next.js)
- [ ] Install Sentry SDK
- [ ] Add DSN to environment variables
- [ ] Verify test error is captured

**Sentry Setup:**
```bash
# Install Sentry
pnpm add @sentry/nextjs

# Run setup wizard (creates config files)
pnpm dlx @sentry/wizard@latest -i nextjs
```

**Environment Variables:**
```env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

**Verify Setup:**
```typescript
// Temporarily add to test, then remove
throw new Error('Test Sentry integration');
// Check Sentry dashboard for the error
```

**Output:** Error tracking active from day one

### Step 8: Verify All Integrations
- [ ] Auth: Can sign up and sign in
- [ ] Database: Data persists correctly
- [ ] Payments: Test checkout completes
- [ ] Webhooks: Events received and processed

**Integration Test Checklist:**
```markdown
## Integration Verification

### Clerk Auth
- [ ] Visit /sign-up → Create test account
- [ ] Sign out → Sign back in
- [ ] Protected routes redirect to sign-in

### Neon Database
- [ ] Run query: SELECT * FROM users
- [ ] Verify user created after sign-up
- [ ] Data persists after server restart

### Stripe Payments
- [ ] Create test checkout session
- [ ] Use card: 4242 4242 4242 4242
- [ ] Webhook fires and logs appear
- [ ] Payment shows in Stripe Dashboard
```

**Output:** All integrations verified working

---

## Infrastructure Checklist Template

```markdown
# Infrastructure: [Project Name]

**Date:** [Today's date]

## Service Status

| Service | Status | Dashboard URL |
|---------|--------|---------------|
| Clerk | ✅ Connected | clerk.com/dashboard |
| Neon | ✅ Connected | console.neon.tech |
| Stripe | ✅ Connected | dashboard.stripe.com |
| Vercel | ✅ Deployed | vercel.com/dashboard |

## Environment Variables

| Variable | Local | Vercel |
|----------|-------|--------|
| CLERK keys | ✅ | ✅ |
| DATABASE_URL | ✅ | ✅ |
| STRIPE keys | ✅ | ✅ |
| STRIPE_WEBHOOK_SECRET | ✅ | ✅ |

## Webhook Endpoints

| Service | Endpoint | Status |
|---------|----------|--------|
| Stripe | /api/webhooks/stripe | ✅ Active |

## Next Steps

→ Proceed to `07-development-protocol.md` to start building features
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Clerk App | Dashboard | clerk.com | App exists, keys work |
| Neon Database | Console | neon.tech | DB connects, schema pushed |
| Stripe Products | Dashboard | stripe.com | Product + price created |
| Vercel Deployment | URL | vercel.com | Site loads |
| Env Variables | .env.local | Project root | All values populated |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Auth Works:** Can sign up and sign in with Clerk
- [ ] **DB Connects:** Schema pushed, queries work
- [ ] **Payments Ready:** Stripe keys configured, test checkout works
- [ ] **Deployed:** Vercel preview URL loads
- [ ] **Webhooks Active:** Stripe events received locally

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Clerk redirect loops | Wrong callback URLs | Set AFTER_SIGN_IN_URL correctly |
| DB connection fails | Wrong connection string | Copy fresh from Neon dashboard |
| Stripe 401 errors | Wrong key environment | Ensure using test keys for dev |
| Webhook signature fails | Wrong secret | Copy fresh from Stripe CLI output |
| Vercel deploy fails | Missing env vars | Add ALL env vars in Vercel dashboard |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 06-infrastructure-provisioning
Deliverables: Clerk, Neon, Stripe connected; Vercel deployed
Next: 07-development-protocol
Blockers: [None / List any issues]
```

**Next SOP:** `07-development-protocol.md`

---

*Last Updated: 2026-01-26*
