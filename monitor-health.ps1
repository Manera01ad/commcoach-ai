# CommCoach Deployment Health Monitor
# Checks the health status of deployed frontend and backend

param(
    [Parameter(Mandatory = $false)]
    [string]$FrontendUrl = "",
    
    [Parameter(Mandatory = $false)]
    [string]$BackendUrl = "",
    
    [Parameter(Mandatory = $false)]
    [switch]$Watch = $false,
    
    [Parameter(Mandatory = $false)]
    [int]$WatchInterval = 30
)

Write-Host "`n💚 CommCoach Health Monitor" -ForegroundColor Cyan
Write-Host "===========================`n" -ForegroundColor Cyan

# Function to check URL health
function Test-UrlHealth {
    param(
        [string]$Url,
        [string]$Name
    )
    
    Write-Host "🔍 Checking $Name..." -ForegroundColor Yellow -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 10 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-Host " ✅ Healthy" -ForegroundColor Green
            
            # Try to parse JSON if it's the health endpoint
            if ($Url -like "*/health") {
                try {
                    $json = $response.Content | ConvertFrom-Json
                    Write-Host "   Status: $($json.status)" -ForegroundColor Gray
                    Write-Host "   Uptime: $([math]::Round($json.uptime, 2))s" -ForegroundColor Gray
                    Write-Host "   Environment: $($json.environment)" -ForegroundColor Gray
                }
                catch {
                    # JSON parsing failed, just show status code
                }
            }
            
            return $true
        }
        else {
            Write-Host " ⚠️  Status: $($response.StatusCode)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host " ❌ Failed" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
        return $false
    }
}

# Function to run health checks
function Run-HealthCheck {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp]`n" -ForegroundColor Gray
    
    $allHealthy = $true
    
    # Check backend
    if ($BackendUrl) {
        $healthUrl = "$BackendUrl/health"
        $apiUrl = "$BackendUrl"
        
        Write-Host "🔧 Backend Health:" -ForegroundColor Cyan
        $backendHealthy = Test-UrlHealth -Url $healthUrl -Name "Health Endpoint"
        
        if (-not $backendHealthy) {
            $allHealthy = $false
        }
        
        Write-Host ""
    }
    else {
        Write-Host "⚠️  Backend URL not provided. Set with -BackendUrl parameter" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Check frontend
    if ($FrontendUrl) {
        Write-Host "🎨 Frontend Health:" -ForegroundColor Cyan
        $frontendHealthy = Test-UrlHealth -Url $FrontendUrl -Name "Frontend"
        
        if (-not $frontendHealthy) {
            $allHealthy = $false
        }
        
        Write-Host ""
    }
    else {
        Write-Host "⚠️  Frontend URL not provided. Set with -FrontendUrl parameter" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # Summary
    if ($BackendUrl -or $FrontendUrl) {
        if ($allHealthy) {
            Write-Host "✅ All services are healthy!" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  Some services have issues!" -ForegroundColor Yellow
        }
    }
    
    return $allHealthy
}

# Main execution
if (-not $FrontendUrl -and -not $BackendUrl) {
    Write-Host "💡 Usage Examples:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Check both services:" -ForegroundColor White
    Write-Host "    .\monitor-health.ps1 -FrontendUrl 'https://commcoach-ai.vercel.app' -BackendUrl 'https://your-backend.railway.app'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Check only backend:" -ForegroundColor White
    Write-Host "    .\monitor-health.ps1 -BackendUrl 'https://your-backend.railway.app'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Watch mode (checks every 30 seconds):" -ForegroundColor White
    Write-Host "    .\monitor-health.ps1 -BackendUrl 'https://...' -Watch" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📝 You can save these URLs in a config file for easy access" -ForegroundColor Cyan
    Write-Host ""
    exit 0
}

# Run once or watch
if ($Watch) {
    Write-Host "👀 Watch mode enabled (checking every $WatchInterval seconds)" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray
    Write-Host "================================`n" -ForegroundColor Cyan
    
    while ($true) {
        Run-HealthCheck
        Write-Host ""
        Write-Host "Next check in $WatchInterval seconds..." -ForegroundColor Gray
        Write-Host "================================`n" -ForegroundColor Cyan
        Start-Sleep -Seconds $WatchInterval
    }
}
else {
    Run-HealthCheck
    Write-Host ""
}
