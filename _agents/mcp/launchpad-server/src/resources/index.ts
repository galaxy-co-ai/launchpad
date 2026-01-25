import { paths } from "../utils/paths.js";
import { readFile, fileExists } from "../utils/markdown.js";
import type { Resource } from "@modelcontextprotocol/sdk/types.js";

export const resources: Resource[] = [
  {
    uri: "launchpad://ideas/index",
    name: "Ideas Index",
    description: "Master index of all ideas (IDEAS.md)",
    mimeType: "text/markdown",
  },
  {
    uri: "launchpad://stack",
    name: "Tech Stack",
    description: "Locked technology decisions (STACK.md)",
    mimeType: "text/markdown",
  },
];

export async function handleReadResource(uri: string): Promise<string> {
  try {
    if (uri === "launchpad://ideas/index") {
      if (await fileExists(paths.ideasIndex)) {
        return await readFile(paths.ideasIndex);
      }
      return "# Ideas Index\n\nNo IDEAS.md found.";
    }

    if (uri === "launchpad://stack") {
      const stackPath = `${paths.stack}/STACK.md`;
      if (await fileExists(stackPath)) {
        return await readFile(stackPath);
      }
      return "# Stack\n\nNo STACK.md found.";
    }

    return `Resource not found: ${uri}`;
  } catch (error) {
    return `Error reading resource: ${error instanceof Error ? error.message : String(error)}`;
  }
}
