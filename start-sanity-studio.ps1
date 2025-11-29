# PowerShell script to start Sanity Studio
# This script reads the .env file and starts Sanity Studio with the correct credentials

Write-Host "🚀 Starting Sanity Studio..." -ForegroundColor Green
Write-Host ""

# Read .env file and extract Sanity credentials
$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    
    $projectId = ($envContent | Select-String -Pattern "VITE_SANITY_PROJECT_ID\s*=" | ForEach-Object { ($_ -split '=')[1].Trim() })
    $dataset = ($envContent | Select-String -Pattern "VITE_SANITY_DATASET\s*=" | ForEach-Object { ($_ -split '=')[1].Trim() })
    
    if ($projectId -and $projectId -ne "your-sanity-project-id") {
        $env:VITE_SANITY_PROJECT_ID = $projectId
        $env:VITE_SANITY_DATASET = if ($dataset) { $dataset } else { "production" }
        
        Write-Host "✅ Found Sanity credentials:" -ForegroundColor Green
        Write-Host "   Project ID: $projectId"
        Write-Host "   Dataset: $($env:VITE_SANITY_DATASET)"
        Write-Host ""
        
        # Change to sanity-studio directory
        $studioPath = Join-Path $PSScriptRoot "sanity-studio"
        
        if (Test-Path $studioPath) {
            Set-Location $studioPath
            Write-Host "📂 Changed to sanity-studio directory" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "🚀 Starting Sanity Studio..." -ForegroundColor Green
            Write-Host "   Studio will be available at: http://localhost:3333" -ForegroundColor Yellow
            Write-Host ""
            
            # Start the studio
            npm run dev
        } else {
            Write-Host "❌ Error: sanity-studio directory not found!" -ForegroundColor Red
            Write-Host "   Please run the setup first." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Error: Sanity Project ID not found or still has placeholder value!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please update your .env file with your actual Sanity credentials:" -ForegroundColor Yellow
        Write-Host "   VITE_SANITY_PROJECT_ID=your-actual-project-id"
        Write-Host "   VITE_SANITY_DATASET=production"
        Write-Host "   VITE_SANITY_TOKEN=your-actual-api-token"
        Write-Host ""
        Write-Host "Get your credentials from: https://www.sanity.io/manage" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "   Please create a .env file in the project root." -ForegroundColor Yellow
}

