// ============================================
// Project Types
// ============================================

export interface Project {
  id: string;
  name: string;
  slug: string;
  local_path: string | null;
  github_url: string | null;
  current_phase: number;
  status_report: string | null;
  last_analyzed: string | null;
  created_at: string;
}

export interface CreateProjectInput {
  name: string;
  local_path?: string | null;
  github_url?: string | null;
}

// ============================================
// Roadmap Types (SOP Pipeline)
// ============================================

export type RoadmapStatus = "pending" | "in_progress" | "complete";

export interface RoadmapItem {
  id: string;
  project_id: string;
  sop_number: number;
  sop_name: string;
  status: RoadmapStatus;
  ai_notes: string | null;
  completed_at: string | null;
}

// SOP names for reference
export const SOP_NAMES = [
  "Idea Intake",
  "Quick Validation",
  "MVP Scope Lock",
  "Revenue Model Lock",
  "Design Brief",
  "Project Setup",
  "Infrastructure",
  "Development",
  "Testing & QA",
  "Pre-Ship Checklist",
  "Launch Day",
  "Post-Launch Monitoring",
  "Marketing Activation",
] as const;

// ============================================
// Chat Types
// ============================================

export interface Conversation {
  id: string;
  project_id: string | null;
  idea_id: string | null;
  title: string | null;
  session_summary: string | null;
  created_at: string;
}

export interface ConversationWithContext {
  conversation: Conversation;
  idea_name: string | null;
  workflow_context: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// ============================================
// SOP Types (with Versioning)
// ============================================

export type SOPPhase = "ideation" | "design" | "setup" | "build" | "launch" | "post_launch";

export interface SOP {
  id: string;
  sop_number: number;
  version: string;
  name: string;
  phase: SOPPhase;
  content: string;
  is_active: boolean;
  tags: string | null; // JSON array string
  created_at: string;
  archived_at: string | null;
}

export interface CreateSOPInput {
  sop_number: number;
  version: string;
  name: string;
  phase: SOPPhase;
  content: string;
  tags?: string[];
}

export const SOP_PHASES = [
  { phase: "ideation" as const, label: "Ideation", sops: [0, 1, 2, 3] },
  { phase: "design" as const, label: "Design", sops: [4] },
  { phase: "setup" as const, label: "Setup", sops: [5, 6] },
  { phase: "build" as const, label: "Build", sops: [7, 8] },
  { phase: "launch" as const, label: "Launch", sops: [9, 10] },
  { phase: "post_launch" as const, label: "Post-Launch", sops: [11, 12] },
];

// ============================================
// Idea Types
// ============================================

export type IdeaStatus = "pending" | "audited" | "active" | "paused" | "archived";

export interface Idea {
  id: string;
  name: string;
  slug: string;
  problem_statement: string | null;
  proposed_solution: string | null;
  source: string | null;
  status: IdeaStatus;
  audit_result: string | null; // JSON string of IdeaAuditResult
  created_at: string;
  audited_at: string | null;
  activated_at: string | null;
  project_id: string | null;
}

export interface CreateIdeaInput {
  name: string;
  problem_statement?: string;
  proposed_solution?: string;
  source?: string;
}

export interface IdeaAuditResult {
  pros: string[];
  cons: string[];
  score: number; // 1-10
  recommendation: "proceed" | "revise" | "reject";
  reasoning: string;
}

// ============================================
// Shot Clock Types
// ============================================

export type ShotClockStatus = "active" | "completed" | "expired" | "locked";

export interface ShotClockSession {
  id: string;
  project_id: string;
  phase_number: number;
  allocated_time_seconds: number;
  bonus_time_seconds: number;
  time_remaining_seconds: number;
  status: ShotClockStatus;
  started_at: string;
  completed_at: string | null;
  locked_until: string | null;
}

// Default time allocations per SOP (in minutes)
export const SHOT_CLOCK_DEFAULTS: Record<number, { name: string; minutes: number }> = {
  0: { name: "Idea Intake", minutes: 15 },
  1: { name: "Quick Validation", minutes: 30 },
  2: { name: "MVP Scope Lock", minutes: 45 },
  3: { name: "Revenue Model Lock", minutes: 30 },
  4: { name: "Design Brief", minutes: 60 },
  5: { name: "Project Setup", minutes: 45 },
  6: { name: "Infrastructure", minutes: 60 },
  7: { name: "Development", minutes: 480 },
  8: { name: "Testing & QA", minutes: 120 },
  9: { name: "Pre-Ship Checklist", minutes: 90 },
  10: { name: "Launch Day", minutes: 60 },
  11: { name: "Post-Launch Monitoring", minutes: 120 },
  12: { name: "Marketing Activation", minutes: 180 },
};

// ============================================
// Settings Types
// ============================================

export interface AppSettings {
  anthropic_api_key: string | null;
  theme: "light" | "dark" | "system";
  auto_analyze: boolean;
}

// ============================================
// Project Analysis Types
// ============================================

export interface PackageJsonInfo {
  name: string | null;
  dependencies: string[];
  dev_dependencies: string[];
  scripts: string[];
}

export interface CargoTomlInfo {
  name: string | null;
  dependencies: string[];
}

export interface SopProgress {
  estimated_phase: number;
  phase_name: string;
  evidence: string[];
}

export interface ProjectAnalysis {
  project_path: string;
  tech_stack: string[];
  frameworks: string[];
  has_git: boolean;
  has_tests: boolean;
  has_ci: boolean;
  has_env_example: boolean;
  file_count: number;
  directory_structure: string[];
  detected_services: string[];
  package_json: PackageJsonInfo | null;
  cargo_toml: CargoTomlInfo | null;
  recommendations: string[];
  sop_progress: SopProgress;
}

// ============================================
// Vault Artifact Types
// ============================================

export type ArtifactType = "idea" | "contract" | "revenue" | "design";

export interface VaultArtifact {
  artifact_type: ArtifactType;
  slug: string;
  file_name: string;
  directory: "backlog" | "active" | "killed";
  path: string;
}

export interface ArtifactResult {
  success: boolean;
  file_path: string;
  message: string;
}

export interface CreateIdeaFileInput {
  name: string;
  problem_statement: string;
  proposed_solution: string;
  source: string;
  source_details?: string;
  who_has_problem?: string;
  pain_description?: string;
  current_solution?: string;
  searched_for_solutions?: boolean;
  would_you_pay?: string;
  price_point_guess?: string;
  know_someone_with_pain?: boolean;
  is_painful?: boolean;
  is_feasible?: boolean;
  can_generate_revenue?: boolean;
  additional_notes?: string;
}

export interface UpdateIdeaFileInput {
  slug: string;
  field: string;
  value: string;
}

export interface CreateContractFileInput {
  slug: string;
  product_name: string;
  value_proposition: string;
  bar_napkin_pitch: string;
  features: string[];
  non_goals: string[];
  launch_day_customers: number;
  launch_day_revenue: number;
  thirty_day_revenue: number;
  thirty_day_active_users: number;
  thirty_day_churn_target: number;
  price_point: number;
  customers_needed_30_day: number;
}

export interface DesignFeature {
  icon: string;
  headline: string;
  description: string;
}

export interface CreateDesignFileInput {
  slug: string;
  product_name: string;
  entry_point: string;
  hook_point: string;
  value_point: string;
  convert_point: string;
  success_point: string;
  screens: string[];
  hero_headline: string;
  hero_subheadline: string;
  hero_cta: string;
  hero_visual: string;
  features: DesignFeature[];
  pricing_display: string;
  pricing_includes: string;
  pricing_cta: string;
  core_interaction: string;
  form_submit_pattern: string;
  error_pattern: string;
  loading_pattern: string;
  components: string[];
  layout_choice: string;
  breakpoint_notes?: string;
  additional_notes?: string;
}

export interface CreateRevenueFileInput {
  slug: string;
  product_name: string;
  revenue_model: string;
  model_reasoning: string;
  price: number;
  price_period: string;
  annual_discount?: number;
  competitor_a: string;
  competitor_b: string;
  positioning: string;
  value_delivered: string;
  trial_type: string;
  trial_reasoning: string;
  entry_point: string;
  paywall_trigger: string;
  cta_text: string;
  payment_method: string;
  access_grant: string;
  refund_policy: string;
  refund_conditions?: string;
  launch_day_revenue: number;
  thirty_day_revenue: number;
  ninety_day_revenue: number;
  launch_day_customers: number;
  thirty_day_customers: number;
  ninety_day_customers: number;
}

// ============================================
// Workflow Types
// ============================================

export type WorkflowStatus = "not_started" | "in_progress" | "completed" | "blocked" | "skipped";
export type WorkflowDecision = "green" | "yellow" | "red";

export interface WorkflowProgress {
  id: string;
  idea_id: string;
  current_sop: number;
  current_step: string | null;
  completed_steps: string;  // JSON array
  step_data: string;        // JSON object
  validation_score: number | null;
  decision: WorkflowDecision | null;
  started_at: string;
  updated_at: string;
}

export interface WorkflowArtifact {
  id: string;
  workflow_id: string;
  artifact_type: ArtifactType;
  file_path: string;
  created_at: string;
}

export interface ProgressSummary {
  current_sop_name: string;
  current_sop_number: number;
  steps_completed: number;
  percent_complete: number;
  phase: string;
}

export interface WorkflowContext {
  workflow: WorkflowProgress;
  idea_name: string;
  idea_slug: string;
  artifacts: WorkflowArtifact[];
  completed_steps_parsed: string[];
  step_data_parsed: Record<string, unknown>;
  progress_summary: ProgressSummary;
  next_action: string;
}

export interface CompleteStepInput {
  idea_id: string;
  step_id: string;
  data: Record<string, unknown>;
}