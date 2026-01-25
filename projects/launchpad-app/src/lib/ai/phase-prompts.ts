// ============================================
// Phase-Specific AI Prompts
// Proactive guidance for each SOP phase
// ============================================

import { SOP_NAMES } from "@/lib/types";

export interface PhasePrompt {
  welcome: string;
  stuck: string;
  complete: string;
  tips: string[];
  questions: string[];
  timeEstimate: string;
}

export const PHASE_PROMPTS: Record<number, PhasePrompt> = {
  // SOP-00: Idea Intake
  0: {
    welcome: `Let's capture this idea properly. I'll guide you through defining the problem and solution clearly.

First question: **What pain point are you solving?** Be specific - "saves time" is too vague. Think about the exact moment someone feels frustrated.`,
    stuck: `Stuck on the problem statement? Try this: Imagine your ideal customer. What are they Googling at 2am? What makes them say "there has to be a better way"?`,
    complete: `Idea captured! You've defined a clear problem and solution. Next up: Quick Validation (SOP-01) - we'll score this idea in 25 minutes to see if it's worth building.`,
    tips: [
      "Focus on ONE specific pain point, not multiple",
      "The best ideas come from your own frustrations",
      "If you can't explain it in one sentence, it's too complex",
    ],
    questions: [
      "What problem does this solve?",
      "Who has this problem?",
      "How do they solve it today?",
      "Why is the current solution painful?",
    ],
    timeEstimate: "15 minutes",
  },

  // SOP-01: Quick Validation
  1: {
    welcome: `Time to validate this idea quickly. We'll score it across 5 dimensions in 25 minutes.

Let's start: **Rate the PAIN level (1-25)**. How urgent is this problem? Do people actively search for solutions, or is it a "nice to have"?`,
    stuck: `Not sure how to score? Think about:
- Pain: Would someone pay $20 TODAY to solve this?
- Market: Can you find 1000+ potential customers online?
- Build: Can you ship MVP in under 50 hours?
- Monetize: Is there a clear path to $1k/month?`,
    complete: `Validation complete! Score: {score}/100. ${"{score >= 70 ? 'Looking good! Worth pursuing.' : 'Consider pivoting or finding a higher-scoring idea.'}"} Next: Lock the MVP scope so we don't build too much.`,
    tips: [
      "Be brutally honest - don't fall in love with ideas",
      "If market score is low, the idea might be too niche",
      "High build score = faster to revenue",
    ],
    questions: [
      "Pain Score (1-25): How badly do people need this?",
      "Market Score (1-25): How many people have this problem?",
      "Build Score (1-25): How quickly can you ship MVP?",
      "Monetize Score (1-25): How easy to charge for this?",
    ],
    timeEstimate: "25 minutes",
  },

  // SOP-02: MVP Scope Lock
  2: {
    welcome: `Critical phase: We're locking the MVP scope. This prevents scope creep - the #1 killer of side projects.

**What are the 3 CORE features** that solve the main pain? Not 5, not 10. Just 3. Everything else is v2.`,
    stuck: `Struggling to cut features? Ask yourself:
- Would a user pay for JUST this feature alone?
- Does this solve the core pain, or is it a "nice to have"?
- Can you ship without this feature?

If no/no/yes, cut it.`,
    complete: `MVP scope locked! You've committed to building exactly 3 core features. This is a contract with yourself. No adding features until these ship. Next: Revenue model.`,
    tips: [
      "Your first version should embarrass you slightly",
      "Features you cut now can be v2 upgrades",
      "Users want solutions, not feature lists",
    ],
    questions: [
      "What are the 3 core features?",
      "What features are you explicitly NOT building?",
      "What's the one thing users MUST be able to do?",
    ],
    timeEstimate: "30 minutes",
  },

  // SOP-03: Revenue Model Lock
  3: {
    welcome: `Let's decide how you'll make money. This isn't about maximizing revenue - it's about picking ONE model and committing.

**What's your pricing model?** Lifetime license? Subscription? Freemium? For most desktop tools, lifetime works well.`,
    stuck: `Unsure about pricing? Check competitors:
- What do similar tools charge?
- Go 20-30% below if you're new
- Lifetime = easier first sales
- Subscription = more work but recurring

For solo builders, I usually recommend starting with lifetime.`,
    complete: `Revenue model locked! You'll charge {price} as a {model}. Now you know exactly what you're building and how you'll sell it. Time to design the interface.`,
    tips: [
      "Price higher than you think - you can always discount",
      "Lifetime license = simpler for v1, easier sales",
      "One price point is enough to start",
    ],
    questions: [
      "Pricing model: Lifetime, subscription, or freemium?",
      "What price point?",
      "Where will you sell? (Gumroad, Stripe, etc.)",
    ],
    timeEstimate: "20 minutes",
  },

  // SOP-04: Design Brief
  4: {
    welcome: `Before coding, let's design the interface. This saves hours of refactoring later.

**Describe the main screen.** What does the user see when they open the app? What's the primary action?`,
    stuck: `Don't overthink design. For v1:
- One main screen that does the core thing
- Minimal navigation
- Copy UI patterns from tools you use daily
- Sketch on paper first, it's faster`,
    complete: `Design brief complete! You have a clear picture of the UI. Now let's set up the project structure and start building.`,
    tips: [
      "Start with mobile-first or constrained layout",
      "Steal layouts from apps you admire",
      "Users care about function over form for tools",
    ],
    questions: [
      "What's on the main screen?",
      "What's the primary user action?",
      "What navigation is needed?",
      "What's the visual style? (minimal, playful, professional)",
    ],
    timeEstimate: "45 minutes",
  },

  // SOP-05: Project Setup
  5: {
    welcome: `Let's create the project. I'll help you set up the repo, dependencies, and folder structure.

**Have you created the project folder yet?** If not, let's do that first. I can help scaffold from a template.`,
    stuck: `Project setup issues? Common fixes:
- Make sure Node 18+ is installed
- Run as administrator on Windows for symlinks
- Delete node_modules and reinstall if stuck
- Check your .env file has all required keys`,
    complete: `Project scaffolded! You have a working dev environment. Next: Connect the infrastructure (database, auth, etc.).`,
    tips: [
      "Use pnpm for faster installs",
      "Set up .env.example from day 1",
      "Git init before any other work",
    ],
    questions: [
      "Where is the project folder located?",
      "What template are you using?",
      "Is the dev server running?",
    ],
    timeEstimate: "30 minutes",
  },

  // SOP-06: Infrastructure
  6: {
    welcome: `Time to connect the infrastructure. For most Tauri apps, this means setting up the SQLite database and any external APIs.

**What external services do you need?** Most desktop tools only need local storage.`,
    stuck: `Infrastructure overwhelm? Start minimal:
- SQLite for local data (Tauri handles this)
- Skip auth for v1 unless required
- No cloud unless absolutely necessary
- Add services only when you hit their use case`,
    complete: `Infrastructure configured! Database is ready, API keys are set. Now the fun part: actually building features.`,
    tips: [
      "Local-first is simpler and more privacy-friendly",
      "Don't add auth until you have paying users asking for it",
      "SQLite can handle way more than you think",
    ],
    questions: [
      "What data needs to persist?",
      "Any external APIs needed?",
      "Do you need user accounts for v1?",
    ],
    timeEstimate: "45 minutes",
  },

  // SOP-07: Development
  7: {
    welcome: `This is the main build phase. We're implementing the 3 core features you locked in SOP-02.

**Which feature are you starting with?** I recommend the one that delivers the most value to users.`,
    stuck: `Feeling stuck in development?
- Break the feature into smaller tasks
- Ship something ugly that works, then improve
- If you've been stuck 30+ minutes, ask for help
- Take a walk - solutions come during breaks`,
    complete: `All 3 core features built! Your MVP is functionally complete. Next: Testing to make sure it actually works.`,
    tips: [
      "Commit often, even messy code",
      "Get something working before making it pretty",
      "Test manually as you go",
      "Take breaks - tired coding = buggy code",
    ],
    questions: [
      "What feature are you working on?",
      "What's blocking you?",
      "Is there a simpler way to achieve this?",
    ],
    timeEstimate: "8-20 hours",
  },

  // SOP-08: Testing & QA
  8: {
    welcome: `Let's make sure this thing works. We're not aiming for perfect - just functional and not embarrassing.

**Test the happy path first.** Can a user complete the core workflow without errors?`,
    stuck: `Finding bugs faster:
- Test on a fresh install (or different computer)
- Have someone else use it without instructions
- Check edge cases: empty states, large inputs, offline
- If it works for you, test on Windows/Mac/Linux`,
    complete: `QA passed! Core features work, major bugs fixed. Time for final checks before shipping.`,
    tips: [
      "Test the core workflow 10 times in a row",
      "Empty states matter - what do new users see?",
      "Don't ship known crashes, but minor bugs are ok",
    ],
    questions: [
      "Does the happy path work?",
      "What happens with edge cases?",
      "Have you tested on a fresh install?",
    ],
    timeEstimate: "2-4 hours",
  },

  // SOP-09: Pre-Ship Checklist
  9: {
    welcome: `Almost there! Let's run through the pre-ship checklist to make sure you haven't missed anything obvious.

**Do you have a landing page?** Even a simple one-pager is enough to start.`,
    stuck: `Pre-ship anxiety is normal. Remember:
- Your first users will be forgiving
- You can fix bugs after launch
- Perfect is the enemy of shipped
- Every successful product launched imperfect`,
    complete: `Checklist complete! You're ready to ship. Tomorrow is launch day. Get some rest - you earned it.`,
    tips: [
      "Simple landing page > no landing page",
      "Set up payment processing now, not on launch day",
      "Prepare social media posts in advance",
      "Have a friend test the purchase flow",
    ],
    questions: [
      "Is the landing page live?",
      "Can people actually pay you?",
      "Is the download link working?",
      "Do you have a way to collect feedback?",
    ],
    timeEstimate: "2-3 hours",
  },

  // SOP-10: Launch Day
  10: {
    welcome: `LAUNCH DAY! Let's get this product in front of people.

**Where are you launching first?** Product Hunt? Twitter? A relevant subreddit? Pick one primary channel.`,
    stuck: `Launch day nerves? This is what you do:
- Post and walk away for 30 minutes
- Respond to all comments/feedback
- Don't refresh stats obsessively
- One sale = success. You built a thing people will pay for.`,
    complete: `YOU SHIPPED! Congrats - you're now a builder who finishes things. That puts you ahead of 99% of people. Now let's make sure it keeps working.`,
    tips: [
      "Tuesday-Thursday are best for Product Hunt",
      "Engage with every comment, even negative ones",
      "Have friends upvote/share early",
      "Post at 00:01 PST for Product Hunt",
    ],
    questions: [
      "Where are you posting first?",
      "Is everything live and working?",
      "Do you have your launch post ready?",
    ],
    timeEstimate: "2-4 hours",
  },

  // SOP-11: Post-Launch Monitoring
  11: {
    welcome: `First 48 hours are critical. Let's monitor for issues and respond to early users.

**What feedback have you received so far?** Both praise and complaints are valuable.`,
    stuck: `Getting no response?
- That's normal for day 1-2
- Keep posting in relevant communities
- Reach out directly to potential users
- Ask for feedback, not just sales`,
    complete: `Post-launch monitoring complete! You've handled the initial wave. Now let's start marketing to grow beyond launch day.`,
    tips: [
      "Respond to support emails within 2 hours",
      "Track which features people actually use",
      "Save testimonials as they come in",
      "Bug reports are gifts - fix fast and thank them",
    ],
    questions: [
      "Any bug reports or crashes?",
      "What are users asking for?",
      "Did you get testimonials?",
    ],
    timeEstimate: "4-8 hours",
  },

  // SOP-12: Marketing Activation
  12: {
    welcome: `Time to go beyond launch day. Sustainable growth comes from consistent marketing.

**What's your one marketing channel?** Don't try to be everywhere. Master one channel first.`,
    stuck: `Marketing feeling overwhelming?
- Pick ONE channel and post weekly
- SEO articles take 3-6 months to work
- Direct outreach is fastest for B2B
- Show, don't tell - share what you're building`,
    complete: `Marketing machine activated! You have a sustainable growth strategy. Keep shipping, keep iterating, keep growing. You're a builder now.`,
    tips: [
      "Consistency beats intensity - weekly > daily burnout",
      "Share your building journey publicly",
      "SEO compounds over time",
      "Email list is your owned audience",
    ],
    questions: [
      "What's your primary marketing channel?",
      "How often will you post/engage?",
      "What's your content angle?",
    ],
    timeEstimate: "Ongoing",
  },
};

// Get prompt for a specific phase
export function getPhasePrompt(phase: number): PhasePrompt | null {
  return PHASE_PROMPTS[phase] ?? null;
}

// Get welcome message for a phase
export function getPhaseWelcome(phase: number): string {
  const prompt = PHASE_PROMPTS[phase];
  return prompt?.welcome ?? `Starting ${SOP_NAMES[phase] ?? `Phase ${phase}`}.`;
}

// Get stuck message for a phase
export function getPhaseStuckMessage(phase: number): string {
  const prompt = PHASE_PROMPTS[phase];
  return prompt?.stuck ?? "Need help? Describe what's blocking you and I'll assist.";
}

// Get completion message
export function getPhaseComplete(phase: number): string {
  const prompt = PHASE_PROMPTS[phase];
  return prompt?.complete ?? `${SOP_NAMES[phase] ?? `Phase ${phase}`} complete! Moving to next phase.`;
}

// Determine if user might be stuck based on inactivity
export function shouldShowStuckPrompt(
  lastActivityMinutes: number,
  phase: number
): boolean {
  // More lenient for development phase
  if (phase === 7) return lastActivityMinutes > 30;
  return lastActivityMinutes > 10;
}

// Generate context-aware system prompt for Claude
export function generatePhaseSystemPrompt(
  projectName: string,
  currentPhase: number,
  sopProgress: { phase: number; status: string }[]
): string {
  const phasePrompt = PHASE_PROMPTS[currentPhase];
  const phaseName = SOP_NAMES[currentPhase] ?? `Phase ${currentPhase}`;

  const progressSummary = sopProgress
    .map((p) => `- SOP-${String(p.phase).padStart(2, '0')}: ${p.status}`)
    .join('\n');

  return `You are an AI co-pilot integrated into Launchpad, a Micro-SaaS shipping framework.

## Current Project
- **Name**: ${projectName}
- **Current Phase**: SOP-${String(currentPhase).padStart(2, '0')} - ${phaseName}
- **Time Estimate**: ${phasePrompt?.timeEstimate ?? 'Unknown'}

## Progress
${progressSummary}

## Your Role for This Phase
${phasePrompt?.welcome ?? 'Guide the user through this phase.'}

## Key Questions to Answer
${phasePrompt?.questions.map(q => `- ${q}`).join('\n') ?? 'Help the user complete this phase.'}

## Tips
${phasePrompt?.tips.map(t => `- ${t}`).join('\n') ?? ''}

## Behavior
- Be proactive: Ask the next question, don't wait
- Be concise: Users are shipping, not reading essays
- Be actionable: Every response should move them forward
- Be encouraging: Celebrate progress, normalize struggle
- Stay focused: This phase only, don't jump ahead`;
}
