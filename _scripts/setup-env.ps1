<#
.SYNOPSIS
    Interactive environment setup for Launchpad projects.

.DESCRIPTION
    This script helps configure environment variables for a project by:
    - Prompting for each required service credential
    - Validating input format where possible
    - Writing to .env.local
    - Providing links to service dashboards

.PARAMETER Project
    The project name in projects/ directory

.PARAMETER Service
    Optional: Only configure a specific service (neon, clerk, upstash, stripe, anthropic, sentry)

.EXAMPLE
    .\setup-env.ps1 -Project "invoice-ai"
    # Interactive setup for all services

.EXAMPLE
    .\setup-env.ps1 -Project "invoice-ai" -Service "clerk"
    # Only configure Clerk credentials

.NOTES
    Author: Launchpad System
    Version: 1.0.0
    Last Updated: 2025-01-05
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [ValidateSet("neon", "clerk", "upstash", "stripe", "anthropic", "sentry", "all")]
    [string]$Service = "all"
)

# Configuration
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$ProjectDir = Join-Path $LaunchpadRoot "projects\$Project"
$EnvPath = Join-Path $ProjectDir ".env.local"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  LAUNCHPAD - Environment Setup       " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# -------------------------------------------------------------------
# Validation
# -------------------------------------------------------------------
if (-not (Test-Path $ProjectDir)) {
    Write-Host "ERROR: Project '$Project' not found at:" -ForegroundColor Red
    Write-Host "       $ProjectDir" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available projects:" -ForegroundColor Yellow
    $projectsPath = Join-Path $LaunchpadRoot "projects"
    if (Test-Path $projectsPath) {
        Get-ChildItem -Path $projectsPath -Directory | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor White
        }
    }
    exit 1
}

Write-Host "Project: $Project" -ForegroundColor White
Write-Host "Env file: $EnvPath" -ForegroundColor Gray
Write-Host ""

# -------------------------------------------------------------------
# Helper Functions
# -------------------------------------------------------------------
function Read-EnvValue {
    param(
        [string]$Prompt,
        [string]$Default = "",
        [switch]$Required,
        [string]$ValidationPattern = ""
    )

    $promptText = $Prompt
    if ($Default) {
        $promptText += " [$Default]"
    }
    $promptText += ": "

    do {
        $value = Read-Host $promptText
        if ([string]::IsNullOrWhiteSpace($value) -and $Default) {
            $value = $Default
        }

        if ($Required -and [string]::IsNullOrWhiteSpace($value)) {
            Write-Host "  This field is required." -ForegroundColor Yellow
            continue
        }

        if ($ValidationPattern -and $value -and $value -notmatch $ValidationPattern) {
            Write-Host "  Invalid format. Please try again." -ForegroundColor Yellow
            continue
        }

        break
    } while ($true)

    return $value
}

function Add-EnvVariable {
    param(
        [string]$Name,
        [string]$Value,
        [string]$FilePath
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return
    }

    $content = ""
    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
    }

    # Check if variable already exists
    if ($content -match "(?m)^$Name=") {
        # Update existing
        $content = $content -replace "(?m)^$Name=.*$", "$Name=`"$Value`""
    } else {
        # Append new
        if ($content -and -not $content.EndsWith("`n")) {
            $content += "`n"
        }
        $content += "$Name=`"$Value`"`n"
    }

    Set-Content -Path $FilePath -Value $content.TrimEnd() -Encoding UTF8
}

# -------------------------------------------------------------------
# Service Configuration Functions
# -------------------------------------------------------------------
function Setup-Neon {
    Write-Host ""
    Write-Host "--- NEON POSTGRESQL ---" -ForegroundColor Cyan
    Write-Host "Dashboard: https://console.neon.tech" -ForegroundColor Gray
    Write-Host ""

    $dbUrl = Read-EnvValue -Prompt "DATABASE_URL (connection string)" -ValidationPattern "^postgresql://"
    Add-EnvVariable -Name "DATABASE_URL" -Value $dbUrl -FilePath $EnvPath

    if ($dbUrl) {
        Write-Host "  Neon configured" -ForegroundColor Green
    }
}

function Setup-Clerk {
    Write-Host ""
    Write-Host "--- CLERK AUTHENTICATION ---" -ForegroundColor Cyan
    Write-Host "Dashboard: https://dashboard.clerk.com" -ForegroundColor Gray
    Write-Host ""

    $pubKey = Read-EnvValue -Prompt "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" -ValidationPattern "^pk_"
    $secKey = Read-EnvValue -Prompt "CLERK_SECRET_KEY" -ValidationPattern "^sk_"
    $webhookSecret = Read-EnvValue -Prompt "CLERK_WEBHOOK_SECRET (optional)"

    Add-EnvVariable -Name "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" -Value $pubKey -FilePath $EnvPath
    Add-EnvVariable -Name "CLERK_SECRET_KEY" -Value $secKey -FilePath $EnvPath
    Add-EnvVariable -Name "CLERK_WEBHOOK_SECRET" -Value $webhookSecret -FilePath $EnvPath

    # Add route configs with defaults
    Add-EnvVariable -Name "NEXT_PUBLIC_CLERK_SIGN_IN_URL" -Value "/sign-in" -FilePath $EnvPath
    Add-EnvVariable -Name "NEXT_PUBLIC_CLERK_SIGN_UP_URL" -Value "/sign-up" -FilePath $EnvPath
    Add-EnvVariable -Name "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL" -Value "/dashboard" -FilePath $EnvPath
    Add-EnvVariable -Name "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL" -Value "/dashboard" -FilePath $EnvPath

    if ($pubKey -and $secKey) {
        Write-Host "  Clerk configured" -ForegroundColor Green
    }
}

function Setup-Upstash {
    Write-Host ""
    Write-Host "--- UPSTASH REDIS ---" -ForegroundColor Cyan
    Write-Host "Dashboard: https://console.upstash.com" -ForegroundColor Gray
    Write-Host ""

    $redisUrl = Read-EnvValue -Prompt "UPSTASH_REDIS_REST_URL" -ValidationPattern "^https://"
    $redisToken = Read-EnvValue -Prompt "UPSTASH_REDIS_REST_TOKEN"

    Add-EnvVariable -Name "UPSTASH_REDIS_REST_URL" -Value $redisUrl -FilePath $EnvPath
    Add-EnvVariable -Name "UPSTASH_REDIS_REST_TOKEN" -Value $redisToken -FilePath $EnvPath

    if ($redisUrl -and $redisToken) {
        Write-Host "  Upstash Redis configured" -ForegroundColor Green
    }

    Write-Host ""
    $setupVector = Read-Host "Setup Upstash Vector? (y/n)"
    if ($setupVector -eq "y") {
        $vectorUrl = Read-EnvValue -Prompt "UPSTASH_VECTOR_REST_URL" -ValidationPattern "^https://"
        $vectorToken = Read-EnvValue -Prompt "UPSTASH_VECTOR_REST_TOKEN"

        Add-EnvVariable -Name "UPSTASH_VECTOR_REST_URL" -Value $vectorUrl -FilePath $EnvPath
        Add-EnvVariable -Name "UPSTASH_VECTOR_REST_TOKEN" -Value $vectorToken -FilePath $EnvPath

        if ($vectorUrl -and $vectorToken) {
            Write-Host "  Upstash Vector configured" -ForegroundColor Green
        }
    }
}

function Setup-Stripe {
    Write-Host ""
    Write-Host "--- STRIPE PAYMENTS ---" -ForegroundColor Cyan
    Write-Host "Dashboard: https://dashboard.stripe.com" -ForegroundColor Gray
    Write-Host ""

    $pubKey = Read-EnvValue -Prompt "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" -ValidationPattern "^pk_"
    $secKey = Read-EnvValue -Prompt "STRIPE_SECRET_KEY" -ValidationPattern "^sk_"
    $webhookSecret = Read-EnvValue -Prompt "STRIPE_WEBHOOK_SECRET (optional)" -ValidationPattern "^whsec_"

    Add-EnvVariable -Name "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" -Value $pubKey -FilePath $EnvPath
    Add-EnvVariable -Name "STRIPE_SECRET_KEY" -Value $secKey -FilePath $EnvPath
    Add-EnvVariable -Name "STRIPE_WEBHOOK_SECRET" -Value $webhookSecret -FilePath $EnvPath

    if ($pubKey -and $secKey) {
        Write-Host "  Stripe configured" -ForegroundColor Green
    }
}

function Setup-Anthropic {
    Write-Host ""
    Write-Host "--- ANTHROPIC (CLAUDE API) ---" -ForegroundColor Cyan
    Write-Host "Dashboard: https://console.anthropic.com" -ForegroundColor Gray
    Write-Host ""

    $apiKey = Read-EnvValue -Prompt "ANTHROPIC_API_KEY" -ValidationPattern "^sk-ant-"
    Add-EnvVariable -Name "ANTHROPIC_API_KEY" -Value $apiKey -FilePath $EnvPath

    if ($apiKey) {
        Write-Host "  Anthropic configured" -ForegroundColor Green
    }
}

function Setup-Sentry {
    Write-Host ""
    Write-Host "--- SENTRY ERROR TRACKING ---" -ForegroundColor Cyan
    Write-Host "Dashboard: https://sentry.io" -ForegroundColor Gray
    Write-Host ""

    $dsn = Read-EnvValue -Prompt "SENTRY_DSN" -ValidationPattern "^https://.*sentry"
    $authToken = Read-EnvValue -Prompt "SENTRY_AUTH_TOKEN (for source maps, optional)"
    $org = Read-EnvValue -Prompt "SENTRY_ORG (optional)"
    $project = Read-EnvValue -Prompt "SENTRY_PROJECT (optional)"

    Add-EnvVariable -Name "SENTRY_DSN" -Value $dsn -FilePath $EnvPath
    Add-EnvVariable -Name "SENTRY_AUTH_TOKEN" -Value $authToken -FilePath $EnvPath
    Add-EnvVariable -Name "SENTRY_ORG" -Value $org -FilePath $EnvPath
    Add-EnvVariable -Name "SENTRY_PROJECT" -Value $project -FilePath $EnvPath

    if ($dsn) {
        Write-Host "  Sentry configured" -ForegroundColor Green
    }
}

# -------------------------------------------------------------------
# Main Setup Flow
# -------------------------------------------------------------------

# Ensure .env.local exists
if (-not (Test-Path $EnvPath)) {
    $envExample = Join-Path $ProjectDir ".env.example"
    if (Test-Path $envExample) {
        Copy-Item -Path $envExample -Destination $EnvPath
        Write-Host "Created .env.local from .env.example" -ForegroundColor Green
    } else {
        New-Item -Path $EnvPath -ItemType File -Force | Out-Null
        Write-Host "Created empty .env.local" -ForegroundColor Green
    }
}

# Run service setups
if ($Service -eq "all") {
    Write-Host "Setting up all services. Press Enter to skip any field." -ForegroundColor Gray
    Setup-Neon
    Setup-Clerk
    Setup-Upstash
    Setup-Stripe
    Setup-Anthropic
    Setup-Sentry
} else {
    switch ($Service) {
        "neon" { Setup-Neon }
        "clerk" { Setup-Clerk }
        "upstash" { Setup-Upstash }
        "stripe" { Setup-Stripe }
        "anthropic" { Setup-Anthropic }
        "sentry" { Setup-Sentry }
    }
}

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  ENVIRONMENT SETUP COMPLETE          " -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Env file: $EnvPath" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review .env.local for any missing values" -ForegroundColor Gray
Write-Host "  2. Run: .\_scripts\provision-db.ps1 -Project $Project" -ForegroundColor Gray
Write-Host "  3. Run: pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Reference: _integrations/INTEGRATIONS.md" -ForegroundColor Cyan
Write-Host ""
