# CommCoach - GitHub Push Setup Guide

Write-Host "`n🚀 Setting up GitHub for CommCoach Backend`n" -ForegroundColor Cyan

# Step 1: Configure Git (if not already done)
Write-Host "Step 1: Configure Git Identity" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Write-Host "Please enter your GitHub details:`n"

$name = Read-Host "Your Name"
$email = Read-Host "Your Email"

git config --global user.name "$name"
git config --global user.email "$email"

Write-Host "`n✅ Git configured with:" -ForegroundColor Green
Write-Host "   Name: $name"
Write-Host "   Email: $email`n"

# Step 2: Verify staging
Write-Host "Step 2: Verify Files to Commit" -ForegroundColor Yellow
Write-Host "----------------------------------------"
git status
Write-Host ""

# Step 3: Commit
Write-Host "Step 3: Create Initial Commit" -ForegroundColor Yellow
Write-Host "----------------------------------------"
$commitMsg = @"
feat: Initial CommCoach backend implementation with Gemini AI integration

- Complete Express server with CORS and middleware
- Antigravity analysis endpoint for transcript processing  
- Gemini AI proxy endpoints for secure API key handling
- Comprehensive documentation and setup guides
- Test scripts for all endpoints
- Environment configuration with .env.example template
"@

git commit -m $commitMsg
Write-Host "`n✅ Initial commit created!`n" -ForegroundColor Green

# Step 4: GitHub Repository
Write-Host "Step 4: Connect to GitHub Repository" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Write-Host "Do you already have a GitHub repository created? (Y/N)" -ForegroundColor Cyan
$hasRepo = Read-Host

if ($hasRepo -eq "Y" -or $hasRepo -eq "y") {
    Write-Host "`nEnter your GitHub repository URL:"
    Write-Host "(Example: https://github.com/yourusername/commcoach.git)" -ForegroundColor Gray
    $repoUrl = Read-Host "Repository URL"
    
    git remote add origin $repoUrl
    Write-Host "`n✅ Remote repository added!`n" -ForegroundColor Green
    
    Write-Host "Step 5: Push to GitHub" -ForegroundColor Yellow
    Write-Host "----------------------------------------"
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    Write-Host "`n✅ Successfully pushed to GitHub!`n" -ForegroundColor Green
    Write-Host "View your repository at:" -ForegroundColor Cyan
    Write-Host $repoUrl.Replace(".git", "") -ForegroundColor Yellow
}
else {
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com/new"
    Write-Host "2. Create a new repository (e.g., 'commcoach')"
    Write-Host "3. Do NOT initialize with README (we already have one)"
    Write-Host "4. Copy the repository URL"
    Write-Host "5. Run these commands:`n"
    Write-Host "   git remote add origin YOUR_REPO_URL" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "`n✅ Setup Complete!`n" -ForegroundColor Green
