# =====================================================
# SaaS Metrics Schema Deployment Script
# =====================================================
# This script helps deploy the SaaS metrics schema to Supabase

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SaaS Metrics Schema Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file with your Supabase credentials" -ForegroundColor Yellow
    exit 1
}

# Read environment variables
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "ERROR: Supabase credentials not found in .env file!" -ForegroundColor Red
    Write-Host "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Supabase credentials loaded" -ForegroundColor Green
Write-Host "  URL: $supabaseUrl" -ForegroundColor Gray
Write-Host ""

# Check if schema file exists
$schemaFile = Join-Path (Split-Path $PSScriptRoot -Parent) "database\saas_metrics_schema.sql"
if (-not (Test-Path $schemaFile)) {
    Write-Host "ERROR: Schema file not found at: $schemaFile" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Schema file found" -ForegroundColor Green
Write-Host "  Path: $schemaFile" -ForegroundColor Gray
Write-Host ""

# Display deployment options
Write-Host "Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Open Supabase SQL Editor (Manual)" -ForegroundColor White
Write-Host "2. View Schema File" -ForegroundColor White
Write-Host "3. Copy Schema to Clipboard" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select an option (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Opening Supabase SQL Editor..." -ForegroundColor Yellow
        
        # Extract project ID from URL
        if ($supabaseUrl -match 'https://([^.]+)\.supabase\.co') {
            $projectId = $matches[1]
            $sqlEditorUrl = "https://supabase.com/dashboard/project/$projectId/sql/new"
            
            Write-Host "✓ Opening browser..." -ForegroundColor Green
            Start-Process $sqlEditorUrl
            
            Write-Host ""
            Write-Host "NEXT STEPS:" -ForegroundColor Cyan
            Write-Host "1. The SQL Editor should open in your browser" -ForegroundColor White
            Write-Host "2. Copy the contents of: $schemaFile" -ForegroundColor White
            Write-Host "3. Paste into the SQL Editor" -ForegroundColor White
            Write-Host "4. Click 'Run' to execute the schema" -ForegroundColor White
        } else {
            Write-Host "ERROR: Could not extract project ID from Supabase URL" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "Opening schema file..." -ForegroundColor Yellow
        Start-Process "notepad.exe" -ArgumentList $schemaFile
    }
    
    "3" {
        Write-Host ""
        Write-Host "Copying schema to clipboard..." -ForegroundColor Yellow
        
        $schemaContent = Get-Content $schemaFile -Raw
        Set-Clipboard -Value $schemaContent
        
        Write-Host "✓ Schema copied to clipboard!" -ForegroundColor Green
        Write-Host ""
        Write-Host "NEXT STEPS:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://supabase.com/dashboard" -ForegroundColor White
        Write-Host "2. Select your project" -ForegroundColor White
        Write-Host "3. Navigate to SQL Editor" -ForegroundColor White
        Write-Host "4. Create a new query" -ForegroundColor White
        Write-Host "5. Paste (Ctrl+V) and Run" -ForegroundColor White
    }
    
    "4" {
        Write-Host "Exiting..." -ForegroundColor Gray
        exit 0
    }
    
    default {
        Write-Host "Invalid option selected" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "For more information, see:" -ForegroundColor White
Write-Host "  SAAS_INTEGRATION_GUIDE.md" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
