# Comprehensive Netlify Setup Script for JDM Heaven
# This script helps you deploy your site to Netlify

Write-Host ""
Write-Host "🚀 Netlify Deployment Setup for JDM Heaven" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# Check if Netlify CLI is installed
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyInstalled) {
    Write-Host "📦 Netlify CLI not found. Installing..." -ForegroundColor Yellow
    Write-Host ""
    npm install -g netlify-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Netlify CLI. Please install manually:" -ForegroundColor Red
        Write-Host "   npm install -g netlify-cli" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Netlify CLI installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Netlify CLI already installed" -ForegroundColor Green
    $version = (netlify --version 2>&1 | Select-String -Pattern '\d+\.\d+\.\d+').Matches[0].Value
    Write-Host "   Version: $version" -ForegroundColor Gray
}

Write-Host ""

# Check if user is logged in
Write-Host "🔐 Checking Netlify authentication..." -ForegroundColor Cyan
$loginStatus = netlify status 2>&1
if ($LASTEXITCODE -ne 0 -or $loginStatus -match "Not logged in") {
    Write-Host "⚠️  Not logged in to Netlify" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opening browser for login..." -ForegroundColor Cyan
    netlify login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Login failed. Please try again." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Already logged in to Netlify" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Environment Variables Checklist" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Before deploying, make sure you have these values ready:" -ForegroundColor White
Write-Host ""
Write-Host "Required:" -ForegroundColor Cyan
Write-Host "  • VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "  • VITE_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "  • VITE_SANITY_PROJECT_ID" -ForegroundColor White
Write-Host "  • VITE_SANITY_DATASET" -ForegroundColor White
Write-Host "  • VITE_SANITY_TOKEN" -ForegroundColor White
Write-Host ""
Write-Host "Optional:" -ForegroundColor Gray
Write-Host "  • VITE_GA_MEASUREMENT_ID" -ForegroundColor Gray
Write-Host "  • NETLIFY_MAINTENANCE_MODE" -ForegroundColor Gray
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "📄 Found .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can copy values from your .env file to Netlify." -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️  No .env file found. Make sure you have your environment variables ready." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "🎯 Next Steps:" -ForegroundColor Green
Write-Host "=============" -ForegroundColor Green
Write-Host ""
Write-Host "Option 1: Initialize and Deploy (Recommended)" -ForegroundColor Cyan
Write-Host "  1. Run: netlify init" -ForegroundColor White
Write-Host "     - Choose 'Create & configure a new site'" -ForegroundColor Gray
Write-Host "     - Or link to existing site" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Set environment variables:" -ForegroundColor White
Write-Host "     netlify env:set VITE_SUPABASE_URL `"your-url`"" -ForegroundColor Gray
Write-Host "     netlify env:set VITE_SUPABASE_ANON_KEY `"your-key`"" -ForegroundColor Gray
Write-Host "     netlify env:set VITE_SANITY_PROJECT_ID `"your-project-id`"" -ForegroundColor Gray
Write-Host "     netlify env:set VITE_SANITY_DATASET `"car-inventory`"" -ForegroundColor Gray
Write-Host "     netlify env:set VITE_SANITY_TOKEN `"your-token`"" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Deploy:" -ForegroundColor White
Write-Host "     netlify deploy --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Deploy via Netlify Dashboard" -ForegroundColor Cyan
Write-Host "  1. Go to: https://app.netlify.com" -ForegroundColor White
Write-Host "  2. Click 'Add new site' → 'Import an existing project'" -ForegroundColor White
Write-Host "  3. Connect your GitHub repository" -ForegroundColor White
Write-Host "  4. Build settings (auto-detected from netlify.toml):" -ForegroundColor White
Write-Host "     • Build command: npm run build" -ForegroundColor Gray
Write-Host "     • Publish directory: dist" -ForegroundColor Gray
Write-Host "  5. Add environment variables in Site settings" -ForegroundColor White
Write-Host "  6. Click 'Deploy site'" -ForegroundColor White
Write-Host ""

# Ask if user wants to proceed with init
$proceed = Read-Host "Would you like to initialize Netlify now? (y/n)"
if ($proceed -eq 'y' -or $proceed -eq 'Y') {
    Write-Host ""
    Write-Host "🚀 Initializing Netlify site..." -ForegroundColor Green
    netlify init
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Netlify site initialized!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Don't forget to set your environment variables:" -ForegroundColor Yellow
        Write-Host "   Use: netlify env:set VARIABLE_NAME `"value`"" -ForegroundColor Cyan
        Write-Host "   Or set them in the Netlify Dashboard" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📖 For detailed instructions, see: NETLIFY_DEPLOYMENT.md" -ForegroundColor Cyan
    }
} else {
    Write-Host ""
    Write-Host "📖 For detailed deployment instructions, see: NETLIFY_DEPLOYMENT.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Quick commands:" -ForegroundColor Yellow
    Write-Host "  • netlify init          - Initialize site" -ForegroundColor White
    Write-Host "  • netlify deploy        - Deploy to draft URL" -ForegroundColor White
    Write-Host "  • netlify deploy --prod - Deploy to production" -ForegroundColor White
    Write-Host "  • netlify open          - Open site in browser" -ForegroundColor White
    Write-Host "  • netlify status        - Check site status" -ForegroundColor White
}

Write-Host ""
