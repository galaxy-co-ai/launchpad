# Launchpad Desktop App

> Desktop companion for the Launchpad Micro-SaaS shipping framework

**Version:** 0.3.0  
**Status:** Active Development  
**Stack:** Next.js 16 + Tauri 2.0

---

## What Is This?

Launchpad Desktop is a native Windows/Mac/Linux application that provides:

- **Idea Management** — Capture and organize Micro-SaaS ideas
- **AI-Guided Workflows** — Intelligent assistant guides you through all 13 SOPs
- **Project Browser** — View and manage active projects
- **Chat Interface** — AI-powered assistant with tool use capabilities
- **Workflow State Machine** — Persistent progress tracking across sessions
- **Progress Dashboard** — Visual Kanban pipeline for ideas
- **Settings Management** — Configure Launchpad preferences

This is the GUI for the Launchpad framework — a desktop-native alternative to CLI workflows.

---

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Run Next.js dev server + Tauri
pnpm dev:tauri

# Or run Next.js only
pnpm dev
```

### Production Build

```bash
# Build the desktop app
pnpm tauri build

# Output location:
# src-tauri/target/release/launchpad.exe (Windows)
# src-tauri/target/release/bundle/dmg/launchpad.dmg (macOS)
# src-tauri/target/release/bundle/appimage/launchpad.AppImage (Linux)
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** Radix UI primitives
- **State:** Zustand
- **Icons:** Lucide React

### Desktop
- **Runtime:** Tauri 2.0 (Rust)
- **IPC:** Tauri commands
- **Database:** SQLite (via rusqlite)
- **File System:** Tauri FS plugin
- **Dialogs:** Tauri dialog plugin

---

## Project Structure

```
launchpad-app/
├── src/
│   ├── app/                    → Next.js pages
│   │   ├── page.tsx            → Dashboard home
│   │   ├── ideas/              → Ideas pipeline dashboard
│   │   ├── new-project/        → New project wizard
│   │   ├── project/            → Project viewer
│   │   ├── sops/               → SOP browser
│   │   └── settings/           → Settings panel
│   ├── components/
│   │   ├── app-shell.tsx       → Main layout
│   │   ├── sidebar.tsx         → Navigation sidebar
│   │   ├── titlebar.tsx        → Custom window controls
│   │   ├── chat/               → Chat interface components
│   │   ├── workflow/           → Workflow UI components
│   │   │   ├── IdeaPipeline.tsx    → Kanban board
│   │   │   ├── IdeaDetail.tsx      → Idea detail view
│   │   │   ├── WorkflowProgress.tsx → Progress indicator
│   │   │   └── SOPChecklist.tsx    → Step checklist
│   │   └── ui/                 → Radix UI components
│   └── lib/
│       ├── store.ts            → Zustand state + workflow actions
│       ├── types.ts            → TypeScript types
│       └── utils.ts            → Utilities
├── src-tauri/
│   ├── src/
│   │   ├── commands/           → Tauri command handlers
│   │   │   ├── analyzer.rs     → Directory analysis
│   │   │   ├── artifacts.rs    → Artifact file generation
│   │   │   ├── chat.rs         → Chat + AI tools
│   │   │   ├── file_tools.rs   → File operations
│   │   │   ├── ideas.rs        → Idea CRUD
│   │   │   ├── projects.rs     → Project CRUD
│   │   │   ├── settings.rs     → Settings management
│   │   │   ├── sops.rs         → SOP data loading
│   │   │   └── workflow.rs     → Workflow state machine
│   │   ├── db/                 → SQLite database
│   │   ├── lib.rs              → Tauri library
│   │   └── main.rs             → Entry point
│   └── tauri.conf.json         → Tauri configuration
└── package.json
```

---

## Features

### ✅ Implemented

#### Core Features
- Custom titlebar with window controls
- Sidebar navigation with active states
- Chat interface with message history
- Project browser with metadata
- SOP browser with phase filtering
- Settings panel with theme toggle
- Launch theme design system (charcoal + blue/orange)

#### AI-Guided Workflows (NEW in v0.3.0)
- **Machine-Readable SOP Schemas** — JSON schemas for SOPs 0-4
- **Artifact Generation Tools** — AI can create IDEA, CONTRACT, REVENUE, DESIGN files
- **Workflow State Machine** — Track progress through SOPs with persistence
- **Progress Dashboard** — Kanban pipeline view for ideas
- **Conversation Continuity** — Resume where you left off with context injection

### 🔨 In Progress

- SOP schemas for phases 5-12
- File content sync with vault artifacts
- Git integration for auto-commits

### ⏳ Planned

- Terminal output viewer
- n8n workflow integration
- Multi-project parallel tracking

---

## AI-Guided Workflow System

### How It Works

1. **User says "I have an idea"** → AI loads SOP-00 schema, guides through questions
2. **AI creates artifacts** → Generates `IDEA-{slug}.md` in `_vault/backlog/`
3. **Validation flow** → AI guides through SOP-01 scoring (125-point rubric)
4. **Decision made** → Idea moves to `_vault/active/` or `_vault/killed/`
5. **Continue through SOPs** → Scope → Revenue → Design → Build
6. **Session persistence** → Close app, reopen, AI remembers context

### Artifact Types

| Artifact | SOP | Location |
|----------|-----|----------|
| IDEA-{slug}.md | SOP-00 | `_vault/backlog/` |
| CONTRACT-{slug}.md | SOP-02 | `_vault/active/` |
| REVENUE-{slug}.md | SOP-03 | `_vault/active/` |
| DESIGN-{slug}.md | SOP-04 | `_vault/active/` |

### Workflow State

The workflow state machine tracks:
- Current SOP number (0-12)
- Current step within SOP
- Completed steps (with collected data)
- Validation scores and decisions
- Generated artifacts

### Resume Detection

The AI detects phrases like:
- "Where were we?"
- "What was I working on?"
- "Continue from last time"
- "Resume"
- "Pick up where we left off"

And automatically summarizes progress before continuing.

---

## Design System

### Launch Theme

The app uses a **Launch Theme** aesthetic:

- **Charcoal gradients** for containers (`from-[#3A3A3C] to-[#1C1C1E]`)
- **Blue ambient glow** for primary actions (`rgba(59, 130, 246, 0.15)`)
- **Orange active states** for interactions (`rgba(249, 115, 22, 0.25)`)
- **White icons** on dark surfaces

### Phase Colors

| Phase | Color | SOPs |
|-------|-------|------|
| Ideation | Amber/Orange | 0-1 |
| Design | Purple/Pink | 2-4 |
| Build | Blue/Cyan | 5-8 |
| Launch | Green/Emerald | 9-12 |

---

## Development

### Running Commands

Tauri commands are defined in `src-tauri/src/commands/`:

```rust
// Example: Get all projects
#[tauri::command]
fn get_projects() -> Vec<Project> {
    // Implementation
}
```

Call from frontend:

```tsx
import { invoke } from '@tauri-apps/api/core';

const projects = await invoke<Project[]>('get_projects');
```

### Adding New Commands

1. Create handler in `src-tauri/src/commands/{module}.rs`
2. Export from `src-tauri/src/commands/mod.rs`
3. Register in `src-tauri/src/lib.rs`
4. Call from frontend with `invoke()`

### AI Tool Integration

AI tools are defined in `chat.rs`:

```rust
fn get_tools() -> serde_json::Value {
    json!([
        {
            "name": "create_idea_file",
            "description": "Creates an IDEA markdown file",
            "input_schema": { ... }
        }
    ])
}
```

Execution handlers in `execute_tool()` map tool names to Rust functions.

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| projects | Project metadata |
| ideas | Idea storage |
| conversations | Chat conversations |
| messages | Chat messages |
| workflow_progress | Workflow state per idea |
| workflow_artifacts | Artifacts linked to workflows |

---

## Building

### Prerequisites

- Node.js 20+
- pnpm
- Rust (for Tauri)
- MSVC Build Tools (Windows)

```bash
# Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install dependencies
pnpm install
```

### Build Process

```bash
# Development build
pnpm tauri dev

# Production build (optimized)
pnpm tauri build

# Build takes ~5-10 minutes on first run
# Subsequent builds are faster (incremental compilation)
```

---

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clean Rust build cache
cd src-tauri
cargo clean
cd ..

# Clean Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
pnpm install
pnpm tauri build
```

### Hot Reload Not Working

Ensure both Next.js and Tauri dev servers are running:

```bash
# Terminal 1: Next.js
pnpm dev

# Terminal 2: Tauri
pnpm tauri dev
```

### MSVC Linker Not Found (Windows)

Install Visual Studio Build Tools with C++ workload:
1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Install "Desktop development with C++"
3. Restart terminal and rebuild

---

## Contributing

This is part of the Launchpad framework. See root `CLAUDE.md` and `GOVERNANCE.md` for contribution guidelines.

---

Built with [Launchpad](https://github.com/galaxyco-ai/launchpad) | Powered by [Tauri](https://tauri.app)
