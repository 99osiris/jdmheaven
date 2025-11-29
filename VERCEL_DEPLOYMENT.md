# 🚀 Vercel Deployment Guide for JDM Heaven

This guide will help you deploy jdmheaven.club to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository (✅ Already done!)
3. **Environment Variables**: Have your credentials ready

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended) ⭐

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click **"Import Git Repository"**

2. **Connect to GitHub**
   - Select your `jdmheaven` repository
   - Authorize Vercel to access your repos

3. **Configure Project**
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install --legacy-peer-deps` (auto-detected)

4. **Set Environment Variables**
   - Click **"Environment Variables"**
   - Add the following variables:

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SANITY_PROJECT_ID=your_sanity_project_id
   VITE_SANITY_DATASET=car-inventory
   VITE_SANITY_TOKEN=your_sanity_api_token
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id (optional)
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete
   - Your site will be live at `https://jdmheaven.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow prompts to link to existing project or create new
   - For production: `vercel --prod`

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_SANITY_PROJECT_ID
   vercel env add VITE_SANITY_DATASET
   vercel env add VITE_SANITY_TOKEN
   ```

## Custom Domain Setup

1. **Add Custom Domain**
   - Go to Project settings → Domains
   - Click **"Add Domain"**
   - Enter: `jdmheaven.club`

2. **Configure DNS**
   - Vercel will provide DNS records
   - Add to your domain registrar:
     - **A Record**: `@` → Vercel IP
     - **CNAME**: `www` → `cname.vercel-dns.com`

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - HTTPS will be enabled automatically

## Environment Variables

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|----------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | [Supabase Dashboard](https://app.supabase.com) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Same as above |
| `VITE_SANITY_PROJECT_ID` | Sanity project ID | [Sanity Dashboard](https://www.sanity.io/manage) |
| `VITE_SANITY_DATASET` | Sanity dataset name | Usually `car-inventory` or `production` |
| `VITE_SANITY_TOKEN` | Sanity API token | Sanity Dashboard → API → Tokens |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID |

## Build Configuration

The `vercel.json` file is already configured with:

- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Framework: Vite
- ✅ SPA routing (all routes → index.html)
- ✅ Security headers
- ✅ Cache control for static assets

## Continuous Deployment

Once connected to GitHub:

- ✅ **Every push to `main`** → Automatic production deploy
- ✅ **Pull requests** → Automatic preview deploy
- ✅ **Other branches** → Branch deploy (optional)

## Vercel vs Netlify

Both platforms are excellent choices:

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Framework Support | Excellent | Excellent |
| Build Speed | Very Fast | Fast |
| Edge Network | Global | Global |
| Free Tier | Generous | Generous |
| Custom Domain | Free SSL | Free SSL |
| Preview Deploys | ✅ | ✅ |

**Recommendation**: Both work great! Choose based on your preference or existing account.

## Troubleshooting

### Build Fails

1. Check **Deployments** → Click failed deploy → View logs
2. Common issues:
   - Missing environment variables
   - Node version mismatch
   - Build timeout

### Site Shows Blank Page

1. Check browser console for errors
2. Verify all environment variables are set
3. Check that `dist` folder contains built files
4. Verify Supabase and Sanity connections

### Environment Variables Not Working

1. Make sure variables start with `VITE_` (for Vite apps)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Remove environment variable
vercel env rm VARIABLE_NAME

# Open project in browser
vercel open
```

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Set up custom domain (jdmheaven.club)
3. ✅ Configure environment variables
4. ✅ Test all functionality
5. ✅ Set up monitoring/analytics

---

**Ready to deploy?** Go to [vercel.com/new](https://vercel.com/new) and import your repository! 🚀

