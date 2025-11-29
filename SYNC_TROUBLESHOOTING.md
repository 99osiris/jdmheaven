# Sync Troubleshooting Guide

## Quick Checklist

### ✅ Step 1: Check if Edge Function is Deployed

1. Go to Supabase Dashboard → Edge Functions
2. Look for `sync-sanity-car` function
3. If it's not there, deploy it:
   ```bash
   supabase functions deploy sync-sanity-car
   ```

### ✅ Step 2: Check Environment Variables

In Supabase Dashboard → Settings → Edge Functions → Environment Variables:

Required variables:
- `SANITY_PROJECT_ID` = `uye9uitb`
- `SANITY_DATASET` = `car-inventory` (or your dataset name)
- `SANITY_API_TOKEN` = (your Sanity API token)

**How to get Sanity API Token:**
1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to **API** → **Tokens**
4. Create a new token with **Read** permissions
5. Copy the token and add it to Supabase Edge Function env vars

### ✅ Step 3: Test Manual Sync First

Use the **Sanity Sync Test** component in the Admin Dashboard:

1. Go to `/admin` in your app
2. Scroll to "Sanity ↔ Supabase Sync" section
3. Click "Fetch Sanity Cars" to see cars in Sanity
4. Click "Fetch Supabase Cars" to see cars in Supabase
5. Select a car and click "Sync Selected Car"

**OR** test directly in browser console:

```javascript
// Open browser console (F12)
import { syncCarFromSanity } from '/src/lib/sync';

// Replace with actual Sanity car ID
const sanityId = 'your-car-sanity-id';
await syncCarFromSanity(sanityId);
```

### ✅ Step 4: Check Sanity Webhook

1. Go to https://www.sanity.io/manage
2. Select your project (`uye9uitb`)
3. Go to **API** → **Webhooks**
4. Check if webhook exists with:
   - URL: `https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car`
   - Filter: `_type == "car"`
   - Triggers: `create`, `update`, `delete`

If webhook doesn't exist, create it:
- **Name**: Sync to Supabase
- **URL**: `https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car`
- **Dataset**: `car-inventory`
- **Trigger on**: `create`, `update`, `delete`
- **Filter**: `_type == "car"`
- **HTTP method**: `POST`

### ✅ Step 5: Check Function Logs

1. Go to Supabase Dashboard → Edge Functions → `sync-sanity-car`
2. Click on **Logs** tab
3. Look for errors when you create a car in Sanity

Common errors:
- `sanityId or _id is required` → Webhook payload format issue
- `Car with Sanity ID ... not found` → Car doesn't exist in Sanity
- `SANITY_PROJECT_ID is missing` → Environment variable not set

### ✅ Step 6: Verify Car Exists in Sanity

1. Open Sanity Studio
2. Go to "Car Inventory"
3. Make sure you have at least one car created and **published**
4. Copy the car's `_id` (it's in the URL or document details)

### ✅ Step 7: Test Edge Function Directly

Test the function with curl or Postman:

```bash
curl -X POST https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"sanityId": "your-sanity-car-id"}'
```

Replace:
- `YOUR_ANON_KEY` with your Supabase anon key
- `your-sanity-car-id` with actual Sanity car ID

## Common Issues

### Issue: "Function not found" or 404
**Solution**: Deploy the function:
```bash
supabase functions deploy sync-sanity-car
```

### Issue: "Environment variable not set"
**Solution**: Add environment variables in Supabase Dashboard → Settings → Edge Functions

### Issue: "Car not found in Sanity"
**Solution**: 
- Make sure car is published in Sanity
- Check the Sanity ID is correct
- Verify dataset name matches (`car-inventory`)

### Issue: "Webhook not triggering"
**Solution**:
- Check webhook is configured correctly
- Verify webhook URL is correct
- Check webhook is enabled
- Test webhook manually in Sanity dashboard

### Issue: "Sync works manually but not via webhook"
**Solution**:
- Check webhook payload format
- Verify Edge Function handles `body._id` (Sanity format)
- Check function logs for webhook errors

## Manual Sync (Alternative)

If webhooks don't work, you can sync manually:

1. **From Admin Dashboard:**
   - Use the "Sanity Sync Test" component
   - Click "Sync All Cars" to sync everything

2. **From Code:**
   ```typescript
   import { syncAllCarsFromSanity } from '@/lib/sync';
   await syncAllCarsFromSanity();
   ```

3. **From Browser Console:**
   ```javascript
   // Get all cars from Sanity and sync
   const { cms } = await import('/src/lib/cms');
   const { syncCarFromSanity } = await import('/src/lib/sync');
   
   const cars = await cms.getCars(100, 0);
   for (const car of cars.cars) {
     await syncCarFromSanity(car._id);
   }
   ```

## Still Not Working?

1. Check browser console for errors
2. Check Supabase function logs
3. Verify all environment variables
4. Test with a simple car (minimal fields)
5. Check Sanity API token has correct permissions

