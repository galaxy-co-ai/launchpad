# 08-testing-qa-checklist.md

> **One-liner:** Ensure quality across functionality, UX, and performance

**Version:** 1.0.0

---

## Overview

**Purpose:** Systematically verify that everything works before shipping. This SOP catches bugs, UX issues, and performance problems before users encounter them.

**When to Use:**
- After all MVP features are implemented
- Before proceeding to pre-ship checklist
- When preparing for launch

**Expected Duration:** 2-4 hours

**Phase:** Build

---

## Prerequisites (Gates to Enter)

- [ ] All P0 features from MVP Contract implemented
- [ ] Code compiles without TypeScript errors
- [ ] ESLint passes without warnings
- [ ] App runs locally without crashes

**Cannot proceed without:** All MVP features implemented and working.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Browser DevTools | Debugging, performance | Chrome/Firefox |
| Lighthouse | Performance audit | Chrome DevTools |
| Mobile Device/Emulator | Mobile testing | Physical or DevTools |
| Stripe Test Cards | Payment testing | stripe.com/docs/testing |
| Test Accounts | Auth testing | Create in Clerk |
| Vitest | Unit testing | vitest.dev |
| Playwright | Integration testing | playwright.dev |

---

## Step-by-Step Checklist

### Step 1: Functional Testing
- [ ] Test every feature end-to-end
- [ ] Test as a new user (fresh account)
- [ ] Test as a returning user
- [ ] Test the payment flow completely

**Functional Test Matrix:**

| Feature | Happy Path | Edge Cases | Error Cases |
|---------|------------|------------|-------------|
| Sign Up | ✅ Create account | Empty fields | Invalid email |
| Sign In | ✅ Login success | Wrong password | Non-existent user |
| Core Feature | ✅ Works as expected | Empty state | Invalid input |
| Payment | ✅ Checkout completes | Cancel mid-flow | Card declined |
| [Feature] | [Test] | [Test] | [Test] |

**Payment Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155
```

**Output:** All features pass functional tests

### Step 2: User Flow Testing
- [ ] Complete the full user journey start to finish
- [ ] Time each major flow
- [ ] Note any friction points
- [ ] Verify the "aha moment" is reached

**User Journey Test:**
```markdown
## User Journey: First-Time User to Paid Customer

### Step 1: Discovery
- [ ] Landing page loads quickly
- [ ] Value proposition is clear in 3 seconds
- [ ] CTA is visible and compelling

### Step 2: Sign Up
- [ ] Sign up takes < 60 seconds
- [ ] No unnecessary fields
- [ ] Email verification works (if enabled)

### Step 3: Onboarding
- [ ] User knows what to do next
- [ ] First value delivered quickly
- [ ] No dead ends or confusion

### Step 4: Core Value
- [ ] User can accomplish main goal
- [ ] Experience matches expectations
- [ ] "Aha moment" occurs

### Step 5: Conversion
- [ ] Paywall appears at right moment
- [ ] Pricing is clear
- [ ] Checkout is smooth

### Step 6: Post-Payment
- [ ] Access granted immediately
- [ ] Receipt/confirmation received
- [ ] User knows what's unlocked
```

**Output:** User journey verified smooth

### Step 3: Cross-Browser Testing
- [ ] Test in Chrome (primary)
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge (optional)

**Browser Test Matrix:**

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Layout | ✅ | ✅ | ✅ | ✅ |
| Auth | ✅ | ✅ | ✅ | ✅ |
| Core Feature | ✅ | ✅ | ✅ | ✅ |
| Payments | ✅ | ✅ | ✅ | ✅ |

**Output:** Works across major browsers

### Step 4: Mobile/Responsive Testing
- [ ] Test on actual mobile device (if available)
- [ ] Test in Chrome DevTools mobile emulation
- [ ] Test at breakpoints: 320px, 768px, 1024px
- [ ] Verify touch interactions work

**Mobile Test Checklist:**
```markdown
## Mobile Testing

### Layout
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Buttons are tap-friendly (min 44x44px)
- [ ] Forms are usable on mobile keyboard

### Navigation
- [ ] Menu works on mobile
- [ ] Links are tappable
- [ ] Back button works correctly

### Key Screens
- [ ] Landing page looks good
- [ ] Auth screens work
- [ ] Dashboard is usable
- [ ] Checkout works
```

**Output:** Mobile experience verified

### Step 5: Performance Testing
- [ ] Run Lighthouse audit
- [ ] Target scores: Performance 90+, Accessibility 90+
- [ ] Check Core Web Vitals
- [ ] Identify any slow pages

**Lighthouse Audit:**
```
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select: Performance, Accessibility, Best Practices, SEO
4. Click "Analyze page load"
5. Document scores
```

**Performance Targets:**

| Metric | Target | Actual |
|--------|--------|--------|
| Performance Score | 90+ | [ ] |
| First Contentful Paint | < 1.8s | [ ] |
| Largest Contentful Paint | < 2.5s | [ ] |
| Cumulative Layout Shift | < 0.1 | [ ] |
| Accessibility Score | 90+ | [ ] |

**Output:** Performance meets targets

### Step 5.5: Automated Testing

Manual testing catches immediate issues, but automated tests prevent regressions and build shipping confidence.

- [ ] Set up Vitest for unit testing
- [ ] Set up Playwright for integration testing
- [ ] Write tests for critical paths
- [ ] Run test suite and verify all pass

**Test File Structure:**
```
project/
├── __tests__/
│   ├── unit/                    # Vitest unit tests
│   │   ├── utils.test.ts
│   │   ├── hooks.test.ts
│   │   └── components/
│   │       └── Button.test.tsx
│   └── integration/             # Playwright E2E tests
│       ├── auth.spec.ts
│       ├── checkout.spec.ts
│       └── core-feature.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

**Coverage Thresholds:**

| Metric | Target | Notes |
|--------|--------|-------|
| Functions | 80% | All utility functions tested |
| Critical Paths | 100% | Auth, payment, core feature |
| Components | 60% | Key interactive components |

**Unit Testing with Vitest:**
```typescript
// __tests__/unit/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, validateEmail } from '@/lib/utils'

describe('formatPrice', () => {
  it('formats cents to dollars', () => {
    expect(formatPrice(1999)).toBe('$19.99')
  })

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })
})

describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false)
  })
})
```

**Integration Testing with Playwright:**
```typescript
// __tests__/integration/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*sign-in.*/)
  })

  test('allows authenticated user to access dashboard', async ({ page }) => {
    // Use Clerk test helpers or session injection
    await page.goto('/dashboard')
    await expect(page.getByRole('heading')).toContainText('Dashboard')
  })
})

// __tests__/integration/checkout.spec.ts
test.describe('Checkout Flow', () => {
  test('completes purchase with test card', async ({ page }) => {
    await page.goto('/pricing')
    await page.click('text=Get Started')
    // Fill Stripe test card
    await page.fill('[data-testid="card-number"]', '4242424242424242')
    await page.click('text=Pay')
    await expect(page).toHaveURL(/.*success.*/)
  })
})
```

**Critical Path Test Checklist:**

| Path | Test File | Status |
|------|-----------|--------|
| Sign up flow | `auth.spec.ts` | [ ] |
| Sign in flow | `auth.spec.ts` | [ ] |
| Core feature action | `core-feature.spec.ts` | [ ] |
| Payment/checkout | `checkout.spec.ts` | [ ] |
| Error handling | `errors.spec.ts` | [ ] |

**Run Commands:**
```bash
# Unit tests
npm run test              # Run all unit tests
npm run test:coverage     # With coverage report

# Integration tests
npm run test:e2e          # Run Playwright tests
npm run test:e2e:headed   # Run with browser visible
```

**Output:** All automated tests pass, coverage meets thresholds

### Step 6: Security Checklist
- [ ] Auth protects private routes
- [ ] API routes check authentication
- [ ] No secrets in client-side code
- [ ] Input validation prevents injection

**Security Test Checklist:**
```markdown
## Security Verification

### Authentication
- [ ] Private pages redirect to login
- [ ] Cannot access other users' data
- [ ] Session expires appropriately

### API Security
- [ ] API routes return 401 for unauthenticated requests
- [ ] Cannot manipulate requests to access other users' data
- [ ] Rate limiting considered (if applicable)

### Data Handling
- [ ] No API keys in client bundle
- [ ] Sensitive data not logged
- [ ] HTTPS enforced in production
```

**Output:** Security basics verified

### Step 7: Edge Cases & Error States
- [ ] Test with empty data
- [ ] Test with maximum data
- [ ] Test offline behavior
- [ ] Test error recovery

**Edge Case Matrix:**

| Scenario | Expected Behavior | Actual |
|----------|-------------------|--------|
| Empty state (no data) | Helpful empty message | [ ] |
| Long text input | Truncates or wraps | [ ] |
| Network error | Error message, retry option | [ ] |
| Session expired | Redirect to login | [ ] |
| Invalid URL | 404 page | [ ] |

**Output:** Edge cases handled gracefully

---

## QA Summary Template

```markdown
# QA Summary: [Project Name]

**Date:** [Today's date]
**Tester:** [Name]

## Overall Status: [PASS / FAIL / NEEDS FIXES]

## Test Results

| Category | Status | Issues Found |
|----------|--------|--------------|
| Functional | ✅ Pass | None |
| User Flow | ✅ Pass | None |
| Cross-Browser | ✅ Pass | None |
| Mobile | ⚠️ Issues | [List issues] |
| Performance | ✅ Pass | Score: [X] |
| Automated Tests | ✅ Pass | Coverage: [X]% |
| Security | ✅ Pass | None |
| Edge Cases | ✅ Pass | None |

## Issues to Fix Before Launch

| Issue | Severity | Fix Required |
|-------|----------|--------------|
| [Issue 1] | High | Yes |
| [Issue 2] | Low | No (post-launch) |

## Sign-Off

- [ ] All critical issues resolved
- [ ] Ready for pre-ship checklist
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Test Results | Markdown | Notes or doc | All categories tested |
| Lighthouse Report | Screenshot | Saved locally | Scores documented |
| Automated Tests | Test files | `__tests__/` directory | All tests pass |
| Coverage Report | HTML/Terminal | `coverage/` or stdout | Meets thresholds |
| Bug List | List | In QA summary | All bugs identified |
| Fix Verification | Testing | In browser | Critical bugs fixed |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Functional:** All features work correctly
- [ ] **User Flow:** Full journey is smooth
- [ ] **Mobile:** Works on mobile devices
- [ ] **Performance:** Lighthouse score 90+
- [ ] **Tests Pass:** Unit and integration tests green
- [ ] **Coverage Met:** Functions 80%+, critical paths 100%
- [ ] **Security:** No auth bypasses possible
- [ ] **Critical Bugs:** All high-severity issues fixed

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Testing only happy path | Optimism bias | Explicitly test error cases |
| Skipping mobile | Works on my desktop | Test mobile first |
| Ignoring performance | "It's fast enough" | Run Lighthouse, get numbers |
| Self-testing only | Blind to own UX | Get fresh eyes if possible |
| Fixing while testing | Context switching | Note issues, fix after test pass |
| Skipping automated tests | "Takes too long to write" | Critical paths only — 4 tests catch 80% of regressions |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 08-testing-qa-checklist
Deliverables: QA summary with all tests passed
Next: 09-pre-ship-checklist
Blockers: [None / List remaining issues]
```

**Next SOP:** `09-pre-ship-checklist.md`

---

*Last Updated: 2026-01-26*
