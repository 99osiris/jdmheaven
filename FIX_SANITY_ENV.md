# 🔧 Fix: Sanity Studio "Configuration must contain projectId" Error

## The Problem

Your `.env` file still has **placeholder values** instead of your actual Sanity credentials.

## The Solution

### Step 1: Get Your Sanity Project ID

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click on your project
3. Copy your **Project ID** (it looks like: `aoh6qdxm` or similar)

### Step 2: Update Your .env File

Open your `.env` file in the project root and replace:

**BEFORE (placeholder):**
```env
VITE_SANITY_PROJECT_ID=your-sanity-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-sanity-api-token-here
```

**AFTER (your actual values):**
```env
VITE_SANITY_PROJECT_ID=aoh6qdxm
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=skAbCdEf1234567890...
```

### Step 3: Restart Sanity Studio

1. **Stop the current studio** (press `Ctrl+C` in the terminal)
2. **Restart it:**
   ```bash
   cd sanity-studio
   npm run dev
   ```

## Quick Check

To verify your .env has the right values, run:

```powershell
Get-Content .env | Select-String "SANITY"
```

You should see your **actual** Project ID, not "your-sanity-project-id".

## Still Having Issues?

If you still get the error after updating:

1. **Double-check** the Project ID is correct (no extra spaces)
2. **Make sure** you saved the .env file
3. **Restart** the studio completely
4. **Check** the terminal output for any error messages

## Alternative: Set Environment Variables Directly

If .env isn't working, you can set them directly when starting:

```powershell
$env:VITE_SANITY_PROJECT_ID="your-actual-project-id"
$env:VITE_SANITY_DATASET="production"
cd sanity-studio
npm run dev
```

---

**Need your Project ID?** It's in your Sanity dashboard at the top of your project page.

