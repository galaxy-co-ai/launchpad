# setup-env.ps1
# Interactive environment variable setup

param(
    [Parameter(Mandatory=$true)]
    [string]$Project
)

$ErrorActionPreference = "Stop"

# Colors
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Error { Write-Host $args -ForegroundColor Red }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warn { Write-Host $args -ForegroundColor Yellow }

# Paths
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$ProjectPath = Join-Path $LaunchpadRoot "projects\$Project"
$EnvPath = Join-Path $ProjectPath ".env.local"

# Check if project exists
if (-not (Test-Path $ProjectPath)) {
    Write-Error "❌ Project '$Project' not found at: $ProjectPath"
    exit 1
}

Write-Info "🔧 Environment Setup for: $Project"
Write-Info ""

# Check if .env.local already exists
if (Test-Path $EnvPath) {
    $existing = Get-Content $EnvPath -Raw
    Write-Warn "⚠️  .env.local already exists"
    Write-Warn ""
    $overwrite = Read-Host "Overwrite existing file? (y/n)"
    if ($overwrite -ne "y") {
        Write-Info "Cancelled"
        exit 0
    }
}

Write-Info "This script will guide you through setting up environment variables."
Write-Info "Press Enter to skip optional variables."
Write-Info ""

# Helper function to prompt for env var
function Get-EnvVar {
    param(
        [string]$Name,
        [string]$Description,
        [bool]$Required = $false,
        [bool]$Secret = $false
    )
    
    $prompt = if ($Required) { "$Name (required)" } else { "$Name (optional)" }
    $prompt = "$prompt - $Description"
    
    Write-Host ""
    Write-Info $prompt
    
    if ($Secret) {
        $value = Read-Host "Value" -AsSecureString
        $value = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($value))
    } else {
        $value = Read-Host "Value"
    }
    
    if ($Required -and [string]::IsNullOrWhiteSpace($value)) {
        Write-Error "❌ This variable is required"
        return Get-EnvVar -Name $Name -Description $Description -Required $Required -Secret $Secret
    }
    
    return $value
}

Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Success "  REQUIRED VARIABLES"
Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Database
$DATABASE_URL = Get-EnvVar `
    -Name "DATABASE_URL" `
    -Description "Neon PostgreSQL connection string" `
    -Required $true `
    -Secret $true

# Clerk Auth
$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = Get-EnvVar `
    -Name "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" `
    -Description "Clerk publishable key" `
    -Required $true

$CLERK_SECRET_KEY = Get-EnvVar `
    -Name "CLERK_SECRET_KEY" `
    -Description "Clerk secret key" `
    -Required $true `
    -Secret $true

Write-Success ""
Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Success "  OPTIONAL VARIABLES"
Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Info "(Press Enter to skip)"

# Clerk Webhook
$CLERK_WEBHOOK_SECRET = Get-EnvVar `
    -Name "CLERK_WEBHOOK_SECRET" `
    -Description "Clerk webhook secret (whsec_...)" `
    -Secret $true

# Stripe
$STRIPE_SECRET_KEY = Get-EnvVar `
    -Name "STRIPE_SECRET_KEY" `
    -Description "Stripe secret key" `
    -Secret $true

$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = Get-EnvVar `
    -Name "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" `
    -Description "Stripe publishable key"

$STRIPE_WEBHOOK_SECRET = Get-EnvVar `
    -Name "STRIPE_WEBHOOK_SECRET" `
    -Description "Stripe webhook secret" `
    -Secret $true

$STRIPE_PRICE_ID_MONTHLY = Get-EnvVar `
    -Name "STRIPE_PRICE_ID_MONTHLY" `
    -Description "Stripe monthly price ID"

$STRIPE_PRICE_ID_YEARLY = Get-EnvVar `
    -Name "STRIPE_PRICE_ID_YEARLY" `
    -Description "Stripe yearly price ID"

# Upstash Redis
$UPSTASH_REDIS_REST_URL = Get-EnvVar `
    -Name "UPSTASH_REDIS_REST_URL" `
    -Description "Upstash Redis REST URL"

$UPSTASH_REDIS_REST_TOKEN = Get-EnvVar `
    -Name "UPSTASH_REDIS_REST_TOKEN" `
    -Description "Upstash Redis REST token" `
    -Secret $true

# Claude API
$ANTHROPIC_API_KEY = Get-EnvVar `
    -Name "ANTHROPIC_API_KEY" `
    -Description "Anthropic Claude API key" `
    -Secret $true

# Sentry
$SENTRY_DSN = Get-EnvVar `
    -Name "SENTRY_DSN" `
    -Description "Sentry DSN for error tracking"

$SENTRY_AUTH_TOKEN = Get-EnvVar `
    -Name "SENTRY_AUTH_TOKEN" `
    -Description "Sentry auth token" `
    -Secret $true

# Upstash Vector
$UPSTASH_VECTOR_REST_URL = Get-EnvVar `
    -Name "UPSTASH_VECTOR_REST_URL" `
    -Description "Upstash Vector REST URL"

$UPSTASH_VECTOR_REST_TOKEN = Get-EnvVar `
    -Name "UPSTASH_VECTOR_REST_TOKEN" `
    -Description "Upstash Vector REST token" `
    -Secret $true

# Build .env.local content
$EnvContent = @"
# Environment Variables for $Project
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Database (Neon PostgreSQL)
DATABASE_URL="$DATABASE_URL"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="$CLERK_SECRET_KEY"
CLERK_WEBHOOK_SECRET="$CLERK_WEBHOOK_SECRET"

# Payments (Stripe)
STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
STRIPE_WEBHOOK_SECRET="$STRIPE_WEBHOOK_SECRET"
STRIPE_PRICE_ID_MONTHLY="$STRIPE_PRICE_ID_MONTHLY"
STRIPE_PRICE_ID_YEARLY="$STRIPE_PRICE_ID_YEARLY"

# Cache (Upstash Redis)
UPSTASH_REDIS_REST_URL="$UPSTASH_REDIS_REST_URL"
UPSTASH_REDIS_REST_TOKEN="$UPSTASH_REDIS_REST_TOKEN"

# AI (Claude)
ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"

# Error Tracking (Sentry)
SENTRY_DSN="$SENTRY_DSN"
SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"

# Vectors (Upstash)
UPSTASH_VECTOR_REST_URL="$UPSTASH_VECTOR_REST_URL"
UPSTASH_VECTOR_REST_TOKEN="$UPSTASH_VECTOR_REST_TOKEN"
"@

# Write to file
Set-Content -Path $EnvPath -Value $EnvContent

Write-Success ""
Write-Success "✅ Environment variables saved to .env.local"
Write-Success ""
Write-Info "📂 Location: $EnvPath"
Write-Success ""
Write-Warn "⚠️  IMPORTANT:"
Write-Warn "  - Never commit .env.local to git"
Write-Warn "  - Add secrets to Vercel project settings for production"
Write-Success ""

