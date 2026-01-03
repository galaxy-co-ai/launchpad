# SOP Schemas

> Machine-readable JSON schemas for Launchpad Standard Operating Procedures

---

## Purpose

These schemas enable AI agents to:
1. **Guide users** through structured SOP workflows
2. **Track progress** step-by-step with validation
3. **Generate artifacts** based on collected data
4. **Enforce quality gates** before advancing

---

## Schema Structure

Each SOP schema (`sop-{NN}.json`) contains:

```typescript
{
  id: string;           // e.g., "sop-00"
  name: string;         // Human-readable name
  version: string;      // Schema version
  description: string;  // What this SOP accomplishes
  
  prerequisites: {
    requiredSOPs: string[];      // Must complete these first
    requiredArtifacts: string[]; // Files that must exist
    conditions: string[];        // Other requirements
  };
  
  steps: SOPStep[];     // Detailed step definitions
  
  artifactTemplate: string;  // Markdown template for output
  
  qualityGates: {
    required: string[];      // Must pass to advance
    recommended: string[];   // Should pass
  };
  
  transitions: {
    onComplete: string;      // Next SOP ID
    conditions: string[];    // Requirements to proceed
  };
  
  pitfalls: Array<{
    mistake: string;
    fix: string;
  }>;
}
```

---

## Step Types

| Type | Purpose | Example |
|------|---------|---------|
| `input` | Collect user data | Problem statement |
| `research` | Gather external info | Reddit search |
| `decision` | Make a choice | Pivot or proceed |
| `generation` | Create output | Draft artifact |
| `validation` | Score/evaluate | 125-point rubric |
| `confirmation` | Get approval | Lock scope |

---

## Available Schemas

| File | SOP | Description |
|------|-----|-------------|
| `sop-00.json` | Idea Intake | Capture and categorize new ideas |
| `sop-01.json` | Quick Validation | Score ideas (125-point rubric) |
| `sop-02.json` | MVP Scope Contract | Lock features and scope |
| `sop-03.json` | Revenue Model Lock | Define pricing strategy |
| `sop-04.json` | Design Brief | Plan UI/UX before code |

---

## Scoring System (SOP-01)

The validation SOP includes a complete scoring rubric:

### Categories
- **Problem Validation** (45 points max)
  - Pain Frequency: 0-15 points
  - Current Solutions: 0-15 points
  - Willingness to Pay: 0-15 points

- **Market Validation** (35 points max)
  - Evidence Found: 0-15 points
  - Competitive Position: 0-10 points
  - Distribution Clarity: 0-10 points

- **Monetization Validation** (45 points max)
  - Revenue Model Fit: 0-15 points
  - Painkiller vs Vitamin: 0-15 points
  - Time to Revenue: 0-15 points

### Thresholds
- **GREEN (90+):** Strong proceed signal
- **YELLOW (60-89):** Proceed with caution, address gaps
- **RED (<60):** Pivot or kill

---

## Usage

### TypeScript

```typescript
import { loadSOP, getSOPStep, validateStepData } from './_sops/schemas';

// Load a schema
const sop = await loadSOP('sop-00');

// Get specific step
const step = getSOPStep(sop, '1.1');

// Validate user input
const valid = validateStepData(step, userData);
```

### AI Context

The workflow system injects schema context into AI prompts:

```typescript
const context = await invoke('generate_ai_context', { ideaId });
// Returns formatted string with current SOP, step, collected data
```

---

## Adding New Schemas

1. Create `sop-{NN}.json` following the structure above
2. Add to exports in `index.ts`
3. Ensure TypeScript types match `schema-types.ts`
4. Test with the AI chat interface

---

## Related Files

- `schema-types.ts` — TypeScript type definitions
- `index.ts` — Schema exports and helper functions
- `../00-idea-intake.md` — Human-readable SOP (source of truth)

