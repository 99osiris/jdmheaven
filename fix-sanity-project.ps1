# Fix Sanity Studio Project Connection
# This script ensures the studio connects to the correct project (uye9uitb)

Write-Host "🔧 Fixing Sanity Studio Project Connection..." -ForegroundColor Green
Write-Host ""

# Clear cache
$sanityCache = "sanity-studio\.sanity"
if (Test-Path $sanityCache) {
    Remove-Item -Recurse -Force $sanityCache
    Write-Host "✅ Cleared .sanity cache folder" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No cache folder found" -ForegroundColor Gray
}

# Set environment variables
$env:SANITY_STUDIO_PROJECT_ID = "uye9uitb"
$env:SANITY_STUDIO_DATASET = "car-inventory"
$env:VITE_SANITY_PROJECT_ID = "uye9uitb"
$env:VITE_SANITY_DATASET = "car-inventory"

Write-Host ""
Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "   Project ID: uye9uitb" -ForegroundColor Cyan
Write-Host "   Dataset: car-inventory" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Stop the current Sanity Studio (if running)" -ForegroundColor White
Write-Host "2. Run: cd sanity-studio" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
Write-Host "4. When prompted, select project 'uye9uitb'" -ForegroundColor White
Write-Host ""
Write-Host "Or use the start script:" -ForegroundColor Yellow
Write-Host "   .\start-sanity-studio.ps1" -ForegroundColor White
Write-Host ""

