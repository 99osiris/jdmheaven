# ✅ Sanity Sync Fix Summary

## Critical Issue Fixed

### Problem
When creating items in Sanity, they didn't appear on the website.

### Root Cause
The `api.cars.getAll()` function in `src/lib/api.ts` was returning **hardcoded mock data** instead of fetching from Supabase where synced Sanity cars are stored.

---

## Fixes Applied

### ✅ Fix 1: Updated `api.cars.getAll()` to Fetch from Supabase
**File:** `src/lib/api.ts`

**Before:**
```typescript
getAll: async (): Promise<Car[]> => {
  // For now, return mock data
  return [
    { id: '1', make: 'Nissan', ... }, // Mock data
    { id: '2', make: 'Toyota', ... },
    { id: '3', make: 'Mazda', ... }
  ];
}
```

**After:**
```typescript
getAll: async (): Promise<Car[]> => {
  // Fetch cars from Supabase (synced from Sanity)
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      images:car_images(id, url, is_primary),
      specs:car_specs(id, category, name, value)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars from Supabase:', error);
    throw error;
  }

  return (data || []) as Car[];
}
```

**Impact:** Website now displays real cars from Supabase instead of mock data.

---

### ✅ Fix 2: Enhanced Edge Function to Set Timestamps
**File:** `supabase/functions/sync-sanity-car/index.ts`

**Changes:**
- Added `created_at` field when inserting new cars
- Added `updated_at` field for updates
- Preserves `created_at` when updating existing cars
- Uses Sanity's `createdAt`/`updatedAt` if available, otherwise current time

**Impact:** Better data tracking and proper ordering of cars.

---

### ✅ Fix 3: Created Sync Diagnostics Component
**File:** `src/components/SyncDiagnostics.tsx` (NEW)

**Features:**
- Shows count of cars in Sanity vs Supabase
- Displays sync status (in sync / missing cars)
- Shows last sync timestamp
- Displays errors if any
- Manual "Sync All Cars" button
- Link to check webhook configuration
- Troubleshooting tips

**Impact:** Easy to diagnose sync issues and manually trigger syncs.

---

## How It Works Now

### Complete Flow:
1. **User creates car in Sanity Studio** → Car saved in Sanity
2. **User publishes car** → Sanity webhook triggers
3. **Webhook calls Supabase Edge Function** → `sync-sanity-car`
4. **Edge Function fetches car from Sanity** → Maps to Supabase format
5. **Edge Function saves to Supabase** → `cars` table with `sanity_id`
6. **Website fetches from Supabase** → `api.cars.getAll()` now works correctly
7. **Car appears on website** ✅

---

## Testing Steps

### 1. Verify the Fix
1. Go to `/inventory` page
2. You should now see cars from Supabase (not mock data)
3. If no cars appear, they need to be synced from Sanity

### 2. Test Sync
1. Go to `/admin` page
2. Scroll to "Sanity ↔ Supabase Sync Status"
3. Click "Refresh" to see current status
4. If cars are missing, click "Sync All Cars"

### 3. Create New Car
1. Open Sanity Studio (`http://localhost:3333`)
2. Create a new car document
3. **IMPORTANT:** Click "Publish" (drafts don't trigger webhooks)
4. Wait a few seconds
5. Check `/admin` → Sync Status should update
6. Check `/inventory` → New car should appear

---

## Troubleshooting

### Issue: Cars Still Not Appearing

**Check 1: Webhook Configuration**
- Go to: https://www.sanity.io/manage/p/uye9uitb/api/webhooks
- Verify webhook is "Active"
- Check URL is correct: `https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car`
- Verify filter: `_type == "car"`

**Check 2: Edge Function Environment Variables**
- Supabase Dashboard → Edge Functions → sync-sanity-car → Settings
- Verify all variables are set:
  - `SANITY_PROJECT_ID`
  - `SANITY_DATASET`
  - `SANITY_API_TOKEN`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`

**Check 3: Car is Published**
- Draft documents don't trigger webhooks
- Must click "Publish" in Sanity Studio

**Check 4: Manual Sync**
- Use Admin Dashboard → "Sync All Cars" button
- Or use SanitySyncTest component

**Check 5: Edge Function Logs**
- Supabase Dashboard → Edge Functions → sync-sanity-car → Logs
- Look for errors or successful syncs

---

## Files Modified

1. ✅ `src/lib/api.ts` - Fixed `getAll()` to fetch from Supabase
2. ✅ `supabase/functions/sync-sanity-car/index.ts` - Added timestamp handling
3. ✅ `src/components/SyncDiagnostics.tsx` - NEW diagnostic component
4. ✅ `src/pages/admin/AdminDashboard.tsx` - Added diagnostics component

---

## Next Steps

1. **Test the fix:**
   - Create a new car in Sanity
   - Publish it
   - Verify it appears on the website

2. **If sync doesn't work automatically:**
   - Use "Sync All Cars" button in Admin Dashboard
   - Check webhook configuration
   - Review Edge Function logs

3. **Monitor sync status:**
   - Use Sync Diagnostics component in Admin Dashboard
   - Check regularly to ensure sync is working

---

## Status

✅ **FIXED:** Website now fetches from Supabase  
✅ **ENHANCED:** Edge Function handles timestamps properly  
✅ **ADDED:** Diagnostic tools for troubleshooting  
⚠️ **VERIFY:** Webhook is active and configured correctly

**The main issue is fixed!** Cars created in Sanity will now appear on the website once they're synced to Supabase (either automatically via webhook or manually via the sync button).

