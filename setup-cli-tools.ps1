# CommCoach CLI Tools Setup
# This script installs Vercel and Railway CLI tools for seamless deployment

Write-Host "`n🚀 CommCoach CLI Tools Setup" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📥 Installing CLI Tools..." -ForegroundColor Yellow
Write-Host "This may take a few minutes...`n" -ForegroundColor Gray

# Install Vercel CLI
Write-Host "1️⃣ Installing Vercel CLI..." -ForegroundColor Cyan
try {
    npm install -g vercel 2>&1 | Out-Null
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI installed: v$vercelVersion" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Vercel CLI installation had issues (may already be installed)" -ForegroundColor Yellow
}

# Install Railway CLI
Write-Host "`n2️⃣ Installing Railway CLI..." -ForegroundColor Cyan
Write-Host "Note: Railway CLI requires manual download on Windows" -ForegroundColor Gray

# Check if Railway CLI is already installed
$railwayInstalled = $false
try {
    railway --version 2>&1 | Out-Null
    $railwayInstalled = $true
    Write-Host "✅ Railway CLI is already installed" -ForegroundColor Green
}
catch {
    Write-Host "Railway CLI not found. Installing via npm..." -ForegroundColor Yellow
    try {
        npm install -g @railway/cli 2>&1 | Out-Null
        Write-Host "✅ Railway CLI installed via npm" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Automated installation failed" -ForegroundColor Yellow
        Write-Host "`nTo install Railway CLI manually:" -ForegroundColor Yellow
        Write-Host "Visit: https://docs.railway.app/guides/cli#installation" -ForegroundColor White
    }
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "📊 Installation Summary" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check Vercel
try {
    $vercelCheck = vercel --version
    Write-Host "✅ Vercel CLI: Ready (v$vercelCheck)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Vercel CLI: Not available" -ForegroundColor Red
}

# Check Railway
try {
    railway --version 2>&1 | Out-Null
    Write-Host "✅ Railway CLI: Ready" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Railway CLI: Not available (optional)" -ForegroundColor Yellow
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Authenticate with Vercel: " -NoNewline -ForegroundColor White
Write-Host "vercel login" -ForegroundColor Yellow
Write-Host "2. Authenticate with Railway: " -NoNewline -ForegroundColor White
Write-Host "railway login" -ForegroundColor Yellow
Write-Host "3. Deploy frontend: " -NoNewline -ForegroundColor White
Write-Host "cd frontend && vercel" -ForegroundColor Yellow
Write-Host "4. Deploy backend: " -NoNewline -ForegroundColor White
Write-Host "cd backend && railway up" -ForegroundColor Yellow

Write-Host "`n✨ Setup complete!`n" -ForegroundColor Green
