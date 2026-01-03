# MCP Server Configurations

> Model Context Protocol servers for AI agent tool access.

**Last Updated:** 2026-01-03  
**Status:** Setup Guide

---

## What is MCP?

Model Context Protocol (MCP) allows AI agents to access external tools and data sources. This directory contains configurations for MCP servers used in Launchpad workflows.

---

## Available Servers

| Server | Purpose | Status |
|--------|---------|--------|
| Filesystem | Read/write project files | Available via Cursor |
| GitHub | Repo management | Planned |
| Canva | Brand asset generation | Planned |

---

## Setup Instructions

### Cursor IDE (Built-in)

Cursor already provides MCP-like capabilities through its built-in tools:
- File reading/writing
- Terminal access
- Codebase search

No additional setup required for basic Launchpad workflows.

### Adding Custom MCP Servers

If you need additional MCP servers (e.g., for n8n automation):

1. Install the MCP server package
2. Configure in your MCP client (Claude Desktop, etc.)
3. Document the configuration here

**Example Configuration (Claude Desktop):**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "C:\\Users\\Dalto\\launchpad"]
    }
  }
}
```

---

## Planned Integrations

### GitHub MCP Server

**Purpose:** Automate repo creation, PR management, issue tracking

**When Ready:**
- Add config to this file
- Update `AGENTS.md` with new capabilities

### Canva MCP Server

**Purpose:** Generate brand assets (logos, social images) programmatically

**When Ready:**
- Requires Canva API access
- Add config and usage guide here

---

## Usage Guidelines

1. **Prefer built-in tools** — Cursor's native capabilities cover most needs
2. **Add servers incrementally** — Only when automation requires them
3. **Document configurations** — Future agents need to know what's available
4. **Test before committing** — Verify servers work before adding to this doc

---

*MCP configurations grow as automation needs mature.*

