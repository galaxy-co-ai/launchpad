#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { sopTools, handleSopTool } from "./tools/sops.js";
import { ideaTools, handleIdeaTool } from "./tools/ideas.js";
import { auditTools, handleAuditTool } from "./tools/audits.js";
import { projectTools, handleProjectTool } from "./tools/projects.js";
import { vaultTools, handleVaultTool } from "./tools/vault.js";
import { sopAssistantTools, handleSopAssistantTool } from "./tools/sop-assistant.js";
import { resources, handleReadResource } from "./resources/index.js";

// Create server
const server = new Server(
  {
    name: "launchpad",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// All tools combined
const allTools = [...sopTools, ...ideaTools, ...auditTools, ...projectTools, ...vaultTools, ...sopAssistantTools];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  let result: string;

  // Route to appropriate handler
  if (name.startsWith("get_sop") || name.startsWith("list_sop") || name.startsWith("search_sop")) {
    result = await handleSopTool(name, args || {});
  } else if (name.includes("idea")) {
    result = await handleIdeaTool(name, args || {});
  } else if (name.includes("audit")) {
    result = await handleAuditTool(name, args || {});
  } else if (name.includes("project")) {
    result = await handleProjectTool(name, args || {});
  } else if (name.includes("vault")) {
    result = await handleVaultTool(name, args || {});
  } else if (name === "ask_sop_assistant" || name === "suggest_next_sop") {
    result = await handleSopAssistantTool(name, args || {});
  } else {
    result = JSON.stringify({ error: `Unknown tool: ${name}` });
  }

  return {
    content: [{ type: "text", text: result }],
  };
});

// List resources handler
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources,
}));

// Read resource handler
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  const content = await handleReadResource(uri);
  return {
    contents: [{ uri, mimeType: "text/markdown", text: content }],
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Launchpad MCP Server running on stdio");
}

main().catch(console.error);
