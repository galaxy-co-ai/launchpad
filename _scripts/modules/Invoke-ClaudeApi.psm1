<#
.SYNOPSIS
    Claude API integration module for Launchpad PowerShell scripts

.DESCRIPTION
    Provides functions for calling the Claude API from PowerShell scripts:
    - Test-ClaudeApiKey: Validates API key format
    - Get-PromptTemplate: Loads prompt templates from _agents/prompts/
    - Invoke-ClaudeMessage: Sends messages to Claude API

.NOTES
    Author: Launchpad System
    Version: 1.0.0
    Requires: PowerShell 7.0+
#>

# Module-level variables
$script:LaunchpadRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$script:PromptsDir = Join-Path $script:LaunchpadRoot "_agents\prompts"

<#
.SYNOPSIS
    Validates Claude API key format

.PARAMETER ApiKey
    The API key to validate. Defaults to $env:ANTHROPIC_API_KEY

.OUTPUTS
    Boolean indicating if key appears valid

.EXAMPLE
    if (Test-ClaudeApiKey) { Write-Host "API key is set" }
#>
function Test-ClaudeApiKey {
    param(
        [string]$ApiKey = $env:ANTHROPIC_API_KEY
    )

    if ([string]::IsNullOrWhiteSpace($ApiKey)) {
        return $false
    }

    # Anthropic API keys start with "sk-ant-"
    if ($ApiKey -match "^sk-ant-[a-zA-Z0-9-_]+$") {
        return $true
    }

    return $false
}

<#
.SYNOPSIS
    Loads a prompt template from _agents/prompts/

.PARAMETER TemplateName
    Name of the template file (without .md extension)

.PARAMETER Variables
    Hashtable of variables to substitute in the template

.OUTPUTS
    Hashtable with SystemPrompt and UserMessage keys

.EXAMPLE
    $prompt = Get-PromptTemplate -TemplateName "audit-scoring" -Variables @{
        IDEA_CONTENT = $ideaContent
    }
#>
function Get-PromptTemplate {
    param(
        [Parameter(Mandatory=$true)]
        [string]$TemplateName,

        [hashtable]$Variables = @{}
    )

    $TemplatePath = Join-Path $script:PromptsDir "$TemplateName.md"

    if (-not (Test-Path $TemplatePath)) {
        throw "Prompt template not found: $TemplatePath"
    }

    $Content = Get-Content $TemplatePath -Raw

    # Parse template sections
    # Format:
    # ---
    # frontmatter
    # ---
    # # System Prompt
    # ...
    # # User Message Template
    # ...

    $SystemPrompt = ""
    $UserMessage = ""

    # Remove frontmatter
    if ($Content -match "^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+") {
        $Content = $Content -replace "^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+", ""
    }

    # Split into system and user sections
    if ($Content -match "# System Prompt[\r\n]+([\s\S]*?)# User Message Template[\r\n]+([\s\S]*)$") {
        $SystemPrompt = $Matches[1].Trim()
        $UserMessage = $Matches[2].Trim()
    } else {
        # If no sections found, treat entire content as system prompt
        $SystemPrompt = $Content.Trim()
    }

    # Substitute variables ({{VAR_NAME}} format)
    foreach ($key in $Variables.Keys) {
        $pattern = "\{\{$key\}\}"
        $SystemPrompt = $SystemPrompt -replace $pattern, $Variables[$key]
        $UserMessage = $UserMessage -replace $pattern, $Variables[$key]
    }

    return @{
        SystemPrompt = $SystemPrompt
        UserMessage = $UserMessage
    }
}

<#
.SYNOPSIS
    Sends a message to Claude API and returns the response

.PARAMETER SystemPrompt
    The system prompt to use

.PARAMETER UserMessage
    The user message to send

.PARAMETER Model
    Claude model to use (default: claude-sonnet-4-20250514)

.PARAMETER MaxTokens
    Maximum tokens in response (default: 4096)

.PARAMETER ApiKey
    API key to use. Defaults to $env:ANTHROPIC_API_KEY

.OUTPUTS
    String containing Claude's response

.EXAMPLE
    $response = Invoke-ClaudeMessage -SystemPrompt "You are a helpful assistant" -UserMessage "Hello"
#>
function Invoke-ClaudeMessage {
    param(
        [Parameter(Mandatory=$true)]
        [string]$SystemPrompt,

        [Parameter(Mandatory=$true)]
        [string]$UserMessage,

        [string]$Model = "claude-sonnet-4-20250514",

        [int]$MaxTokens = 4096,

        [string]$ApiKey = $env:ANTHROPIC_API_KEY
    )

    if (-not (Test-ClaudeApiKey -ApiKey $ApiKey)) {
        throw "Invalid or missing ANTHROPIC_API_KEY"
    }

    $Headers = @{
        "x-api-key" = $ApiKey
        "anthropic-version" = "2023-06-01"
        "content-type" = "application/json"
    }

    $Body = @{
        model = $Model
        max_tokens = $MaxTokens
        system = $SystemPrompt
        messages = @(
            @{
                role = "user"
                content = $UserMessage
            }
        )
    } | ConvertTo-Json -Depth 10

    try {
        $Response = Invoke-RestMethod `
            -Uri "https://api.anthropic.com/v1/messages" `
            -Method POST `
            -Headers $Headers `
            -Body $Body `
            -TimeoutSec 120

        # Extract text content from response
        if ($Response.content -and $Response.content.Count -gt 0) {
            $TextContent = $Response.content | Where-Object { $_.type -eq "text" } | Select-Object -First 1
            if ($TextContent) {
                return $TextContent.text
            }
        }

        throw "No text content in response"
    }
    catch {
        $ErrorMessage = $_.Exception.Message

        # Try to parse API error response
        if ($_.ErrorDetails.Message) {
            try {
                $ErrorBody = $_.ErrorDetails.Message | ConvertFrom-Json
                if ($ErrorBody.error.message) {
                    $ErrorMessage = $ErrorBody.error.message
                }
            }
            catch {
                # Ignore JSON parse errors
            }
        }

        throw "Claude API error: $ErrorMessage"
    }
}

<#
.SYNOPSIS
    Gets Claude AI status for display in scripts

.OUTPUTS
    Hashtable with Available (bool) and Message (string)

.EXAMPLE
    $status = Get-ClaudeStatus
    Write-Host $status.Message -ForegroundColor $(if ($status.Available) { "Green" } else { "Gray" })
#>
function Get-ClaudeStatus {
    $Available = Test-ClaudeApiKey

    if ($Available) {
        return @{
            Available = $true
            Message = "Claude AI assistance: ENABLED"
        }
    }
    elseif ($env:ANTHROPIC_API_KEY) {
        return @{
            Available = $false
            Message = "Claude AI assistance: DISABLED (invalid API key format)"
        }
    }
    else {
        return @{
            Available = $false
            Message = "Claude AI assistance: DISABLED (no ANTHROPIC_API_KEY)"
        }
    }
}

# Export functions
Export-ModuleMember -Function @(
    'Test-ClaudeApiKey',
    'Get-PromptTemplate',
    'Invoke-ClaudeMessage',
    'Get-ClaudeStatus'
)
