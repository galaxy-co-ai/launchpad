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
  title: string | null;
  created_at: string;
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
