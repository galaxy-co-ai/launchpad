import { glob } from "glob";
import path from "path";
import { paths, getAuditPath } from "../utils/paths.js";
import { parseMarkdownFile, fileExists, readFile } from "../utils/markdown.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// Tool definitions
export const auditTools: Tool[] = [
  {
    name: "get_audit",
    description: "Get the audit report for a specific idea. Audits are created by SOP 01a-rigorous-idea-audit.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The idea slug to get the audit for",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "list_audits",
    description: "List all audit reports with optional filtering by verdict or minimum score",
    inputSchema: {
      type: "object",
      properties: {
        verdict: {
          type: "string",
          enum: ["STRONG GO", "GO", "CONDITIONAL", "WEAK", "KILL"],
          description: "Filter by verdict",
        },
        min_score: {
          type: "number",
          description: "Filter by minimum total score (0-500)",
        },
      },
      required: [],
    },
  },
];

// Helper to parse audit score from content
function parseAuditScore(content: string): number | null {
  // Try frontmatter first
  const scoreMatch = content.match(/final_score:\s*"?(\d+)\/500"?/);
  if (scoreMatch) {
    return parseInt(scoreMatch[1], 10);
  }

  // Try Score Summary table
  const tableMatch = content.match(/\*\*TOTAL\*\*\s*\|\s*\*\*(\d+)\/500\*\*/);
  if (tableMatch) {
    return parseInt(tableMatch[1], 10);
  }

  return null;
}

// Helper to parse verdict from content
function parseVerdict(content: string): string | null {
  // Try frontmatter
  const frontmatterMatch = content.match(/verdict:\s*"?([^"\n]+)"?/);
  if (frontmatterMatch) {
    return frontmatterMatch[1].trim();
  }

  // Try header
  const headerMatch = content.match(/## Verdict:\s*(.+)/);
  if (headerMatch) {
    return headerMatch[1].trim();
  }

  return null;
}

// Helper to parse pillar scores
function parsePillarScores(content: string): Record<string, { score: number; pass: boolean }> | null {
  const scores: Record<string, { score: number; pass: boolean }> = {};

  const pillarMatches = content.matchAll(/\|\s*(\d+)\.\s*([^|]+)\s*\|\s*(\d+)\/100\s*\|\s*\d+\s*\|\s*(Yes|No)\s*\|/g);

  for (const match of pillarMatches) {
    const name = match[2].trim();
    const score = parseInt(match[3], 10);
    const pass = match[4] === "Yes";
    scores[name] = { score, pass };
  }

  return Object.keys(scores).length > 0 ? scores : null;
}

// Tool handlers
export async function handleGetAudit(args: { slug: string }): Promise<string> {
  try {
    const auditPath = getAuditPath(args.slug);

    if (!(await fileExists(auditPath))) {
      return JSON.stringify({
        error: `No audit found for idea '${args.slug}'`,
        expected_path: auditPath,
        suggestion: "Run audit-idea.ps1 to create an audit",
      });
    }

    const { frontmatter, content, raw } = await parseMarkdownFile(auditPath);
    const score = parseAuditScore(raw);
    const verdict = parseVerdict(raw);
    const pillarScores = parsePillarScores(raw);

    return JSON.stringify({
      slug: args.slug,
      path: auditPath,
      frontmatter,
      score,
      verdict,
      pillarScores,
      content: raw,
      aiAssisted: frontmatter.ai_assisted === "true",
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to get audit: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleListAudits(args: {
  verdict?: string;
  min_score?: number;
}): Promise<string> {
  try {
    const auditsDir = paths.vaultAudits;

    if (!(await fileExists(auditsDir))) {
      return JSON.stringify({
        audits: [],
        count: 0,
        filters: args,
      });
    }

    const files = await glob("AUDIT-*.md", { cwd: auditsDir });

    const audits = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace("AUDIT-", "").replace(".md", "");
        const filePath = path.join(auditsDir, file);

        try {
          const content = await readFile(filePath);
          const { frontmatter } = await parseMarkdownFile(filePath);
          const score = parseAuditScore(content);
          const verdict = parseVerdict(content);

          return {
            slug,
            score,
            verdict,
            date: frontmatter.audit_date || null,
            aiAssisted: frontmatter.ai_assisted === "true",
            path: filePath,
          };
        } catch {
          return {
            slug,
            score: null,
            verdict: null,
            date: null,
            aiAssisted: false,
            path: filePath,
          };
        }
      })
    );

    // Apply filters
    let filtered = audits;

    if (args.verdict) {
      filtered = filtered.filter((a) => a.verdict === args.verdict);
    }

    if (args.min_score !== undefined) {
      filtered = filtered.filter((a) => a.score !== null && a.score >= args.min_score!);
    }

    // Sort by score descending
    filtered.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Summary stats
    const verdictCounts: Record<string, number> = {};
    for (const audit of audits) {
      if (audit.verdict) {
        verdictCounts[audit.verdict] = (verdictCounts[audit.verdict] || 0) + 1;
      }
    }

    return JSON.stringify({
      audits: filtered,
      count: filtered.length,
      total: audits.length,
      filters: args,
      summary: {
        verdictCounts,
        averageScore: audits.filter((a) => a.score).length > 0
          ? Math.round(
              audits.filter((a) => a.score).reduce((sum, a) => sum + (a.score || 0), 0) /
              audits.filter((a) => a.score).length
            )
          : null,
      },
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to list audits: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// Route handler
export async function handleAuditTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "get_audit":
      return handleGetAudit(args as { slug: string });
    case "list_audits":
      return handleListAudits(args as { verdict?: string; min_score?: number });
    default:
      return JSON.stringify({ error: `Unknown audit tool: ${name}` });
  }
}
