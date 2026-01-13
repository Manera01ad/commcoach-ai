# CommCoach Quick Deploy Script
# Deploy frontend and/or backend with a single command

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("frontend", "backend", "both")]
    [string]$Target = "both",
    
    [Parameter(Mandatory = $false)]
    [switch]$Production = $false
)

Write-Host "`n🚀 CommCoach Quick Deploy" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan

$rootDir = $PSScriptRoot
$frontendDir = Join-Path $rootDir "frontend"
$backendDir = Join-Path $rootDir "backend"

# Function to deploy frontend
function Deploy-Frontend {
    Write-Host "📱 Deploying Frontend to Vercel..." -ForegroundColor Yellow
    
    if (-not (Test-Path $frontendDir)) {
        Write-Host "❌ Frontend directory not found!" -ForegroundColor Red
        return $false
    }
    
    Push-Location $frontendDir
    
    try {
        # Check if vercel is installed
        $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
        if (-not $vercelInstalled) {
            Write-Host "❌ Vercel CLI not installed!" -ForegroundColor Red
            Write-Host "Run: npm install -g vercel" -ForegroundColor Yellow
            Pop-Location
            return $false
        }
        
        # Check if project is linked
        if (-not (Test-Path ".vercel")) {
            Write-Host "⚠️  Project not linked to Vercel. Linking now..." -ForegroundColor Yellow
            vercel
        }
        
        # Deploy
        if ($Production) {
            Write-Host "🚀 Deploying to production..." -ForegroundColor Green
            vercel --prod
        }
        else {
            Write-Host "🚀 Deploying to preview..." -ForegroundColor Green
            vercel
        }
        
        Write-Host "✅ Frontend deployment complete!" -ForegroundColor Green
        Pop-Location
        return $true
        
    }
    catch {
        Write-Host "❌ Frontend deployment failed: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Function to deploy backend
function Deploy-Backend {
    Write-Host "⚙️  Deploying Backend to Railway..." -ForegroundColor Yellow
    
    if (-not (Test-Path $backendDir)) {
        Write-Host "❌ Backend directory not found!" -ForegroundColor Red
        return $false
    }
    
    Push-Location $backendDir
    
    try {
        # Check if railway is installed
        $railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
        if (-not $railwayInstalled) {
            Write-Host "❌ Railway CLI not installed!" -ForegroundColor Red
            Write-Host "Visit: https://docs.railway.app/guides/cli#installation" -ForegroundColor Yellow
            Pop-Location
            return $false
        }
        
        # Check if project is linked
        Write-Host "🔗 Checking Railway project link..." -ForegroundColor Gray
        
        # Deploy
        Write-Host "🚀 Deploying to Railway..." -ForegroundColor Green
        railway up
        
        Write-Host "✅ Backend deployment complete!" -ForegroundColor Green
        Pop-Location
        return $true
        
    }
    catch {
        Write-Host "❌ Backend deployment failed: $_" -ForegroundColor Red
        Pop-Location
        return $false
    }
}

# Main deployment logic
$success = $true

if ($Target -eq "frontend" -or $Target -eq "both") {
    if (-not (Deploy-Frontend)) {
        $success = $false
    }
    Write-Host ""
}

if ($Target -eq "backend" -or $Target -eq "both") {
    if (-not (Deploy-Backend)) {
        $success = $false
    }
    Write-Host ""
}

# Summary
Write-Host "================================" -ForegroundColor Cyan
if ($success) {
    Write-Host "✅ Deployment Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your app should be live now!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Check deployment status:" -ForegroundColor Yellow
    Write-Host "  Vercel:  vercel ls" -ForegroundColor White
    Write-Host "  Railway: railway status" -ForegroundColor White
}
else {
    Write-Host "❌ Deployment had errors!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Ensure CLI tools are installed (run setup-cli-tools.ps1)" -ForegroundColor White
    Write-Host "  2. Authenticate: vercel login && railway login" -ForegroundColor White
    Write-Host "  3. Link projects: vercel link (in frontend/) && railway link (in backend/)" -ForegroundColor White
}
Write-Host "================================`n" -ForegroundColor Cyan
