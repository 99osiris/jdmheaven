#!/bin/bash
# Comprehensive Netlify Setup Script for JDM Heaven
# This script helps you deploy your site to Netlify

echo ""
echo "🚀 Netlify Deployment Setup for JDM Heaven"
echo "==========================================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Netlify CLI not found. Installing..."
    echo ""
    npm install -g netlify-cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Netlify CLI. Please install manually:"
        echo "   npm install -g netlify-cli"
        exit 1
    fi
    echo "✅ Netlify CLI installed successfully"
else
    echo "✅ Netlify CLI already installed"
    VERSION=$(netlify --version 2>&1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    echo "   Version: $VERSION"
fi

echo ""

# Check if user is logged in
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null || netlify status 2>&1 | grep -q "Not logged in"; then
    echo "⚠️  Not logged in to Netlify"
    echo ""
    echo "Opening browser for login..."
    netlify login
    if [ $? -ne 0 ]; then
        echo "❌ Login failed. Please try again."
        exit 1
    fi
else
    echo "✅ Already logged in to Netlify"
fi

echo ""
echo "📋 Environment Variables Checklist"
echo "================================="
echo ""
echo "Before deploying, make sure you have these values ready:"
echo ""
echo "Required:"
echo "  • VITE_SUPABASE_URL"
echo "  • VITE_SUPABASE_ANON_KEY"
echo "  • VITE_SANITY_PROJECT_ID"
echo "  • VITE_SANITY_DATASET"
echo "  • VITE_SANITY_TOKEN"
echo ""
echo "Optional:"
echo "  • VITE_GA_MEASUREMENT_ID"
echo "  • NETLIFY_MAINTENANCE_MODE"
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "📄 Found .env file"
    echo ""
    echo "You can copy values from your .env file to Netlify."
    echo ""
else
    echo "⚠️  No .env file found. Make sure you have your environment variables ready."
    echo ""
fi

echo "🎯 Next Steps:"
echo "============="
echo ""
echo "Option 1: Initialize and Deploy (Recommended)"
echo "  1. Run: netlify init"
echo "     - Choose 'Create & configure a new site'"
echo "     - Or link to existing site"
echo ""
echo "  2. Set environment variables:"
echo "     netlify env:set VITE_SUPABASE_URL \"your-url\""
echo "     netlify env:set VITE_SUPABASE_ANON_KEY \"your-key\""
echo "     netlify env:set VITE_SANITY_PROJECT_ID \"your-project-id\""
echo "     netlify env:set VITE_SANITY_DATASET \"car-inventory\""
echo "     netlify env:set VITE_SANITY_TOKEN \"your-token\""
echo ""
echo "  3. Deploy:"
echo "     netlify deploy --prod"
echo ""
echo "Option 2: Deploy via Netlify Dashboard"
echo "  1. Go to: https://app.netlify.com"
echo "  2. Click 'Add new site' → 'Import an existing project'"
echo "  3. Connect your GitHub repository"
echo "  4. Build settings (auto-detected from netlify.toml):"
echo "     • Build command: npm run build"
echo "     • Publish directory: dist"
echo "  5. Add environment variables in Site settings"
echo "  6. Click 'Deploy site'"
echo ""

# Ask if user wants to proceed with init
read -p "Would you like to initialize Netlify now? (y/n) " proceed
if [ "$proceed" = "y" ] || [ "$proceed" = "Y" ]; then
    echo ""
    echo "🚀 Initializing Netlify site..."
    netlify init
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Netlify site initialized!"
        echo ""
        echo "📝 Don't forget to set your environment variables:"
        echo "   Use: netlify env:set VARIABLE_NAME \"value\""
        echo "   Or set them in the Netlify Dashboard"
        echo ""
        echo "📖 For detailed instructions, see: NETLIFY_DEPLOYMENT.md"
    fi
else
    echo ""
    echo "📖 For detailed deployment instructions, see: NETLIFY_DEPLOYMENT.md"
    echo ""
    echo "Quick commands:"
    echo "  • netlify init          - Initialize site"
    echo "  • netlify deploy        - Deploy to draft URL"
    echo "  • netlify deploy --prod - Deploy to production"
    echo "  • netlify open          - Open site in browser"
    echo "  • netlify status        - Check site status"
fi

echo ""
