# CommCoach GitHub Push Script
# Run this AFTER creating your repository on GitHub.com

Write-Host "`n🚀 CommCoach GitHub Push Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Get GitHub username
Write-Host "📝 Step 1: Enter your GitHub information" -ForegroundColor Yellow
$githubUsername = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ GitHub username is required!" -ForegroundColor Red
    exit 1
}

# Step 2: Construct repository URL
$repoUrl = "https://github.com/$githubUsername/commcoach-ai.git"
Write-Host "`n✅ Repository URL: $repoUrl" -ForegroundColor Green

# Step 3: Check if remote already exists
Write-Host "`n📡 Step 2: Checking remote configuration..." -ForegroundColor Yellow
$remoteExists = git remote | Select-String -Pattern "origin" -Quiet

if ($remoteExists) {
    Write-Host "⚠️  Remote 'origin' already exists. Updating URL..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
} else {
    Write-Host "✅ Adding remote 'origin'..." -ForegroundColor Green
    git remote add origin $repoUrl
}

# Step 4: Verify current branch
Write-Host "`n🌿 Step 3: Verifying branch..." -ForegroundColor Yellow
$currentBranch = git branch --show-current

if ($currentBranch -ne "main") {
    Write-Host "⚠️  Current branch is '$currentBranch'. Renaming to 'main'..." -ForegroundColor Yellow
    git branch -M main
} else {
    Write-Host "✅ Already on 'main' branch" -ForegroundColor Green
}

# Step 5: Show git status
Write-Host "`n📊 Step 4: Current repository status:" -ForegroundColor Yellow
git status --short

# Step 6: Push to GitHub
Write-Host "`n🚀 Step 5: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may take a moment..." -ForegroundColor Gray

try {
    git push -u origin main 2>&1 | Out-String | Write-Host
    
    Write-Host "`n✅ SUCCESS! Your code is now on GitHub!" -ForegroundColor Green
    Write-Host "`n🌐 View your repository at:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$githubUsername/commcoach-ai`n" -ForegroundColor White
    
    Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Deploy backend to Railway (https://railway.app)" -ForegroundColor White
    Write-Host "   2. Deploy frontend to Vercel (https://vercel.com)" -ForegroundColor White
    Write-Host "   3. See DEPLOYMENT.md for detailed instructions`n" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Error pushing to GitHub!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "`n💡 Possible solutions:" -ForegroundColor Yellow
    Write-Host "   1. Make sure you created the repository on GitHub.com" -ForegroundColor White
    Write-Host "   2. Verify your GitHub credentials" -ForegroundColor White
    Write-Host "   3. Check your internet connection`n" -ForegroundColor White
}
