/**
 * SOP Schema Index
 * 
 * Import and export all SOP schemas for easy access.
 * Use these schemas to programmatically guide users through the workflow.
 */

import type { SOPSchema, WorkflowProgress, AIWorkflowContext } from './schema-types';

// Schema file paths (for dynamic loading)
export const SOP_SCHEMA_FILES = {
  0: 'sop-00.json',
  1: 'sop-01.json',
  2: 'sop-02.json',
  3: 'sop-03.json',
  4: 'sop-04.json',
  // Future SOPs will be added here
  // 5: 'sop-05.json',
  // 6: 'sop-06.json',
  // etc.
} as const;

// Phase groupings for UI organization
export const SOP_PHASES = {
  ideation: [0, 1, 2, 3],
  design: [4],
  setup: [5, 6],
  build: [7],
  qa: [8],
  ship: [9, 10],
  iterate: [11, 12],
} as const;

// Phase display names
export const PHASE_LABELS: Record<string, string> = {
  ideation: 'Ideation',
  design: 'Design',
  setup: 'Setup',
  build: 'Build',
  qa: 'QA',
  ship: 'Ship',
  iterate: 'Iterate',
};

// SOP display info for UI
export const SOP_INFO = [
  { number: 0, name: 'Idea Intake', emoji: '💡', phase: 'ideation' },
  { number: 1, name: 'Quick Validation', emoji: '🔍', phase: 'ideation' },
  { number: 2, name: 'MVP Scope Contract', emoji: '📝', phase: 'ideation' },
  { number: 3, name: 'Revenue Model Lock', emoji: '💰', phase: 'ideation' },
  { number: 4, name: 'Design Brief', emoji: '🎨', phase: 'design' },
  { number: 5, name: 'Project Setup', emoji: '🏗️', phase: 'setup' },
  { number: 6, name: 'Infrastructure Provisioning', emoji: '☁️', phase: 'setup' },
  { number: 7, name: 'Development Protocol', emoji: '⚡', phase: 'build' },
  { number: 8, name: 'Testing & QA', emoji: '🧪', phase: 'qa' },
  { number: 9, name: 'Pre-Ship Checklist', emoji: '✅', phase: 'ship' },
  { number: 10, name: 'Launch Day Protocol', emoji: '🚀', phase: 'ship' },
  { number: 11, name: 'Post-Launch Monitoring', emoji: '📊', phase: 'iterate' },
  { number: 12, name: 'Marketing Activation', emoji: '📣', phase: 'iterate' },
] as const;

/**
 * Helper function to get the next SOP number based on current progress
 */
export function getNextSop(currentSop: number): number | null {
  if (currentSop >= 12) return null;
  return currentSop + 1;
}

/**
 * Helper function to calculate workflow progress percentage
 */
export function calculateProgress(workflow: WorkflowProgress): number {
  const totalSteps = Object.keys(workflow.stepProgress).length;
  if (totalSteps === 0) return 0;
  
  const completedSteps = Object.values(workflow.stepProgress).filter(
    step => step.status === 'completed'
  ).length;
  
  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Helper function to get SOP phase from number
 */
export function getSopPhase(sopNumber: number): string {
  for (const [phase, sops] of Object.entries(SOP_PHASES)) {
    if ((sops as readonly number[]).includes(sopNumber)) {
      return phase;
    }
  }
  return 'unknown';
}

/**
 * Generate AI context for a workflow
 */
export function generateAIContext(
  schema: SOPSchema,
  workflow: WorkflowProgress,
  currentStepIndex: number
): AIWorkflowContext {
  const currentStep = schema.steps[currentStepIndex] || null;
  const completedSteps = Object.values(workflow.stepProgress).filter(
    s => s.status === 'completed'
  ).length;
  
  const nextSteps = schema.steps
    .slice(currentStepIndex + 1, currentStepIndex + 4)
    .map(s => ({ stepId: s.id, name: s.name }));
  
  const suggestedPrompt = currentStep 
    ? currentStep.prompt 
    : `Let's continue with SOP ${schema.sopNumber}: ${schema.name}`;
  
  return {
    currentSop: schema,
    currentStep,
    collectedData: workflow.collectedData,
    nextSteps,
    progressSummary: {
      completedSteps,
      totalSteps: schema.steps.length,
      percentComplete: Math.round((completedSteps / schema.steps.length) * 100),
    },
    suggestedPrompt,
  };
}

// Re-export types
export type { 
  SOPSchema, 
  SOPStep, 
  SOPPhase,
  StepType,
  InputType,
  ArtifactType,
  WorkflowProgress,
  AIWorkflowContext,
  ScoringSystem,
  TransitionRule,
  QualityGate,
} from './schema-types';

