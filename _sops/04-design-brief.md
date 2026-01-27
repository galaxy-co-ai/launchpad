# 04-design-brief.md

> **One-liner:** Plan user flows and UI before writing any code

**Version:** 1.0.0

---

## Overview

**Purpose:** Design the user experience before development. This SOP creates a blueprint for what users see and do, preventing "design as you go" chaos and ensuring the UI serves the core value proposition.

**When to Use:**
- After revenue model is locked
- Before any code is written
- When transitioning from planning to building

**Expected Duration:** 1-2 hours

**Phase:** Design

---

## Prerequisites (Gates to Enter)

- [ ] MVP Contract completed (`02-mvp-scope-contract`)
- [ ] Revenue Model locked (`03-revenue-model-lock`)
- [ ] Clear understanding of P0 features
- [ ] Know the payment trigger point

**Cannot proceed without:** Locked scope and pricing decisions.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| Design System | UI components | `_design-system/DESIGN_SYSTEM.md` |
| shadcn/ui | Component library | ui.shadcn.com |
| Lucide Icons | Icon reference | `_design-system/icons/ICONS.md` |
| Excalidraw | Quick wireframes | excalidraw.com (optional) |

---

## Step-by-Step Checklist

### Step 1: Map Core User Flow
- [ ] Start from: How does user discover this?
- [ ] Map each step to reach core value
- [ ] End at: User achieves goal (and pays)
- [ ] Keep flow under 5 steps for MVP

**User Flow Template:**
```
ENTRY → [How they arrive]
  ↓
HOOK → [What grabs attention - 3 seconds]
  ↓
VALUE → [Core action that delivers value]
  ↓
CONVERT → [Payment/signup trigger]
  ↓
SUCCESS → [User achieves their goal]
```

**Example Flow (AI Writing Tool):**
```
ENTRY → Lands on landing page
  ↓
HOOK → Sees "Write 10x faster" + demo
  ↓
VALUE → Tries free generation (1 sample)
  ↓
CONVERT → Hits paywall for more generations
  ↓
SUCCESS → Pays, generates unlimited content
```

**Output:** Core user flow diagram

### Step 2: Define Key Screens
- [ ] List every screen needed for MVP
- [ ] Maximum 5-7 screens for true MVP
- [ ] Each screen has ONE primary purpose

**Screen Inventory Template:**

| Screen | Purpose | Primary Action |
|--------|---------|----------------|
| Landing Page | Convert visitors | Click "Get Started" |
| Auth | Sign up/in | Create account |
| Dashboard | Main workspace | [Core feature] |
| [Feature Screen] | [Purpose] | [Action] |
| Settings | Account mgmt | Update prefs |
| Pricing/Upgrade | Convert free users | Pay |

**Output:** Screen inventory table

### Step 2.5: Accessibility Planning

Plan accessibility from the start — fixing it later is expensive and often requires redesigning components.

- [ ] Review color contrast requirements (see checklist below)
- [ ] Plan keyboard navigation for all interactive elements
- [ ] Identify focus order for each screen
- [ ] Note any complex widgets needing ARIA patterns
- [ ] Confirm touch targets are sized appropriately

**Accessibility Checklist (WCAG 2.1 AA):**

| Requirement | Standard | How to Check |
|-------------|----------|--------------|
| Text contrast | 4.5:1 minimum | WebAIM Contrast Checker |
| UI component contrast | 3:1 minimum | Buttons, inputs, icons |
| Keyboard accessible | All interactions | Tab through entire flow |
| Focus visible | Clear focus indicator | Check focus ring visibility |
| Focus order | Logical reading order | Tab matches visual flow |
| Form labels | Associated with inputs | Every input has a label |
| Error messages | Descriptive + linked | Clear error states planned |
| Touch targets | 44x44px minimum | Mobile tap areas |
| Color independence | Info not color-only | Icons/text alongside color |

**Common Patterns to Plan:**

| Component | Accessibility Need |
|-----------|-------------------|
| Modal/Dialog | Focus trap, Escape to close |
| Dropdown menu | Arrow key navigation |
| Tabs | Arrow keys, proper ARIA roles |
| Toast notifications | Role="alert" for screen readers |
| Loading states | Aria-live regions |
| Form validation | Error linked to field via aria-describedby |

**Tools Reference:**
- Contrast checker: webaim.org/resources/contrastchecker
- Color-blind simulator: colourblindnesstest.com
- Keyboard testing: Tab through without mouse

**Output:** Accessibility notes for each screen

### Step 3: Design Landing Page Structure
- [ ] Define above-the-fold content (hero)
- [ ] Plan social proof section
- [ ] Design feature highlights
- [ ] Place CTA buttons strategically

**Landing Page Blueprint:**
```markdown
## Above the Fold (Hero)
- Headline: [10 words max, benefit-focused]
- Subheadline: [Explain what it does]
- CTA Button: [Action text, e.g., "Start Free"]
- Hero Visual: [Screenshot/demo/animation]

## Social Proof
- Logos / Testimonials / Stats
- "Used by X people" or "Y happy customers"

## Features (3 max)
- Feature 1: [Icon] + [Headline] + [1-line description]
- Feature 2: [Icon] + [Headline] + [1-line description]
- Feature 3: [Icon] + [Headline] + [1-line description]

## Pricing
- Clear pricing display
- What's included
- CTA to purchase

## Footer
- Links, legal, social
```

**Output:** Landing page structure document

### Step 4: Sketch Key Interactions
- [ ] How does the core feature work?
- [ ] What happens on button clicks?
- [ ] What feedback does user get?
- [ ] What are error states?

**Interaction Patterns:**

| Action | User Does | System Response |
|--------|-----------|-----------------|
| Submit form | Clicks button | Loading → Success toast |
| Error occurs | Invalid input | Inline error message |
| Async action | Starts process | Progress indicator |
| Success | Completes goal | Celebration/confirmation |

**Output:** Interaction pattern documentation

### Step 5: Create Design Brief Document
- [ ] Compile all design decisions
- [ ] Save as `_vault/active/DESIGN-[slug].md`
- [ ] Reference design system for implementation

**Output:** Design brief document

---

## Design Brief Template

```markdown
# Design Brief: [Product Name]

**Date:** [Today's date]
**Design System:** Reference `_design-system/DESIGN_SYSTEM.md`

---

## Core User Flow

```
[Your flow diagram here]
```

---

## Screen Inventory

| # | Screen | Purpose | Components Needed |
|---|--------|---------|-------------------|
| 1 | Landing | Convert | Hero, Features, Pricing, CTA |
| 2 | Auth | Sign up/in | Clerk components |
| 3 | Dashboard | Main app | [List components] |
| 4 | [Screen] | [Purpose] | [Components] |

---

## Landing Page Structure

### Hero
- **Headline:** [Your headline]
- **Subheadline:** [Your subheadline]
- **CTA:** [Button text]
- **Visual:** [Description of hero image/demo]

### Features Section
1. [Feature 1 with icon]
2. [Feature 2 with icon]
3. [Feature 3 with icon]

### Pricing Section
- Display: [How pricing is shown]
- CTA: [Purchase button text]

---

## Component Checklist (from shadcn/ui)

- [ ] Button (primary, secondary, ghost)
- [ ] Card
- [ ] Input / Form
- [ ] Toast (notifications)
- [ ] Dialog (modals)
- [ ] [Other needed components]

---

## Color Usage

Reference: `_design-system/tokens/colors.css`

- **Primary actions:** Primary color
- **Backgrounds:** Background/card colors
- **Text:** Foreground colors
- **Accents:** For highlights/badges

---

## Responsive Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

**Mobile-first:** Yes, design mobile first

---

## Accessibility

**Contrast Verified:**
- [ ] Primary text on background: [ratio] (need 4.5:1)
- [ ] Secondary text on background: [ratio] (need 4.5:1)
- [ ] Primary button text/bg: [ratio] (need 4.5:1)
- [ ] UI components on background: [ratio] (need 3:1)

**Keyboard Navigation:**
- [ ] All interactive elements reachable via Tab
- [ ] Focus order matches visual flow
- [ ] Focus indicators visible
- [ ] Escape closes modals/dropdowns

**Screen-Specific Notes:**

| Screen | Accessibility Considerations |
|--------|------------------------------|
| Landing | [Notes] |
| Dashboard | [Notes] |
| [Screen] | [Notes] |

---

## Key Interactions

| Element | Interaction | Feedback |
|---------|-------------|----------|
| CTA Button | Click | Loading state → redirect |
| Form Submit | Submit | Validation → toast |
| [Element] | [Action] | [Response] |

---

## Design Decisions Log

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Layout | Single column | Simpler for MVP |
| [Decision] | [Choice] | [Why] |

```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Design Brief | Markdown | `_vault/active/DESIGN-[slug].md` | File exists with all sections |
| User Flow | Diagram | In design brief | Clear path from entry to success |
| Screen List | Table | In design brief | All MVP screens identified |
| Component List | Checklist | In design brief | shadcn components identified |
| Accessibility Notes | Checklist | In design brief | Contrast + keyboard nav documented |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Flow Defined:** Clear path from landing to paid conversion
- [ ] **Screens Listed:** Every screen needed is identified
- [ ] **Components Chosen:** Know which shadcn/ui components to use
- [ ] **Landing Structure:** Hero, features, pricing planned
- [ ] **Accessibility Planned:** Contrast verified, keyboard nav considered, touch targets sized
- [ ] **Document Saved:** Design brief in `_vault/active/`

**ALL gates must pass to proceed to next SOP.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Too many screens | Feature creep | Hard cap at 7 screens for MVP |
| No mobile consideration | Desktop-first habit | Start mobile, expand up |
| Custom components | Over-engineering | Use shadcn/ui defaults first |
| Vague interactions | Assuming obvious | Document every click → response |
| Skipping landing page | "I'll do it later" | Landing page IS the product for visitors |
| Ignoring accessibility | "Add it later" | Check contrast + keyboard now — fixing later costs 10x |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 04-design-brief
Deliverables: DESIGN-[slug].md with [X] screens, user flow mapped
Next: 05-project-setup
Blockers: [None / List any issues]
```

**Next SOP:** `05-project-setup.md`

---

*Last Updated: 2026-01-26*
