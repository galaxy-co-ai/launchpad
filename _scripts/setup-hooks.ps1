<#
.SYNOPSIS
    Configures git to use Launchpad's custom hooks directory.

.DESCRIPTION
    This script sets up git to use the .githooks/ directory for hooks,
    enabling the pre-commit QCO (orphan document detection) and any
    future hooks we add.

    Run this once after cloning the repo or when hooks are updated.

.EXAMPLE
    .\_scripts\setup-hooks.ps1

.NOTES
    Author: Launchpad System
    Version: 1.0.0
#>

$LaunchpadRoot = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  LAUNCHPAD — Git Hooks Setup         " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repo
$GitDir = Join-Path $LaunchpadRoot ".git"
if (-not (Test-Path $GitDir)) {
    Write-Host "ERROR: Not a git repository" -ForegroundColor Red
    Write-Host "Run this from the Launchpad root directory" -ForegroundColor Yellow
    exit 1
}

# Configure git to use our hooks directory
Write-Host "Configuring git to use .githooks/ directory..." -ForegroundColor Yellow

try {
    Push-Location $LaunchpadRoot
    git config core.hooksPath .githooks
    Pop-Location

    Write-Host ""
    Write-Host "SUCCESS: Git hooks configured" -ForegroundColor Green
    Write-Host ""
    Write-Host "Active hooks:" -ForegroundColor Cyan

    $HooksDir = Join-Path $LaunchpadRoot ".githooks"
    $Hooks = Get-ChildItem -Path $HooksDir -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notmatch "\.sample$" }

    foreach ($Hook in $Hooks) {
        Write-Host "  - $($Hook.Name)" -ForegroundColor White
    }

    Write-Host ""
    Write-Host "The pre-commit hook will now scan for orphan documents" -ForegroundColor Gray
    Write-Host "before each commit. To bypass: git commit --no-verify" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "ERROR: Failed to configure git hooks" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
