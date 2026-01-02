# Approved Dependencies

> Pre-vetted packages for Launchpad projects. If it's not on this list, ask before adding.

**Last Updated:** 2025-12-28

---

## Core Principle

**Minimal dependencies, maximum stability.** Every package added is a maintenance burden. We use what we need, nothing more.

---

## Required (Every Project)

These packages are installed in every Launchpad project:

### Framework & Language

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

### Styling

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  }
}
```

### UI Components

```json
{
  "dependencies": {
    "lucide-react": "^0.460.0",
    "@radix-ui/react-slot": "^1.1.0"
  }
}
```

Note: shadcn/ui components are copy-pasted, not installed. Radix packages are added as needed per component.

### Forms & Validation

```json
{
  "dependencies": {
    "zod": "^3.24.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0"
  }
}
```

### Animation

```json
{
  "dependencies": {
    "motion": "^11.15.0"
  }
}
```

### Utilities

```json
{
  "dependencies": {
    "date-fns": "^4.1.0",
    "sonner": "^1.7.0"
  }
}
```

---

## Database & ORM

```json
{
  "dependencies": {
    "drizzle-orm": "^0.38.0",
    "@neondatabase/serverless": "^0.10.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.0"
  }
}
```

---

## Authentication

```json
{
  "dependencies": {
    "@clerk/nextjs": "^6.0.0"
  }
}
```

---

## Cache & Rate Limiting

```json
{
  "dependencies": {
    "@upstash/redis": "^1.34.0",
    "@upstash/ratelimit": "^2.0.0"
  }
}
```

---

## AI & LLM

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.0"
  }
}
```

### Optional AI Packages

```json
{
  "dependencies": {
    "@upstash/vector": "^1.1.0",
    "ai": "^4.0.0"
  }
}
```

---

## Payments

```json
{
  "dependencies": {
    "stripe": "^17.0.0"
  }
}
```

---

## Error Tracking

```json
{
  "dependencies": {
    "@sentry/nextjs": "^8.0.0"
  }
}
```

---

## Optional Enhancements

These are approved but only add when needed:

### Command Palette

```json
{
  "dependencies": {
    "cmdk": "^1.0.0"
  }
}
```

### Drawer Component

```json
{
  "dependencies": {
    "vaul": "^1.1.0"
  }
}
```

### Carousels

```json
{
  "dependencies": {
    "embla-carousel-react": "^8.5.0"
  }
}
```

### Charts

```json
{
  "dependencies": {
    "recharts": "^2.14.0"
  }
}
```

### Rich Text Editor

```json
{
  "dependencies": {
    "@tiptap/react": "^2.0.0",
    "@tiptap/starter-kit": "^2.0.0"
  }
}
```

### Email

```json
{
  "dependencies": {
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.30"
  }
}
```

### File Uploads

```json
{
  "dependencies": {
    "uploadthing": "^7.0.0",
    "@uploadthing/react": "^7.0.0"
  }
}
```

### State Management (when React state isn't enough)

```json
{
  "dependencies": {
    "zustand": "^5.0.0"
  }
}
```

### Data Fetching (for complex cases)

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0"
  }
}
```

---

## Development Tools

```json
{
  "devDependencies": {
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.4.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

---

## Radix UI Components

Add as needed when using shadcn/ui components:

```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.0",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-hover-card": "^1.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.0",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0"
  }
}
```

---

## Install Commands

### New Project Setup

```bash
# Core (always)
pnpm add next react react-dom
pnpm add -D typescript @types/node @types/react @types/react-dom

# Styling
pnpm add tailwindcss class-variance-authority clsx tailwind-merge

# UI
pnpm add lucide-react motion sonner date-fns

# Forms
pnpm add zod react-hook-form @hookform/resolvers

# shadcn/ui init
pnpm dlx shadcn@latest init
```

### Database

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

### Auth

```bash
pnpm add @clerk/nextjs
```

### Cache

```bash
pnpm add @upstash/redis @upstash/ratelimit
```

### AI

```bash
pnpm add @anthropic-ai/sdk
```

### Payments

```bash
pnpm add stripe
```

---

## Banned Packages

Do not install these:

| Package | Reason | Alternative |
|---------|--------|-------------|
| `prisma` | Slower, heavier | `drizzle-orm` |
| `next-auth` | Complex, over-engineered | `@clerk/nextjs` |
| `styled-components` | CSS-in-JS bloat | Tailwind |
| `emotion` | CSS-in-JS bloat | Tailwind |
| `redux` | Over-engineered | React state / Zustand |
| `mobx` | Magic, hard to debug | React state / Zustand |
| `axios` | Unnecessary, fetch exists | Native fetch |
| `lodash` | Tree-shaking issues | Native JS / date-fns |
| `moment` | Huge bundle | `date-fns` |
| `express` | Not needed with Next.js | API routes |
| `electron` | Bloated desktop apps | Tauri |

---

## Adding New Dependencies

Before adding a package not on this list:

1. **Check if native JS can do it** — Often it can
2. **Check bundle size** — Use bundlephobia.com
3. **Check maintenance** — Last commit? Open issues?
4. **Ask** — Is this truly necessary?

If approved, add it to this document with rationale.

---

*Only install what's on this list. Everything else requires approval.*
