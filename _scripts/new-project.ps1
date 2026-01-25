<#
.SYNOPSIS
    Creates a new Launchpad project from templates.

.DESCRIPTION
    This script scaffolds a new project by:
    - Copying the selected template to projects/
    - Setting up the project structure
    - Optionally generating a PRD with Claude AI
    - Initializing git repository
    - Creating project-specific files

    Supports templates: nextjs-web, tauri-desktop, api-only

.PARAMETER Name
    The project name (kebab-case, e.g., "my-saas-app")

.PARAMETER Template
    The template to use (default: nextjs-web)

.PARAMETER SkipGit
    Skip git initialization

.EXAMPLE
    .\new-project.ps1 -Name "invoice-ai"
    # Creates projects/invoice-ai from nextjs-web template

.EXAMPLE
    .\new-project.ps1 -Name "desktop-app" -Template "tauri-desktop"
    # Creates projects/desktop-app from tauri-desktop template

.NOTES
    Author: Launchpad System
    Version: 1.1.0 (Added AI PRD generation)
    Last Updated: 2025-01-05
#>

param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern("^[a-z0-9-]+$")]
    [string]$Name,

    [ValidateSet("nextjs-web", "tauri-desktop", "api-only")]
    [string]$Template = "nextjs-web",

    [switch]$SkipGit
)

# Configuration
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$TemplatesDir = Join-Path $LaunchpadRoot "_templates\project"
$ProjectsDir = Join-Path $LaunchpadRoot "projects"
$TargetDir = Join-Path $ProjectsDir $Name

# Import Claude module (if available)
$ModulePath = Join-Path $PSScriptRoot "modules\Invoke-ClaudeApi.psm1"
$UseAI = $false
$GeneratePRD = $false
$ProjectDescription = ""

if (Test-Path $ModulePath) {
    try {
        Import-Module $ModulePath -Force -ErrorAction Stop
        $Status = Get-ClaudeStatus
        $UseAI = $Status.Available
    }
    catch {
        $UseAI = $false
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  LAUNCHPAD - New Project             " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Show AI status
if ($UseAI) {
    Write-Host "  Claude AI: Available for PRD generation" -ForegroundColor Magenta
} else {
    Write-Host "  Claude AI: Not available" -ForegroundColor Gray
}
Write-Host ""

# -------------------------------------------------------------------
# Validation
# -------------------------------------------------------------------
Write-Host "[1/5] Validating inputs..." -ForegroundColor Yellow

# Check if project already exists
if (Test-Path $TargetDir) {
    Write-Host "ERROR: Project '$Name' already exists at:" -ForegroundColor Red
    Write-Host "       $TargetDir" -ForegroundColor Gray
    exit 1
}

# Check if template exists
$TemplateDir = Join-Path $TemplatesDir $Template
if (-not (Test-Path $TemplateDir)) {
    Write-Host "ERROR: Template '$Template' not found at:" -ForegroundColor Red
    Write-Host "       $TemplateDir" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available templates:" -ForegroundColor Yellow
    Get-ChildItem -Path $TemplatesDir -Directory | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor White
    }
    exit 1
}

Write-Host "  Project: $Name" -ForegroundColor White
Write-Host "  Template: $Template" -ForegroundColor White
Write-Host "  Target: $TargetDir" -ForegroundColor Gray

# Offer PRD generation if AI is available
if ($UseAI) {
    Write-Host ""
    $WantPRD = Read-Host "Generate initial PRD with Claude AI? (y/n)"
    if ($WantPRD -eq "y") {
        Write-Host ""
        Write-Host "Describe your project in 1-3 sentences:" -ForegroundColor Yellow
        Write-Host "(What problem does it solve? Who is it for?)" -ForegroundColor Gray
        $ProjectDescription = Read-Host "Description"
        if (-not [string]::IsNullOrWhiteSpace($ProjectDescription)) {
            $GeneratePRD = $true
            Write-Host "  PRD will be generated after template copy" -ForegroundColor Magenta
        } else {
            Write-Host "  No description provided - skipping PRD generation" -ForegroundColor Gray
        }
    }
}

# -------------------------------------------------------------------
# Create projects directory if needed
# -------------------------------------------------------------------
Write-Host "[2/5] Preparing directories..." -ForegroundColor Yellow

if (-not (Test-Path $ProjectsDir)) {
    New-Item -Path $ProjectsDir -ItemType Directory -Force | Out-Null
    Write-Host "  Created: projects/" -ForegroundColor Green
}

# -------------------------------------------------------------------
# Copy template
# -------------------------------------------------------------------
Write-Host "[3/5] Copying template..." -ForegroundColor Yellow

try {
    # Copy template excluding node_modules, .git, and other generated files
    $ExcludeDirs = @("node_modules", ".git", ".next", "out", "dist", "build", ".vercel", "target")

    # Create target directory
    New-Item -Path $TargetDir -ItemType Directory -Force | Out-Null

    # Copy files recursively, excluding unwanted directories
    Get-ChildItem -Path $TemplateDir -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($TemplateDir.Length + 1)
        $targetPath = Join-Path $TargetDir $relativePath

        # Check if path contains excluded directory
        $shouldExclude = $false
        foreach ($excludeDir in $ExcludeDirs) {
            if ($relativePath -like "$excludeDir*" -or $relativePath -like "*\$excludeDir\*") {
                $shouldExclude = $true
                break
            }
        }

        if (-not $shouldExclude) {
            if ($_.PSIsContainer) {
                if (-not (Test-Path $targetPath)) {
                    New-Item -Path $targetPath -ItemType Directory -Force | Out-Null
                }
            } else {
                $parentDir = Split-Path -Parent $targetPath
                if (-not (Test-Path $parentDir)) {
                    New-Item -Path $parentDir -ItemType Directory -Force | Out-Null
                }
                Copy-Item -Path $_.FullName -Destination $targetPath -Force
            }
        }
    }

    Write-Host "  Template copied successfully" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to copy template" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# -------------------------------------------------------------------
# Generate PRD with Claude AI (if requested)
# -------------------------------------------------------------------
$PrdGenerated = $false
if ($GeneratePRD) {
    Write-Host "[3.5/5] Generating PRD with Claude AI..." -ForegroundColor Magenta

    try {
        # Load PRD template
        $PrdTemplatePath = Join-Path $LaunchpadRoot "_templates\docs\PRD.md"
        if (Test-Path $PrdTemplatePath) {
            $PrdTemplate = Get-Content $PrdTemplatePath -Raw

            # Get prompt template
            $Prompt = Get-PromptTemplate -TemplateName "prd-generation" -Variables @{
                PROJECT_NAME = $Name
                TEMPLATE_TYPE = $Template
                DESCRIPTION = $ProjectDescription
                PRD_TEMPLATE = $PrdTemplate
            }

            Write-Host "  Claude is generating your PRD..." -ForegroundColor Cyan

            # Call Claude API
            $PrdContent = Invoke-ClaudeMessage -SystemPrompt $Prompt.SystemPrompt -UserMessage $Prompt.UserMessage

            # Create docs directory
            $DocsDir = Join-Path $TargetDir "docs"
            if (-not (Test-Path $DocsDir)) {
                New-Item -Path $DocsDir -ItemType Directory -Force | Out-Null
            }

            # Add AI attribution header
            $Date = Get-Date -Format "yyyy-MM-dd HH:mm"
            $PrdHeader = @"
---
generated_by: Claude AI
generated_at: $Date
status: draft
project: $Name
template: $Template
---

> **Note:** This PRD was AI-generated based on the project description. Review and update all [TBD] sections before implementation.

"@

            # Write PRD file
            $PrdPath = Join-Path $DocsDir "PRD.md"
            Set-Content -Path $PrdPath -Value ($PrdHeader + $PrdContent) -Encoding UTF8
            Write-Host "  Created: docs/PRD.md" -ForegroundColor Green
            $PrdGenerated = $true
        } else {
            Write-Host "  PRD template not found - skipping" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "  PRD generation failed: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "  You can generate one manually using the PRD template" -ForegroundColor Gray
    }
}

# -------------------------------------------------------------------
# Update project files
# -------------------------------------------------------------------
Write-Host "[4/5] Customizing project..." -ForegroundColor Yellow

# Update package.json with project name
$PackageJsonPath = Join-Path $TargetDir "package.json"
if (Test-Path $PackageJsonPath) {
    $packageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    $packageJson.name = $Name
    $packageJson.version = "0.1.0"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $PackageJsonPath -Encoding UTF8
    Write-Host "  Updated: package.json" -ForegroundColor Green
}

# Create .env.local from .env.example
$EnvExamplePath = Join-Path $TargetDir ".env.example"
$EnvLocalPath = Join-Path $TargetDir ".env.local"
if ((Test-Path $EnvExamplePath) -and -not (Test-Path $EnvLocalPath)) {
    Copy-Item -Path $EnvExamplePath -Destination $EnvLocalPath
    Write-Host "  Created: .env.local (from .env.example)" -ForegroundColor Green
}

# Create project CLAUDE.md
$ClaudeMdPath = Join-Path $TargetDir "CLAUDE.md"
$PrdReference = if ($PrdGenerated) {
    @"

## PRD

See ``docs/PRD.md`` for the initial Product Requirements Document.
> **Note:** This was AI-generated. Review and update [TBD] sections.
"@
} else { "" }

$ClaudeMdContent = @"
# $Name

> Project created from Launchpad template: $Template
$PrdReference

## Quick Reference

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Database | Neon PostgreSQL |
| ORM | Drizzle |
| Auth | Clerk |
| Payments | Stripe |

## Project Status

- **Created:** $(Get-Date -Format "yyyy-MM-dd")
- **Current Phase:** 05 (Project Setup)
- **Next SOP:** 06-infrastructure-provisioning.md

## Commands

``````bash
pnpm install     # Install dependencies
pnpm dev         # Start dev server
pnpm build       # Build for production
pnpm lint        # Run linter
``````

## Environment Variables

See ``.env.example`` for required variables.
Run ``setup-env.ps1`` to configure.

---

*Refer to root CLAUDE.md for full context.*
"@
Set-Content -Path $ClaudeMdPath -Value $ClaudeMdContent -Encoding UTF8
Write-Host "  Created: CLAUDE.md" -ForegroundColor Green

# -------------------------------------------------------------------
# Initialize git
# -------------------------------------------------------------------
Write-Host "[5/5] Initializing git..." -ForegroundColor Yellow

if ($SkipGit) {
    Write-Host "  Skipped (--SkipGit flag)" -ForegroundColor Gray
} else {
    try {
        Push-Location $TargetDir
        git init --quiet
        git add .
        git commit -m "Initial commit from Launchpad template: $Template" --quiet
        Pop-Location
        Write-Host "  Git repository initialized" -ForegroundColor Green
    }
    catch {
        Write-Host "  WARNING: Git initialization failed" -ForegroundColor Yellow
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Gray
        Pop-Location
    }
}

# -------------------------------------------------------------------
# Summary
# -------------------------------------------------------------------
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  PROJECT CREATED SUCCESSFULLY        " -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Location: $TargetDir" -ForegroundColor White
Write-Host "  Template: $Template" -ForegroundColor White
if ($PrdGenerated) {
    Write-Host "  PRD: docs/PRD.md (AI-generated)" -ForegroundColor Magenta
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd projects\$Name" -ForegroundColor Gray
if ($PrdGenerated) {
    Write-Host "  2. Review docs/PRD.md - update [TBD] sections" -ForegroundColor Magenta
    Write-Host "  3. pnpm install" -ForegroundColor Gray
    Write-Host "  4. .\_scripts\setup-env.ps1 -Project $Name" -ForegroundColor Gray
    Write-Host "  5. .\_scripts\provision-db.ps1 -Project $Name" -ForegroundColor Gray
    Write-Host "  6. pnpm dev" -ForegroundColor Gray
} else {
    Write-Host "  2. pnpm install" -ForegroundColor Gray
    Write-Host "  3. .\_scripts\setup-env.ps1 -Project $Name" -ForegroundColor Gray
    Write-Host "  4. .\_scripts\provision-db.ps1 -Project $Name" -ForegroundColor Gray
    Write-Host "  5. pnpm dev" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Current SOP: 05-project-setup.md" -ForegroundColor Cyan
Write-Host "Next SOP:    06-infrastructure-provisioning.md" -ForegroundColor Cyan
Write-Host ""
