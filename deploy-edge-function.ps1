# Deploy Supabase Edge Function using npx
# This script uses npx to run Supabase CLI without global installation

Write-Host "Deploying Supabase Edge Function..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "supabase\functions\sync-sanity-car\index.ts")) {
    Write-Host "Error: sync-sanity-car function not found!" -ForegroundColor Red
    Write-Host "Make sure you're in the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Logging in to Supabase..." -ForegroundColor Cyan
npx supabase login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Login failed. Please try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Linking project..." -ForegroundColor Cyan
npx supabase link --project-ref vnkawvjagxngghzwojjm
if ($LASTEXITCODE -ne 0) {
    Write-Host "Linking failed. Check your project reference ID." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 3: Setting environment variables..." -ForegroundColor Cyan
Write-Host "You'll need to set these in Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "  - SANITY_PROJECT_ID" -ForegroundColor White
Write-Host "  - SANITY_DATASET" -ForegroundColor White
Write-Host "  - SANITY_API_TOKEN" -ForegroundColor White
Write-Host "  - SUPABASE_URL" -ForegroundColor White
Write-Host "  - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Have you set the environment variables in Supabase Dashboard? (y/n)"
if ($continue -ne 'y' -and $continue -ne 'Y') {
    Write-Host "Please set the environment variables first, then run this script again." -ForegroundColor Yellow
    Write-Host "See DEPLOY_EDGE_FUNCTION.md for instructions." -ForegroundColor Cyan
    exit 0
}

Write-Host ""
Write-Host "Step 4: Deploying function..." -ForegroundColor Cyan
npx supabase functions deploy sync-sanity-car
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Success! Function deployed." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Set up Sanity webhook (see SETUP_SANITY_WEBHOOK.md)" -ForegroundColor White
    Write-Host "2. Test the function in Supabase Dashboard" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Deployment failed. Check the error messages above." -ForegroundColor Red
}

