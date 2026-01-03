# new-project.ps1
# Scaffolds a new project from template

param(
    [Parameter(Mandatory=$true)]
    [string]$Name,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("nextjs-web")]
    [string]$Template = "nextjs-web"
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Cyan }

# Validate project name
if ($Name -notmatch '^[a-z0-9-]+$') {
    Write-Error "❌ Project name must be lowercase alphanumeric with hyphens only"
    exit 1
}

# Paths
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$TemplatePath = Join-Path $LaunchpadRoot "_templates\project\$Template"
$ProjectsPath = Join-Path $LaunchpadRoot "projects"
$TargetPath = Join-Path $ProjectsPath $Name

# Check if template exists
if (-not (Test-Path $TemplatePath)) {
    Write-Error "❌ Template '$Template' not found at: $TemplatePath"
    exit 1
}

# Check if project already exists
if (Test-Path $TargetPath) {
    Write-Error "❌ Project '$Name' already exists at: $TargetPath"
    exit 1
}

Write-Info "🚀 Creating new project: $Name"
Write-Info "📦 Template: $Template"
Write-Info ""

# Create target directory
Write-Info "📁 Creating project directory..."
New-Item -ItemType Directory -Path $TargetPath | Out-Null

# Copy template files
Write-Info "📋 Copying template files..."
Copy-Item -Path "$TemplatePath\*" -Destination $TargetPath -Recurse -Force

# Update package.json with project name
$PackageJsonPath = Join-Path $TargetPath "package.json"
if (Test-Path $PackageJsonPath) {
    Write-Info "📝 Updating package.json..."
    $packageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    $packageJson.name = $Name
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $PackageJsonPath
}

# Create .env.local placeholder
Write-Info "📄 Creating .env.local..."
$EnvContent = @"
# Environment Variables for $Name
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Run: .\_scripts\setup-env.ps1 -project "$Name" to populate

# Database
DATABASE_URL=""

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
CLERK_WEBHOOK_SECRET=""

# Payments (Stripe)
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID_MONTHLY=""
STRIPE_PRICE_ID_YEARLY=""

# Cache (Upstash Redis)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# AI (Claude)
ANTHROPIC_API_KEY=""

# Error Tracking (Sentry)
SENTRY_DSN=""
SENTRY_AUTH_TOKEN=""

# Vectors (Upstash)
UPSTASH_VECTOR_REST_URL=""
UPSTASH_VECTOR_REST_TOKEN=""
"@

$EnvPath = Join-Path $TargetPath ".env.local"
Set-Content -Path $EnvPath -Value $EnvContent

# Create README.md
Write-Info "📖 Creating README.md..."
$ReadmeContent = @"
# $Name

> Generated from Launchpad template: $Template

## Quick Start

``````bash
# Install dependencies
pnpm install

# Set up environment variables
.\_scripts\setup-env.ps1 -project "$Name"

# Provision database
.\_scripts\provision-db.ps1 -project "$Name"

# Start development server
pnpm dev
``````

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Neon PostgreSQL + Drizzle ORM
- **Auth:** Clerk
- **Payments:** Stripe
- **Cache:** Upstash Redis
- **AI:** Claude API
- **Hosting:** Vercel

## Project Structure

``````
$Name/
├── app/              → Pages and routes
│   ├── (auth)/       → Authentication pages
│   ├── (dashboard)/  → Protected dashboard
│   ├── (marketing)/  → Public marketing pages
│   └── api/          → API routes and webhooks
├── components/
│   └── ui/           → shadcn/ui components
├── lib/              → Utilities and configs
│   ├── db/           → Database schema and queries
│   ├── env.ts        → Environment validation
│   └── utils.ts      → Helper functions
└── middleware.ts     → Clerk auth middleware
``````

## Development

``````bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Database migrations
pnpm drizzle-kit generate
pnpm drizzle-kit push
``````

## Environment Variables

See `.env.local` for required variables.

Run setup script to configure:
``````bash
.\_scripts\setup-env.ps1 -project "$Name"
``````

## Next Steps

1. ✅ Project scaffolded
2. ⏳ Configure environment variables
3. ⏳ Provision database
4. ⏳ Set up Clerk authentication
5. ⏳ Configure Stripe payments
6. ⏳ Deploy to Vercel

---

Built with [Launchpad](https://github.com/galaxyco-ai/launchpad)
"@

$ReadmePath = Join-Path $TargetPath "README.md"
Set-Content -Path $ReadmePath -Value $ReadmeContent

Write-Success ""
Write-Success "✅ Project created successfully!"
Write-Success ""
Write-Info "📂 Location: $TargetPath"
Write-Info ""
Write-Info "Next steps:"
Write-Info "  1. cd projects\$Name"
Write-Info "  2. pnpm install"
Write-Info "  3. ..\..\_scripts\setup-env.ps1 -project `"$Name`""
Write-Info "  4. ..\..\_scripts\provision-db.ps1 -project `"$Name`""
Write-Info "  5. pnpm dev"
Write-Success ""

