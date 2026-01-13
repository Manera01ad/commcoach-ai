# Test multiple communication scenarios
Write-Host "`n🧪 ANTIGRAVITY ANALYSIS - Multiple Scenarios Test`n" -ForegroundColor Cyan

# Scenario 1: Public Speaking Anxiety
Write-Host "Test 1: Senior Product Manager - Public Speaking Anxiety" -ForegroundColor Yellow
$transcriptData = Get-Content test-transcript.json -Raw | ConvertFrom-Json
$test1Body = @{
    userId     = $transcriptData.userId
    timestamp  = $transcriptData.timestamp
    transcript = $transcriptData.transcript
} | ConvertTo-Json -Depth 10

$result1 = Invoke-RestMethod -Uri "http://localhost:3001/api/antigravity/analyze-session" -Method Post -ContentType "application/json" -Body $test1Body
Write-Host "  ✓ Skill Focus: $($result1.skillFocus)" -ForegroundColor Green
Write-Host "  ✓ Confidence: $($result1.confidenceLevel)/5" -ForegroundColor Green
Write-Host "  ✓ Practice Time: $($result1.practiceTime)`n" -ForegroundColor Green

# Scenario 2: Clarity and Brevity
Write-Host "Test 2: Sales Executive - Clarity and Brevity Issues" -ForegroundColor Yellow
$transcript2 = "COACH: John, what brings you here today?`n`nJOHN: Well, my manager says my client presentations are too long. I tend to go into a lot of detail. My close rate has dropped from 40% to 25% in the last quarter. She says I'm explaining when I should be persuading."
$test2Body = @{
    userId     = "user_john_456"
    timestamp  = "2026-01-12T02:00:00Z"
    transcript = $transcript2
} | ConvertTo-Json

$result2 = Invoke-RestMethod -Uri "http://localhost:3001/api/antigravity/analyze-session" -Method Post -ContentType "application/json" -Body $test2Body
Write-Host "  ✓ Skill Focus: $($result2.skillFocus)" -ForegroundColor Green
Write-Host "  ✓ Confidence: $($result2.confidenceLevel)/5" -ForegroundColor Green
Write-Host "  ✓ Practice Time: $($result2.practiceTime)`n" -ForegroundColor Green

# Scenario 3: Emotional Intelligence
Write-Host "Test 3: Engineering Manager - Emotional Intelligence" -ForegroundColor Yellow
$transcript3 = "COACH: Alex, tell me about your 360 review.`n`nALEX: My team says I'm too direct. I'm an engineering manager, we need to be efficient. But I've had three people leave in six months saying they're looking for better culture. HR says I need to work on emotional intelligence or I won't get promoted."
$test3Body = @{
    userId     = "user_alex_789"
    timestamp  = "2026-01-12T02:05:00Z"
    transcript = $transcript3
} | ConvertTo-Json

$result3 = Invoke-RestMethod -Uri "http://localhost:3001/api/antigravity/analyze-session" -Method Post -ContentType "application/json" -Body $test3Body
Write-Host "  ✓ Skill Focus: $($result3.skillFocus)" -ForegroundColor Green
Write-Host "  ✓ Confidence: $($result3.confidenceLevel)/5" -ForegroundColor Green
Write-Host "  ✓ Practice Time: $($result3.practiceTime)`n" -ForegroundColor Green

# Summary
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ All scenarios analyzed successfully!" -ForegroundColor Green
Write-Host "======================================`n" -ForegroundColor Cyan

# Show detailed comparison
Write-Host "COMPARISON SUMMARY:`n" -ForegroundColor Cyan

$comparison = @(
    [PSCustomObject]@{
        Scenario     = "Public Speaking"
        User         = "Sarah (PM)"
        SkillFocus   = $result1.skillFocus
        Confidence   = "$($result1.confidenceLevel)/5"
        PracticeTime = $result1.practiceTime
    },
    [PSCustomObject]@{
        Scenario     = "Clarity/Brevity"
        User         = "John (Sales)"
        SkillFocus   = $result2.skillFocus
        Confidence   = "$($result2.confidenceLevel)/5"
        PracticeTime = $result2.practiceTime
    },
    [PSCustomObject]@{
        Scenario     = "Emotional Intelligence"
        User         = "Alex (Eng Mgr)"
        SkillFocus   = $result3.skillFocus
        Confidence   = "$($result3.confidenceLevel)/5"
        PracticeTime = $result3.practiceTime
    }
)

$comparison | Format-Table -AutoSize
