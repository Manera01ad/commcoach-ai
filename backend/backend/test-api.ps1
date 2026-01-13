# CommCoach Backend API Test Script
# Run this script to test all endpoints

Write-Host "`n🧪 Testing CommCoach Backend API" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
Write-Host "GET $baseUrl/health`n" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✓ Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host "`n================================`n"

# Test 2: API Root
Write-Host "Test 2: API Root" -ForegroundColor Yellow
Write-Host "GET $baseUrl/api`n" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api" -Method Get
    Write-Host "✓ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host "`n================================`n"

# Test 3: Antigravity Test Endpoint
Write-Host "Test 3: Antigravity Test" -ForegroundColor Yellow
Write-Host "GET $baseUrl/api/antigravity/test`n" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/antigravity/test" -Method Get
    Write-Host "✓ Response:" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host "`n================================`n"

# Test 4: Gemini Models
Write-Host "Test 4: Gemini Models" -ForegroundColor Yellow
Write-Host "GET $baseUrl/api/gemini/models`n" -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/gemini/models" -Method Get
    Write-Host "✓ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}

Write-Host "`n================================`n"

# Test 5: Gemini Generate (requires API key)
Write-Host "Test 5: Gemini Generate" -ForegroundColor Yellow
Write-Host "POST $baseUrl/api/gemini/generate`n" -ForegroundColor Gray
$body = @{
    model = "gemini-2.0-flash-exp"
    prompt = "Say hello in a professional manner"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/gemini/generate" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    Write-Host "Note: This requires a valid GEMINI_API_KEY in .env file" -ForegroundColor Yellow
}

Write-Host "`n================================`n"

# Test 6: Antigravity Analysis (requires API key)
Write-Host "Test 6: Antigravity Analysis" -ForegroundColor Yellow
Write-Host "POST $baseUrl/api/antigravity/analyze-session`n" -ForegroundColor Gray
$body = @{
    userId = "test_user_1"
    timestamp = "2025-01-12T00:00:00Z"
    transcript = "USER: I struggle with public speaking. I get nervous.`nCOACH: Tell me more about when this happens.`nUSER: Mainly in meetings with executives. I feel like I am not good enough."
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/antigravity/analyze-session" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    Write-Host "Note: This requires a valid GEMINI_API_KEY in .env file" -ForegroundColor Yellow
}

Write-Host "`n================================`n"
Write-Host "✅ Testing Complete!" -ForegroundColor Green
Write-Host "`nNote: Tests 5 and 6 require a valid GEMINI_API_KEY in your .env file`n" -ForegroundColor Yellow
