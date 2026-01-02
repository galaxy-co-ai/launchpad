# 🎨 Launchpad Design System — Complete Guide

**Version:** 1.0.0  
**Last Updated:** December 27, 2025  
**Target:** Apple Human Interface Guidelines Level Polish

---

## 🎯 Design Philosophy

We aim for **Apple iOS/macOS quality** — refined, purposeful, delightful. Every pixel matters.

### Core Principles (Apple HIG-Inspired)

| Principle | What It Means | Implementation |
|-----------|---------------|----------------|
| **Clarity** | Content is king, UI supports it | Minimal chrome, typography hierarchy |
| **Deference** | UI never competes with content | Subtle backgrounds, muted UI elements |
| **Depth** | Layers create context | Shadows, blur, translucency |
| **Consistency** | Predictable patterns | Shared tokens, component library |
| **Direct Manipulation** | Immediate feedback | Hover states, animations, haptics |

---

## 🧱 Component Architecture

### Foundation Layer (LOCKED)

```
┌─────────────────────────────────────────────────────────┐
│  shadcn/ui (Base Components)                            │
│  └── Radix UI Primitives (Accessibility)                │
│      └── Tailwind CSS (Styling)                         │
│          └── CSS Variables (Theming)                    │
└─────────────────────────────────────────────────────────┘
```

### Premium Extensions (APPROVED)

| Library | Purpose | When to Use |
|---------|---------|-------------|
| **Aceternity UI** | Magic animated components | Landing pages, hero sections, marketing |
| **Magic UI** | Startup-focused animations | Product features, showcases |
| **Origin UI** | Advanced patterns | Complex UIs, dashboards |

```bash
# Aceternity UI - Copy components from ui.aceternity.com
# Magic UI - Copy components from magicui.design  
# Origin UI - Copy components from originui.com

# These are copy-paste libraries, no npm install needed
```

---

## 🎨 Color System

### Token Structure (OKLCH - Modern)

shadcn/ui uses OKLCH colors (perceptually uniform) in Tailwind v4:

```css
:root {
  /* Semantic tokens */
  --background: oklch(1 0 0);              /* Pure white */
  --foreground: oklch(0.145 0 0);          /* Near black */
  
  --primary: oklch(0.205 0 0);             /* Actions */
  --primary-foreground: oklch(0.985 0 0);
  
  --secondary: oklch(0.97 0 0);            /* Secondary actions */
  --secondary-foreground: oklch(0.205 0 0);
  
  --muted: oklch(0.97 0 0);                /* Disabled, hints */
  --muted-foreground: oklch(0.556 0 0);
  
  --accent: oklch(0.97 0 0);               /* Highlights */
  --accent-foreground: oklch(0.205 0 0);
  
  --destructive: oklch(0.577 0.245 27.325); /* Errors, danger */
  
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... inverted for dark mode */
}
```

### Color Usage Rules

| Intent | Token | Never Use |
|--------|-------|-----------|
| Page background | `bg-background` | `bg-white`, `bg-black` |
| Primary text | `text-foreground` | `text-gray-900` |
| Secondary text | `text-muted-foreground` | `text-gray-500` |
| Borders | `border-border` | `border-gray-200` |
| Focus ring | `ring-ring` | Arbitrary colors |
| Destructive | `bg-destructive` | `bg-red-500` |

---

## ✍️ Typography System

### Font Stack (Geist Family)

```tsx
// app/layout.tsx - Next.js App Router
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

### Type Scale (Apple-Inspired)

| Role | Tailwind Class | Size | Weight | Use Case |
|------|---------------|------|--------|----------|
| Display | `text-5xl font-bold tracking-tight` | 48px | 700 | Hero headlines |
| Title 1 | `text-4xl font-bold` | 36px | 700 | Page titles |
| Title 2 | `text-3xl font-semibold` | 30px | 600 | Section headers |
| Title 3 | `text-2xl font-semibold` | 24px | 600 | Card titles |
| Headline | `text-xl font-medium` | 20px | 500 | Subsections |
| Body | `text-base` | 16px | 400 | Default text |
| Callout | `text-base font-medium` | 16px | 500 | Emphasized body |
| Subhead | `text-sm font-medium` | 14px | 500 | Labels, metadata |
| Footnote | `text-sm text-muted-foreground` | 14px | 400 | Secondary info |
| Caption | `text-xs text-muted-foreground` | 12px | 400 | Timestamps, hints |

### Line Height

```css
/* Global defaults - already in Tailwind */
--leading-tight: 1.25;    /* Headlines */
--leading-snug: 1.375;    /* Titles */
--leading-normal: 1.5;    /* Body (default) */
--leading-relaxed: 1.625; /* Long-form */
```

---

## 📐 Spacing System (8pt Grid)

### Base Scale

Tailwind's default spacing is 4px base (1 = 4px). We use **8pt grid** for layouts:

| Token | Pixels | Tailwind | Use Case |
|-------|--------|----------|----------|
| 0 | 0px | `0` | None |
| 1 | 4px | `1` | Tight spacing only |
| 2 | 8px | `2` | Minimum spacing |
| 3 | 12px | `3` | Tight padding |
| 4 | 16px | `4` | Standard padding |
| 6 | 24px | `6` | Component gaps |
| 8 | 32px | `8` | Section spacing |
| 12 | 48px | `12` | Large sections |
| 16 | 64px | `16` | Page sections |
| 24 | 96px | `24` | Hero spacing |

### Spacing Rules (Internal ≤ External)

```
┌─────────────────────────────────────────────┐
│  Card (p-6 = 24px internal)                 │
│  ┌─────────────────────────────────────┐    │
│  │  Content (gap-4 = 16px between)     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
        ↑ gap-8 (32px) between cards
```

**Rule:** Padding inside elements ≤ Gap between elements

---

## 🎬 Animation System

### Core Library: Framer Motion

```bash
npm install motion
```

### Animation Presets (Apple-Like)

```tsx
// lib/animations.ts
export const animations = {
  // Enter/Exit - Snappy, responsive
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Slide up - Modal/sheet entry
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  
  // Scale - Buttons, cards
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Spring - Natural feel
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 30
  },
  
  // Gentle spring - Longer movements
  springGentle: {
    type: "spring",
    stiffness: 300,
    damping: 25
  }
}
```

### Easing Curves (CSS Variables)

```css
:root {
  /* Standard easings */
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  
  /* Apple-like snappy */
  --ease-apple: cubic-bezier(0.25, 0.1, 0.25, 1);
  
  /* Smooth deceleration */
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Bounce */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
}
```

### Animation Guidelines

| Interaction | Duration | Easing | Notes |
|-------------|----------|--------|-------|
| Hover state | 150ms | ease-out | Instant feel |
| Button press | 100ms | ease-out | Snappy feedback |
| Modal open | 250ms | ease-out | Slide + fade |
| Modal close | 200ms | ease-in | Slightly faster out |
| Page transition | 300ms | ease-in-out | Smooth swap |
| Skeleton shimmer | 1.5s | linear | Infinite loop |

### Reduced Motion Support

```tsx
// Always respect user preferences
import { motion } from "motion/react"
import { useReducedMotion } from "motion/react"

function Component() {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      animate={{ opacity: 1, y: shouldReduceMotion ? 0 : 20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    />
  )
}
```

---

## 🪟 Glassmorphism / Apple Liquid Glass

### Basic Glass Effect

```css
.glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Tailwind Utility Classes

```tsx
// Light glass panel
<div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl">

// Dark glass panel  
<div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl">

// Frosted card
<div className="bg-background/80 backdrop-blur-md border shadow-lg rounded-xl">
```

### When to Use Glass Effects

| ✅ Use For | ❌ Avoid For |
|-----------|-------------|
| Navigation overlays | Primary content areas |
| Modal backdrops | Forms with lots of inputs |
| Floating toolbars | Text-heavy sections |
| Notification toasts | Low-contrast situations |
| Sidebars over content | Below colorful backgrounds |

---

## 🔲 Shadow System

### Elevation Scale

```css
:root {
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
```

### Usage Guidelines

| Element | Shadow | Tailwind |
|---------|--------|----------|
| Input focus | xs | `shadow-xs` |
| Card resting | sm | `shadow-sm` |
| Card hover | md | `shadow-md` |
| Dropdown | lg | `shadow-lg` |
| Modal | xl | `shadow-xl` |
| Popover | xl | `shadow-xl` |

---

## 🔘 Border Radius System

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-default: 0.25rem; /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Pill shape */
}
```

### Component Radius Standards

| Component | Radius | Tailwind |
|-----------|--------|----------|
| Button | lg (8px) | `rounded-lg` |
| Input | md (6px) | `rounded-md` |
| Card | xl (12px) | `rounded-xl` |
| Modal | 2xl (16px) | `rounded-2xl` |
| Avatar | full | `rounded-full` |
| Badge | md (6px) | `rounded-md` |
| Tooltip | md (6px) | `rounded-md` |

---

## ♿ Accessibility Requirements

### WCAG 2.1 AA Compliance (Minimum)

| Requirement | Standard | How We Meet It |
|-------------|----------|----------------|
| Color contrast | 4.5:1 text, 3:1 UI | OKLCH tokens tested |
| Keyboard nav | Full support | Radix primitives |
| Focus visible | Always visible | `ring-2 ring-ring` |
| Screen readers | ARIA labels | Radix handles it |
| Reduced motion | Respected | `prefers-reduced-motion` |
| Touch targets | 44x44px min | Padding on buttons |

### Focus States (Mandatory)

```tsx
// Every interactive element needs visible focus
<Button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Click me
</Button>
```

---

## 📱 Responsive Breakpoints

```css
/* Tailwind defaults - mobile first */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Container Widths

```tsx
// Standard content container
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// Narrow content (articles, forms)
<div className="mx-auto max-w-2xl px-4">

// Wide content (dashboards)
<div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
```

---

## 📦 Complete Dependency List

### Required (Every Project)

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.460.0",
    "motion": "^11.15.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.24.0",
    "sonner": "^1.7.0",
    "date-fns": "^4.1.0"
  }
}
```

### Optional Enhancements

```json
{
  "dependencies": {
    "cmdk": "^1.0.0",           // Command palette
    "vaul": "^1.1.0",            // Drawer component
    "embla-carousel-react": "^8.5.0", // Carousels
    "recharts": "^2.14.0",       // Charts
    "@radix-ui/react-slot": "^1.1.0" // Composition
  }
}
```

---

## 🚀 Quick Start Checklist

```
□ Initialize shadcn/ui: npx shadcn@latest init
□ Install core deps: npm install motion lucide-react sonner
□ Configure Geist fonts in layout.tsx
□ Set up CSS variables in globals.css
□ Add animation presets to lib/animations.ts
□ Configure Tailwind with custom tokens
□ Test dark mode toggle
□ Verify focus states work
□ Check reduced motion support
```

---

*This design system targets Apple-level polish. Every decision is intentional.*
