# Quick Start Script for CommCoach AI
# This script helps you verify the secure setup

Write-Host "CommCoach AI - Security Verification Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist
Write-Host "Checking Environment Files..." -ForegroundColor Yellow
Write-Host ""

$backendEnv = Test-Path "backend\.env"
$frontendEnv = Test-Path "frontend\.env.local"

if ($backendEnv) {
    Write-Host "[OK] backend\.env exists" -ForegroundColor Green
}
else {
    Write-Host "[MISSING] backend\.env NOT FOUND" -ForegroundColor Red
    Write-Host "   Create it from backend\.env.example" -ForegroundColor Yellow
}

if ($frontendEnv) {
    Write-Host "[OK] frontend\.env.local exists" -ForegroundColor Green
}
else {
    Write-Host "[MISSING] frontend\.env.local NOT FOUND" -ForegroundColor Red
    Write-Host "   Create it from frontend\.env.example" -ForegroundColor Yellow
}

Write-Host ""

# Check for API key in backend .env
if ($backendEnv) {
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "GEMINI_API_KEY=YOUR_ACTUAL_KEY_HERE" -or $envContent -match "GEMINI_API_KEY=$" -or $envContent -notmatch "GEMINI_API_KEY=") {
        Write-Host "[WARNING] GEMINI_API_KEY not configured in backend\.env" -ForegroundColor Yellow
        Write-Host "   Please add your actual API key" -ForegroundColor Yellow
    }
    else {
        Write-Host "[OK] GEMINI_API_KEY is configured" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit backend\.env and add your Gemini API key" -ForegroundColor White
Write-Host "   Get it from: https://aistudio.google.com/app/apikey" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Open TWO terminals and run:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm install" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm install" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
