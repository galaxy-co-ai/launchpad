import { glob } from "glob";
import { paths } from "../utils/paths.js";
import { fileExists } from "../utils/markdown.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const vaultTools: Tool[] = [
  {
    name: "get_vault_stats",
    description: "Get statistics about the ideas vault - counts by status, pending audits, etc.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

export async function handleGetVaultStats(): Promise<string> {
  try {
    const counts: Record<string, number> = {
      backlog: 0,
      active: 0,
      shipped: 0,
      killed: 0,
      audits: 0,
    };

    // Count ideas in each folder
    for (const status of ["backlog", "active", "shipped", "killed"] as const) {
      const folder = paths[`vault${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof paths];
      if (await fileExists(folder as string)) {
        const files = await glob("IDEA-*.md", { cwd: folder as string });
        counts[status] = files.length;
      }
    }

    // Count audits
    if (await fileExists(paths.vaultAudits)) {
      const auditFiles = await glob("AUDIT-*.md", { cwd: paths.vaultAudits });
      counts.audits = auditFiles.length;
    }

    const total = counts.backlog + counts.active + counts.shipped + counts.killed;
    const pendingAudit = counts.backlog; // Ideas in backlog likely need audit

    return JSON.stringify({
      counts,
      total,
      pendingAudit,
      pipeline: {
        stage1_backlog: counts.backlog,
        stage2_active: counts.active,
        stage3_shipped: counts.shipped,
        killed: counts.killed,
      },
      auditCoverage: total > 0 ? Math.round((counts.audits / total) * 100) : 0,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to get vault stats: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleVaultTool(name: string, _args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "get_vault_stats":
      return handleGetVaultStats();
    default:
      return JSON.stringify({ error: `Unknown vault tool: ${name}` });
  }
}
