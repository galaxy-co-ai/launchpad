import { glob } from "glob";
import { paths, getSopPath } from "../utils/paths.js";
import { parseMarkdownFile, readFile, fileExists, extractTitle } from "../utils/markdown.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// Tool definitions
export const sopTools: Tool[] = [
  {
    name: "get_sop",
    description: "Get the content of a specific SOP (Standard Operating Procedure). SOPs are numbered 00-12, with 01a being the rigorous audit.",
    inputSchema: {
      type: "object",
      properties: {
        number: {
          type: "string",
          description: "SOP number: 0-12 or '01a' for rigorous audit",
        },
      },
      required: ["number"],
    },
  },
  {
    name: "list_sops",
    description: "List all available SOPs (Standard Operating Procedures) in the Launchpad system",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "search_sops",
    description: "Search SOP content for a specific query string",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term to find in SOP content",
        },
      },
      required: ["query"],
    },
  },
];

// SOP metadata for listing
const SOP_LIST = [
  { number: "00", phase: "Ideation", title: "Idea Intake", file: "00-idea-intake.md" },
  { number: "01", phase: "Ideation", title: "Quick Validation", file: "01-quick-validation.md" },
  { number: "01a", phase: "Ideation", title: "Rigorous Idea Audit", file: "01a-rigorous-idea-audit.md" },
  { number: "02", phase: "Ideation", title: "MVP Scope Contract", file: "02-mvp-scope-contract.md" },
  { number: "03", phase: "Ideation", title: "Revenue Model Lock", file: "03-revenue-model-lock.md" },
  { number: "04", phase: "Design", title: "Design Brief", file: "04-design-brief.md" },
  { number: "05", phase: "Setup", title: "Project Setup", file: "05-project-setup.md" },
  { number: "06", phase: "Setup", title: "Infrastructure Provisioning", file: "06-infrastructure-provisioning.md" },
  { number: "07", phase: "Build", title: "Development Protocol", file: "07-development-protocol.md" },
  { number: "08", phase: "Build", title: "Testing & QA Checklist", file: "08-testing-qa-checklist.md" },
  { number: "09", phase: "Launch", title: "Pre-Ship Checklist", file: "09-pre-ship-checklist.md" },
  { number: "10", phase: "Launch", title: "Launch Day Protocol", file: "10-launch-day-protocol.md" },
  { number: "11", phase: "Post-Launch", title: "Post-Launch Monitoring", file: "11-post-launch-monitoring.md" },
  { number: "12", phase: "Post-Launch", title: "Marketing Activation", file: "12-marketing-activation.md" },
];

// Tool handlers
export async function handleGetSop(args: { number: string }): Promise<string> {
  try {
    const sopPath = getSopPath(args.number);

    if (!(await fileExists(sopPath))) {
      return JSON.stringify({
        error: `SOP ${args.number} not found`,
        available: SOP_LIST.map(s => s.number),
      });
    }

    const { frontmatter, content, raw } = await parseMarkdownFile(sopPath);

    return JSON.stringify({
      number: args.number,
      path: sopPath,
      frontmatter,
      content: raw,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to get SOP: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleListSops(): Promise<string> {
  return JSON.stringify({
    sops: SOP_LIST,
    total: SOP_LIST.length,
    phases: {
      ideation: SOP_LIST.filter(s => s.phase === "Ideation"),
      design: SOP_LIST.filter(s => s.phase === "Design"),
      setup: SOP_LIST.filter(s => s.phase === "Setup"),
      build: SOP_LIST.filter(s => s.phase === "Build"),
      launch: SOP_LIST.filter(s => s.phase === "Launch"),
      postLaunch: SOP_LIST.filter(s => s.phase === "Post-Launch"),
    },
  });
}

export async function handleSearchSops(args: { query: string }): Promise<string> {
  try {
    const results: Array<{
      number: string;
      title: string;
      phase: string;
      matches: string[];
    }> = [];

    const query = args.query.toLowerCase();

    for (const sop of SOP_LIST) {
      const sopPath = `${paths.sops}/${sop.file}`;

      if (!(await fileExists(sopPath))) continue;

      const content = await readFile(sopPath);
      const lines = content.split("\n");
      const matches: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(query)) {
          // Include context (the matching line)
          matches.push(`Line ${i + 1}: ${lines[i].trim().substring(0, 100)}${lines[i].length > 100 ? "..." : ""}`);
        }
      }

      if (matches.length > 0) {
        results.push({
          number: sop.number,
          title: sop.title,
          phase: sop.phase,
          matches: matches.slice(0, 5), // Limit to first 5 matches per SOP
        });
      }
    }

    return JSON.stringify({
      query: args.query,
      totalMatches: results.reduce((sum, r) => sum + r.matches.length, 0),
      sopsWithMatches: results.length,
      results,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// Route handler
export async function handleSopTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "get_sop":
      return handleGetSop(args as { number: string });
    case "list_sops":
      return handleListSops();
    case "search_sops":
      return handleSearchSops(args as { query: string });
    default:
      return JSON.stringify({ error: `Unknown SOP tool: ${name}` });
  }
}
