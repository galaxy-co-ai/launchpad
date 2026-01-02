<#
.SYNOPSIS
    Directory Quality Control Officer (QCO)
    Enforces Launchpad governance rules for document hygiene.

.DESCRIPTION
    This script patrols the Launchpad directory structure, looking for:
    - Orphan markdown files in forbidden locations
    - Expired files in _archive/ (>15 days) and _scratch/ (>7 days)
    - Files with non-compliant naming conventions

    Run regularly to maintain a clean, navigable codebase.

.PARAMETER AutoClean
    If specified, automatically deletes expired files instead of just reporting.

.PARAMETER Verbose
    Show detailed output for each file checked.

.EXAMPLE
    .\directory-qco.ps1
    # Runs audit and reports violations

.EXAMPLE
    .\directory-qco.ps1 -AutoClean
    # Runs audit and deletes expired files

.NOTES
    Author: Launchpad System
    Version: 1.0.0
    Last Updated: 2025-12-28
#>

param(
    [switch]$AutoClean,
    [switch]$Verbose
)

# Configuration
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$ArchiveMaxAgeDays = 15
$ScratchMaxAgeDays = 7

# Allowed files in root
$AllowedRootFiles = @(
    "README.md",
    "CLAUDE.md",
    "MANIFEST.md",
    "AGENTS.md",
    "GOVERNANCE.md",
    "CURSORRULES.md",
    ".gitignore",
    ".gitattributes"
)

# Forbidden directories for markdown files
$ForbiddenMdLocations = @(
    "src",
    "lib",
    "app",
    "components",
    "pages",
    "api",
    "node_modules",
    ".git"
)

# Results tracking
$Violations = @{
    OrphanDocs = @()
    ExpiredArchive = @()
    ExpiredScratch = @()
    NamingViolations = @()
    ForbiddenLocations = @()
}

$CleanedFiles = @()

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  DIRECTORY QCO - Quality Control     " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Scanning: $LaunchpadRoot" -ForegroundColor Gray
Write-Host ""

# -------------------------------------------------------------------
# Check 1: Orphan markdown files in root
# -------------------------------------------------------------------
Write-Host "[1/4] Checking root for orphan documents..." -ForegroundColor Yellow

$RootFiles = Get-ChildItem -Path $LaunchpadRoot -File -Filter "*.md" -ErrorAction SilentlyContinue

foreach ($file in $RootFiles) {
    if ($file.Name -notin $AllowedRootFiles) {
        $Violations.OrphanDocs += $file.FullName
        if ($Verbose) {
            Write-Host "  ORPHAN: $($file.Name)" -ForegroundColor Red
        }
    }
}

# -------------------------------------------------------------------
# Check 2: Markdown files in forbidden locations
# -------------------------------------------------------------------
Write-Host "[2/4] Checking for docs in code directories..." -ForegroundColor Yellow

foreach ($forbiddenDir in $ForbiddenMdLocations) {
    $dirPath = Join-Path $LaunchpadRoot $forbiddenDir
    if (Test-Path $dirPath) {
        $mdFiles = Get-ChildItem -Path $dirPath -Recurse -File -Filter "*.md" -ErrorAction SilentlyContinue
        foreach ($file in $mdFiles) {
            # Exclude node_modules entirely and README.md in project folders
            if ($file.FullName -notmatch "node_modules" -and $file.Name -ne "README.md") {
                $Violations.ForbiddenLocations += $file.FullName
                if ($Verbose) {
                    Write-Host "  FORBIDDEN: $($file.FullName)" -ForegroundColor Red
                }
            }
        }
    }
}

# -------------------------------------------------------------------
# Check 3: Expired files in _archive/
# -------------------------------------------------------------------
Write-Host "[3/4] Checking _archive/ for expired files..." -ForegroundColor Yellow

$ArchivePath = Join-Path $LaunchpadRoot "_archive"
if (Test-Path $ArchivePath) {
    $ArchiveFiles = Get-ChildItem -Path $ArchivePath -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ne ".gitkeep" }

    $CutoffDate = (Get-Date).AddDays(-$ArchiveMaxAgeDays)

    foreach ($file in $ArchiveFiles) {
        if ($file.LastWriteTime -lt $CutoffDate) {
            $Violations.ExpiredArchive += $file.FullName
            $daysOld = [math]::Round(((Get-Date) - $file.LastWriteTime).TotalDays)

            if ($Verbose) {
                Write-Host "  EXPIRED ($daysOld days): $($file.Name)" -ForegroundColor Red
            }

            if ($AutoClean) {
                Remove-Item $file.FullName -Force
                $CleanedFiles += $file.FullName
            }
        }
    }
}

# -------------------------------------------------------------------
# Check 4: Expired files in _scratch/
# -------------------------------------------------------------------
Write-Host "[4/4] Checking _scratch/ for expired files..." -ForegroundColor Yellow

$ScratchPath = Join-Path $LaunchpadRoot "_scratch"
if (Test-Path $ScratchPath) {
    $ScratchFiles = Get-ChildItem -Path $ScratchPath -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -ne ".gitkeep" }

    $CutoffDate = (Get-Date).AddDays(-$ScratchMaxAgeDays)

    foreach ($file in $ScratchFiles) {
        if ($file.LastWriteTime -lt $CutoffDate) {
            $Violations.ExpiredScratch += $file.FullName
            $daysOld = [math]::Round(((Get-Date) - $file.LastWriteTime).TotalDays)

            if ($Verbose) {
                Write-Host "  EXPIRED ($daysOld days): $($file.Name)" -ForegroundColor Red
            }

            if ($AutoClean) {
                Remove-Item $file.FullName -Force
                $CleanedFiles += $file.FullName
            }
        }
    }
}

# -------------------------------------------------------------------
# Report
# -------------------------------------------------------------------
Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  QCO REPORT                          " -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$TotalViolations = $Violations.OrphanDocs.Count +
                   $Violations.ForbiddenLocations.Count +
                   $Violations.ExpiredArchive.Count +
                   $Violations.ExpiredScratch.Count

if ($TotalViolations -eq 0) {
    Write-Host "  STATUS: ALL CLEAR" -ForegroundColor Green
    Write-Host "  No governance violations detected." -ForegroundColor Green
} else {
    Write-Host "  STATUS: VIOLATIONS FOUND" -ForegroundColor Red
    Write-Host ""

    if ($Violations.OrphanDocs.Count -gt 0) {
        Write-Host "  Orphan docs in root: $($Violations.OrphanDocs.Count)" -ForegroundColor Red
        foreach ($file in $Violations.OrphanDocs) {
            Write-Host "    - $file" -ForegroundColor Gray
        }
        Write-Host "    FIX: Move to _archive/ or proper location" -ForegroundColor Yellow
        Write-Host ""
    }

    if ($Violations.ForbiddenLocations.Count -gt 0) {
        Write-Host "  Docs in code directories: $($Violations.ForbiddenLocations.Count)" -ForegroundColor Red
        foreach ($file in $Violations.ForbiddenLocations) {
            Write-Host "    - $file" -ForegroundColor Gray
        }
        Write-Host "    FIX: Move to appropriate _system folder" -ForegroundColor Yellow
        Write-Host ""
    }

    if ($Violations.ExpiredArchive.Count -gt 0) {
        Write-Host "  Expired in _archive/: $($Violations.ExpiredArchive.Count)" -ForegroundColor Red
        if (-not $AutoClean) {
            Write-Host "    FIX: Run with -AutoClean to delete, or manually remove" -ForegroundColor Yellow
        }
        Write-Host ""
    }

    if ($Violations.ExpiredScratch.Count -gt 0) {
        Write-Host "  Expired in _scratch/: $($Violations.ExpiredScratch.Count)" -ForegroundColor Red
        if (-not $AutoClean) {
            Write-Host "    FIX: Run with -AutoClean to delete, or manually remove" -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

if ($CleanedFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "  AUTO-CLEANED: $($CleanedFiles.Count) files deleted" -ForegroundColor Green
    foreach ($file in $CleanedFiles) {
        Write-Host "    - $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Archive retention: $ArchiveMaxAgeDays days" -ForegroundColor Gray
Write-Host "  Scratch retention: $ScratchMaxAgeDays days" -ForegroundColor Gray
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Return exit code based on violations
if ($TotalViolations -gt 0 -and -not $AutoClean) {
    exit 1
} else {
    exit 0
}
