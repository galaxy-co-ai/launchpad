/**
 * SOP Schema Type Definitions
 * 
 * These types define the structure of machine-readable SOP schemas
 * that enable AI-guided workflow tracking and artifact generation.
 */

// =============================================================================
// Core Enums
// =============================================================================

export type SOPPhase = 
  | 'ideation'    // SOPs 0-3: Idea capture through revenue model
  | 'design'      // SOP 4: Design brief
  | 'setup'       // SOPs 5-6: Project and infrastructure setup
  | 'build'       // SOP 7: Development
  | 'qa'          // SOP 8: Testing
  | 'ship'        // SOPs 9-10: Pre-ship and launch
  | 'iterate';    // SOPs 11-12: Post-launch monitoring and marketing

export type StepType = 
  | 'input'       // Requires user input (text, selection)
  | 'research'    // Requires external research (web search, competitor analysis)
  | 'decision'    // Requires user to make a choice
  | 'action'      // Requires user to perform an action
  | 'generation'  // AI generates content/artifact
  | 'validation'  // Validates previous inputs/decisions
  | 'checklist';  // Multiple checkbox items

export type InputType = 
  | 'text'        // Free-form text input
  | 'textarea'    // Multi-line text input
  | 'number'      // Numeric input
  | 'select'      // Single selection from options
  | 'multiselect' // Multiple selections from options
  | 'url'         // URL input
  | 'date'        // Date input
  | 'boolean';    // Yes/No input

export type ArtifactType = 
  | 'idea'        // IDEA-{slug}.md
  | 'contract'    // CONTRACT-{slug}.md
  | 'revenue'     // REVENUE-{slug}.md
  | 'design';     // DESIGN-{slug}.md

export type WorkflowStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'blocked'
  | 'skipped';

// =============================================================================
// Validation Rules
// =============================================================================

export interface ValidationRule {
  /** Minimum number of items (for arrays/lists) */
  minItems?: number;
  /** Maximum number of items (for arrays/lists) */
  maxItems?: number;
  /** Minimum value (for numbers) */
  min?: number;
  /** Maximum value (for numbers) */
  max?: number;
  /** Minimum length (for strings) */
  minLength?: number;
  /** Maximum length (for strings) */
  maxLength?: number;
  /** Regex pattern (for strings) */
  pattern?: string;
  /** Required field */
  required?: boolean;
  /** Custom validation message */
  message?: string;
}

// =============================================================================
// Scoring System
// =============================================================================

export interface ScoringCriteria {
  /** Unique identifier for this scoring criterion */
  id: string;
  /** Description of what earns these points */
  description: string;
  /** Points awarded when criterion is met */
  points: number;
  /** Type of evidence needed */
  evidenceType?: 'boolean' | 'count' | 'text';
}

export interface ScoringSection {
  /** Name of the scoring section */
  name: string;
  /** Maximum points for this section */
  maxPoints: number;
  /** Individual scoring criteria */
  criteria: ScoringCriteria[];
}

export interface ScoringSystem {
  /** All scoring sections */
  sections: ScoringSection[];
  /** Total maximum score */
  maxTotal: number;
  /** Score thresholds for decisions */
  thresholds: {
    /** Minimum score to proceed (GREEN) */
    pass: number;
    /** Score range for conditional proceed (YELLOW) */
    conditional?: { min: number; max: number };
    /** Below this score = fail (RED) */
    fail?: number;
  };
}

// =============================================================================
// Step Definitions
// =============================================================================

export interface StepInput {
  /** Unique field name for this input */
  field: string;
  /** Display label */
  label: string;
  /** Input type */
  type: InputType;
  /** Placeholder text */
  placeholder?: string;
  /** Help text / description */
  helpText?: string;
  /** Options for select/multiselect */
  options?: { value: string; label: string }[];
  /** Default value */
  defaultValue?: unknown;
  /** Validation rules */
  validation?: ValidationRule;
}

export interface SOPStep {
  /** Unique step ID (e.g., "1.1", "2.3") */
  id: string;
  /** Step name */
  name: string;
  /** Step type */
  type: StepType;
  /** Is this step required to proceed? */
  required: boolean;
  /** AI prompt to guide user through this step */
  prompt: string;
  /** Detailed instructions for the AI */
  instructions?: string[];
  /** Expected inputs from user */
  inputs?: StepInput[];
  /** Validation rules for step completion */
  validation?: ValidationRule;
  /** Scoring criteria (if applicable) */
  scoring?: ScoringCriteria[];
  /** Checklist items (for checklist type) */
  checklistItems?: { id: string; label: string; required: boolean }[];
  /** Output field name where step data is stored */
  outputField?: string;
  /** Dependencies on other steps */
  dependsOn?: string[];
}

// =============================================================================
// Artifact Templates
// =============================================================================

export interface ArtifactTemplate {
  /** Artifact type */
  type: ArtifactType;
  /** File name pattern (e.g., "IDEA-{slug}.md") */
  filePattern: string;
  /** Directory location */
  directory: string;
  /** Markdown template content */
  template: string;
  /** Fields required to generate this artifact */
  requiredFields: string[];
}

// =============================================================================
// Transition Rules
// =============================================================================

export interface TransitionCondition {
  /** Field to check */
  field: string;
  /** Comparison operator */
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'exists';
  /** Value to compare against */
  value: unknown;
}

export interface TransitionRule {
  /** Conditions that must be met (AND logic) */
  conditions: TransitionCondition[];
  /** Next SOP number if conditions are met */
  nextSop: number;
  /** Alternative action if conditions fail */
  failAction?: 'block' | 'kill' | 'retry' | 'manual';
  /** Message to display on transition */
  message?: string;
}

// =============================================================================
// Quality Gates
// =============================================================================

export interface QualityGate {
  /** Gate ID */
  id: string;
  /** Gate description */
  description: string;
  /** Condition to check */
  condition: TransitionCondition;
  /** Is this gate required to pass? */
  required: boolean;
  /** Error message if gate fails */
  errorMessage: string;
}

// =============================================================================
// Output/Deliverable Definitions
// =============================================================================

export interface SOPOutput {
  /** Output name */
  name: string;
  /** Output type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'file';
  /** Description of what this output contains */
  description: string;
  /** File location (for file outputs) */
  location?: string;
  /** How to validate this output exists/is correct */
  validation?: ValidationRule;
}

// =============================================================================
// Main SOP Schema
// =============================================================================

export interface SOPSchema {
  /** SOP number (0-12) */
  sopNumber: number;
  /** SOP name */
  name: string;
  /** One-liner description */
  description: string;
  /** Workflow phase */
  phase: SOPPhase;
  /** Expected duration */
  estimatedDuration: string;
  /** Prerequisites to enter this SOP */
  prerequisites: {
    /** Required SOPs to be completed */
    completedSops?: number[];
    /** Required artifacts to exist */
    requiredArtifacts?: ArtifactType[];
    /** Required fields from previous steps */
    requiredFields?: string[];
    /** Custom conditions */
    conditions?: TransitionCondition[];
  };
  /** All steps in this SOP */
  steps: SOPStep[];
  /** Scoring system (if applicable) */
  scoring?: ScoringSystem;
  /** Artifacts generated by this SOP */
  artifacts?: ArtifactTemplate[];
  /** Expected outputs/deliverables */
  outputs: SOPOutput[];
  /** Quality gates that must pass */
  qualityGates: QualityGate[];
  /** Transition rules to next SOP */
  transition: TransitionRule;
  /** Common pitfalls to warn about */
  pitfalls?: { issue: string; fix: string }[];
}

// =============================================================================
// Workflow State
// =============================================================================

export interface WorkflowStepProgress {
  /** Step ID */
  stepId: string;
  /** Current status */
  status: WorkflowStatus;
  /** Data collected in this step */
  data: Record<string, unknown>;
  /** Timestamp when started */
  startedAt?: string;
  /** Timestamp when completed */
  completedAt?: string;
  /** Any notes or issues */
  notes?: string;
}

export interface WorkflowProgress {
  /** Unique workflow ID */
  id: string;
  /** Associated idea ID */
  ideaId: string;
  /** Current SOP number */
  currentSop: number;
  /** Current step ID within SOP */
  currentStepId: string | null;
  /** Progress for each step */
  stepProgress: Record<string, WorkflowStepProgress>;
  /** Aggregated data from all steps */
  collectedData: Record<string, unknown>;
  /** Generated artifacts */
  artifacts: { type: ArtifactType; path: string; createdAt: string }[];
  /** Workflow start time */
  startedAt: string;
  /** Last update time */
  updatedAt: string;
  /** Overall status */
  status: WorkflowStatus;
}

// =============================================================================
// AI Context Injection
// =============================================================================

export interface AIWorkflowContext {
  /** Current SOP schema */
  currentSop: SOPSchema;
  /** Current step details */
  currentStep: SOPStep | null;
  /** All data collected so far */
  collectedData: Record<string, unknown>;
  /** What comes next */
  nextSteps: { stepId: string; name: string }[];
  /** Progress summary */
  progressSummary: {
    completedSteps: number;
    totalSteps: number;
    percentComplete: number;
  };
  /** Suggested prompt for AI */
  suggestedPrompt: string;
}

