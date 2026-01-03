# Launchpad Desktop App - Agent Context

> Project-specific rules for AI agents working on the Launchpad Desktop application.

**Project:** launchpad-app  
**Version:** 0.3.0  
**Updated:** 2026-01-03

---

## Quick Context

This is a **Tauri 2.0 desktop app** with:
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4
- **Backend:** Rust (Tauri commands)
- **Database:** SQLite (rusqlite)
- **State:** Zustand store

---

## Architecture Overview

### Frontend → Backend Flow

```
React Component
    ↓ invoke()
Tauri Command (Rust)
    ↓
SQLite / File System
    ↓
Return to Frontend
```

### Key Files

| Purpose | File |
|---------|------|
| State management | `src/lib/store.ts` |
| Type definitions | `src/lib/types.ts` |
| Tauri commands | `src-tauri/src/commands/*.rs` |
| Command registration | `src-tauri/src/lib.rs` |
| Database schema | `src-tauri/src/db/mod.rs` |

---

## AI-Guided Workflow System

### Components

1. **SOP Schemas** (`_sops/schemas/`)
   - Machine-readable JSON schemas for SOPs 0-4
   - Define steps, inputs, validation, scoring

2. **Artifact Tools** (`src-tauri/src/commands/artifacts.rs`)
   - `create_idea_file`, `update_idea_file`
   - `create_contract_file`, `create_revenue_file`, `create_design_file`
   - `move_idea_file`, `list_vault_artifacts`

3. **Workflow State** (`src-tauri/src/commands/workflow.rs`)
   - `start_workflow`, `complete_step`, `advance_sop`
   - `get_workflow_state`, `get_workflow_context`
   - `generate_ai_context`

4. **Chat Integration** (`src-tauri/src/commands/chat.rs`)
   - AI tools registered in `get_tools()`
   - Tool execution in `execute_tool()`
   - Context injection via store

### Workflow Flow

```
User: "I have an idea"
    ↓
Store: detectSOPContext() → returns SOP-00 context
    ↓
AI: Receives guided prompt with SOP schema
    ↓
AI: Asks structured questions per SOP steps
    ↓
AI: Calls create_idea_file tool
    ↓
Backend: Creates _vault/backlog/IDEA-{slug}.md
    ↓
Store: Updates workflow progress
```

---

## Database Tables

```sql
-- Core tables
projects, ideas, conversations, messages

-- Workflow tables (NEW)
workflow_progress  -- Tracks SOP/step progress per idea
workflow_artifacts -- Links artifacts to workflows
```

---

## Adding New Features

### New Tauri Command

1. Add function to appropriate `src-tauri/src/commands/*.rs`
2. Export in `src-tauri/src/commands/mod.rs`
3. Register in `src-tauri/src/lib.rs` invoke_handler!
4. Add TypeScript types to `src/lib/types.ts`
5. Create store action in `src/lib/store.ts`

### New AI Tool

1. Add tool definition to `get_tools()` in `chat.rs`
2. Add execution handler to `execute_tool()` in `chat.rs`
3. Implement backing Rust function
4. Register if needed in `lib.rs`

### New SOP Schema

1. Create `_sops/schemas/sop-{NN}.json`
2. Follow structure in `schema-types.ts`
3. Export in `_sops/schemas/index.ts`

---

## UI Components

### Workflow Components (`src/components/workflow/`)

| Component | Purpose |
|-----------|---------|
| `IdeaPipeline.tsx` | Kanban board for ideas |
| `IdeaDetail.tsx` | Full idea view |
| `WorkflowProgress.tsx` | SOP progress indicator |
| `SOPChecklist.tsx` | Interactive step checklist |

### Design Tokens

- Use Launch theme (charcoal gradients)
- Phase colors: amber (ideation), purple (design), blue (build), green (launch)
- See `src/globals.css` for CSS variables

---

## Store Actions

### Workflow Actions

```typescript
// Set active idea for context injection
setActiveIdea(ideaId: string)

// Start workflow for new idea
startWorkflow(ideaId: string)

// Mark step complete with data
completeStep(stepId: string, data?: Record<string, any>)

// Move to next SOP
advanceSop()

// Update validation score (SOP-01)
updateValidation(score: number, decision: string)
```

### Context Injection

The `sendMessage()` function automatically:
1. Checks for `activeIdeaId` or `conversation.idea_id`
2. Fetches workflow context from backend
3. Injects into AI system prompt
4. Detects "where were we" for resume prompts

---

## Common Tasks

### Debug Workflow State

```typescript
// In browser console
const state = useAppStore.getState();
console.log(state.currentWorkflow);
console.log(state.currentWorkflowContext);
```

### Test Artifact Creation

```typescript
await invoke('create_idea_file', {
  input: {
    name: 'Test Idea',
    problem: 'Test problem',
    solution: 'Test solution',
    category: 'Automation'
  }
});
```

### Check Database

SQLite database is at `~/.launchpad/data.db` (or AppData on Windows).

---

## Don't Do

- Don't modify SOP markdown files (`_sops/*.md`) — use JSON schemas instead
- Don't skip Zod validation for user input
- Don't use `console.log` in production — use structured logging
- Don't hardcode paths — use Tauri path APIs

---

## Related Docs

- Root `CLAUDE.md` — Launchpad system overview
- `_stack/STACK.md` — Technology decisions
- `_design-system/DESIGN_SYSTEM.md` — UI patterns
- `_sops/schemas/schema-types.ts` — Schema type definitions

