# Agents Directory

> Configuration and resources for AI agents working within Launchpad.

**Status:** Active  
**Last Updated:** 2026-01-03

---

## Purpose

This directory contains everything AI agents need beyond the core documentation:
- **Workflow automations** (n8n exports)
- **Reusable prompts** for common tasks
- **MCP server configurations** for tool access

---

## Directory Structure

```
_agents/
├── AGENTS_README.md    # This file
├── n8n/
│   └── workflows/      # Exported n8n workflow JSON files
├── prompts/
│   └── PROMPTS.md      # Index of reusable prompts
└── mcp/
    └── MCP.md          # MCP server setup guide
```

---

## Usage

### For AI Agents

1. Check `prompts/PROMPTS.md` for pre-built prompts before writing new ones
2. Reference `mcp/MCP.md` for available tool servers
3. Use n8n workflows for automated pipelines

### For Dalton

- Export n8n workflows as JSON to `n8n/workflows/`
- Add new prompt templates to `prompts/`
- Configure new MCP servers in `mcp/`

---

## Adding New Resources

### Adding a Workflow

1. Export from n8n as JSON
2. Save to `n8n/workflows/{workflow-name}.json`
3. Document purpose in a comment or companion `.md` file

### Adding a Prompt

1. Add to `prompts/PROMPTS.md` with:
   - Name
   - Use case
   - The prompt template
   - Variables to fill in

### Adding an MCP Server

1. Document in `mcp/MCP.md`:
   - Server name
   - Purpose
   - Setup instructions
   - Available tools

---

*This directory grows as Launchpad automation matures.*

