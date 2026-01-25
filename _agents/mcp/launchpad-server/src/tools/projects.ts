import { glob } from "glob";
import path from "path";
import fs from "fs/promises";
import { paths, getProjectPath } from "../utils/paths.js";
import { parseMarkdownFile, fileExists, readFile } from "../utils/markdown.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const projectTools: Tool[] = [
  {
    name: "list_projects",
    description: "List all projects in the Launchpad projects/ folder",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_project",
    description: "Get information about a specific project including its CLAUDE.md context",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Project name (folder name in projects/)",
        },
      },
      required: ["name"],
    },
  },
];

export async function handleListProjects(): Promise<string> {
  try {
    if (!(await fileExists(paths.projects))) {
      return JSON.stringify({ projects: [], count: 0 });
    }

    const entries = await fs.readdir(paths.projects, { withFileTypes: true });
    const projects = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = path.join(paths.projects, entry.name);
        const claudeMdPath = path.join(projectPath, "CLAUDE.md");

        let phase = null;
        let created = null;

        if (await fileExists(claudeMdPath)) {
          try {
            const content = await readFile(claudeMdPath);
            const phaseMatch = content.match(/Current Phase:\*\*\s*(.+)/);
            const createdMatch = content.match(/Created:\*\*\s*(\d{4}-\d{2}-\d{2})/);
            phase = phaseMatch ? phaseMatch[1].trim() : null;
            created = createdMatch ? createdMatch[1] : null;
          } catch {}
        }

        projects.push({
          name: entry.name,
          path: projectPath,
          phase,
          created,
          hasClaudeMd: await fileExists(claudeMdPath),
        });
      }
    }

    return JSON.stringify({ projects, count: projects.length });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to list projects: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleGetProject(args: { name: string }): Promise<string> {
  try {
    const projectPath = getProjectPath(args.name);

    if (!(await fileExists(projectPath))) {
      return JSON.stringify({
        error: `Project '${args.name}' not found`,
        path: projectPath,
      });
    }

    const claudeMdPath = path.join(projectPath, "CLAUDE.md");
    let claudeMd = null;

    if (await fileExists(claudeMdPath)) {
      claudeMd = await readFile(claudeMdPath);
    }

    const packageJsonPath = path.join(projectPath, "package.json");
    let packageJson = null;

    if (await fileExists(packageJsonPath)) {
      try {
        packageJson = JSON.parse(await readFile(packageJsonPath));
      } catch {}
    }

    return JSON.stringify({
      name: args.name,
      path: projectPath,
      claudeMd,
      packageJson: packageJson ? { name: packageJson.name, version: packageJson.version } : null,
    });
  } catch (error) {
    return JSON.stringify({
      error: `Failed to get project: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleProjectTool(name: string, args: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "list_projects":
      return handleListProjects();
    case "get_project":
      return handleGetProject(args as { name: string });
    default:
      return JSON.stringify({ error: `Unknown project tool: ${name}` });
  }
}
