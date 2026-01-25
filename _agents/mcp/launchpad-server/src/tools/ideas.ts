import { glob } from "glob";
import path from "path";
import fs from "fs/promises";
import { paths, getVaultPath, getAuditPath } from "../utils/paths.js";
import { parseMarkdownFile, fileExists, readFile, writeFile, ensureDir } from "../utils/markdown.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// Tool definitions
export const ideaTools: Tool[] = [
  {
    name: "list_ideas",
    description: "List ideas in the Launchpad vault by status folder",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["backlog", "active", "shipped", "killed"],
          description: "Filter by idea status folder",
        },
      },
      required: ["status"],
    },
  },
  {
    name: "get_idea",
    description: "Get the full content of a specific idea file",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The idea slug (kebab-case identifier)",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "create_idea",
    description: "Create a new idea file in the backlog folder",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Unique slug for the idea (kebab-case)",
        },
        name: {
          type: "string",
          description: "Human-readable name for the idea",
        },
        problem: {
          type: "string",
          description: "Problem statement - what pain does this solve?",
        },
        solution: {
          type: "string",
          description: "Proposed solution - how does this solve the problem?",
        },
        source: {
          type: "string",
          description: "Where did this idea come from?",
        },
      },
      required: ["slug", "name", "problem", "solution"],
    },
  },
  {
    name: "move_idea",
    description: "Move an idea between vault folders (backlog, active, shipped, killed)",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The idea slug to move",
        },
        to_status: {
          type: "string",
          enum: ["backlog", "active", "shipped", "killed"],
          description: "Target folder to move the idea to",
        },
        reason: {
          type: "string",
          description: "Optional reason for the move (for audit trail)",
        },
      },
      required: ["slug", "to_status"],
    },
  },
];

// Helper to find an idea across all vault folders
async function findIdea(slug: string): Promise<{ path: string; status: string } | null> {
  const statuses = ["backlog", "active", "shipped", "killed"];

  for (const status of statuses) {
    const ideaPath = path.join(getVaultPath(status), `IDEA-${slug}.md`);
    if (await fileExists(ideaPath)) {
      return { path: ideaPath, status };
    }
  }
  return null;
}

// Tool handlers
export async function handleListIdeas(args: { status: string }): Promise<string> {
  try {
    const vaultPath = getVaultPath(args.status);

    if (!(await fileExists(vaultPath))) {
      return JSON.stringify({
        status: args.status,
        ideas: [],
        count: 0,
      });
    }

    const files = await glob("IDEA-*.md", { cwd: vaultPath });

    const ideas = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace("IDEA-", "").replace(".md", "");
        const filePath = path.join(vaultPath, file);

        try {
          const { frontmatter } = await parseMarkdownFile(filePath);
          return {
            slug,
            name: frontmatter.name || slug,
            created: frontmatter.created || null,
            path: filePath,
          };
        } catch {
          return {
            slug,
            name: slug,
            created: null,
            path: filePath,
          };
        }
      })
    );

    return JSON.stringify({
      status: args.status,
      ideas,
      count: ideas.length,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to list ideas: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleGetIdea(args: { slug: string }): Promise<string> {
  try {
    const found = await findIdea(args.slug);

    if (!found) {
      return JSON.stringify({
        error: `Idea '${args.slug}' not found in any vault folder`,
        searched: ["backlog", "active", "shipped", "killed"],
      });
    }

    const { frontmatter, content, raw } = await parseMarkdownFile(found.path);

    // Check if audit exists
    const auditPath = getAuditPath(args.slug);
    const hasAudit = await fileExists(auditPath);

    return JSON.stringify({
      slug: args.slug,
      status: found.status,
      path: found.path,
      frontmatter,
      content: raw,
      hasAudit,
      auditPath: hasAudit ? auditPath : null,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to get idea: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleCreateIdea(args: {
  slug: string;
  name: string;
  problem: string;
  solution: string;
  source?: string;
}): Promise<string> {
  try {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(args.slug)) {
      return JSON.stringify({
        error: "Invalid slug format. Use kebab-case (lowercase letters, numbers, hyphens)",
      });
    }

    // Check if idea already exists
    const existing = await findIdea(args.slug);
    if (existing) {
      return JSON.stringify({
        error: `Idea '${args.slug}' already exists in ${existing.status}`,
        path: existing.path,
      });
    }

    // Create idea content
    const date = new Date().toISOString().split("T")[0];
    const ideaContent = `---
name: "${args.name}"
slug: "${args.slug}"
created: "${date}"
source: "${args.source || "Manual entry"}"
status: "backlog"
---

# ${args.name}

## Problem Statement

${args.problem}

## Proposed Solution

${args.solution}

## Initial Signals

- [ ] Would you pay for this? (Gut check)
- [ ] Have you searched for solutions? (Active need)
- [ ] Do you know someone with this problem? (Market validation)

## Next Steps

1. Complete SOP 00-idea-intake.md checklist
2. Run quick validation (SOP 01)
3. If promising, run rigorous audit (SOP 01a)

---

*Created via Launchpad MCP Server*
`;

    // Ensure backlog directory exists
    await ensureDir(paths.vaultBacklog);

    // Write idea file
    const ideaPath = path.join(paths.vaultBacklog, `IDEA-${args.slug}.md`);
    await writeFile(ideaPath, ideaContent);

    return JSON.stringify({
      success: true,
      slug: args.slug,
      status: "backlog",
      path: ideaPath,
      nextStep: "Run quick validation (SOP 01) or rigorous audit (SOP 01a)",
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to create idea: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleMoveIdea(args: {
  slug: string;
  to_status: string;
  reason?: string;
}): Promise<string> {
  try {
    // Find the idea
    const found = await findIdea(args.slug);

    if (!found) {
      return JSON.stringify({
        error: `Idea '${args.slug}' not found in any vault folder`,
      });
    }

    if (found.status === args.to_status) {
      return JSON.stringify({
        error: `Idea '${args.slug}' is already in ${args.to_status}`,
        path: found.path,
      });
    }

    // Ensure target directory exists
    const targetDir = getVaultPath(args.to_status);
    await ensureDir(targetDir);

    // Move the file
    const newPath = path.join(targetDir, `IDEA-${args.slug}.md`);
    await fs.rename(found.path, newPath);

    // Log the move (append to file)
    const date = new Date().toISOString();
    const moveLog = `\n\n---\n*Moved from ${found.status} to ${args.to_status} on ${date}${args.reason ? `: ${args.reason}` : ""}*\n`;

    const content = await readFile(newPath);
    await writeFile(newPath, content + moveLog);

    return JSON.stringify({
      success: true,
      slug: args.slug,
      from_status: found.status,
      to_status: args.to_status,
      old_path: found.path,
      new_path: newPath,
      reason: args.reason || null,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to move idea: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// Route handler
export async function handleIdeaTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "list_ideas":
      return handleListIdeas(args as { status: string });
    case "get_idea":
      return handleGetIdea(args as { slug: string });
    case "create_idea":
      return handleCreateIdea(args as {
        slug: string;
        name: string;
        problem: string;
        solution: string;
        source?: string;
      });
    case "move_idea":
      return handleMoveIdea(args as {
        slug: string;
        to_status: string;
        reason?: string;
      });
    default:
      return JSON.stringify({ error: `Unknown idea tool: ${name}` });
  }
}
