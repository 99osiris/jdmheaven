# Netlify Deployment Guide for JDM Heaven

This guide will help you deploy jdmheaven.club to Netlify.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Have your credentials ready

## Quick Deploy

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - Select your GitHub repository (`jdmheaven`)
   - Authorize Netlify to access your repos

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20` (auto-detected from netlify.toml)

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following variables:

   ```
   VITE_SUPABASE_URL=https://vnkawvjagxngghzwojjm.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SANITY_PROJECT_ID=uye9uitb
   VITE_SANITY_DATASET=car-inventory
   VITE_SANITY_TOKEN=your_sanity_api_token
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be live at `https://random-name.netlify.app`

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```
   - Follow prompts to link to existing site or create new

4. **Set Environment Variables**
   ```bash
   netlify env:set VITE_SUPABASE_URL "https://vnkawvjagxngghzwojjm.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "your_key"
   netlify env:set VITE_SANITY_PROJECT_ID "uye9uitb"
   netlify env:set VITE_SANITY_DATASET "car-inventory"
   netlify env:set VITE_SANITY_TOKEN "your_token"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Custom Domain Setup

1. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter: `jdmheaven.club`

2. **Configure DNS**
   - Netlify will provide DNS records
   - Add to your domain registrar:
     - **A Record**: `@` → Netlify IP
     - **CNAME**: `www` → `your-site.netlify.app`

3. **SSL Certificate**
   - Netlify automatically provisions SSL via Let's Encrypt
   - HTTPS will be enabled automatically

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `VITE_SANITY_PROJECT_ID` | Sanity project ID | `uye9uitb` |
| `VITE_SANITY_DATASET` | Sanity dataset name | `car-inventory` |
| `VITE_SANITY_TOKEN` | Sanity API token | `sk...` |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `VITE_GA_MEASUREMENT_ID` | Google Analytics ID |
| `NETLIFY_MAINTENANCE_MODE` | Set to `true` to enable maintenance page |

## Build Configuration

The `netlify.toml` file is already configured with:

- ✅ Build command: `npm run build`
- ✅ Publish directory: `dist`
- ✅ Node version: `20`
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ SPA routing (all routes → index.html)
- ✅ Cache control for static assets
- ✅ HTTPS redirects

## Continuous Deployment

Once connected to GitHub:

1. **Automatic Deploys**
   - Every push to `main` branch → Production deploy
   - Every push to other branches → Preview deploy

2. **Deploy Previews**
   - Pull requests get automatic preview URLs
   - Test changes before merging

3. **Branch Deploys**
   - Deploy specific branches for staging/testing

## Maintenance Mode

To enable maintenance mode:

1. **Via Netlify Dashboard**
   - Site settings → Environment variables
   - Add: `NETLIFY_MAINTENANCE_MODE` = `true`
   - Redeploy

2. **Via CLI**
   ```bash
   netlify env:set NETLIFY_MAINTENANCE_MODE "true"
   netlify deploy --prod
   ```

## Performance Optimization

Netlify automatically:
- ✅ CDN distribution
- ✅ Asset compression (gzip/brotli)
- ✅ Image optimization (via Netlify Image CDN)
- ✅ Edge caching
- ✅ HTTP/2 and HTTP/3

## Monitoring & Analytics

1. **Netlify Analytics**
   - Built-in analytics in Netlify Dashboard
   - View traffic, bandwidth, build times

2. **Google Analytics**
   - Set `VITE_GA_MEASUREMENT_ID` environment variable
   - Analytics will be enabled automatically

## Troubleshooting

### Build Fails

1. **Check Build Logs**
   - Go to Deploys → Click on failed deploy
   - Review error messages

2. **Common Issues**
   - Missing environment variables
   - Node version mismatch
   - Build timeout (increase in netlify.toml)

### Site Not Loading

1. **Check Redirects**
   - Verify `netlify.toml` redirects are correct
   - Check `public/_redirects` file

2. **Check Environment Variables**
   - Ensure all required vars are set
   - Verify values are correct

### CSP Errors

1. **Update CSP in netlify.toml**
   - Add missing domains to Content-Security-Policy
   - Check browser console for blocked resources

## Advanced Configuration

### Build Plugins

Add to `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
```

### Edge Functions

If using Netlify Edge Functions:
```toml
[build]
  edge_functions = "netlify/edge-functions"
```

### Form Handling

Netlify automatically handles forms:
- Add `netlify` attribute to forms
- Submissions appear in Netlify Dashboard

## Post-Deployment Checklist

- [ ] Verify site loads correctly
- [ ] Test all routes (SPA routing)
- [ ] Check environment variables are set
- [ ] Verify Supabase connection
- [ ] Verify Sanity connection
- [ ] Test authentication flow
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate
- [ ] Test form submissions
- [ ] Check analytics tracking

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Status**: https://www.netlifystatus.com
- **Community**: https://community.netlify.com

## Next Steps

1. Deploy to Netlify
2. Set up custom domain (jdmheaven.club)
3. Configure environment variables
4. Test all functionality
5. Set up monitoring/analytics
6. Enable continuous deployment

