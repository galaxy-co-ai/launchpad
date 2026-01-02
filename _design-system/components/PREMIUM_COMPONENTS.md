# ✨ Premium Animated Components — Aceternity UI & Magic UI

**Purpose:** Apple-level polish for marketing pages, hero sections, and product showcases.

---

## 🎯 When to Use Premium Components

| Library | Best For | Don't Use For |
|---------|----------|---------------|
| **shadcn/ui** | App UI, forms, dashboards | Marketing pages |
| **Aceternity UI** | Hero sections, landing pages | Dense data interfaces |
| **Magic UI** | Feature showcases, testimonials | Form-heavy pages |
| **Origin UI** | Complex app patterns | Simple pages |

---

## 🌟 Aceternity UI

**Website:** https://ui.aceternity.com  
**License:** Free for commercial use  
**How to use:** Copy-paste components (not npm install)

### Top Components for Launchpad

#### 1. Hero Sections
- **Spotlight** — Gradient spotlight following cursor
- **Meteor** — Falling meteor animation background
- **Aurora** — Northern lights background effect
- **Spotlight Background** — Dramatic lighting effect

#### 2. Text Effects
- **Text Generate Effect** — Words appearing one by one
- **TypewriterEffect** — Typing animation
- **Text Reveal Card** — Hover to reveal text
- **Flip Words** — Rotating word animation

#### 3. Cards & Containers
- **3D Card Effect** — Tilt on hover
- **Animated Card** — Floating animation
- **Moving Border** — Animated gradient border
- **Background Gradient** — Animated mesh gradient

#### 4. Navigation
- **Floating Navbar** — Glassmorphism nav
- **Floating Dock** — macOS-style dock
- **Tabs** — Animated tab transitions

#### 5. Testimonials & Social Proof
- **Infinite Moving Cards** — Auto-scrolling testimonials
- **Animated Testimonials** — Fancy testimonial cards

### Installation Pattern

```tsx
// 1. Create the component file
// components/ui/spotlight.tsx

// 2. Copy code from ui.aceternity.com

// 3. Import and use
import { Spotlight } from "@/components/ui/spotlight"

export function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative z-10">
        <h1>Your Hero Content</h1>
      </div>
    </div>
  )
}
```

---

## 🪄 Magic UI

**Website:** https://magicui.design  
**License:** Free for commercial use  
**How to use:** Copy-paste components

### Top Components for Launchpad

#### 1. Text Animations
- **Gradual Spacing** — Letters spacing out
- **Letter Pullup** — Letters pulling up into view
- **Word Pull Up** — Words animating in
- **Blur In** — Text blurring into focus
- **Fade Text** — Elegant fade animation
- **Sparkles Text** — Shimmering text effect

#### 2. Backgrounds
- **Dot Pattern** — Animated dot grid
- **Grid Pattern** — Subtle grid background
- **Retro Grid** — 80s-style perspective grid
- **Particles** — Floating particle system

#### 3. Interactive
- **Globe** — 3D rotating globe (react-globe.gl)
- **Orbiting Circles** — Circling elements
- **Marquee** — Smooth infinite scroll
- **Bento Grid** — Apple-style feature grid

#### 4. Buttons & CTAs
- **Shimmer Button** — Shimmering CTA
- **Pulsating Button** — Attention-grabbing pulse
- **Rainbow Button** — Animated rainbow border

#### 5. Feature Display
- **Safari** — Browser frame mockup
- **iPhone 15 Pro** — Device frame mockup
- **Animated Beam** — Connection line animation
- **Border Beam** — Animated border effect

### Installation Pattern

```tsx
// 1. Install dependencies if needed
// npm install motion (most components need it)

// 2. Create component file
// components/ui/shimmer-button.tsx

// 3. Copy from magicui.design

// 4. Use in your page
import { ShimmerButton } from "@/components/ui/shimmer-button"

<ShimmerButton>
  Start Free Trial
</ShimmerButton>
```

---

## 🏗️ Origin UI

**Website:** https://originui.com  
**License:** Free  
**How to use:** Copy-paste components

### When to Use Origin UI

Origin UI provides **400+ components** that are more advanced patterns than base shadcn/ui. Use for:

- Complex forms with validation states
- Advanced data tables
- Multi-step wizards
- Complex dialogs
- Timeline components
- Rich notifications
- Advanced menus

### Key Components

```
✅ Authentication forms (login, register, forgot password)
✅ Pricing tables with toggle
✅ Feature comparison tables
✅ Team member cards
✅ Notification systems
✅ Command menus
✅ File uploaders
✅ Date/time pickers
✅ Rich text inputs
```

---

## 📁 Component Organization

```
components/
├── ui/                    # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── aceternity/            # Aceternity UI components
│   ├── spotlight.tsx
│   ├── meteor.tsx
│   └── text-generate.tsx
├── magic/                 # Magic UI components
│   ├── shimmer-button.tsx
│   ├── bento-grid.tsx
│   └── marquee.tsx
└── blocks/                # Composed page blocks
    ├── hero-spotlight.tsx
    ├── testimonial-section.tsx
    └── feature-bento.tsx
```

---

## 🎨 Styling Integration

### Matching with shadcn/ui Theme

Most Aceternity/Magic UI components come with their own styles. To integrate with your theme:

```tsx
// Replace hardcoded colors with CSS variables
// Before:
className="bg-slate-900"

// After:
className="bg-background"

// Before:
className="text-white"

// After:
className="text-foreground"

// Before:
style={{ background: "linear-gradient(to right, #000, #333)" }}

// After:
className="bg-gradient-to-r from-background to-muted"
```

### Common Adjustments

```tsx
// 1. Background colors
"bg-black" → "bg-background"
"bg-white" → "bg-card"

// 2. Text colors
"text-white" → "text-foreground"
"text-gray-400" → "text-muted-foreground"

// 3. Borders
"border-gray-800" → "border-border"

// 4. Accent colors
"text-blue-500" → "text-primary"
```

---

## 🚀 Performance Considerations

### Do's

```tsx
// ✅ Lazy load heavy components
const Globe = dynamic(() => import("@/components/magic/globe"), {
  ssr: false,
  loading: () => <div className="h-[400px] animate-pulse bg-muted rounded-xl" />
})

// ✅ Use motion's LazyMotion for code splitting
import { LazyMotion, domAnimation } from "motion/react"

<LazyMotion features={domAnimation}>
  {/* Animated content */}
</LazyMotion>

// ✅ Disable animations in reduced motion mode
const prefersReducedMotion = useReducedMotion()
```

### Don'ts

```tsx
// ❌ Don't use heavy animations on mobile
// Add responsive checks
{!isMobile && <ParticleBackground />}

// ❌ Don't layer too many animated elements
// Pick ONE hero animation, not three

// ❌ Don't animate on every scroll
// Use intersection observer for scroll-triggered animations
```

---

## 📋 Page Template Patterns

### Landing Page Structure

```tsx
export default function LandingPage() {
  return (
    <>
      {/* Hero - Use Aceternity Spotlight or Aurora */}
      <section className="relative min-h-screen">
        <Spotlight />
        <HeroContent />
      </section>

      {/* Social Proof - Use Magic UI Marquee */}
      <section className="py-12 border-y">
        <LogoMarquee />
      </section>

      {/* Features - Use Magic UI Bento Grid */}
      <section className="py-24">
        <BentoGrid features={features} />
      </section>

      {/* Testimonials - Use Aceternity Moving Cards */}
      <section className="py-24 bg-muted">
        <InfiniteMovingCards testimonials={testimonials} />
      </section>

      {/* CTA - Use Magic UI Shimmer Button */}
      <section className="py-24 text-center">
        <ShimmerButton>Get Started Free</ShimmerButton>
      </section>
    </>
  )
}
```

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────┐
│  PREMIUM COMPONENTS GUIDE                               │
├─────────────────────────────────────────────────────────┤
│  Marketing Pages:  Aceternity UI + Magic UI             │
│  App UI:           shadcn/ui (base)                     │
│  Complex Patterns: Origin UI                            │
│                                                         │
│  Hero:       Spotlight, Aurora, Meteor                  │
│  Text:       TypewriterEffect, TextGenerateEffect       │
│  Cards:      3D Card, Moving Border                     │
│  Buttons:    Shimmer Button, Pulsating Button           │
│  Social:     Infinite Moving Cards, Marquee             │
│  Features:   Bento Grid, Animated Beam                  │
└─────────────────────────────────────────────────────────┘
```

---

*Use these sparingly on marketing pages. App UI stays clean with shadcn/ui.*
