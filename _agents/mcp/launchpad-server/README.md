# Launchpad MCP Server

MCP (Model Context Protocol) server that exposes Launchpad operations to Claude Code.

## Setup

```bash
cd _agents/mcp/launchpad-server
pnpm install
pnpm build
```

## Claude Desktop Configuration

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "launchpad": {
      "command": "node",
      "args": ["C:/Users/Owner/workspace/launchpad/_agents/mcp/launchpad-server/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop after updating config.

## Available Tools

### Ideas
- `list_ideas` - List ideas by status (backlog/active/shipped/killed)
- `get_idea` - Get full idea content
- `create_idea` - Create new idea in backlog
- `move_idea` - Move idea between folders

### Audits
- `get_audit` - Get audit report for an idea
- `list_audits` - List audits with optional filters

### SOPs
- `get_sop` - Get SOP content (0-12, 01a)
- `list_sops` - List all SOPs
- `search_sops` - Search SOP content

### Projects
- `list_projects` - List all projects
- `get_project` - Get project info

### Vault
- `get_vault_stats` - Pipeline statistics

### AI Assistant (requires ANTHROPIC_API_KEY)
- `ask_sop_assistant` - Ask questions about SOPs, get guidance
- `suggest_next_sop` - Get AI recommendation for next SOP based on your situation

## Resources

- `launchpad://ideas/index` - IDEAS.md
- `launchpad://stack` - STACK.md
