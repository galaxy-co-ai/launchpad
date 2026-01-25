import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Launchpad root is 5 levels up from this file:
// launchpad-server/src/utils/paths.ts -> launchpad-server/src/utils -> launchpad-server/src -> launchpad-server -> mcp -> _agents -> launchpad
export const LAUNCHPAD_ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..");

// Key directories
export const paths = {
  root: LAUNCHPAD_ROOT,
  vault: path.join(LAUNCHPAD_ROOT, "_vault"),
  vaultBacklog: path.join(LAUNCHPAD_ROOT, "_vault", "backlog"),
  vaultActive: path.join(LAUNCHPAD_ROOT, "_vault", "active"),
  vaultShipped: path.join(LAUNCHPAD_ROOT, "_vault", "shipped"),
  vaultKilled: path.join(LAUNCHPAD_ROOT, "_vault", "killed"),
  vaultAudits: path.join(LAUNCHPAD_ROOT, "_vault", "audits"),
  sops: path.join(LAUNCHPAD_ROOT, "_sops"),
  projects: path.join(LAUNCHPAD_ROOT, "projects"),
  stack: path.join(LAUNCHPAD_ROOT, "_stack"),
  designSystem: path.join(LAUNCHPAD_ROOT, "_design-system"),
  templates: path.join(LAUNCHPAD_ROOT, "_templates"),
  ideasIndex: path.join(LAUNCHPAD_ROOT, "_vault", "IDEAS.md"),
};

// Get vault path for a status
export function getVaultPath(status: string): string {
  switch (status) {
    case "backlog":
      return paths.vaultBacklog;
    case "active":
      return paths.vaultActive;
    case "shipped":
      return paths.vaultShipped;
    case "killed":
      return paths.vaultKilled;
    default:
      throw new Error(`Unknown vault status: ${status}`);
  }
}

// Get idea file path
export function getIdeaPath(slug: string, status?: string): string | null {
  if (status) {
    return path.join(getVaultPath(status), `IDEA-${slug}.md`);
  }

  // Search all vault folders
  const statuses = ["backlog", "active", "shipped", "killed"];
  for (const s of statuses) {
    const ideaPath = path.join(getVaultPath(s), `IDEA-${slug}.md`);
    // Note: Caller should check if file exists
    return ideaPath;
  }
  return null;
}

// Get audit file path
export function getAuditPath(slug: string): string {
  return path.join(paths.vaultAudits, `AUDIT-${slug}.md`);
}

// Get SOP file path
export function getSopPath(sopNumber: string | number): string {
  const num = String(sopNumber).padStart(2, "0");
  // Handle special case for 01a
  if (sopNumber === "01a" || sopNumber === "1a") {
    return path.join(paths.sops, "01a-rigorous-idea-audit.md");
  }
  // List of SOP files by number
  const sopFiles: Record<string, string> = {
    "00": "00-idea-intake.md",
    "01": "01-quick-validation.md",
    "02": "02-mvp-scope-contract.md",
    "03": "03-revenue-model-lock.md",
    "04": "04-design-brief.md",
    "05": "05-project-setup.md",
    "06": "06-infrastructure-provisioning.md",
    "07": "07-development-protocol.md",
    "08": "08-testing-qa-checklist.md",
    "09": "09-pre-ship-checklist.md",
    "10": "10-launch-day-protocol.md",
    "11": "11-post-launch-monitoring.md",
    "12": "12-marketing-activation.md",
  };

  const filename = sopFiles[num];
  if (!filename) {
    throw new Error(`Unknown SOP number: ${sopNumber}`);
  }
  return path.join(paths.sops, filename);
}

// Get project path
export function getProjectPath(projectName: string): string {
  return path.join(paths.projects, projectName);
}
