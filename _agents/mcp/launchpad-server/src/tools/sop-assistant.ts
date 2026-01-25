import { paths } from "../utils/paths.js";
import { readFile, fileExists } from "../utils/markdown.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

// Tool definitions
export const sopAssistantTools: Tool[] = [
  {
    name: "ask_sop_assistant",
    description:
      "AI-powered assistant for navigating Launchpad SOPs. Ask questions about which SOP to use, get help with checklist items, understand handoffs between SOPs, or get guidance on your current situation. Requires ANTHROPIC_API_KEY environment variable.",
    inputSchema: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description:
            "Your question about SOPs - e.g., 'What SOP should I use for a new idea?', 'How do I pass the Problem Evidence pillar?', 'What happens after the audit?'",
        },
        context: {
          type: "string",
          description:
            "Optional context: current SOP number, idea slug, or relevant background",
        },
      },
      required: ["question"],
    },
  },
  {
    name: "suggest_next_sop",
    description:
      "Get AI recommendation for which SOP to execute next based on your current situation and vault status",
    inputSchema: {
      type: "object",
      properties: {
        current_situation: {
          type: "string",
          description:
            "Describe where you are: e.g., 'just had a new idea', 'idea passed audit', 'finished building MVP', 'ready to launch'",
        },
        idea_slug: {
          type: "string",
          description: "Optional: The slug of the idea you're working on",
        },
      },
      required: ["current_situation"],
    },
  },
];

// Load the prompt template
async function loadPromptTemplate(): Promise<{ systemPrompt: string; userTemplate: string }> {
  const templatePath = `${paths.root}/_agents/prompts/sop-assistant.md`;

  if (!(await fileExists(templatePath))) {
    throw new Error("SOP assistant prompt template not found");
  }

  const content = await readFile(templatePath);

  // Remove frontmatter
  let processedContent = content;
  if (content.startsWith("---")) {
    const endIndex = content.indexOf("---", 3);
    if (endIndex !== -1) {
      processedContent = content.slice(endIndex + 3).trim();
    }
  }

  // Split into system and user sections
  const systemMatch = processedContent.match(
    /# System Prompt\n([\s\S]*?)# User Message Template/
  );
  const userMatch = processedContent.match(/# User Message Template\n([\s\S]*)$/);

  const systemPrompt = systemMatch ? systemMatch[1].trim() : processedContent;
  const userTemplate = userMatch ? userMatch[1].trim() : "{{USER_QUESTION}}";

  return { systemPrompt, userTemplate };
}

// Call Claude API
async function callClaudeAPI(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return JSON.stringify({
      error: "ANTHROPIC_API_KEY not set",
      suggestion:
        "Set the ANTHROPIC_API_KEY environment variable to enable AI assistance",
    });
  }

  if (!apiKey.startsWith("sk-ant-")) {
    return JSON.stringify({
      error: "Invalid ANTHROPIC_API_KEY format",
      suggestion: "API key should start with 'sk-ant-'",
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json() as {
      content?: Array<{ type: string; text?: string }>;
    };

    if (data.content && data.content.length > 0) {
      const textContent = data.content.find((c) => c.type === "text");
      if (textContent && textContent.text) {
        return textContent.text;
      }
    }

    throw new Error("No text content in response");
  } catch (error) {
    throw new Error(
      `Claude API error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// Get vault status for context
async function getVaultStatus(): Promise<string> {
  const statuses = ["backlog", "active", "shipped", "killed"];
  const counts: Record<string, number> = {};

  for (const status of statuses) {
    const folder =
      paths[`vault${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof paths];
    if (await fileExists(folder as string)) {
      const { glob } = await import("glob");
      const files = await glob("IDEA-*.md", { cwd: folder as string });
      counts[status] = files.length;
    } else {
      counts[status] = 0;
    }
  }

  return `Vault status: ${counts.backlog} backlog, ${counts.active} active, ${counts.shipped} shipped, ${counts.killed} killed`;
}

// Tool handlers
export async function handleAskSopAssistant(args: {
  question: string;
  context?: string;
}): Promise<string> {
  try {
    const { systemPrompt, userTemplate } = await loadPromptTemplate();

    // Build user message
    let userMessage = userTemplate
      .replace("{{USER_QUESTION}}", args.question)
      .replace("{{CONTEXT}}", args.context ? `\nContext: ${args.context}` : "");

    // Add vault status for context
    const vaultStatus = await getVaultStatus();
    userMessage += `\n\n${vaultStatus}`;

    const response = await callClaudeAPI(systemPrompt, userMessage);

    return JSON.stringify({
      question: args.question,
      context: args.context || null,
      response,
    });
  } catch (error) {
    return JSON.stringify({
      error: `SOP Assistant error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

export async function handleSuggestNextSop(args: {
  current_situation: string;
  idea_slug?: string;
}): Promise<string> {
  try {
    const { systemPrompt } = await loadPromptTemplate();

    // Build a focused question
    let userMessage = `Based on this situation, which SOP should I execute next?\n\nCurrent situation: ${args.current_situation}`;

    if (args.idea_slug) {
      // Try to get idea info
      const statuses = ["backlog", "active", "shipped", "killed"];
      for (const status of statuses) {
        const ideaPath = `${paths[`vault${status.charAt(0).toUpperCase() + status.slice(1)}` as keyof typeof paths]}/IDEA-${args.idea_slug}.md`;
        if (await fileExists(ideaPath)) {
          userMessage += `\n\nIdea '${args.idea_slug}' is currently in: ${status}`;

          // Check if audit exists
          const auditPath = `${paths.vaultAudits}/AUDIT-${args.idea_slug}.md`;
          if (await fileExists(auditPath)) {
            userMessage += ` (audit exists)`;
          } else {
            userMessage += ` (no audit yet)`;
          }
          break;
        }
      }
    }

    // Add vault status
    const vaultStatus = await getVaultStatus();
    userMessage += `\n\n${vaultStatus}`;

    userMessage += `\n\nProvide a specific recommendation: which SOP number and why. Be direct.`;

    const response = await callClaudeAPI(systemPrompt, userMessage);

    return JSON.stringify({
      situation: args.current_situation,
      idea_slug: args.idea_slug || null,
      recommendation: response,
    });
  } catch (error) {
    return JSON.stringify({
      error: `SOP suggestion error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// Route handler
export async function handleSopAssistantTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "ask_sop_assistant":
      return handleAskSopAssistant(args as { question: string; context?: string });
    case "suggest_next_sop":
      return handleSuggestNextSop(
        args as { current_situation: string; idea_slug?: string }
      );
    default:
      return JSON.stringify({ error: `Unknown SOP assistant tool: ${name}` });
  }
}
