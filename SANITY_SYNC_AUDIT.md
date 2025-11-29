# 🔍 Sanity Sync Audit Report

## Critical Issue Found

### Problem: Website Shows Mock Data Instead of Real Data

**Location:** `src/lib/api.ts` - `api.cars.getAll()`

**Issue:** The function returns hardcoded mock data instead of fetching from Supabase where synced Sanity cars are stored.

**Impact:** 
- New cars created in Sanity don't appear on the website
- Website shows only 3 mock cars (Nissan Skyline, Toyota Supra, Mazda RX-7)
- Real inventory is invisible to users

**Root Cause:**
```typescript
// BEFORE (WRONG):
getAll: async (): Promise<Car[]> => {
  // For now, return mock data
  return [
    { id: '1', make: 'Nissan', ... },
    { id: '2', make: 'Toyota', ... },
    { id: '3', make: 'Mazda', ... }
  ];
}
```

**Fix Applied:**
- Changed to fetch from Supabase `cars` table
- Includes related `car_images` and `car_specs`
- Orders by `created_at` descending

---

## Sync Flow Analysis

### Current Architecture:
1. **Sanity Studio** → User creates/updates car
2. **Sanity Webhook** → Triggers on create/update/delete
3. **Supabase Edge Function** → `sync-sanity-car` receives webhook
4. **Supabase Database** → Car data stored in `cars` table
5. **Website** → Should fetch from Supabase (was broken, now fixed)

### Potential Issues to Check:

1. **Webhook Configuration**
   - ✅ URL: `https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car`
   - ✅ Filter: `_type == "car"`
   - ✅ Triggers: create, update, delete
   - ⚠️ **Verify webhook is active in Sanity**

2. **Edge Function Environment Variables**
   - `SANITY_PROJECT_ID` = `uye9uitb`
   - `SANITY_DATASET` = `car-inventory`
   - `SANITY_API_TOKEN` = (must be set)
   - `SUPABASE_URL` = (must be set)
   - `SUPABASE_SERVICE_ROLE_KEY` = (must be set)

3. **Sanity Document Publishing**
   - ⚠️ **Draft documents don't trigger webhooks**
   - Must click "Publish" in Sanity Studio
   - Webhooks only fire on published documents

4. **Supabase Table Structure**
   - Must have `cars` table with `sanity_id` column
   - Must have `car_images` and `car_specs` tables
   - Foreign keys must be properly configured

---

## Fixes Applied

### ✅ Fix 1: Updated `api.cars.getAll()`
- Now fetches from Supabase instead of returning mock data
- Includes proper error handling
- Returns cars with images and specs

### ✅ Fix 2: Added Diagnostic Tools
- Created sync test component
- Added manual sync trigger
- Added webhook status checker

---

## Testing Checklist

- [ ] Create a new car in Sanity Studio
- [ ] **Publish the car** (important!)
- [ ] Check Supabase Edge Function logs
- [ ] Verify car appears in Supabase `cars` table
- [ ] Refresh website inventory page
- [ ] Verify car appears on website

---

## Next Steps

1. **Verify Webhook is Active:**
   - Go to: https://www.sanity.io/manage/p/uye9uitb/api/webhooks
   - Check webhook status is "Active"

2. **Test Manual Sync:**
   - Use Admin Dashboard sync test
   - Or call Edge Function directly

3. **Check Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → sync-sanity-car → Logs
   - Look for errors or successful syncs

4. **Verify Environment Variables:**
   - All required variables must be set in Supabase
   - Values must be correct

---

## Common Issues & Solutions

### Issue: Webhook Not Triggering
**Solution:** 
- Verify webhook is active
- Check filter is exactly `_type == "car"`
- Ensure document is published (not draft)

### Issue: Edge Function Error
**Solution:**
- Check environment variables are set
- Verify Sanity API token has read permissions
- Check Supabase service role key is correct

### Issue: Car Not Appearing on Website
**Solution:**
- Verify car exists in Supabase `cars` table
- Check `sanity_id` column is populated
- Ensure website is fetching from Supabase (now fixed)

---

## Status

✅ **Fixed:** `api.cars.getAll()` now fetches from Supabase  
⚠️ **Verify:** Webhook is active and configured correctly  
⚠️ **Test:** Create a new car and verify it appears

