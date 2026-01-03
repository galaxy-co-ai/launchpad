# provision-db.ps1
# Provisions a Neon database for a project

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

Write-Info "🗄️  Database Provisioning for: $Project"
Write-Info ""

# Check for Neon CLI
$neonInstalled = Get-Command neonctl -ErrorAction SilentlyContinue
if (-not $neonInstalled) {
    Write-Warn "⚠️  Neon CLI not found"
    Write-Info ""
    Write-Info "Install Neon CLI:"
    Write-Info "  npm install -g neonctl"
    Write-Info ""
    Write-Info "Or provision manually at: https://console.neon.tech"
    Write-Info ""
    
    $manual = Read-Host "Skip automatic provisioning and enter connection string manually? (y/n)"
    if ($manual -eq "y") {
        Write-Info ""
        Write-Info "Manual setup:"
        Write-Info "  1. Go to https://console.neon.tech"
        Write-Info "  2. Create new project: $Project-db"
        Write-Info "  3. Copy the connection string (pooled)"
        Write-Info "  4. Run: .\_scripts\setup-env.ps1 -project `"$Project`""
        Write-Info ""
        exit 0
    }
    exit 1
}

# Check if user is authenticated with Neon
Write-Info "Checking Neon authentication..."
$authCheck = neonctl me 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warn "⚠️  Not authenticated with Neon"
    Write-Info ""
    Write-Info "Authenticate with Neon:"
    Write-Info "  neonctl auth"
    Write-Info ""
    exit 1
}

Write-Success "✅ Authenticated with Neon"
Write-Info ""

# Get user confirmation
$dbName = "$Project-db"
Write-Info "Database name: $dbName"
Write-Info "Region: us-east-2 (default)"
Write-Info ""

$confirm = Read-Host "Create database? (y/n)"
if ($confirm -ne "y") {
    Write-Info "Cancelled"
    exit 0
}

Write-Info ""
Write-Info "Creating Neon project..."
Write-Info ""

# Create Neon project
try {
    $output = neonctl projects create --name $dbName --region us-east-2 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "❌ Failed to create Neon project"
        Write-Error $output
        exit 1
    }
    
    # Extract project ID from output
    $projectId = $output | Select-String -Pattern 'Created project ([a-z0-9-]+)' | ForEach-Object { $_.Matches.Groups[1].Value }
    
    if (-not $projectId) {
        Write-Warn "⚠️  Could not extract project ID automatically"
        Write-Info ""
        Write-Info "Get connection string manually:"
        Write-Info "  1. Go to https://console.neon.tech"
        Write-Info "  2. Find project: $dbName"
        Write-Info "  3. Copy connection string (pooled)"
        Write-Info "  4. Run: .\_scripts\setup-env.ps1 -project `"$Project`""
        Write-Info ""
        exit 0
    }
    
    Write-Success "✅ Database created"
    Write-Info "   Project ID: $projectId"
    Write-Info ""
    
    # Get connection string
    Write-Info "Fetching connection string..."
    $connectionOutput = neonctl connection-string --project-id $projectId --pooled 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "⚠️  Could not fetch connection string automatically"
        Write-Info ""
        Write-Info "Get connection string manually:"
        Write-Info "  1. Go to https://console.neon.tech/app/projects/$projectId"
        Write-Info "  2. Copy connection string (pooled)"
        Write-Info "  3. Run: .\_scripts\setup-env.ps1 -project `"$Project`""
        Write-Info ""
        exit 0
    }
    
    $connectionString = $connectionOutput.Trim()
    
    Write-Success "✅ Connection string retrieved"
    Write-Info ""
    
    # Update .env.local if it exists
    if (Test-Path $EnvPath) {
        Write-Info "Updating .env.local..."
        $envContent = Get-Content $EnvPath -Raw
        $envContent = $envContent -replace 'DATABASE_URL=""', "DATABASE_URL=`"$connectionString`""
        Set-Content -Path $EnvPath -Value $envContent
        Write-Success "✅ .env.local updated"
    } else {
        Write-Warn "⚠️  .env.local not found"
        Write-Info ""
        Write-Info "Add to .env.local manually:"
        Write-Info "  DATABASE_URL=`"$connectionString`""
        Write-Info ""
        Write-Info "Or run:"
        Write-Info "  .\_scripts\setup-env.ps1 -project `"$Project`""
    }
    
    Write-Success ""
    Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Success "  DATABASE READY"
    Write-Success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Success ""
    Write-Info "Next steps:"
    Write-Info "  1. cd projects\$Project"
    Write-Info "  2. pnpm drizzle-kit generate"
    Write-Info "  3. pnpm drizzle-kit push"
    Write-Success ""
    
} catch {
    Write-Error "❌ Error creating database: $_"
    exit 1
}

