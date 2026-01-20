# Simple Authentication Test with Standard Email

$API_URL = "http://localhost:3001/api"
$TEST_EMAIL = "testuser@gmail.com"  # Using standard email format
$TEST_PASSWORD = "password123456"   # Longer password
$TEST_NAME = "Test User"

Write-Host "Testing with standard email format..." -ForegroundColor Cyan
Write-Host "Email: $TEST_EMAIL" -ForegroundColor Gray
Write-Host ""

# Test Sign Up
try {
    $signupBody = @{
        email    = $TEST_EMAIL
        password = $TEST_PASSWORD
        fullName = $TEST_NAME
    } | ConvertTo-Json

    $signupResponse = Invoke-RestMethod -Uri "$API_URL/auth/signup" `
        -Method Post `
        -Body $signupBody `
        -ContentType "application/json"
    
    Write-Host "✅ Sign Up Successful!" -ForegroundColor Green
    Write-Host "Message: $($signupResponse.message)" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "❌ Sign Up Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.error)" -ForegroundColor Red
    }
}
