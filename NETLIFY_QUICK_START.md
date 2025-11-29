# 🚀 Netlify Quick Start Guide

Get your JDM Heaven website deployed to Netlify in minutes!

## Prerequisites

- ✅ GitHub repository with your code
- ✅ Netlify account ([sign up free](https://app.netlify.com))
- ✅ Environment variables ready (see below)

## Option 1: Deploy via Netlify Dashboard (Easiest) ⭐

### Step 1: Connect Repository

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify and select your `jdmheaven` repository
5. Select the `main` branch

### Step 2: Configure Build Settings

Netlify will auto-detect these from `netlify.toml`:
- ✅ **Build command**: `npm run build`
- ✅ **Publish directory**: `dist`
- ✅ **Node version**: `20`

**Just click "Deploy site"** - no changes needed!

### Step 3: Set Environment Variables

After the first deploy (or before), add your environment variables:

1. Go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add each of these:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=car-inventory
VITE_SANITY_TOKEN=your-api-token
```

4. Click **"Save"**
5. Go to **Deploys** → Click **"Trigger deploy"** → **"Clear cache and deploy site"**

### Step 4: Done! 🎉

Your site is now live! Visit your Netlify URL (e.g., `https://random-name.netlify.app`)

---

## Option 2: Deploy via CLI (Advanced)

### Step 1: Run Setup Script

**Windows (PowerShell):**
```powershell
.\netlify-setup.ps1
```

**Mac/Linux:**
```bash
chmod +x netlify-setup.sh
./netlify-setup.sh
```

### Step 2: Initialize Site

```bash
netlify init
```

Choose:
- **"Create & configure a new site"** (for new site)
- Or **"Link this directory to an existing site"** (if you already have one)

### Step 3: Set Environment Variables

```bash
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set VITE_SANITY_PROJECT_ID "your-project-id"
netlify env:set VITE_SANITY_DATASET "car-inventory"
netlify env:set VITE_SANITY_TOKEN "your-api-token"
```

### Step 4: Deploy

**Test deploy (draft URL):**
```bash
netlify deploy
```

**Production deploy:**
```bash
netlify deploy --prod
```

---

## Environment Variables Reference

### Required Variables

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `VITE_SUPABASE_URL` | [Supabase Dashboard](https://app.supabase.com) → Project Settings → API | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Same as above | `eyJhbGc...` |
| `VITE_SANITY_PROJECT_ID` | [Sanity Dashboard](https://www.sanity.io/manage) → Your Project | `uye9uitb` |
| `VITE_SANITY_DATASET` | Usually `production` or `car-inventory` | `car-inventory` |
| `VITE_SANITY_TOKEN` | Sanity Dashboard → API → Tokens → Create Token | `sk...` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID (e.g., `G-XXXXXXXXXX`) |
| `NETLIFY_MAINTENANCE_MODE` | Set to `true` to enable maintenance page |

---

## Custom Domain Setup

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `jdmheaven.club`
4. Follow Netlify's DNS instructions:
   - Add **A Record** or **CNAME** as shown
   - Netlify will automatically provision SSL certificate
   - Wait for DNS propagation (usually 5-60 minutes)

---

## Continuous Deployment

Once connected to GitHub:

- ✅ **Every push to `main`** → Automatic production deploy
- ✅ **Pull requests** → Automatic preview deploy
- ✅ **Other branches** → Branch deploy (optional)

---

## Troubleshooting

### Build Fails

1. Check **Deploys** → Click failed deploy → View logs
2. Common issues:
   - Missing environment variables
   - Node version mismatch (should be 20)
   - Build timeout (contact Netlify support to increase)

### Site Shows Blank Page

1. Check browser console for errors
2. Verify all environment variables are set correctly
3. Check that `dist` folder contains built files
4. Verify Supabase and Sanity connections

### Environment Variables Not Working

1. Make sure variables start with `VITE_` (for Vite apps)
2. Redeploy after adding variables (they're only available at build time)
3. Check variable names match exactly (case-sensitive)

### SPA Routing Not Working

- The `public/_redirects` file handles SPA routing
- Make sure it's included in your build output
- Check that redirects are configured correctly

---

## Useful Commands

```bash
# Check site status
netlify status

# Open site in browser
netlify open

# View site logs
netlify logs

# List environment variables
netlify env:list

# Update environment variable
netlify env:set VARIABLE_NAME "value"

# Delete environment variable
netlify env:unset VARIABLE_NAME

# View site info
netlify sites:info
```

---

## Next Steps

1. ✅ Deploy to Netlify
2. ✅ Set up custom domain (jdmheaven.club)
3. ✅ Configure environment variables
4. ✅ Test all functionality
5. ✅ Set up monitoring/analytics
6. ✅ Enable continuous deployment

---

## Need Help?

- 📖 [Full Deployment Guide](./NETLIFY_DEPLOYMENT.md)
- 📖 [Netlify Documentation](https://docs.netlify.com)
- 💬 [Netlify Community](https://community.netlify.com)

---

**Ready to deploy?** Run the setup script or follow Option 1 above! 🚀

