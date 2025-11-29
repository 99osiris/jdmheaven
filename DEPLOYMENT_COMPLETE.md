# ✅ Supabase CLI Setup & Deployment Complete!

## What Was Done

1. ✅ **Supabase CLI Installed** - Using npx (no global installation needed)
2. ✅ **Logged in to Supabase** - Authenticated successfully
3. ✅ **Project Linked** - Connected to project `vnkawvjagxngghzwojjm`
4. ✅ **Edge Function Deployed** - `sync-sanity-car` function is now live!

## Function Status

- **Function Name:** `sync-sanity-car`
- **Status:** ✅ Deployed
- **URL:** `https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car`
- **Dashboard:** https://supabase.com/dashboard/project/vnkawvjagxngghzwojjm/functions

## ⚠️ IMPORTANT: Set Environment Variables

The function is deployed but needs environment variables to work. Set them in Supabase Dashboard:

### Quick Steps:

1. **Go to Supabase Dashboard:**
   - https://app.supabase.com/project/vnkawvjagxngghzwojjm/functions

2. **Click on `sync-sanity-car` function**

3. **Go to Settings tab** → **Environment Variables**

4. **Add these 5 variables:**

   | Variable Name | Value |
   |--------------|-------|
   | `SANITY_PROJECT_ID` | `uye9uitb` |
   | `SANITY_DATASET` | `car-inventory` |
   | `SANITY_API_TOKEN` | (Get from [Sanity Manage](https://www.sanity.io/manage) → API → Tokens) |
   | `SUPABASE_URL` | `https://vnkawvjagxngghzwojjm.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | (Get from Supabase Dashboard → Settings → API → service_role key) |

5. **Click Save** for each variable

### How to Get Your Tokens:

**Sanity API Token:**
1. Go to https://www.sanity.io/manage
2. Select your project
3. API → Tokens → Add API token
4. Name: "Supabase Sync"
5. Permission: Read (or Editor)
6. Copy the token (starts with `sk...`)

**Supabase Service Role Key:**
1. Go to Supabase Dashboard → Settings → API
2. Find "Project API keys" section
3. Look for `service_role` key
4. Click "Reveal" to show it
5. Copy the key (starts with `eyJ...`)

⚠️ **Never share your service_role key publicly!**

## Test the Function

After setting environment variables:

1. Go to the function page in Supabase Dashboard
2. Click **Invoke** tab
3. Paste this test payload:
   ```json
   {
     "sanityId": "test-id"
   }
   ```
4. Click **Invoke**
5. Check the response

## Next Steps

1. ✅ Function deployed
2. ⏭️ **Set environment variables** (see above)
3. ⏭️ **Set up Sanity webhook** (see `SETUP_SANITY_WEBHOOK.md`)
4. ⏭️ **Test sync** by creating a car in Sanity

## Useful Commands

Since we're using npx, you can run these commands anytime:

```powershell
# Deploy function
npx supabase functions deploy sync-sanity-car

# View function logs
npx supabase functions logs sync-sanity-car

# Check function status
npx supabase functions list
```

## Troubleshooting

### Function Not Working?

1. **Check environment variables are set:**
   - Go to Dashboard → Functions → sync-sanity-car → Settings
   - Verify all 5 variables are there

2. **Check function logs:**
   - Dashboard → Functions → sync-sanity-car → Logs
   - Look for error messages

3. **Test manually:**
   - Use the Invoke tab in Dashboard
   - Or use the Admin Dashboard sync test component

### Need to Redeploy?

Just run:
```powershell
# Temporarily move .env if it has encoding issues
Move-Item .env .env.temp -Force
npx supabase functions deploy sync-sanity-car
Move-Item .env.temp .env -Force
```

Or use the `deploy-edge-function.ps1` script I created.

---

**Your Edge Function is deployed!** 🎉

Just set the environment variables and you're ready to go!

