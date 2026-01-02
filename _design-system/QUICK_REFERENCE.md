# 🎯 Launchpad Design System — Quick Reference

**Last Updated:** December 27, 2025  
**Goal:** Ship beautiful products in 72 hours

---

## 🔒 LOCKED STACK

| Category | Choice | Package |
|----------|--------|---------|
| **Components** | shadcn/ui | `npx shadcn@latest` |
| **Primitives** | Radix UI | via shadcn |
| **Styling** | Tailwind CSS v4 | `tailwindcss` |
| **Icons** | Lucide | `lucide-react` |
| **Fonts** | Geist Sans/Mono | `next/font` |
| **Animation** | Motion (Framer) | `motion` |
| **Forms** | React Hook Form + Zod | `react-hook-form @hookform/resolvers zod` |
| **Toasts** | Sonner | `sonner` |
| **Dates** | date-fns | `date-fns` |
| **Utilities** | clsx + tailwind-merge | `clsx tailwind-merge` |
| **Variants** | CVA | `class-variance-authority` |

---

## 📦 Install Commands

```bash
# Core (required)
npm install lucide-react motion sonner date-fns
npm install class-variance-authority clsx tailwind-merge
npm install react-hook-form @hookform/resolvers zod

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input form dialog etc.
```

---

## 🎨 Theme Colors

```tsx
// Always use semantic tokens
bg-background      // Page background
bg-card            // Elevated surfaces
bg-muted           // Disabled, hints
bg-primary         // Main actions
bg-secondary       // Alt actions
bg-destructive     // Danger/errors

text-foreground       // Primary text
text-muted-foreground // Secondary text
text-primary          // Links, emphasis

border-border      // Default borders
border-input       // Form inputs
ring-ring          // Focus states
```

---

## ✍️ Typography

```tsx
// Headings
text-5xl font-bold    // Display (48px)
text-4xl font-bold    // Title 1 (36px)
text-3xl font-semibold // Title 2 (30px)
text-2xl font-semibold // Title 3 (24px)
text-xl font-medium   // Headline (20px)

// Body
text-base             // Body (16px)
text-sm               // Small (14px)
text-xs               // Caption (12px)

// Font family
font-sans             // Geist Sans
font-mono             // Geist Mono
```

---

## 📏 Spacing (8pt Grid)

```tsx
// Padding
p-2   // 8px
p-4   // 16px
p-6   // 24px
p-8   // 32px

// Gap
gap-2 // 8px
gap-4 // 16px
gap-6 // 24px
gap-8 // 32px

// Margin
m-4   // 16px
my-8  // 32px vertical
mx-auto // Center
```

---

## 🎬 Animation

```tsx
// Simple transitions (Tailwind)
transition-colors duration-150
transition-all duration-200 ease-out

// Complex animations (Motion)
import { motion } from "motion/react"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
/>

// Spring
transition={{ type: "spring", stiffness: 400, damping: 25 }}

// Loading spinner
<Loader2 className="h-5 w-5 animate-spin" />
```

---

## 🔲 Border Radius

```tsx
rounded-md   // 6px - Inputs
rounded-lg   // 8px - Buttons
rounded-xl   // 12px - Cards
rounded-2xl  // 16px - Modals
rounded-full // Pills, avatars
```

---

## 🌓 Dark Mode

```tsx
// In layout.tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// Toggle
import { useTheme } from "next-themes"
const { theme, setTheme } = useTheme()
```

---

## 🎯 Icons (Lucide)

```tsx
import { Home, Settings, User, Loader2 } from "lucide-react"

// Standard size
<Home className="h-5 w-5" />

// With color
<Home className="h-5 w-5 text-muted-foreground" />

// Interactive
<Home className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />

// Accessibility (icon-only buttons)
<Button size="icon" aria-label="Settings">
  <Settings className="h-5 w-5" />
</Button>
```

---

## 🪟 Glassmorphism

```tsx
// Light glass
className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-xl"

// Dark glass
className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl"

// Subtle glass
className="bg-background/80 backdrop-blur-md border shadow-lg rounded-xl"
```

---

## 🚀 Premium Components

| Use Case | Library | Examples |
|----------|---------|----------|
| **Hero sections** | Aceternity UI | Spotlight, Aurora, Meteor |
| **Text effects** | Aceternity UI | TypewriterEffect, TextGenerate |
| **Feature showcase** | Magic UI | Bento Grid, Animated Beam |
| **Social proof** | Aceternity UI | Infinite Moving Cards |
| **CTAs** | Magic UI | Shimmer Button |
| **App UI** | shadcn/ui | Forms, dialogs, tables |

---

## ✅ Component Checklist

Every component should have:

- [ ] Semantic color tokens (no hardcoded colors)
- [ ] Proper focus states (`focus-visible:ring-2`)
- [ ] Hover/active transitions
- [ ] Dark mode support
- [ ] Reduced motion support
- [ ] ARIA labels where needed
- [ ] Loading states
- [ ] Error states

---

## 🛑 Never Do

```tsx
// ❌ Hardcoded colors
className="bg-gray-900 text-white"
// ✅ Use tokens
className="bg-background text-foreground"

// ❌ Mixed icon libraries
import { FaHome } from "react-icons/fa"
// ✅ Lucide only
import { Home } from "lucide-react"

// ❌ Arbitrary values
className="p-[13px] w-[347px]"
// ✅ Use scale
className="p-3 w-80"

// ❌ Missing accessibility
<Button size="icon"><X /></Button>
// ✅ Add aria-label
<Button size="icon" aria-label="Close"><X /></Button>

// ❌ Heavy animations everywhere
// ✅ Subtle, purposeful motion
```

---

## 📁 File Structure

```
_design-system/
├── DESIGN_SYSTEM.md          # Full guide
├── components/
│   └── PREMIUM_COMPONENTS.md # Aceternity/Magic UI guide
├── icons/
│   └── ICONS.md              # Lucide usage
├── tokens/
│   ├── colors.css            # Color variables
│   ├── typography.css        # Font tokens
│   └── animations.css        # Motion tokens
└── themes/
    ├── light.css             # Light mode
    └── dark.css              # Dark mode
```

---

```
┌─────────────────────────────────────────────────────────┐
│  LAUNCHPAD DESIGN SYSTEM                                │
│  "Apple-level polish, 72-hour shipping"                 │
├─────────────────────────────────────────────────────────┤
│  UI:        shadcn/ui + Radix + Tailwind                │
│  Icons:     Lucide (only)                               │
│  Font:      Geist Sans/Mono                             │
│  Motion:    Framer Motion                               │
│  Marketing: Aceternity UI + Magic UI                    │
│  Forms:     React Hook Form + Zod                       │
│  Toasts:    Sonner                                      │
└─────────────────────────────────────────────────────────┘
```

---

*This system is LOCKED. Follow it exactly.*
