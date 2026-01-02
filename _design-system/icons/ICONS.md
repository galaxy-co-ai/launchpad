# 🎯 Launchpad Icon System — Lucide Icons

**Library:** [Lucide React](https://lucide.dev)  
**Version:** Latest (^0.460.0+)  
**License:** ISC (MIT-equivalent)

---

## 📦 Installation

```bash
npm install lucide-react
```

---

## 🚀 Basic Usage

```tsx
import { Home, Settings, User, ChevronRight } from "lucide-react"

// Default size (24x24)
<Home />

// Custom size with Tailwind
<Home className="h-5 w-5" />

// With color
<Home className="h-5 w-5 text-muted-foreground" />

// Interactive states
<Home className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
```

---

## 📏 Size Standards

| Context | Tailwind Class | Size | Notes |
|---------|---------------|------|-------|
| Inline (text) | `h-4 w-4` | 16px | Within body text |
| Button icon | `h-5 w-5` | 20px | Standard buttons |
| Nav item | `h-5 w-5` | 20px | Sidebar, tabs |
| Card action | `h-5 w-5` | 20px | Card headers |
| Large action | `h-6 w-6` | 24px | Hero buttons |
| Feature icon | `h-8 w-8` | 32px | Feature cards |
| Hero icon | `h-10 w-10` | 40px | Marketing sections |
| Illustration | `h-12 w-12` to `h-16 w-16` | 48-64px | Empty states |

---

## 🎨 Color Patterns

```tsx
// Inherit text color (default)
<Home className="h-5 w-5" />

// Muted (secondary)
<Home className="h-5 w-5 text-muted-foreground" />

// Primary brand
<Home className="h-5 w-5 text-primary" />

// Destructive/danger
<Trash2 className="h-5 w-5 text-destructive" />

// Success
<Check className="h-5 w-5 text-green-500" />

// Warning  
<AlertTriangle className="h-5 w-5 text-yellow-500" />

// Interactive
<Home className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
```

---

## 🧩 Common Icon Patterns

### Navigation Icons

```tsx
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  User, 
  Users,
  Folder,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react"
```

### Action Icons

```tsx
import {
  Plus,
  Minus,
  Check,
  X,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Share,
  ExternalLink,
  Link,
  Send,
  Save,
  RefreshCw,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react"
```

### Status Icons

```tsx
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Clock,
  Loader2,
  Ban,
  ShieldCheck,
} from "lucide-react"
```

### Media Icons

```tsx
import {
  Image,
  Video,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react"
```

### Communication Icons

```tsx
import {
  Mail,
  MessageSquare,
  MessageCircle,
  Phone,
  Video,
  AtSign,
  Hash,
  Calendar,
  CalendarDays,
} from "lucide-react"
```

### E-commerce Icons

```tsx
import {
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Package,
  Truck,
  Receipt,
  Tag,
  Percent,
  Gift,
} from "lucide-react"
```

---

## 🔄 Loading & Spinners

```tsx
import { Loader2 } from "lucide-react"

// Spinning loader
<Loader2 className="h-5 w-5 animate-spin" />

// In button
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

---

## 📐 Icon + Text Alignment

```tsx
// Icon before text
<span className="inline-flex items-center gap-2">
  <Home className="h-4 w-4" />
  Home
</span>

// Icon after text
<span className="inline-flex items-center gap-2">
  Learn more
  <ChevronRight className="h-4 w-4" />
</span>

// Icon only button (needs aria-label)
<Button size="icon" aria-label="Settings">
  <Settings className="h-5 w-5" />
</Button>
```

---

## ♿ Accessibility

### Icons with text (decorative)
```tsx
// No special attrs needed - text provides context
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Item
</Button>
```

### Icon-only buttons (requires label)
```tsx
// ALWAYS add aria-label
<Button size="icon" aria-label="Delete item">
  <Trash2 className="h-5 w-5" />
</Button>

// Or use sr-only span
<Button size="icon">
  <Trash2 className="h-5 w-5" />
  <span className="sr-only">Delete item</span>
</Button>
```

### Informational icons
```tsx
// Use aria-hidden for decorative icons
<div className="flex items-center gap-2">
  <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
  <span>Success! Your changes have been saved.</span>
</div>
```

---

## 🛠️ Custom Icon Wrapper

```tsx
// components/ui/icon.tsx
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
}

export function Icon({ icon: IconComponent, size = "md", className }: IconProps) {
  return <IconComponent className={cn(sizeMap[size], className)} />
}

// Usage
import { Icon } from "@/components/ui/icon"
import { Home } from "lucide-react"

<Icon icon={Home} size="lg" className="text-primary" />
```

---

## 🔍 Finding Icons

1. **Lucide Website:** https://lucide.dev/icons
2. **Search:** Use the search bar with keywords
3. **Categories:** Browse by category (arrows, files, etc.)
4. **VS Code:** Install "Lucide Icons" extension for autocomplete

### Search Tips
- "arrow" → navigation arrows
- "file" → documents, folders
- "user" → people, accounts
- "chart" → data visualization
- "alert" → warnings, notifications

---

## ❌ Never Do

```tsx
// ❌ Don't mix icon libraries
import { FaHome } from "react-icons/fa" // NO!
import { Home } from "lucide-react"      // YES!

// ❌ Don't use inline styles
<Home style={{ width: 20, height: 20 }} /> // NO!
<Home className="h-5 w-5" />               // YES!

// ❌ Don't forget accessibility on icon-only buttons
<Button size="icon">
  <Trash2 className="h-5 w-5" />  // NO! Missing aria-label
</Button>

// ❌ Don't use arbitrary sizes
<Home className="h-[17px] w-[17px]" /> // NO!
<Home className="h-4 w-4" />           // YES! Use scale
```

---

## 📋 Quick Reference

```
┌─────────────────────────────────────────────────────────┐
│  ICON STANDARDS                                         │
├─────────────────────────────────────────────────────────┤
│  Library:     lucide-react (ONLY)                       │
│  Default:     h-5 w-5 (20px)                            │
│  Inline:      h-4 w-4 (16px)                            │
│  Feature:     h-8 w-8 (32px)                            │
│  Color:       Use Tailwind text-* classes               │
│  A11y:        Icon-only buttons need aria-label         │
└─────────────────────────────────────────────────────────┘
```

---

*Use Lucide icons consistently. No exceptions.*
