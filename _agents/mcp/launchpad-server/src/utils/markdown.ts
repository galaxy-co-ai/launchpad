import fs from "fs/promises";

export interface MarkdownFile {
  frontmatter: Record<string, string>;
  content: string;
  raw: string;
}

/**
 * Parse a markdown file with YAML frontmatter
 */
export async function parseMarkdownFile(filePath: string): Promise<MarkdownFile> {
  const raw = await fs.readFile(filePath, "utf-8");
  return parseMarkdown(raw);
}

/**
 * Parse markdown content with YAML frontmatter
 */
export function parseMarkdown(raw: string): MarkdownFile {
  const frontmatter: Record<string, string> = {};
  let content = raw;

  // Check for frontmatter
  if (raw.startsWith("---")) {
    const endIndex = raw.indexOf("---", 3);
    if (endIndex !== -1) {
      const frontmatterText = raw.slice(3, endIndex).trim();
      content = raw.slice(endIndex + 3).trim();

      // Parse YAML-like frontmatter (simple key: value pairs)
      for (const line of frontmatterText.split("\n")) {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
          const key = line.slice(0, colonIndex).trim();
          let value = line.slice(colonIndex + 1).trim();
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          frontmatter[key] = value;
        }
      }
    }
  }

  return { frontmatter, content, raw };
}

/**
 * Extract the title from markdown content (first H1)
 */
export function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/**
 * Extract a summary/description from markdown (first paragraph after title)
 */
export function extractSummary(content: string): string | null {
  // Find first non-empty line after a heading
  const lines = content.split("\n");
  let foundHeading = false;

  for (const line of lines) {
    if (line.startsWith("#")) {
      foundHeading = true;
      continue;
    }
    if (foundHeading && line.trim() && !line.startsWith("#") && !line.startsWith(">")) {
      return line.trim();
    }
  }
  return null;
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read file content as string
 */
export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

/**
 * Write file content
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, "utf-8");
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}
