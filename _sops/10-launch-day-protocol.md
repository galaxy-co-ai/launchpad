# 10-launch-day-protocol.md

> **One-liner:** Deploy to production and verify everything works

**Version:** 1.0.0

---

## Overview

**Purpose:** Execute a smooth launch day with clear steps, verification checkpoints, and rollback plans. This SOP ensures the transition from "ready to launch" to "live and working" happens without chaos.

**When to Use:**
- Launch day
- After pre-ship checklist is complete
- When ready to go live to real users

**Expected Duration:** 2-4 hours (including monitoring)

**Phase:** Launch

---

## Prerequisites (Gates to Enter)

- [ ] Pre-ship checklist completed (`09-pre-ship-checklist`)
- [ ] All systems verified on production URL
- [ ] Stripe live mode enabled and tested
- [ ] Marketing copy ready (optional but recommended)

**Cannot proceed without:** All pre-ship items checked off.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Vercel Dashboard | Deployment control | vercel.com |
| Stripe Dashboard | Monitor payments | dashboard.stripe.com |
| Sentry | Error monitoring | sentry.io |
| Social Media | Announcement | Twitter/X, LinkedIn, etc. |
| Product Hunt | Launch platform | producthunt.com (optional) |

---

## Step-by-Step Checklist

### Step 1: Pre-Launch Verification (Launch Day Morning)
- [ ] Visit production URL—site loads
- [ ] Sign up flow works
- [ ] Core feature works
- [ ] No errors in Sentry overnight
- [ ] Stripe dashboard shows live mode

**Final Go/No-Go Decision:**
```markdown
## Launch Go/No-Go

### GREEN (Launch)
- [ ] All verifications pass
- [ ] No new bugs discovered
- [ ] Team is available for support

### RED (Delay)
- [ ] Critical bug found
- [ ] External service down
- [ ] Not ready for real users
```

**Output:** Go/No-Go decision made

### Step 2: Deploy Final Version
- [ ] Ensure latest code is pushed to main
- [ ] Verify Vercel auto-deployed (or trigger manual deploy)
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors

**Vercel Deployment Check:**
```
1. Go to Vercel Dashboard
2. Check latest deployment status: ✅ Ready
3. Verify deployment URL matches production domain
4. Check "Functions" tab for any errors
```

**Output:** Latest version deployed to production

### Step 3: Live Site Verification
- [ ] Clear browser cache or use incognito
- [ ] Full user journey test (one more time)
- [ ] Create a real test account
- [ ] Complete a real transaction (if comfortable)
- [ ] Verify webhook fires correctly

**Live Verification Script:**
```markdown
## Live Site Test

### Landing Page
- [ ] Loads in < 3 seconds
- [ ] Hero content displays correctly
- [ ] CTA button works

### Sign Up
- [ ] Create account: test+launch@[yourdomain].com
- [ ] Email verification (if enabled)
- [ ] Redirected to dashboard

### Core Feature
- [ ] Feature works as expected
- [ ] Data saves correctly
- [ ] No console errors

### Payment (Real Money Test)
- [ ] Click upgrade/purchase
- [ ] Checkout loads
- [ ] Complete with real card
- [ ] Access granted
- [ ] Webhook processed
- [ ] Refund if just testing

### Post-Payment
- [ ] User can access paid features
- [ ] Receipt email received
```

**Output:** Live site verified working

### Step 4: Flip the Switch (Soft Launch)
- [ ] Share link with small test group (friends, beta users)
- [ ] Ask for feedback on any issues
- [ ] Monitor for 30-60 minutes
- [ ] Fix any quick issues found

**Soft Launch Message Template:**
```
Hey! I just launched [Product Name] and would love your feedback.

[URL]

It's [one-line description]. Let me know if anything breaks or feels confusing!
```

**Output:** Soft launch complete, initial feedback gathered

### Step 5: Public Announcement
- [ ] Choose announcement channels
- [ ] Post announcement (use templates below)
- [ ] Engage with comments/questions
- [ ] Monitor traffic and errors

**Announcement Channels:**
| Channel | Audience | Priority |
|---------|----------|----------|
| Twitter/X | Builders, tech folks | High |
| LinkedIn | Professional network | Medium |
| Reddit | Niche communities | Medium |
| Indie Hackers | Indie makers | High |
| Product Hunt | Tech early adopters | Optional |
| Hacker News | Tech community | Optional |

**Twitter/X Launch Template:**
```
I just launched [Product Name]! 🚀

[One sentence what it does]

→ [URL]

Built with:
• Next.js 15
• [Other tech if relevant]

Would love your feedback!
```

**LinkedIn Launch Template:**
```
Excited to announce the launch of [Product Name]!

[Problem it solves in 2-3 sentences]

Check it out here: [URL]

I'd appreciate any feedback or shares!

#buildinpublic #saas #launch
```

**Output:** Public announcement posted

---

## Product Hunt Launch Playbook

Product Hunt can drive significant traffic and credibility for Micro-SaaS launches. This detailed playbook maximizes your chances of a successful PH launch.

### Phase 1: Preparation (2 Weeks Before)

**Find a Hunter:**
- [ ] Identify 5-10 potential hunters (makers with 1K+ followers who actively hunt)
- [ ] Check their recent hunts—do they hunt products like yours?
- [ ] Reach out with personalized pitch (not generic template)
- [ ] Confirm hunter and schedule date

**Hunter Outreach Template:**
```
Subject: Would you hunt [Product Name]?

Hi [Hunter Name],

I've been following your work and loved your hunt of [Recent Product].
I'm launching [Product Name]—[one sentence description].

I think it'd resonate with the PH community because [reason].

Would you be interested in hunting it on [proposed date]?

Happy to share more details!

[Your Name]
```

**Choose Launch Date:**
- [ ] Avoid: Mondays (weekend hangover), Fridays (low engagement)
- [ ] Avoid: Major holidays, Apple events, big tech announcements
- [ ] Best days: Tuesday, Wednesday, Thursday
- [ ] Check PH calendar for competing launches

### Phase 2: Assets & Copy (1 Week Before)

**Visual Assets:**
- [ ] Logo (240x240px, PNG with transparent background)
- [ ] Gallery images (1270x760px, 3-5 screenshots)
- [ ] Video demo (optional but 2x engagement if included)
- [ ] Maker photo (professional headshot)

**Written Copy:**
- [ ] Tagline (60 characters max, benefit-focused)
- [ ] Description (265 characters, explain what + who for)
- [ ] First comment (your story, why you built it, call to try)

**Tagline Examples:**
```
Good: "Write 10x faster with AI-powered suggestions"
Bad: "An innovative AI-powered writing assistant tool"

Good: "Track habits without the guilt"
Bad: "A beautiful habit tracking application"
```

**First Comment Template:**
```
Hey Product Hunt! 👋

I'm [Name], and I built [Product] because [personal problem/story].

After [time building/validating], I'm excited to finally share it.

Here's what makes it different:
• [Key differentiator 1]
• [Key differentiator 2]

I'd love your feedback—especially on [specific question].

Try it free: [URL]
```

**Build Support Network:**
- [ ] Create list of 20-30 people who will upvote/comment
- [ ] Brief them: "Will launch on PH on [date], would appreciate genuine support"
- [ ] Prepare DM template for launch day notification
- [ ] Do NOT ask for "upvotes"—ask them to "check it out and share thoughts"

### Phase 3: Launch Day (12:01 AM PST)

**Timing Strategy:**
- [ ] Submit at 12:01 AM PST (Pacific Standard Time)
- [ ] This gives you full 24-hour ranking period
- [ ] Set alarm if needed—don't miss the window
- [ ] Verify listing goes live correctly

**First 4 Hours (Critical Window):**
- [ ] Post Twitter/X announcement immediately
- [ ] Send notification to support network
- [ ] Respond to EVERY comment within 30 minutes
- [ ] Be online and present—don't schedule and forget

**Launch Day DM Template:**
```
Hey! I just launched [Product] on Product Hunt!

Would love if you could check it out and share your thoughts:
[PH Link]

No pressure to upvote—honest feedback is most valuable.

Thanks! 🙏
```

**Engagement Tactics:**
| Hour | Action |
|------|--------|
| 0-1 | Notify core supporters, respond to first comments |
| 1-4 | Monitor actively, respond to all comments, share BTS on Twitter |
| 4-8 | Continue engagement, share updates on progress |
| 8-16 | Maintain presence, thank supporters publicly |
| 16-24 | Final push, prepare post-launch content |

**Comment Response Guidelines:**
- Thank every commenter by name
- Answer questions thoroughly
- Ask follow-up questions to continue conversation
- Share relevant details/stories
- Never: Ask for upvotes, complain about ranking, argue with critics

### Phase 4: Post-Launch (24-48 Hours)

**Immediate Follow-Up:**
- [ ] Thank hunters and supporters publicly
- [ ] Share results on Twitter (even if modest)
- [ ] Screenshot your ranking as a milestone
- [ ] Send thank-you DMs to key supporters

**Capture Value:**
- [ ] Add "Featured on Product Hunt" badge to site
- [ ] Export email list of followers (PH dashboard)
- [ ] Note which comments/features got most traction
- [ ] Identify potential beta users or power users from comments

**Results Sharing Template:**
```
[Product] finished #[X] on Product Hunt!

Results:
• [X] upvotes
• [X] comments
• [X] new users
• [X] paying customers

Biggest learnings:
• [Lesson 1]
• [Lesson 2]

Thanks to everyone who supported! 🙏

What's next: [Your plans]
```

**Learn & Iterate:**
- [ ] Document what worked and what didn't
- [ ] Note feedback themes for product roadmap
- [ ] Plan follow-up content based on traction
- [ ] Consider re-launching for major updates (3-6 months later)

### Product Hunt Success Metrics

| Metric | Good | Great | Exceptional |
|--------|------|-------|-------------|
| Upvotes | 100+ | 300+ | 500+ |
| Comments | 20+ | 50+ | 100+ |
| Daily Ranking | Top 10 | Top 5 | #1 of the day |
| Sign-ups from PH | 50+ | 200+ | 500+ |

---

### Step 6: Monitor Launch Period (2-4 hours)
- [ ] Keep Sentry open—watch for errors
- [ ] Keep Stripe open—watch for payments
- [ ] Keep Vercel open—watch function invocations
- [ ] Respond quickly to any user issues

**Monitoring Dashboard:**
```markdown
## Launch Monitoring

### Errors (Sentry)
- [ ] Check every 15 minutes
- [ ] Zero errors: ✅
- [ ] New errors: Address immediately

### Traffic (Vercel Analytics)
- [ ] Visitors arriving from announcements
- [ ] Page views increasing

### Payments (Stripe)
- [ ] First payment received: ⏳
- [ ] Successful checkouts: [count]
- [ ] Failed checkouts: [count]

### User Feedback
- [ ] DMs/emails monitored
- [ ] Quick responses to issues
```

**Output:** Launch period monitored successfully

### Step 7: Celebrate & Document
- [ ] Take a screenshot of first payment (milestone!)
- [ ] Note any lessons learned
- [ ] Thank people who helped/shared
- [ ] Plan next steps

**Launch Day Summary Template:**
```markdown
# Launch Day Summary: [Product Name]

**Date:** [Today's date]
**URL:** [Production URL]

## Metrics

| Metric | Count |
|--------|-------|
| Unique visitors | [X] |
| Sign ups | [X] |
| Paying customers | [X] |
| Revenue | $[X] |

## What Went Well
- [Positive 1]
- [Positive 2]

## Issues Encountered
- [Issue 1] → [How resolved]
- [Issue 2] → [How resolved]

## Lessons Learned
- [Lesson 1]
- [Lesson 2]

## Next Steps
- [ ] [Action 1]
- [ ] [Action 2]
```

**Output:** Launch documented for future reference

---

## Rollback Plan

If something goes critically wrong:

```markdown
## Emergency Rollback

### Severity Assessment
- **Minor bug:** Note and fix later, don't roll back
- **Major bug:** Fix quickly, may pause marketing
- **Critical (data loss, security):** Roll back immediately

### Rollback Steps
1. In Vercel: Deployments → Select previous working deployment
2. Click "Promote to Production"
3. Verify site works on previous version
4. Communicate to users if they noticed

### Communication Template (if needed)
"We're experiencing some technical difficulties and are working on a fix.
Apologies for any inconvenience—we'll be back shortly!"
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Live Site | URL | Production domain | Site accessible |
| Announcement | Posts | Social media | Posts published |
| First Users | Accounts | Database | Sign ups recorded |
| Launch Summary | Markdown | Documentation | Summary written |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Site Live:** Production URL works for public
- [ ] **Auth Works:** Users can sign up and sign in
- [ ] **Payments Work:** At least one test transaction succeeded
- [ ] **Announced:** At least one public announcement made
- [ ] **Monitored:** No critical errors during launch window

**ALL gates must pass for successful launch.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Launching silently | Fear of rejection | Tell at least 10 people |
| Over-monitoring | Anxiety | Set 15-min check intervals |
| Fixing non-critical bugs | Perfectionism | Note for later, don't derail launch |
| No celebration | Moving too fast | Take a moment to appreciate the milestone |
| Ghost town after launch | No follow-up | Continue marketing in days following |
| PH launch at wrong time | Timezone confusion | 12:01 AM PST — set an alarm |
| Asking for upvotes | Seems faster | Gets flagged — ask for "feedback" instead |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 10-launch-day-protocol
Deliverables: Site live at [URL], [X] sign ups, $[X] revenue
Next: 11-post-launch-monitoring
Blockers: [None / List any issues]
```

**Next SOP:** `11-post-launch-monitoring.md`

---

*Last Updated: 2026-01-26*
