# Sanity Webhook Setup Helper
# This script opens the Sanity webhook creation page and displays the exact values you need

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Sanity Webhook Setup Helper" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Your configuration
$supabaseUrl = "https://vnkawvjagxngghzwojjm.supabase.co"
$webhookUrl = "$supabaseUrl/functions/v1/sync-sanity-car"
$sanityProjectId = "uye9uitb"
$dataset = "car-inventory"

Write-Host "Your Webhook Configuration:" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Name:" -ForegroundColor Yellow
Write-Host "  Sync to Supabase" -ForegroundColor White
Write-Host ""
Write-Host "URL:" -ForegroundColor Yellow
Write-Host "  $webhookUrl" -ForegroundColor White
Write-Host ""
Write-Host "Dataset:" -ForegroundColor Yellow
Write-Host "  $dataset" -ForegroundColor White
Write-Host ""
Write-Host "Trigger on:" -ForegroundColor Yellow
Write-Host "  [x] create" -ForegroundColor White
Write-Host "  [x] update" -ForegroundColor White
Write-Host "  [x] delete" -ForegroundColor White
Write-Host ""
Write-Host "Filter:" -ForegroundColor Yellow
Write-Host "  _type == `"car`"" -ForegroundColor White
Write-Host ""
Write-Host "HTTP method:" -ForegroundColor Yellow
Write-Host "  POST" -ForegroundColor White
Write-Host ""
Write-Host "API version:" -ForegroundColor Yellow
Write-Host "  v2021-03-25 (or v2024-01-01)" -ForegroundColor White
Write-Host ""
Write-Host "Secret:" -ForegroundColor Yellow
Write-Host "  (leave blank for now)" -ForegroundColor White
Write-Host ""

# Open Sanity Manage page
Write-Host "Opening Sanity Manage..." -ForegroundColor Cyan
$sanityUrl = "https://www.sanity.io/manage/p/$sanityProjectId/api/webhooks"
Start-Process $sanityUrl

Write-Host ""
Write-Host "Instructions:" -ForegroundColor Cyan
Write-Host "=============" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. The Sanity Manage page should open in your browser" -ForegroundColor White
Write-Host "2. Click 'Create webhook' or 'Add webhook'" -ForegroundColor White
Write-Host "3. Fill in the form with the values shown above" -ForegroundColor White
Write-Host "4. Copy the URL from above and paste it in the URL field" -ForegroundColor White
Write-Host "5. Make sure to check all three triggers: create, update, delete" -ForegroundColor White
Write-Host "6. Enter the filter exactly as shown: _type == `"car`"" -ForegroundColor White
Write-Host "7. Click 'Save' or 'Create'" -ForegroundColor White
Write-Host ""

# Copy webhook URL to clipboard
$webhookUrl | Set-Clipboard
Write-Host "✅ Webhook URL copied to clipboard!" -ForegroundColor Green
Write-Host "   You can paste it directly into the Sanity webhook form" -ForegroundColor Gray
Write-Host ""

Write-Host "After creating the webhook:" -ForegroundColor Cyan
Write-Host "1. Test it by creating/updating a car in Sanity Studio" -ForegroundColor White
Write-Host "2. Check Supabase Dashboard → Edge Functions → sync-sanity-car → Logs" -ForegroundColor White
Write-Host "3. Verify the car appears in Supabase → Table Editor → cars" -ForegroundColor White
Write-Host ""

