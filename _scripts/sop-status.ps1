<#
.SYNOPSIS
    SOP Navigator - Track and manage project SOP progress

.DESCRIPTION
    Shows current SOP status, completion percentage, and next steps for a Launchpad project.
    Progress is stored in .launchpad/sop-status.json within each project.

.PARAMETER Project
    Project name (folder under projects/)

.PARAMETER Action
    Action to perform: status (default), advance, reset, init

.EXAMPLE
    .\sop-status.ps1 -Project "my-saas"
    Shows current SOP status for my-saas

.EXAMPLE
    .\sop-status.ps1 -Project "my-saas" -Action advance
    Marks current SOP complete and moves to next

.EXAMPLE
    .\sop-status.ps1 -Project "my-saas" -Action init
    Initializes SOP tracking for a new project
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [ValidateSet("status", "advance", "reset", "init")]
    [string]$Action = "status",

    [string]$Note = ""
)

# Configuration
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$ProjectPath = Join-Path $LaunchpadRoot "projects" $Project
$StatusFile = Join-Path $ProjectPath ".launchpad" "sop-status.json"

# SOP definitions in order
$SOPs = @(
    @{ Id = "00"; Name = "idea-intake"; Phase = "Ideation" }
    @{ Id = "01"; Name = "quick-validation"; Phase = "Ideation" }
    @{ Id = "01a"; Name = "rigorous-idea-audit"; Phase = "Ideation" }
    @{ Id = "02"; Name = "mvp-scope-contract"; Phase = "Ideation" }
    @{ Id = "03"; Name = "revenue-model-lock"; Phase = "Ideation" }
    @{ Id = "04"; Name = "design-brief"; Phase = "Design" }
    @{ Id = "05"; Name = "project-setup"; Phase = "Setup" }
    @{ Id = "06"; Name = "infrastructure-provisioning"; Phase = "Setup" }
    @{ Id = "07"; Name = "development-protocol"; Phase = "Build" }
    @{ Id = "08"; Name = "testing-qa-checklist"; Phase = "Build" }
    @{ Id = "09"; Name = "pre-ship-checklist"; Phase = "Launch" }
    @{ Id = "10"; Name = "launch-day-protocol"; Phase = "Launch" }
    @{ Id = "11"; Name = "post-launch-monitoring"; Phase = "Post-Launch" }
    @{ Id = "12"; Name = "marketing-activation"; Phase = "Post-Launch" }
)

function Get-SopIndex {
    param([string]$SopId)
    for ($i = 0; $i -lt $SOPs.Count; $i++) {
        if ($SOPs[$i].Id -eq $SopId) { return $i }
    }
    return -1
}

function Get-SopById {
    param([string]$SopId)
    return $SOPs | Where-Object { $_.Id -eq $SopId }
}

function Initialize-Status {
    $status = @{
        project = $Project
        currentSop = "00-idea-intake"
        completedSops = @()
        skippedSops = @()
        startedAt = (Get-Date).ToString("o")
        lastUpdated = (Get-Date).ToString("o")
        notes = @{}
    }

    $dir = Split-Path $StatusFile -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $status | ConvertTo-Json -Depth 10 | Set-Content $StatusFile
    return $status
}

function Get-Status {
    if (-not (Test-Path $StatusFile)) {
        return $null
    }
    return Get-Content $StatusFile | ConvertFrom-Json
}

function Save-Status {
    param($Status)
    $Status.lastUpdated = (Get-Date).ToString("o")
    $Status | ConvertTo-Json -Depth 10 | Set-Content $StatusFile
}

function Show-ProgressBar {
    param(
        [int]$Completed,
        [int]$Total,
        [int]$Width = 30
    )

    $pct = [math]::Round(($Completed / $Total) * 100)
    $filled = [math]::Round(($Completed / $Total) * $Width)
    $empty = $Width - $filled

    $bar = ("[" + ("=" * $filled) + ("-" * $empty) + "]")
    return "$bar $pct% ($Completed/$Total)"
}

function Show-Status {
    param($Status)

    $currentId = $Status.currentSop.Split("-")[0]
    $currentSop = Get-SopById $currentId
    $currentIndex = Get-SopIndex $currentId
    $completedCount = $Status.completedSops.Count

    Write-Host ""
    Write-Host "  SOP Status: $($Status.project)" -ForegroundColor Cyan
    Write-Host "  ============================================" -ForegroundColor DarkGray
    Write-Host ""

    # Progress bar
    $progressBar = Show-ProgressBar -Completed $completedCount -Total $SOPs.Count
    Write-Host "  Progress: $progressBar" -ForegroundColor Yellow
    Write-Host ""

    # Current SOP
    Write-Host "  Current SOP:" -ForegroundColor White
    Write-Host "    [$($currentSop.Id)] $($currentSop.Name)" -ForegroundColor Green
    Write-Host "    Phase: $($currentSop.Phase)" -ForegroundColor DarkGray
    Write-Host ""

    # Next SOP
    if ($currentIndex -lt ($SOPs.Count - 1)) {
        $nextSop = $SOPs[$currentIndex + 1]
        Write-Host "  Next SOP:" -ForegroundColor White
        Write-Host "    [$($nextSop.Id)] $($nextSop.Name)" -ForegroundColor DarkYellow
        Write-Host "    Phase: $($nextSop.Phase)" -ForegroundColor DarkGray
    } else {
        Write-Host "  Next SOP:" -ForegroundColor White
        Write-Host "    None - Ready to ship!" -ForegroundColor Magenta
    }
    Write-Host ""

    # Completed SOPs
    if ($Status.completedSops.Count -gt 0) {
        Write-Host "  Completed:" -ForegroundColor White
        foreach ($sopId in $Status.completedSops) {
            $sop = Get-SopById $sopId
            $note = ""
            if ($Status.notes.$sopId) {
                $note = " - $($Status.notes.$sopId)"
            }
            Write-Host "    [x] $($sop.Id)-$($sop.Name)$note" -ForegroundColor DarkGreen
        }
        Write-Host ""
    }

    # Skipped SOPs
    if ($Status.skippedSops.Count -gt 0) {
        Write-Host "  Skipped:" -ForegroundColor White
        foreach ($sopId in $Status.skippedSops) {
            $sop = Get-SopById $sopId
            $note = ""
            if ($Status.notes.$sopId) {
                $note = " - $($Status.notes.$sopId)"
            }
            Write-Host "    [-] $($sop.Id)-$($sop.Name)$note" -ForegroundColor DarkYellow
        }
        Write-Host ""
    }

    # Timeline
    $started = [DateTime]::Parse($Status.startedAt)
    $elapsed = (Get-Date) - $started
    Write-Host "  Started: $($started.ToString('yyyy-MM-dd'))" -ForegroundColor DarkGray
    Write-Host "  Elapsed: $($elapsed.Days) days" -ForegroundColor DarkGray
    Write-Host ""
}

function Advance-Sop {
    param($Status, [string]$NoteText)

    $currentId = $Status.currentSop.Split("-")[0]
    $currentIndex = Get-SopIndex $currentId

    if ($currentIndex -ge ($SOPs.Count - 1)) {
        Write-Host ""
        Write-Host "  All SOPs complete! Project is shipped." -ForegroundColor Green
        Write-Host ""
        return $Status
    }

    # Mark current as complete
    $completedList = [System.Collections.ArrayList]@($Status.completedSops)
    if (-not $completedList.Contains($currentId)) {
        $completedList.Add($currentId) | Out-Null
    }
    $Status.completedSops = $completedList.ToArray()

    # Add note if provided
    if ($NoteText) {
        if (-not $Status.notes) {
            $Status.notes = @{}
        }
        $Status.notes[$currentId] = $NoteText
    }

    # Move to next SOP
    $nextSop = $SOPs[$currentIndex + 1]
    $Status.currentSop = "$($nextSop.Id)-$($nextSop.Name)"

    Save-Status $Status

    Write-Host ""
    Write-Host "  Marked [$currentId] as complete" -ForegroundColor Green
    Write-Host "  Advanced to [$($nextSop.Id)] $($nextSop.Name)" -ForegroundColor Cyan
    Write-Host ""

    return $Status
}

# Verify project exists
if (-not (Test-Path $ProjectPath)) {
    Write-Host ""
    Write-Host "  Error: Project '$Project' not found at $ProjectPath" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Execute action
switch ($Action) {
    "init" {
        if (Test-Path $StatusFile) {
            Write-Host ""
            Write-Host "  Warning: Status file already exists. Use -Action reset to clear." -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
        $status = Initialize-Status
        Write-Host ""
        Write-Host "  Initialized SOP tracking for '$Project'" -ForegroundColor Green
        Write-Host "  Status file: $StatusFile" -ForegroundColor DarkGray
        Write-Host ""
        Show-Status $status
    }

    "status" {
        $status = Get-Status
        if (-not $status) {
            Write-Host ""
            Write-Host "  No SOP tracking found for '$Project'" -ForegroundColor Yellow
            Write-Host "  Run: .\sop-status.ps1 -Project '$Project' -Action init" -ForegroundColor DarkGray
            Write-Host ""
            exit 1
        }
        Show-Status $status
    }

    "advance" {
        $status = Get-Status
        if (-not $status) {
            Write-Host ""
            Write-Host "  No SOP tracking found. Initialize first with -Action init" -ForegroundColor Red
            Write-Host ""
            exit 1
        }
        $status = Advance-Sop $status $Note
        Show-Status $status
    }

    "reset" {
        if (Test-Path $StatusFile) {
            Remove-Item $StatusFile -Force
            Write-Host ""
            Write-Host "  Reset SOP tracking for '$Project'" -ForegroundColor Yellow
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "  No status file to reset" -ForegroundColor DarkGray
            Write-Host ""
        }
    }
}
