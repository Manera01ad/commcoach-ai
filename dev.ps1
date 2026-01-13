
Write-Host "🚀 Starting CommCoach AI (Frontend + Backend)..." -ForegroundColor Cyan

# Start Backend
Write-Host "Starting Backend on Port 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command cd backend; npm run dev"

# Start Frontend
Write-Host "Starting Frontend on Port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command cd frontend; npm run dev"

Write-Host "✅ Application starting! Check the new windows." -ForegroundColor Yellow
