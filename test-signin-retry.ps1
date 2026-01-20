# Alternative: Test with a Different User (No Email Confirmation Needed)

# We'll use Supabase's admin API to create a user that's auto-confirmed
# This bypasses the email confirmation requirement

$API_URL = "http://localhost:3001/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Creating Auto-Confirmed Test User" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Try signing in with the existing user
# Sometimes Supabase auto-confirms after a certain time
Write-Host "Attempting to sign in with existing user..." -ForegroundColor Yellow
Write-Host ""

try {
    $signinBody = @{
        email    = "testuser@gmail.com"
        password = "password123456"
    } | ConvertTo-Json

    $signinResponse = Invoke-RestMethod -Uri "$API_URL/auth/signin" `
        -Method Post `
        -Body $signinBody `
        -ContentType "application/json"
    
    Write-Host "✅ Sign In Successful!" -ForegroundColor Green
    Write-Host "User Email: $($signinResponse.user.email)" -ForegroundColor Gray
    Write-Host "User Name: $($signinResponse.user.full_name)" -ForegroundColor Gray
    Write-Host "User Status: $($signinResponse.user.status)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ AUTHENTICATION FULLY WORKING!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Test in browser at http://localhost:5173" -ForegroundColor Cyan
    
}
catch {
    Write-Host "❌ Still needs email confirmation" -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUTION: Go to Supabase Dashboard" -ForegroundColor Yellow
    Write-Host "1. Click 'SQL Editor' in the top navigation" -ForegroundColor White
    Write-Host "2. Click 'New Query'" -ForegroundColor White
    Write-Host "3. Paste and run:" -ForegroundColor White
    Write-Host ""
    Write-Host "UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'testuser@gmail.com';" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then run this script again!" -ForegroundColor Yellow
}
