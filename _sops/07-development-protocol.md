# 07-development-protocol.md

> **One-liner:** Build all features with quality and consistency

**Version:** 1.0.0

---

## Overview

**Purpose:** Provide a structured approach to building features. This SOP ensures consistent code quality, prevents scope creep during development, and maintains momentum through clear daily rhythms.

**When to Use:**
- After infrastructure is provisioned
- Throughout the entire build phase
- For every feature being implemented

**Expected Duration:** Varies by feature (typically 2-4 hours per P0 feature)

**Phase:** Build

---

## Prerequisites (Gates to Enter)

- [ ] Infrastructure provisioned (`06-infrastructure-provisioning`)
- [ ] All services connected and verified
- [ ] MVP Contract features list available
- [ ] Design brief with screen inventory

**Cannot proceed without:** Working infrastructure with auth, database, and payments connected.

---

## Required Tools/Resources

| Tool/Resource | Purpose | Link/Location |
|---------------|---------|---------------|
| MVP Contract | Feature list | `_vault/active/CONTRACT-[slug].md` |
| Design Brief | UI reference | `_vault/active/DESIGN-[slug].md` |
| Stack Patterns | Code standards | `_stack/patterns.md` |
| Anti-Patterns | What to avoid | `_stack/anti-patterns.md` |
| Component Library | UI building | ui.shadcn.com |

---

## Step-by-Step Checklist

### Step 1: Daily Startup Ritual
- [ ] Review MVP Contract—what features remain?
- [ ] Pick ONE feature to complete today
- [ ] Break feature into 3-5 subtasks
- [ ] Set a target: "Done when [X] works"

**Daily Focus Template:**
```markdown
## Today's Focus: [Feature Name]

**Target:** [What "done" looks like]

### Subtasks:
1. [ ] [Subtask 1]
2. [ ] [Subtask 2]
3. [ ] [Subtask 3]

**Time Budget:** [X] hours
**Scope Creep Alert:** If I start doing [Y], STOP.
```

**Output:** Clear daily development target

### Step 2: Feature Development Flow
- [ ] Create feature branch: `feature/[feature-name]`
- [ ] Write the simplest working version first
- [ ] Test manually as you build
- [ ] Refactor only if necessary
- [ ] Commit frequently with clear messages

**Git Workflow:**
```bash
# Create feature branch
git checkout -b feature/[feature-name]

# Commit pattern
git add .
git commit -m "[type]: [description]"

# Types: feat, fix, refactor, style, docs, test
# Example: "feat: add checkout button to pricing page"

# When done
git checkout main
git merge feature/[feature-name]
git push
```

**Output:** Feature implemented on branch

### Step 3: Code Quality Standards
- [ ] TypeScript strict mode—no `any` types
- [ ] Zod validation for all external data
- [ ] Error boundaries around risky code
- [ ] Loading states for async operations

**Code Checklist Per Feature:**
```markdown
## Feature: [Name]

### Quality Checks:
- [ ] No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] No ESLint warnings (`pnpm lint`)
- [ ] External data validated with Zod
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Mobile responsive
```

**Output:** Clean, type-safe code

### Step 4: Component Development Pattern
- [ ] Start with shadcn/ui base components
- [ ] Compose into feature components
- [ ] Keep components focused (single responsibility)
- [ ] Extract reusable pieces only when needed

**Component Structure:**
```typescript
// Feature component pattern
export function FeatureName() {
  // 1. Hooks at top
  const [state, setState] = useState();

  // 2. Derived state / computations
  const computed = useMemo(() => {}, []);

  // 3. Event handlers
  const handleAction = () => {};

  // 4. Effects (if needed)
  useEffect(() => {}, []);

  // 5. Early returns for loading/error
  if (loading) return <Skeleton />;
  if (error) return <ErrorState />;

  // 6. Main render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

**Output:** Well-structured components

### Step 5: API Route Development Pattern
- [ ] Validate input with Zod schemas
- [ ] Check authentication first
- [ ] Handle errors gracefully
- [ ] Return consistent response shapes

**API Route Pattern:**
```typescript
// src/app/api/[resource]/route.ts
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const inputSchema = z.object({
  // Define expected input
});

export async function POST(req: Request) {
  try {
    // 1. Check auth
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate input
    const body = await req.json();
    const input = inputSchema.parse(body);

    // 3. Business logic
    const result = await doSomething(input);

    // 4. Return success
    return NextResponse.json({ data: result });

  } catch (error) {
    // 5. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**Output:** Robust API routes

### Step 6: Database Operations Pattern
- [ ] Use Drizzle ORM for all queries
- [ ] Define schemas in `src/lib/db/schema.ts`
- [ ] Keep queries in dedicated files
- [ ] Use transactions for multi-step operations

**Database Pattern:**
```typescript
// src/lib/db/queries/users.ts
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserByClerkId(clerkId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);
  return user;
}

export async function createUser(data: { clerkId: string; email: string }) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning();
  return user;
}
```

**Output:** Clean database operations

### Step 7: End-of-Day Checklist
- [ ] Feature complete and working?
- [ ] Code committed and pushed?
- [ ] No TypeScript/ESLint errors?
- [ ] Tested manually in browser?
- [ ] Updated any relevant docs?

**Daily Wrap-Up Template:**
```markdown
## Day Complete

**Feature:** [Feature name]
**Status:** [Complete / In Progress / Blocked]

### Completed:
- [What got done]

### Remaining:
- [What's left, if any]

### Blockers:
- [None / List blockers]

### Tomorrow:
- [Next feature or continuation]
```

**Output:** Clear status for next session

---

## Feature Completion Checklist

Before marking any feature as complete:

```markdown
## Feature Complete: [Feature Name]

### Functionality
- [ ] Core functionality works as designed
- [ ] Edge cases handled
- [ ] Error states display correctly
- [ ] Loading states display correctly

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] No console.log statements left
- [ ] No commented-out code

### UI/UX
- [ ] Matches design brief
- [ ] Mobile responsive
- [ ] Accessible (keyboard nav, aria labels)
- [ ] Consistent with design system

### Integration
- [ ] Works with auth (if applicable)
- [ ] Works with database (if applicable)
- [ ] Works with payments (if applicable)
```

---

## Deliverables (Proof of Completion)

| Deliverable | Format | Location | Validation |
|-------------|--------|----------|------------|
| Feature Code | TypeScript | `src/` directory | Feature works in browser |
| Git Commits | Git history | GitHub | Commits are atomic and descriptive |
| No Errors | Terminal | Local | `pnpm tsc` and `pnpm lint` pass |

---

## Quality Gates (Pass/Fail Criteria)

- [ ] **Feature Works:** Core functionality operates as designed
- [ ] **Code Compiles:** No TypeScript errors
- [ ] **Lint Passes:** No ESLint warnings
- [ ] **Manually Tested:** Verified in browser
- [ ] **Committed:** Code pushed to repository

**ALL gates must pass before starting next feature.**

---

## Common Pitfalls & Fixes

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Scope creep mid-feature | "While I'm here..." | Stick to subtask list, note ideas for later |
| Premature optimization | Wanting it perfect | Make it work first, optimize if needed |
| Skipping types | Moving fast | `any` is tech debt—type it now |
| No commits | Waiting for "done" | Commit every working state |
| Ignoring mobile | Desktop tunnel vision | Check mobile after each component |

---

## Handoff to Next SOP

**Status Report Template:**
```
Completed: 07-development-protocol
Deliverables: [X] of [Y] features implemented
Next: 08-testing-qa-checklist (when all features done)
Blockers: [None / List any issues]
```

**Next SOP:** `08-testing-qa-checklist.md`

---

*Last Updated: 2026-01-26*
