// ============================================
// Project Templates
// Pre-configured templates for quick scaffolding
// ============================================

export interface ProjectTemplate {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: "desktop" | "web" | "api" | "chrome";

  // Tech stack
  techStack: string[];

  // What gets created
  structure: {
    folders: string[];
    files: { path: string; description: string }[];
  };

  // Post-setup commands
  postSetup: string[];

  // Recommended for these idea categories
  recommendedFor: string[];

  // Estimated setup time
  setupTime: string;

  // Features included
  features: string[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "tauri-desktop",
    name: "Tauri Desktop App",
    slug: "tauri-desktop",
    description: "Full-featured desktop app with Next.js frontend and Rust backend",
    icon: "desktop",
    techStack: ["Tauri 2.0", "Next.js", "TypeScript", "Tailwind", "SQLite"],
    structure: {
      folders: [
        "src/app",
        "src/components",
        "src/lib",
        "src-tauri/src",
        "public",
      ],
      files: [
        { path: "package.json", description: "Node dependencies" },
        { path: "tsconfig.json", description: "TypeScript config" },
        { path: "tailwind.config.ts", description: "Tailwind setup" },
        { path: "next.config.ts", description: "Next.js config" },
        { path: "src-tauri/Cargo.toml", description: "Rust dependencies" },
        { path: "src-tauri/tauri.conf.json", description: "Tauri config" },
        { path: "src-tauri/src/main.rs", description: "Rust entry point" },
        { path: "src-tauri/src/lib.rs", description: "Rust library" },
        { path: "src/app/page.tsx", description: "Main page" },
        { path: "src/app/layout.tsx", description: "Root layout" },
        { path: "src/lib/store.ts", description: "Zustand store" },
        { path: ".env.example", description: "Environment variables" },
      ],
    },
    postSetup: ["pnpm install", "cargo check"],
    recommendedFor: ["dev-tools", "productivity", "ai-utilities"],
    setupTime: "2-3 minutes",
    features: [
      "Native desktop performance",
      "System tray support",
      "Local SQLite database",
      "Cross-platform (Windows, Mac, Linux)",
      "Auto-updates ready",
      "Hot reload in dev",
    ],
  },
  {
    id: "nextjs-web",
    name: "Next.js Web App",
    slug: "nextjs-web",
    description: "Web SaaS with auth, database, and payments ready",
    icon: "web",
    techStack: ["Next.js", "TypeScript", "Tailwind", "Drizzle", "PostgreSQL"],
    structure: {
      folders: [
        "src/app",
        "src/app/api",
        "src/components",
        "src/lib",
        "src/db",
        "public",
      ],
      files: [
        { path: "package.json", description: "Node dependencies" },
        { path: "tsconfig.json", description: "TypeScript config" },
        { path: "tailwind.config.ts", description: "Tailwind setup" },
        { path: "next.config.ts", description: "Next.js config" },
        { path: "drizzle.config.ts", description: "Drizzle ORM config" },
        { path: "src/app/page.tsx", description: "Landing page" },
        { path: "src/app/layout.tsx", description: "Root layout" },
        { path: "src/db/schema.ts", description: "Database schema" },
        { path: "src/lib/auth.ts", description: "Auth helpers" },
        { path: ".env.example", description: "Environment variables" },
      ],
    },
    postSetup: ["pnpm install", "pnpm db:push"],
    recommendedFor: ["business", "content"],
    setupTime: "3-5 minutes",
    features: [
      "Authentication ready (Clerk)",
      "Database with Drizzle ORM",
      "Stripe payments setup",
      "API routes included",
      "SEO optimized",
      "Vercel deploy ready",
    ],
  },
  {
    id: "api-backend",
    name: "API Backend",
    slug: "api-backend",
    description: "Fast API service with Hono and Drizzle",
    icon: "api",
    techStack: ["Hono", "TypeScript", "Drizzle", "PostgreSQL"],
    structure: {
      folders: [
        "src/routes",
        "src/middleware",
        "src/db",
        "src/lib",
      ],
      files: [
        { path: "package.json", description: "Node dependencies" },
        { path: "tsconfig.json", description: "TypeScript config" },
        { path: "drizzle.config.ts", description: "Drizzle ORM config" },
        { path: "src/index.ts", description: "Entry point" },
        { path: "src/routes/index.ts", description: "Route definitions" },
        { path: "src/db/schema.ts", description: "Database schema" },
        { path: ".env.example", description: "Environment variables" },
      ],
    },
    postSetup: ["pnpm install"],
    recommendedFor: ["dev-tools", "business"],
    setupTime: "1-2 minutes",
    features: [
      "Fast Hono framework",
      "Type-safe routes",
      "Drizzle ORM",
      "CORS configured",
      "Rate limiting ready",
      "JWT auth ready",
    ],
  },
  {
    id: "chrome-extension",
    name: "Chrome Extension",
    slug: "chrome-extension",
    description: "Browser extension with React popup and content scripts",
    icon: "chrome",
    techStack: ["React", "TypeScript", "Tailwind", "Chrome APIs"],
    structure: {
      folders: [
        "src/popup",
        "src/content",
        "src/background",
        "public",
      ],
      files: [
        { path: "package.json", description: "Node dependencies" },
        { path: "tsconfig.json", description: "TypeScript config" },
        { path: "manifest.json", description: "Extension manifest" },
        { path: "vite.config.ts", description: "Vite config" },
        { path: "src/popup/App.tsx", description: "Popup UI" },
        { path: "src/content/index.ts", description: "Content script" },
        { path: "src/background/index.ts", description: "Service worker" },
      ],
    },
    postSetup: ["pnpm install", "pnpm build"],
    recommendedFor: ["productivity", "dev-tools"],
    setupTime: "1-2 minutes",
    features: [
      "React popup UI",
      "Content script injection",
      "Background service worker",
      "Chrome storage sync",
      "Hot reload in dev",
      "Manifest V3 ready",
    ],
  },
];

// Get template by ID
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((t) => t.id === id);
}

// Get recommended template for an idea category
export function getRecommendedTemplate(category: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((t) => t.recommendedFor.includes(category));
}

// Get all templates
export function getAllTemplates(): ProjectTemplate[] {
  return PROJECT_TEMPLATES;
}
