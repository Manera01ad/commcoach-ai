# Complete Authentication Test

$API_URL = "http://localhost:3001/api"
$TEST_EMAIL = "testuser@gmail.com"
$TEST_PASSWORD = "password123456"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Sign In" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    $signinBody = @{
        email    = $TEST_EMAIL
        password = $TEST_PASSWORD
    } | ConvertTo-Json

    $signinResponse = Invoke-RestMethod -Uri "$API_URL/auth/signin" `
        -Method Post `
        -Body $signinBody `
        -ContentType "application/json"
    
    Write-Host "✅ Sign In Successful!" -ForegroundColor Green
    Write-Host "User Email: $($signinResponse.user.email)" -ForegroundColor Gray
    Write-Host "User Name: $($signinResponse.user.full_name)" -ForegroundColor Gray
    Write-Host "User Status: $($signinResponse.user.status)" -ForegroundColor Gray
    Write-Host "Access Token: $($signinResponse.session.access_token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ AUTHENTICATION WORKING!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    
}
catch {
    Write-Host "❌ Sign In Failed!" -ForegroundColor Red
    if ($_.ErrorDetails) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Error: $($errorDetails.error)" -ForegroundColor Red
    }
}
