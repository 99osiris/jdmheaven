# 🔗 Setup Sanity Webhook for Auto-Sync

This guide will help you set up automatic syncing from Sanity to Supabase when you add or update cars.

## Quick Setup Steps

### Step 1: Get Your Supabase Function URL

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Edge Functions** → **sync-sanity-car**
4. Copy the function URL (it should look like):
   ```
   https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car
   ```

### Step 2: Deploy the Edge Function (if not already deployed)

```bash
# Make sure you're in the project root
cd supabase/functions/sync-sanity-car

# Deploy the function
supabase functions deploy sync-sanity-car

# Or if using Supabase CLI from root:
supabase functions deploy sync-sanity-car --project-ref vnkawvjagxngghzwojjm
```

### Step 3: Set Edge Function Environment Variables

In Supabase Dashboard → Edge Functions → sync-sanity-car → Settings → Environment Variables:

Add these variables:
- `SANITY_PROJECT_ID` = `uye9uitb` (or your project ID)
- `SANITY_DATASET` = `car-inventory` (or your dataset name)
- `SANITY_API_TOKEN` = (your Sanity API token - see below)
- `SUPABASE_URL` = `https://vnkawvjagxngghzwojjm.supabase.co` (your Supabase URL)
- `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase service role key)

**How to get Sanity API Token:**
1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Name it: "Supabase Sync"
6. Set permissions: **Read** (or **Editor** if you want write access)
7. Copy the token (starts with `sk...`)

**How to get Supabase Service Role Key:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (keep this secret!)

### Step 4: Create Sanity Webhook

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project (`uye9uitb`)
3. Go to **API** → **Webhooks**
4. Click **Create webhook**
5. Fill in the form:

   **Name:** `Sync to Supabase`
   
   **URL:** 
   ```
   https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car
   ```
   (Replace with your actual Supabase function URL)
   
   **Dataset:** `car-inventory` (or your dataset name)
   
   **Trigger on:** 
   - ✅ `create`
   - ✅ `update`
   - ✅ `delete`
   
   **Filter:** 
   ```
   _type == "car"
   ```
   
   **HTTP method:** `POST`
   
   **API version:** `v2021-03-25` or `v2024-01-01`
   
   **Secret:** (optional, leave blank for now)

6. Click **Save**

### Step 5: Test the Webhook

1. Go to your Sanity Studio
2. Create or update a car document
3. Publish the document
4. Check Supabase Dashboard → Table Editor → `cars` table
5. You should see the car appear/update automatically!

### Step 6: Verify It's Working

**Option A: Check Supabase Logs**
1. Go to Supabase Dashboard → Edge Functions → sync-sanity-car
2. Click **Logs**
3. You should see requests when you create/update cars in Sanity

**Option B: Use the Admin Dashboard**
1. Go to `/admin` in your app
2. Scroll to "Sanity ↔ Supabase Sync" section
3. Click "Fetch Sanity Cars" and "Fetch Supabase Cars"
4. Compare the lists - they should match!

## Troubleshooting

### Webhook Not Triggering

1. **Check webhook is active:**
   - Go to Sanity Manage → API → Webhooks
   - Make sure the webhook shows as "Active"

2. **Check webhook URL is correct:**
   - Must be: `https://your-project.supabase.co/functions/v1/sync-sanity-car`
   - No trailing slash!

3. **Check filter is correct:**
   - Should be: `_type == "car"` (exact match, case-sensitive)

4. **Test manually:**
   - Use the Admin Dashboard sync test component
   - Or call the function directly:
   ```bash
   curl -X POST https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{"sanityId": "your-car-id"}'
   ```

### Edge Function Errors

1. **Check environment variables:**
   - All required variables must be set
   - Values must be correct (no extra spaces)

2. **Check function logs:**
   - Supabase Dashboard → Edge Functions → sync-sanity-car → Logs
   - Look for error messages

3. **Verify function is deployed:**
   - Should show as "Active" in Supabase Dashboard

### Data Not Syncing

1. **Check Sanity document is published:**
   - Draft documents don't trigger webhooks
   - Must click "Publish" in Sanity Studio

2. **Check car exists in Sanity:**
   - Verify the car document exists and has required fields

3. **Check Supabase table structure:**
   - Make sure `cars` table has `sanity_id` column
   - Check that required columns exist

## Manual Sync (Fallback)

If automatic sync isn't working, you can manually sync:

1. **From Admin Dashboard:**
   - Go to `/admin`
   - Use "Sanity ↔ Supabase Sync" section
   - Select a car and click "Sync Selected Car"

2. **From Code:**
   ```typescript
   import { triggerSync } from '@/lib/sync/webhook-handler';
   await triggerSync('sanity-car-id');
   ```

## Next Steps

✅ Webhook configured  
✅ Edge Function deployed  
✅ Environment variables set  
✅ Test sync working  

Your Sanity → Supabase sync should now be automatic! 🎉

