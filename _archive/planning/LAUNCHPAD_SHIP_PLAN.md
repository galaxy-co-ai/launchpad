# LAUNCHPAD: From Empty Shell to Shipping Machine

> After your error handling/performance sprint, this is what transforms Launchpad from "looks cool" to "holy shit I shipped 3 products this month"

---

## THE CORE PROBLEM

Launchpad has the structure of a shipping framework but none of the **fuel**:
- Empty ideas vault (1 idea vs "140 pre-validated")
- No first-run experience (user opens app → blank dashboard → ???)
- No active guidance (Claude waits, doesn't lead)
- No templates that actually DO anything
- No momentum builders (streaks, velocity, public accountability)

**Result:** User opens app, sees nothing, closes app, never returns.

---

## THE TRANSFORMATION: 5 Systems That Make Launchpad Work

### System 1: First-Run Experience (Critical)

**Current:** User sees empty dashboard
**Target:** User starts their first project in under 3 minutes

#### Implementation:
```
FIRST LAUNCH FLOW:
┌─────────────────────────────────────────────────────┐
│  Welcome to Launchpad                                │
│                                                      │
│  You're about to join the 1% who actually ship.     │
│                                                      │
│  [Start Your First Mission →]                        │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Pick Your First Project                             │
│                                                      │
│  ○ Browse 50 Validated Ideas (recommended)           │
│  ○ I Have My Own Idea                                │
│  ○ Import Existing Project                           │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Here are 5 High-Potential Ideas:                    │
│                                                      │
│  [1] Local AI Chat - $29 lifetime              ⭐ 92 │
│      Desktop ChatGPT alternative, privacy-first     │
│                                                      │
│  [2] Clipboard Manager Pro - $15 lifetime      ⭐ 88 │
│      History, snippets, templates                   │
│                                                      │
│  [3] JSON Formatter - $9 lifetime              ⭐ 85 │
│      Works offline, dev-focused                     │
│                                                      │
│  [Pick This One] [Show More Ideas] [Own Idea]       │
└─────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Project Created: Local AI Chat                      │
│                                                      │
│  Phase 1: Quick Validation                           │
│  [Start 25-min Shot Clock →]                         │
│                                                      │
│  Claude: "Let's validate this in 25 minutes. I'll   │
│  guide you through 5 questions to score this idea." │
└─────────────────────────────────────────────────────┘
```

**Files to Create/Modify:**
- `src/app/onboarding/page.tsx` - New first-run flow
- `src/lib/store.ts` - Add `hasCompletedOnboarding` flag
- `src/app/layout.tsx` - Check onboarding status, redirect if needed

---

### System 2: Pre-Loaded Ideas Vault (50 Validated Ideas)

**Current:** 1 idea in backlog
**Target:** 50 validated, categorized, ready-to-build ideas

#### Categories (10 ideas each):
1. **Developer Tools** - JSON formatter, API tester, env manager, etc.
2. **Productivity** - Clipboard manager, time tracker, focus timer, etc.
3. **AI Utilities** - Prompt library, local LLM chat, transcription, etc.
4. **Content Creation** - Screenshot annotator, video trimmer, markdown editor
5. **Business Tools** - Invoice generator, proposal builder, CRM lite

#### Idea Structure:
```typescript
interface ValidatedIdea {
  id: string;
  name: string;
  slug: string;
  oneLiner: string;
  category: 'dev-tools' | 'productivity' | 'ai-utilities' | 'content' | 'business';

  // Validation scores (pre-calculated)
  painScore: number;      // 1-25: How painful is the problem?
  marketScore: number;    // 1-25: How big is the market?
  buildScore: number;     // 1-25: How easy to build? (for Tauri/Next)
  monetizeScore: number;  // 1-25: How easy to monetize?
  totalScore: number;     // Sum of above (max 100)

  // Ready-to-use content
  targetCustomer: string;
  pricingModel: string;
  suggestedPrice: string;
  competitors: string[];
  differentiator: string;
  mvpFeatures: string[];  // Core features for v1
  launchPlatforms: string[]; // Where to launch

  // Build guidance
  estimatedHours: number;
  techStack: string[];    // Subset of Launchpad stack
  templateId?: string;    // Link to project template
}
```

**Files to Create:**
- `src/data/validated-ideas.ts` - 50 ideas with full metadata
- `src/app/ideas/page.tsx` - Browseable ideas gallery
- `src/components/idea-picker.tsx` - Selection UI for onboarding

---

### System 3: Active AI Guidance (Claude as Co-Pilot)

**Current:** Claude waits for questions
**Target:** Claude actively guides through each SOP phase

#### Phase-Aware Prompts:
```typescript
const PHASE_PROMPTS = {
  0: `You're starting a new project. Let's validate this idea in 25 minutes.
      I'll ask you 5 questions to score it. Ready?`,

  1: `Great validation score! Now let's lock the MVP scope.
      What are the 3 core features that solve the main pain?`,

  2: `Scope locked. Time to decide on pricing.
      Based on competitors, I suggest $${suggestedPrice}. Thoughts?`,

  3: `Revenue model set. Let's design the UI before coding.
      Describe the main screen. I'll help refine it.`,

  // ... etc for all 13 phases
};
```

#### Proactive Suggestions:
```typescript
// When user opens project page
if (project.current_phase === 3 && !hasDesignBrief) {
  showClaude("You're on Design Brief phase but haven't started. Want me to guide you through it?");
}

// When shot clock expires
if (shotClockExpired) {
  showClaude("Time's up on Phase 3. You completed 4/5 sections. Want to extend 15 minutes or move to Phase 4?");
}

// When user is stuck (no activity for 10 min)
if (inactiveMinutes > 10) {
  showClaude("Looks like you're stuck. What's blocking you? I can help research or draft content.");
}
```

**Files to Modify:**
- `src/lib/ai/phase-prompts.ts` - New file with phase-specific prompts
- `src/components/chat/` - Auto-trigger messages based on context
- `src/app/project/page.tsx` - Inject proactive Claude suggestions

---

### System 4: Visual Pipeline & Progress

**Current:** Dashboard shows counts only
**Target:** Kanban-style pipeline showing all projects across phases

#### Pipeline View:
```
┌────────────────────────────────────────────────────────────────┐
│  YOUR SHIPPING PIPELINE                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  IDEATION        BUILD           LAUNCH          SHIPPED       │
│  ┌─────────┐    ┌─────────┐     ┌─────────┐     ┌─────────┐   │
│  │ Idea A  │    │Project B│     │Product C│     │Product D│   │
│  │ Phase 1 │    │ Phase 5 │     │ Phase 9 │     │ ✓ Live  │   │
│  │ ▓▓░░░░░ │    │ ▓▓▓▓▓░░ │     │ ▓▓▓▓▓▓▓ │     │ $423/mo │   │
│  └─────────┘    └─────────┘     └─────────┘     └─────────┘   │
│                                                                 │
│  VELOCITY: 2.3 projects/month   STREAK: 12 days                │
└────────────────────────────────────────────────────────────────┘
```

**Stats to Track:**
- Projects shipped this month
- Average time per project (ideation to launch)
- Current shipping streak (days with activity)
- Phase completion velocity
- Revenue generated (if they add it)

**Files to Create:**
- `src/app/pipeline/page.tsx` - Kanban pipeline view
- `src/components/velocity-stats.tsx` - Shipping metrics
- `src/lib/store.ts` - Add velocity tracking state

---

### System 5: One-Click Project Scaffolding

**Current:** "New Project" just creates DB entry
**Target:** One click creates full project with files, deps, structure

#### Template Types:
```typescript
const PROJECT_TEMPLATES = {
  'tauri-desktop': {
    name: 'Tauri Desktop App',
    description: 'Desktop app with Next.js + Rust backend',
    creates: [
      'package.json',
      'tsconfig.json',
      'src-tauri/Cargo.toml',
      'src-tauri/tauri.conf.json',
      'src/app/page.tsx',
      'src/lib/store.ts',
      // ... full scaffold
    ],
    postSetup: ['pnpm install', 'cargo check'],
  },

  'nextjs-web': {
    name: 'Next.js Web App',
    description: 'Web SaaS with auth, DB, payments',
    creates: [
      // ... web scaffold
    ],
  },

  'api-only': {
    name: 'API Service',
    description: 'Backend API with Hono + Drizzle',
    creates: [
      // ... API scaffold
    ],
  },
};
```

#### Scaffolding Flow:
```
User picks idea → "Local AI Chat"
                ↓
Template auto-selected → "tauri-desktop"
                ↓
Target folder picker → C:\projects\local-ai-chat
                ↓
[Scaffold Project] button clicked
                ↓
Progress UI:
  ✓ Creating folder structure...
  ✓ Copying template files...
  ✓ Customizing for "Local AI Chat"...
  ✓ Running pnpm install...
  ✓ Running cargo check...
  ✓ Opening in VS Code...
                ↓
"Project scaffolded! Phase 1 begins now."
```

**Files to Create:**
- `src/lib/scaffolder.ts` - Project scaffolding logic
- `src-tauri/src/commands/scaffold.rs` - Rust file operations
- `_templates/tauri-desktop/` - Full Tauri template
- `_templates/nextjs-web/` - Full Next.js template

---

## IMPLEMENTATION PRIORITY

### Sprint 1: First-Run Experience (4-6 hours)
**Why first:** Nothing else matters if users bounce on first open

1. Create onboarding flow (3 screens)
2. Add `hasCompletedOnboarding` to store
3. Redirect logic in layout
4. Simple "Pick an idea or add your own" screen

### Sprint 2: Ideas Vault Population (3-4 hours)
**Why second:** Users need ideas to pick from

1. Create `validated-ideas.ts` with 50 ideas
2. Add scoring metadata to each
3. Create ideas browser page
4. Connect to onboarding flow

### Sprint 3: Active AI Guidance (4-6 hours)
**Why third:** Claude should guide, not wait

1. Create phase-specific prompt system
2. Auto-trigger Claude on project open
3. Add proactive suggestions based on inactivity
4. Connect shot clock to Claude prompts

### Sprint 4: Visual Pipeline (3-4 hours)
**Why fourth:** Users need to see their progress

1. Create pipeline/kanban view
2. Add velocity tracking
3. Streak counter
4. Phase progress bars

### Sprint 5: Project Scaffolding (6-8 hours)
**Why last:** This is complex but not critical for v1

1. Create template structure
2. Rust scaffolding commands
3. Progress UI during scaffold
4. Post-scaffold actions (install, open)

---

## TOTAL EFFORT: ~20-28 hours

**After this, Launchpad will:**
- Greet users with clear next steps
- Offer 50 ready-to-build ideas
- Guide users through each phase with AI
- Show visual progress and velocity
- Actually scaffold projects with one click

---

## SUCCESS METRICS

| Metric | Current | Target |
|--------|---------|--------|
| Time to first project | ∞ (users bounce) | < 3 minutes |
| Ideas to choose from | 1 | 50 |
| Claude proactive messages | 0 | 5+ per session |
| Projects shipped per user | 0 | 1+ in first month |
| Daily active usage | Unknown | Streak tracking |

---

## THE MANTRA

**Launchpad doesn't wait for users to figure it out.**
**Launchpad LAUNCHES users into building.**

Every screen should answer: "What should I do RIGHT NOW?"

If the answer isn't obvious in 3 seconds, the screen has failed.

---

*Created: January 6, 2026*
*Status: Ready for implementation after current sprint*
