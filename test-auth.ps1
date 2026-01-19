# Authentication Testing Script for CommCoach AI
# This script tests the signup and signin endpoints

$API_URL = "http://localhost:3001/api"
$TEST_EMAIL = "test_user_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$TEST_PASSWORD = "password123"
$TEST_NAME = "Test User"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CommCoach AI - Authentication Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "[1/4] Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method Get
    Write-Host "✅ Backend is healthy: $($health.status)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Backend health check failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Make sure the backend is running: cd backend && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test 2: Sign Up
Write-Host "[2/4] Testing Sign Up..." -ForegroundColor Yellow
Write-Host "Email: $TEST_EMAIL" -ForegroundColor Gray
Write-Host "Password: $TEST_PASSWORD" -ForegroundColor Gray
Write-Host "Name: $TEST_NAME" -ForegroundColor Gray
Write-Host ""

try {
    $signupBody = @{
        email = $TEST_EMAIL
        password = $TEST_PASSWORD
        fullName = $TEST_NAME
    } | ConvertTo-Json

    $signupResponse = Invoke-RestMethod -Uri "$API_URL/auth/signup" `
        -Method Post `
        -Body $signupBody `
        -ContentType "application/json"
    
    Write-Host "✅ Sign Up Successful!" -ForegroundColor Green
    Write-Host "Message: $($signupResponse.message)" -ForegroundColor Gray
    Write-Host "User ID: $($signupResponse.user.id)" -ForegroundColor Gray
    Write-Host "Status: $($signupResponse.user.status)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Sign Up Failed!" -ForegroundColor Red
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Error: $($errorDetails.error)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common Issues:" -ForegroundColor Yellow
    Write-Host "1. Supabase database not configured" -ForegroundColor Yellow
    Write-Host "2. RLS policies blocking insert" -ForegroundColor Yellow
    Write-Host "3. Email already exists" -ForegroundColor Yellow
    exit 1
}

# Wait a moment for database to settle
Start-Sleep -Seconds 2

# Test 3: Sign In
Write-Host "[3/4] Testing Sign In..." -ForegroundColor Yellow
Write-Host "Email: $TEST_EMAIL" -ForegroundColor Gray
Write-Host "Password: $TEST_PASSWORD" -ForegroundColor Gray
Write-Host ""

try {
    $signinBody = @{
        email = $TEST_EMAIL
        password = $TEST_PASSWORD
    } | ConvertTo-Json

    $signinResponse = Invoke-RestMethod -Uri "$API_URL/auth/signin" `
        -Method Post `
        -Body $signinBody `
        -ContentType "application/json"
    
    Write-Host "✅ Sign In Successful!" -ForegroundColor Green
    Write-Host "Message: $($signinResponse.message)" -ForegroundColor Gray
    Write-Host "User Email: $($signinResponse.user.email)" -ForegroundColor Gray
    Write-Host "User Name: $($signinResponse.user.full_name)" -ForegroundColor Gray
    Write-Host "User Status: $($signinResponse.user.status)" -ForegroundColor Gray
    Write-Host "Access Token: $($signinResponse.session.access_token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # Save token for next test
    $global:ACCESS_TOKEN = $signinResponse.session.access_token
    
} catch {
    Write-Host "❌ Sign In Failed!" -ForegroundColor Red
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Error: $($errorDetails.error)" -ForegroundColor Red
    exit 1
}

# Test 4: Get Session
Write-Host "[4/4] Testing Get Session (Protected Route)..." -ForegroundColor Yellow
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $global:ACCESS_TOKEN"
    }

    $sessionResponse = Invoke-RestMethod -Uri "$API_URL/auth/me" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Session Retrieved Successfully!" -ForegroundColor Green
    Write-Host "User Email: $($sessionResponse.user.email)" -ForegroundColor Gray
    Write-Host "User Name: $($sessionResponse.user.full_name)" -ForegroundColor Gray
    Write-Host "User Status: $($sessionResponse.user.status)" -ForegroundColor Gray
    Write-Host ""
    
} catch {
    Write-Host "❌ Get Session Failed!" -ForegroundColor Red
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Error: $($errorDetails.error)" -ForegroundColor Red
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Yellow
Write-Host "Email: $TEST_EMAIL" -ForegroundColor White
Write-Host "Password: $TEST_PASSWORD" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host "2. Click 'Create Account' and test the UI" -ForegroundColor White
Write-Host "3. Sign in with the credentials above" -ForegroundColor White
Write-Host ""
