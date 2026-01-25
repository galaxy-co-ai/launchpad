<#
.SYNOPSIS
    Provisions and configures Neon PostgreSQL database for a Launchpad project.

.DESCRIPTION
    This script helps set up the database by:
    - Verifying DATABASE_URL is configured
    - Running Drizzle migrations
    - Optionally seeding initial data
    - Opening Drizzle Studio for visual database management

.PARAMETER Project
    The project name in projects/ directory

.PARAMETER Push
    Run drizzle-kit push (sync schema without migrations)

.PARAMETER Generate
    Run drizzle-kit generate (create migration files)

.PARAMETER Migrate
    Run migrations

.PARAMETER Studio
    Open Drizzle Studio

.PARAMETER Seed
    Run seed script (if exists)

.EXAMPLE
    .\provision-db.ps1 -Project "invoice-ai" -Push
    # Push schema to database

.EXAMPLE
    .\provision-db.ps1 -Project "invoice-ai" -Generate -Migrate
    # Generate and run migrations

.EXAMPLE
    .\provision-db.ps1 -Project "invoice-ai" -Studio
    # Open Drizzle Studio

.NOTES
    Author: Launchpad System
    Version: 1.0.0
    Last Updated: 2025-01-05
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [switch]$Push,
    [switch]$Generate,
    [switch]$Migrate,
    [switch]$Studio,
    [switch]$Seed
)

# Configuration
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$ProjectDir = Join-Path $LaunchpadRoot "projects\$Project"
$EnvPath = Join-Path $ProjectDir ".env.local"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  LAUNCHPAD - Database Provisioning   " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------------------------------
# Validation
# -------------------------------------------------------------------
Write-Host "[1/3] Validating setup..." -ForegroundColor Yellow

# Check project exists
if (-not (Test-Path $ProjectDir)) {
    Write-Host "ERROR: Project '$Project' not found at:" -ForegroundColor Red
    Write-Host "       $ProjectDir" -ForegroundColor Gray
    exit 1
}

# Check .env.local exists
if (-not (Test-Path $EnvPath)) {
    Write-Host "ERROR: .env.local not found" -ForegroundColor Red
    Write-Host "Run: .\_scripts\setup-env.ps1 -Project $Project" -ForegroundColor Yellow
    exit 1
}

# Check DATABASE_URL is set
$envContent = Get-Content $EnvPath -Raw
if ($envContent -notmatch 'DATABASE_URL=".+"') {
    Write-Host "ERROR: DATABASE_URL not configured in .env.local" -ForegroundColor Red
    Write-Host ""
    Write-Host "To set up Neon PostgreSQL:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://console.neon.tech" -ForegroundColor Gray
    Write-Host "  2. Create a new project" -ForegroundColor Gray
    Write-Host "  3. Copy the connection string" -ForegroundColor Gray
    Write-Host "  4. Run: .\_scripts\setup-env.ps1 -Project $Project -Service neon" -ForegroundColor Gray
    exit 1
}

# Check drizzle.config exists
$DrizzleConfigPath = Join-Path $ProjectDir "drizzle.config.ts"
if (-not (Test-Path $DrizzleConfigPath)) {
    Write-Host "ERROR: drizzle.config.ts not found" -ForegroundColor Red
    Write-Host "This project may not be configured for Drizzle ORM" -ForegroundColor Yellow
    exit 1
}

Write-Host "  Project: $Project" -ForegroundColor Green
Write-Host "  Database: Neon PostgreSQL" -ForegroundColor Green
Write-Host "  ORM: Drizzle" -ForegroundColor Green

# -------------------------------------------------------------------
# Check dependencies
# -------------------------------------------------------------------
Write-Host "[2/3] Checking dependencies..." -ForegroundColor Yellow

Push-Location $ProjectDir

# Check if node_modules exists
$NodeModulesPath = Join-Path $ProjectDir "node_modules"
if (-not (Test-Path $NodeModulesPath)) {
    Write-Host "  Installing dependencies..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

# Check drizzle-kit is available
$DrizzleKitPath = Join-Path $NodeModulesPath ".bin\drizzle-kit"
if (-not (Test-Path $DrizzleKitPath)) {
    Write-Host "  Installing drizzle-kit..." -ForegroundColor Yellow
    pnpm add -D drizzle-kit
}

Write-Host "  Dependencies ready" -ForegroundColor Green

# -------------------------------------------------------------------
# Database Operations
# -------------------------------------------------------------------
Write-Host "[3/3] Running database operations..." -ForegroundColor Yellow

$operationRun = $false

# Default to Push if no operation specified
if (-not $Push -and -not $Generate -and -not $Migrate -and -not $Studio -and -not $Seed) {
    $Push = $true
}

# Generate migrations
if ($Generate) {
    Write-Host ""
    Write-Host "Generating migrations..." -ForegroundColor Cyan
    pnpm drizzle-kit generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Migration generation failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "  Migrations generated" -ForegroundColor Green
    $operationRun = $true
}

# Run migrations
if ($Migrate) {
    Write-Host ""
    Write-Host "Running migrations..." -ForegroundColor Cyan
    pnpm drizzle-kit migrate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Migration failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "  Migrations applied" -ForegroundColor Green
    $operationRun = $true
}

# Push schema (sync without migrations)
if ($Push) {
    Write-Host ""
    Write-Host "Pushing schema to database..." -ForegroundColor Cyan
    pnpm drizzle-kit push
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Schema push failed" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Write-Host "  Schema pushed successfully" -ForegroundColor Green
    $operationRun = $true
}

# Run seed script
if ($Seed) {
    Write-Host ""
    Write-Host "Running seed script..." -ForegroundColor Cyan

    $SeedScriptPath = Join-Path $ProjectDir "lib\db\seed.ts"
    if (Test-Path $SeedScriptPath) {
        pnpm tsx $SeedScriptPath
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Seed script failed" -ForegroundColor Red
            Pop-Location
            exit 1
        }
        Write-Host "  Database seeded" -ForegroundColor Green
    } else {
        Write-Host "  No seed script found at lib/db/seed.ts" -ForegroundColor Yellow
    }
    $operationRun = $true
}

# Open Drizzle Studio
if ($Studio) {
    Write-Host ""
    Write-Host "Opening Drizzle Studio..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to close when done" -ForegroundColor Gray
    pnpm drizzle-kit studio
    $operationRun = $true
}

Pop-Location

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  DATABASE PROVISIONING COMPLETE      " -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Project: $Project" -ForegroundColor White
Write-Host ""
Write-Host "Available commands:" -ForegroundColor Yellow
Write-Host "  -Push      Push schema (default)" -ForegroundColor Gray
Write-Host "  -Generate  Generate migration files" -ForegroundColor Gray
Write-Host "  -Migrate   Run migrations" -ForegroundColor Gray
Write-Host "  -Seed      Run seed script" -ForegroundColor Gray
Write-Host "  -Studio    Open Drizzle Studio" -ForegroundColor Gray
Write-Host ""
Write-Host "Example:" -ForegroundColor Cyan
Write-Host "  .\_scripts\provision-db.ps1 -Project $Project -Studio" -ForegroundColor Gray
Write-Host ""
Write-Host "Next step: pnpm dev" -ForegroundColor Cyan
Write-Host ""
