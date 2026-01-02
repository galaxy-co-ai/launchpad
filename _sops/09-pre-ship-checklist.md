# 09-pre-ship-checklist.md

> **One-liner:** Final checks before going live to production

---

## Overview

**Purpose:** Ensure nothing is forgotten before launch. This comprehensive checklist covers legal, technical, and operational requirements that must be in place before real users arrive.

**When to Use:**
- After QA testing is complete
- Before launch day
- Final 24-48 hours before going live

**Expected Duration:** 2-4 hours

**Phase:** Launch

---

## Prerequisites (Gates to Enter)

- [ ] QA testing completed (`08-testing-qa-checklist`)
- [ ] All critical bugs fixed
- [ ] App deployed to Vercel and working
- [ ] Stripe in live mode ready to enable

**Cannot proceed without:** All QA tests passing with no critical issues.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Vercel Dashboard | Production deployment | vercel.com |
| Stripe Dashboard | Live mode setup | dashboard.stripe.com |
| Clerk Dashboard | Production instance | clerk.com |
| Domain Registrar | Custom domain | porkbun.com |
| Sentry | Error tracking | sentry.io |

---

## Step-by-Step Checklist

### Step 1: Legal & Compliance
- [ ] Privacy Policy page exists and is linked
- [ ] Terms of Service page exists and is linked
- [ ] Cookie consent banner (if needed for EU users)
- [ ] Refund policy documented and visible

**Legal Page Requirements:**
```markdown
## Privacy Policy Must Include:
- What data you collect
- How you use the data
- Third-party services (Clerk, Stripe, etc.)
- How users can request data deletion
- Contact email for privacy questions

## Terms of Service Must Include:
- Service description
- User responsibilities
- Payment terms
- Limitation of liability
- Termination clause
- Governing law
```

**Quick Solution:** Use a generator like Termly, Iubenda, or Termageddon for compliant templates.

**Output:** Legal pages published and linked in footer

### Step 2: Domain & SSL
- [ ] Custom domain purchased
- [ ] Domain connected to Vercel
- [ ] SSL certificate active (automatic on Vercel)
- [ ] www redirects to non-www (or vice versa)
- [ ] Old URLs redirect if applicable

**Domain Setup:**
```
1. In Vercel: Project Settings → Domains
2. Add your domain: [yourdomain.com]
3. In Porkbun: Add DNS records Vercel provides
4. Wait for propagation (usually < 1 hour)
5. Verify HTTPS works: https://[yourdomain.com]
```

**Output:** Custom domain live with SSL

### Step 3: Production Environment Variables
- [ ] All env vars set in Vercel production
- [ ] Using production API keys (not test keys)
- [ ] Stripe switched to live mode
- [ ] Clerk using production instance

**Environment Variable Audit:**

| Variable | Test Value | Production Value | Verified |
|----------|------------|------------------|----------|
| NEXT_PUBLIC_APP_URL | localhost:3000 | yourdomain.com | [ ] |
| CLERK keys | pk_test_, sk_test_ | pk_live_, sk_live_ | [ ] |
| STRIPE keys | pk_test_, sk_test_ | pk_live_, sk_live_ | [ ] |
| DATABASE_URL | Same for both | Same for both | [ ] |
| STRIPE_WEBHOOK_SECRET | whsec_test_ | whsec_live_ | [ ] |

**Output:** Production env vars configured

### Step 4: Stripe Live Mode Setup
- [ ] Complete Stripe account verification
- [ ] Submit required business information
- [ ] Enable live mode in Stripe Dashboard
- [ ] Create production webhook endpoint
- [ ] Update webhook URL in Stripe
- [ ] Test with a real $1 transaction (refund after)

**Stripe Production Checklist:**
```markdown
## Stripe Live Mode

### Account Activation
- [ ] Business details submitted
- [ ] Bank account connected
- [ ] Identity verified
- [ ] Account activated for live payments

### Webhook Setup
- [ ] Production endpoint: https://[domain]/api/webhooks/stripe
- [ ] Events selected: checkout.session.completed, etc.
- [ ] Signing secret copied to Vercel env vars

### Test Transaction
- [ ] Make real $1 purchase
- [ ] Verify webhook received
- [ ] Check payment in Stripe Dashboard
- [ ] Issue refund
```

**Output:** Stripe ready for live transactions

### Step 5: Error Tracking Setup
- [ ] Sentry project created
- [ ] Sentry SDK installed
- [ ] DSN added to environment
- [ ] Test error captured

**Sentry Setup:**
```bash
# Install Sentry
pnpm add @sentry/nextjs

# Run setup wizard
pnpm dlx @sentry/wizard@latest -i nextjs
```

**Verify Sentry:**
```typescript
// Temporarily add to test
throw new Error('Test Sentry integration');

// Then remove after verifying in Sentry dashboard
```

**Output:** Error tracking active

### Step 6: Analytics Setup (Optional but Recommended)
- [ ] Analytics tool chosen (Plausible, Vercel Analytics, etc.)
- [ ] Tracking script installed
- [ ] Verified events are captured

**Recommended: Vercel Analytics**
```typescript
// In layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Output:** Analytics tracking active

### Step 7: SEO & Social Sharing
- [ ] Page titles set for all pages
- [ ] Meta descriptions written
- [ ] Open Graph tags configured
- [ ] Twitter card tags configured
- [ ] Favicon set
- [ ] robots.txt allows indexing

**SEO Checklist:**
```typescript
// src/app/layout.tsx metadata
export const metadata = {
  title: {
    default: '[Product Name] - [Tagline]',
    template: '%s | [Product Name]',
  },
  description: '[60-160 character description]',
  openGraph: {
    title: '[Product Name]',
    description: '[Description]',
    url: 'https://[domain]',
    siteName: '[Product Name]',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Product Name]',
    description: '[Description]',
    images: ['/og-image.png'],
  },
};
```

**Output:** SEO metadata configured

### Step 8: Pre-Launch Testing
- [ ] Full user journey on production URL
- [ ] Sign up → Use feature → Pay → Success
- [ ] Test on mobile device
- [ ] Test with real Stripe payment (refund after)
- [ ] Verify emails are received (if applicable)

**Production Smoke Test:**
```markdown
## Production Smoke Test

### Auth Flow
- [ ] Sign up works on production
- [ ] Sign in works
- [ ] Sign out works

### Core Feature
- [ ] Main feature works
- [ ] Data persists correctly

### Payment Flow
- [ ] Pricing page displays correctly
- [ ] Checkout initiates
- [ ] Payment completes (use real card, refund)
- [ ] Access granted after payment

### Error Handling
- [ ] 404 page displays
- [ ] Errors logged to Sentry
```

**Output:** Production verified working

---

## Pre-Ship Checklist Summary

```markdown
# Pre-Ship Checklist: [Project Name]

**Date:** [Today's date]
**Target Launch:** [Tomorrow's date]

## Status

| Category | Status | Notes |
|----------|--------|-------|
| Legal Pages | ✅ Complete | Privacy + Terms linked |
| Domain | ✅ Complete | [domain].com live |
| Production Env | ✅ Complete | All vars set |
| Stripe Live | ✅ Complete | Test transaction worked |
| Error Tracking | ✅ Complete | Sentry configured |
| Analytics | ✅ Complete | Vercel Analytics active |
| SEO | ✅ Complete | OG tags set |
| Smoke Test | ✅ Complete | Full journey verified |

## Final Blockers

- [ ] None — Ready to launch!
- [ ] [Or list any remaining blockers]

## Launch Time

**Scheduled:** [Date and time]
**Announced:** [Yes/No]
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Legal Pages | Web pages | /privacy, /terms | Pages accessible |
| Custom Domain | URL | Production | HTTPS working |
| Stripe Live | Dashboard | Stripe | Live mode enabled |
| Error Tracking | Dashboard | Sentry | Test error captured |
| Smoke Test | Checklist | Documentation | All tests pass |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Legal:** Privacy Policy and Terms exist
- [ ] **Domain:** Custom domain with SSL working
- [ ] **Payments:** Stripe live mode enabled and tested
- [ ] **Errors:** Sentry capturing errors
- [ ] **Smoke Test:** Full journey works on production

**ALL gates must pass to proceed to launch.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Test keys in production | Forgot to update env | Audit all env vars |
| Broken webhook | Wrong URL or secret | Test webhook before launch |
| No legal pages | "I'll add later" | Use generators, add now |
| DNS not propagated | Impatience | Wait up to 48 hours |
| Missing OG image | Forgot social sharing | Create 1200x630 image |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 09-pre-ship-checklist
Deliverables: Production ready with domain, payments, tracking
Next: 10-launch-day-protocol
Blockers: [None / List any issues]
```

**Next SOP:** `10-launch-day-protocol.md`

---

*Last Updated: 2025-12-28*
