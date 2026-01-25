<#
.SYNOPSIS
    Interactive idea audit script for rigorous PMF validation

.DESCRIPTION
    Guides you through SOP 01a-rigorous-idea-audit.md to validate an idea.
    Creates AUDIT-[slug].md with scores, research, and go/no-go decision.

    With ANTHROPIC_API_KEY set, Claude AI suggests scores based on the idea file.
    You can accept (press Enter) or override any suggestion.

.PARAMETER Slug
    The idea slug (kebab-case) to audit

.EXAMPLE
    .\audit-idea.ps1 -Slug "ai-invoice-tool"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$Slug
)

$ErrorActionPreference = "Stop"

# Paths
$LaunchpadRoot = Split-Path -Parent $PSScriptRoot
$VaultPath = Join-Path $LaunchpadRoot "_vault"
$TemplatePath = Join-Path $LaunchpadRoot "_templates\docs\AUDIT-TEMPLATE.md"
$AuditPath = Join-Path $VaultPath "audits\AUDIT-$Slug.md"
$IdeaBacklog = Join-Path $VaultPath "backlog\IDEA-$Slug.md"
$IdeaActive = Join-Path $VaultPath "active\IDEA-$Slug.md"

# Import Claude module (if available)
$ModulePath = Join-Path $PSScriptRoot "modules\Invoke-ClaudeApi.psm1"
$UseAI = $false
$AISuggestions = $null

if (Test-Path $ModulePath) {
    try {
        Import-Module $ModulePath -Force -ErrorAction Stop
        $Status = Get-ClaudeStatus
        $UseAI = $Status.Available
    }
    catch {
        # Module import failed - continue without AI
        $UseAI = $false
    }
}

# Banner
Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "                    RIGOROUS IDEA AUDIT                              " -ForegroundColor Cyan
Write-Host "                   SOP 01a - PMF Validation                          " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Show AI status
if ($UseAI) {
    Write-Host "  Claude AI assistance: ENABLED" -ForegroundColor Magenta
    Write-Host "  AI will suggest scores - press Enter to accept or type to override" -ForegroundColor Gray
} else {
    Write-Host "  Claude AI assistance: DISABLED" -ForegroundColor Gray
    if (-not $env:ANTHROPIC_API_KEY) {
        Write-Host "  Set ANTHROPIC_API_KEY to enable AI-assisted scoring" -ForegroundColor Gray
    }
}
Write-Host ""

# Check idea exists
$IdeaPath = $null
if (Test-Path $IdeaBacklog) {
    $IdeaPath = $IdeaBacklog
    Write-Host "Found idea in backlog: $IdeaBacklog" -ForegroundColor Green
} elseif (Test-Path $IdeaActive) {
    $IdeaPath = $IdeaActive
    Write-Host "Found idea in active: $IdeaActive" -ForegroundColor Yellow
} else {
    Write-Host "ERROR: No idea file found for slug '$Slug'" -ForegroundColor Red
    Write-Host "Expected: $IdeaBacklog" -ForegroundColor Gray
    Write-Host "Run 00-idea-intake first to create the idea file." -ForegroundColor Gray
    exit 1
}

# Check template exists
if (-not (Test-Path $TemplatePath)) {
    Write-Host "ERROR: Audit template not found at $TemplatePath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "This audit typically takes 4-8 hours of research." -ForegroundColor Yellow
Write-Host "70%+ of ideas should FAIL this audit. Be rigorous." -ForegroundColor Yellow
Write-Host ""

# Confirm
$Confirm = Read-Host "Ready to start the audit for '$Slug'? (y/n)"
if ($Confirm -ne "y") {
    Write-Host "Audit cancelled." -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "                  AUTOMATIC DISQUALIFIERS                            " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$Disqualifiers = @(
    "No monetization path (free tool only)",
    "Market too small (<1,000 potential customers)",
    "Requires viral growth to work",
    "MVP costs >$100K to build",
    "Dominated by well-funded incumbents with network effects",
    "Regulatory/legal barriers",
    "B2B Enterprise sales cycles (6+ months)",
    "Requires hardware or physical fulfillment"
)

$Killed = $false
foreach ($dq in $Disqualifiers) {
    $Response = Read-Host "Does this apply? '$dq' (y/n)"
    if ($Response -eq "y") {
        Write-Host ""
        Write-Host "INSTANT KILL: $dq" -ForegroundColor Red
        $Killed = $true
        break
    }
}

if ($Killed) {
    Write-Host ""
    Write-Host "This idea fails an automatic disqualifier." -ForegroundColor Red
    Write-Host "Move to _vault/killed/ and document the reason." -ForegroundColor Red

    $MoveIt = Read-Host "Move idea to killed folder now? (y/n)"
    if ($MoveIt -eq "y") {
        $KilledPath = Join-Path $VaultPath "killed\IDEA-$Slug.md"
        Move-Item -Path $IdeaPath -Destination $KilledPath -Force
        Write-Host "Moved to: $KilledPath" -ForegroundColor Yellow
    }
    exit 0
}

Write-Host ""
Write-Host "No disqualifiers found. Proceeding to scoring..." -ForegroundColor Green
Write-Host ""

# AI Analysis (if available)
if ($UseAI) {
    Write-Host "======================================================================" -ForegroundColor Magenta
    Write-Host "                     AI ANALYSIS IN PROGRESS                         " -ForegroundColor Magenta
    Write-Host "======================================================================" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Claude is analyzing the idea file..." -ForegroundColor Cyan

    try {
        $IdeaContent = Get-Content $IdeaPath -Raw
        $Prompt = Get-PromptTemplate -TemplateName "audit-scoring" -Variables @{
            IDEA_CONTENT = $IdeaContent
        }

        $Response = Invoke-ClaudeMessage -SystemPrompt $Prompt.SystemPrompt -UserMessage $Prompt.UserMessage

        # Parse JSON response
        $AISuggestions = $Response | ConvertFrom-Json

        Write-Host ""
        Write-Host "Analysis complete!" -ForegroundColor Green
        Write-Host ""

        # Show key insights
        if ($AISuggestions.keyInsights -and $AISuggestions.keyInsights.Count -gt 0) {
            Write-Host "Key Insights:" -ForegroundColor Magenta
            foreach ($insight in $AISuggestions.keyInsights) {
                Write-Host "  - $insight" -ForegroundColor White
            }
            Write-Host ""
        }

        # Show research gaps
        if ($AISuggestions.researchGaps -and $AISuggestions.researchGaps.Count -gt 0) {
            Write-Host "Research Gaps Identified:" -ForegroundColor Yellow
            foreach ($gap in $AISuggestions.researchGaps) {
                Write-Host "  ! $gap" -ForegroundColor Yellow
            }
            Write-Host ""
        }

        # Show suggested verdict
        Write-Host "AI Suggested Verdict: $($AISuggestions.suggestedVerdict) ($($AISuggestions.totalScore)/500)" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "Review and confirm each score below. Press Enter to accept AI suggestion." -ForegroundColor Gray
        Write-Host ""
    }
    catch {
        Write-Host ""
        Write-Host "AI analysis failed: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "Proceeding with manual scoring..." -ForegroundColor Gray
        Write-Host ""
        $AISuggestions = $null
    }
}

# Scoring function with AI assistance
function Get-PillarScore {
    param(
        [string]$PillarName,
        [string]$PillarKey,
        [int]$MaxScore,
        [int]$MinScore,
        [array]$Criteria,
        [PSCustomObject]$AISuggestions
    )

    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "                  $PillarName" -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Maximum: $MaxScore points | Minimum to pass: $MinScore points" -ForegroundColor Gray
    Write-Host ""

    $TotalScore = 0
    $AIPillar = $null

    # Get AI suggestions for this pillar
    if ($AISuggestions -and $AISuggestions.$PillarKey) {
        $AIPillar = $AISuggestions.$PillarKey
    }

    foreach ($c in $Criteria) {
        Write-Host "$($c.Name) (max $($c.Points) pts)" -ForegroundColor White
        Write-Host "  $($c.Description)" -ForegroundColor Gray

        # Find AI suggestion for this criterion
        $AICriterion = $null
        if ($AIPillar -and $AIPillar.criteria) {
            $AICriterion = $AIPillar.criteria | Where-Object { $_.name -eq $c.Name } | Select-Object -First 1
        }

        # Show AI suggestion if available
        $DefaultScore = ""
        if ($AICriterion) {
            Write-Host ""
            Write-Host "  [AI Suggests: $($AICriterion.suggestedScore)/$($c.Points)]" -ForegroundColor Magenta
            Write-Host "  $($AICriterion.reasoning)" -ForegroundColor DarkMagenta
            if ($AICriterion.needsResearch) {
                Write-Host "  (Needs more research)" -ForegroundColor Yellow
            }
            $DefaultScore = $AICriterion.suggestedScore
        }

        # Prompt for score
        $PromptText = if ($DefaultScore -ne "") {
            "  Score (0-$($c.Points)) [$DefaultScore]"
        } else {
            "  Score (0-$($c.Points))"
        }

        $ScoreInput = Read-Host $PromptText

        # Use AI suggestion if user just presses Enter
        $Score = if ([string]::IsNullOrWhiteSpace($ScoreInput) -and $DefaultScore -ne "") {
            [int]$DefaultScore
        } elseif ([string]::IsNullOrWhiteSpace($ScoreInput)) {
            0
        } else {
            [int]$ScoreInput
        }

        # Clamp to valid range
        if ($Score -lt 0) { $Score = 0 }
        if ($Score -gt $c.Points) { $Score = $c.Points }

        $TotalScore += $Score
        Write-Host ""
    }

    $Pass = $TotalScore -ge $MinScore
    $PassText = if ($Pass) { "PASS" } else { "FAIL" }
    $PassColor = if ($Pass) { "Green" } else { "Red" }

    Write-Host "$PillarName Score: $TotalScore / $MaxScore [$PassText]" -ForegroundColor $PassColor
    Write-Host ""

    return @{
        Score = $TotalScore
        Pass = $Pass
    }
}

# Pillar 1: Problem Evidence
$P1 = Get-PillarScore -PillarName "PILLAR 1: PROBLEM EVIDENCE" -PillarKey "pillar1" -MaxScore 100 -MinScore 60 -Criteria @(
    @{ Name = "10+ public complaints"; Points = 25; Description = "Found 10+ posts/tweets describing this problem" },
    @{ Name = "Financial loss quantified"; Points = 25; Description = "Evidence shows $ lost due to problem" },
    @{ Name = "Recurring problem"; Points = 15; Description = "Problem happens weekly/monthly, not one-time" },
    @{ Name = "Active solution searching"; Points = 15; Description = "Google Trends shows search volume" },
    @{ Name = "Angry competitor users"; Points = 10; Description = "1-star reviews mention this pain" },
    @{ Name = "Personal experience"; Points = 10; Description = "You genuinely have this problem" }
) -AISuggestions $AISuggestions

# Pillar 2: Market Sizing
$P2 = Get-PillarScore -PillarName "PILLAR 2: MARKET SIZING" -PillarKey "pillar2" -MaxScore 100 -MinScore 50 -Criteria @(
    @{ Name = "TAM > `$1B"; Points = 15; Description = "Total addressable market exceeds `$1 billion" },
    @{ Name = "SAM > `$100M"; Points = 20; Description = "Serviceable market exceeds `$100 million" },
    @{ Name = "SOM > `$500K Year 1"; Points = 25; Description = "Realistic first year revenue potential" },
    @{ Name = "Market growing >5% YoY"; Points = 15; Description = "Industry growth documented" },
    @{ Name = "Clear customer segment"; Points = 15; Description = "Specific, not 'everyone'" },
    @{ Name = "Organic reach possible"; Points = 10; Description = "Can acquire without paid ads" }
) -AISuggestions $AISuggestions

# Pillar 3: Competitive Landscape
$P3 = Get-PillarScore -PillarName "PILLAR 3: COMPETITIVE LANDSCAPE" -PillarKey "pillar3" -MaxScore 100 -MinScore 50 -Criteria @(
    @{ Name = "5+ competitors analyzed"; Points = 20; Description = "Deep dive on at least 5 competitors" },
    @{ Name = "Weakness pattern found"; Points = 20; Description = "Common weakness across competitors" },
    @{ Name = "Unique differentiation"; Points = 20; Description = "Not just cheaper or simpler" },
    @{ Name = "Gap validated by complaints"; Points = 15; Description = "Users asking for what you'd build" },
    @{ Name = "No `$50M+ funded competitor"; Points = 10; Description = "Avoidable competition" },
    @{ Name = "Defensible differentiation"; Points = 15; Description = "Not easily copied" }
) -AISuggestions $AISuggestions

# Pillar 4: Monetization Viability
$P4 = Get-PillarScore -PillarName "PILLAR 4: MONETIZATION VIABILITY" -PillarKey "pillar4" -MaxScore 100 -MinScore 60 -Criteria @(
    @{ Name = "Competitors charge successfully"; Points = 25; Description = "Existing paid products in space" },
    @{ Name = "LTV:CAC ratio >3:1"; Points = 25; Description = "Unit economics work" },
    @{ Name = "Price validated by market"; Points = 15; Description = "Similar to competitor pricing" },
    @{ Name = "MRR model viable"; Points = 15; Description = "Subscription model fits" },
    @{ Name = "Profitable <100 customers"; Points = 10; Description = "Low break-even point" },
    @{ Name = "Path to `$10K MRR clear"; Points = 10; Description = "Math adds up" }
) -AISuggestions $AISuggestions

# Pillar 5: Execution Risk
$P5 = Get-PillarScore -PillarName "PILLAR 5: EXECUTION RISK" -PillarKey "pillar5" -MaxScore 100 -MinScore 50 -Criteria @(
    @{ Name = "MVP in <2 weeks"; Points = 25; Description = "Can build core feature fast" },
    @{ Name = "Uses existing stack"; Points = 15; Description = "No new tech to learn" },
    @{ Name = "No critical dependencies"; Points = 15; Description = "No single-point-of-failure APIs" },
    @{ Name = "Low risk score (<25)"; Points = 30; Description = "Risk register total under 25" },
    @{ Name = "Clear acquisition channel"; Points = 15; Description = "Know how to get first customers" }
) -AISuggestions $AISuggestions

# Final calculation
$TotalScore = $P1.Score + $P2.Score + $P3.Score + $P4.Score + $P5.Score
$AllPass = $P1.Pass -and $P2.Pass -and $P3.Pass -and $P4.Pass -and $P5.Pass

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "                      FINAL RESULTS                                  " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pillar 1 (Problem):      $($P1.Score)/100 $(if ($P1.Pass) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($P1.Pass) { "Green" } else { "Red" })
Write-Host "Pillar 2 (Market):       $($P2.Score)/100 $(if ($P2.Pass) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($P2.Pass) { "Green" } else { "Red" })
Write-Host "Pillar 3 (Competition):  $($P3.Score)/100 $(if ($P3.Pass) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($P3.Pass) { "Green" } else { "Red" })
Write-Host "Pillar 4 (Monetization): $($P4.Score)/100 $(if ($P4.Pass) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($P4.Pass) { "Green" } else { "Red" })
Write-Host "Pillar 5 (Execution):    $($P5.Score)/100 $(if ($P5.Pass) { '[PASS]' } else { '[FAIL]' })" -ForegroundColor $(if ($P5.Pass) { "Green" } else { "Red" })
Write-Host "----------------------------------------------------------------------"
Write-Host "TOTAL SCORE:             $TotalScore/500" -ForegroundColor White
Write-Host ""

# Determine verdict
if ($TotalScore -ge 400 -and $AllPass) {
    $Verdict = "STRONG GO"
    $VerdictColor = "Green"
    $Action = "Fast-track to 02-mvp-scope-contract.md"
} elseif ($TotalScore -ge 350 -and $AllPass) {
    $Verdict = "GO"
    $VerdictColor = "Green"
    $Action = "Proceed to 02-mvp-scope-contract.md with caution"
} elseif ($TotalScore -ge 350) {
    $Verdict = "CONDITIONAL"
    $VerdictColor = "Yellow"
    $Action = "Fix failing pillar(s) before proceeding"
} elseif ($TotalScore -ge 300) {
    $Verdict = "WEAK"
    $VerdictColor = "Yellow"
    $Action = "Pivot or enhance the idea"
} else {
    $Verdict = "KILL"
    $VerdictColor = "Red"
    $Action = "Move to _vault/killed/"
}

Write-Host "======================================================================" -ForegroundColor $VerdictColor
Write-Host "                      VERDICT: $Verdict" -ForegroundColor $VerdictColor
Write-Host "======================================================================" -ForegroundColor $VerdictColor
Write-Host ""
Write-Host "Action: $Action" -ForegroundColor $VerdictColor
Write-Host ""

# Create audit file
$Date = Get-Date -Format "yyyy-MM-dd"
$AINote = if ($UseAI -and $AISuggestions) { "`nai_assisted: true" } else { "" }
$AuditContent = @"
---
idea_slug: "$Slug"
audit_date: "$Date"
final_score: "$TotalScore/500"
verdict: "$Verdict"$AINote
---

# Idea Audit: $Slug

> **Verdict:** $Verdict | **Score:** $TotalScore/500 | **Date:** $Date

## Score Summary

| Pillar | Score | Minimum | Pass? |
|--------|-------|---------|-------|
| 1. Problem Evidence | $($P1.Score)/100 | 60 | $(if ($P1.Pass) { 'Yes' } else { 'No' }) |
| 2. Market Sizing | $($P2.Score)/100 | 50 | $(if ($P2.Pass) { 'Yes' } else { 'No' }) |
| 3. Competitive Landscape | $($P3.Score)/100 | 50 | $(if ($P3.Pass) { 'Yes' } else { 'No' }) |
| 4. Monetization Viability | $($P4.Score)/100 | 60 | $(if ($P4.Pass) { 'Yes' } else { 'No' }) |
| 5. Execution Risk | $($P5.Score)/100 | 50 | $(if ($P5.Pass) { 'Yes' } else { 'No' }) |
| **TOTAL** | **$TotalScore/500** | **350** | $(if ($TotalScore -ge 350 -and $AllPass) { 'Yes' } else { 'No' }) |

## Verdict: $Verdict

**Action:** $Action

---

## Research Notes

*Add your research evidence, competitor analysis, and supporting documentation here.*

---

*Audit completed using SOP 01a-rigorous-idea-audit.md$(if ($UseAI -and $AISuggestions) { ' with Claude AI assistance' } else { '' })*
"@

# Ensure audits directory exists
$AuditsDir = Join-Path $VaultPath "audits"
if (-not (Test-Path $AuditsDir)) {
    New-Item -ItemType Directory -Path $AuditsDir -Force | Out-Null
}

# Write audit file
Set-Content -Path $AuditPath -Value $AuditContent -Encoding UTF8
Write-Host "Audit saved: $AuditPath" -ForegroundColor Green
Write-Host ""

# Handle file movement
if ($Verdict -eq "KILL" -or $Verdict -eq "WEAK") {
    $MoveIt = Read-Host "Move idea to killed folder? (y/n)"
    if ($MoveIt -eq "y") {
        $KilledPath = Join-Path $VaultPath "killed\IDEA-$Slug.md"
        Move-Item -Path $IdeaPath -Destination $KilledPath -Force
        Write-Host "Moved to: $KilledPath" -ForegroundColor Yellow
    }
} elseif ($Verdict -eq "STRONG GO" -or $Verdict -eq "GO") {
    if ($IdeaPath -eq $IdeaBacklog) {
        $MoveIt = Read-Host "Move idea to active folder? (y/n)"
        if ($MoveIt -eq "y") {
            $ActivePath = Join-Path $VaultPath "active\IDEA-$Slug.md"
            Move-Item -Path $IdeaPath -Destination $ActivePath -Force
            Write-Host "Moved to: $ActivePath" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Audit complete. Next step: Fill in the research details in $AuditPath" -ForegroundColor Cyan
Write-Host ""
