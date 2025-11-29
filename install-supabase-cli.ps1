# Install Supabase CLI for Windows
# This script downloads and installs Supabase CLI

Write-Host "🚀 Installing Supabase CLI..." -ForegroundColor Green
Write-Host ""

# Create local bin directory if it doesn't exist
$binDir = "$env:USERPROFILE\.local\bin"
if (-not (Test-Path $binDir)) {
    New-Item -ItemType Directory -Path $binDir -Force | Out-Null
    Write-Host "✅ Created bin directory: $binDir" -ForegroundColor Green
}

# Download Supabase CLI
Write-Host "📥 Downloading Supabase CLI..." -ForegroundColor Yellow
$url = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.zip"
$zipPath = "$env:TEMP\supabase-cli.zip"
$extractPath = "$env:TEMP\supabase-cli"

try {
    Invoke-WebRequest -Uri $url -OutFile $zipPath -UseBasicParsing
    Write-Host "✅ Download complete" -ForegroundColor Green
    
    # Extract
    Write-Host "📦 Extracting..." -ForegroundColor Yellow
    Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
    
    # Copy to bin directory
    $exePath = "$extractPath\supabase.exe"
    if (Test-Path $exePath) {
        Copy-Item $exePath -Destination "$binDir\supabase.exe" -Force
        Write-Host "✅ Supabase CLI installed to: $binDir\supabase.exe" -ForegroundColor Green
    } else {
        Write-Host "❌ Could not find supabase.exe in extracted files" -ForegroundColor Red
        exit 1
    }
    
    # Clean up
    Remove-Item $zipPath -Force
    Remove-Item $extractPath -Recurse -Force
    
} catch {
    Write-Host "❌ Error downloading Supabase CLI: $_" -ForegroundColor Red
    exit 1
}

# Add to PATH if not already there
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($currentPath -notlike "*$binDir*") {
    Write-Host ""
    Write-Host "Adding to PATH..." -ForegroundColor Yellow
    $newPath = "$currentPath;$binDir"
    [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
    Write-Host "Added $binDir to PATH" -ForegroundColor Green
    Write-Host ""
    Write-Host "Please restart your terminal for PATH changes to take effect!" -ForegroundColor Yellow
} else {
    Write-Host "Already in PATH" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Supabase CLI installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your terminal (or run: refreshenv)" -ForegroundColor White
Write-Host "2. Run: supabase login" -ForegroundColor White
Write-Host "3. Run: supabase link --project-ref vnkawvjagxngghzwojjm" -ForegroundColor White
Write-Host "4. Run: supabase functions deploy sync-sanity-car" -ForegroundColor White
Write-Host ""

