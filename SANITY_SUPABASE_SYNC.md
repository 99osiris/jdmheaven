# Sanity ↔ Supabase Sync Guide

This guide explains how to set up bidirectional sync between Sanity CMS and Supabase for the car inventory.

## Overview

When a vehicle is added or updated in Sanity CMS, it automatically syncs to Supabase. This allows you to:
- Manage content in Sanity (CMS)
- Use Supabase for application features (wishlists, comparisons, etc.)
- Keep both systems in sync

## Architecture

1. **Sanity** → Source of truth for car content
2. **Supabase** → Application database for features
3. **Sync Function** → Maps Sanity data to Supabase format

## Setup

### 1. Environment Variables

Make sure these are set in your `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=car-inventory
VITE_SANITY_TOKEN=your_sanity_api_token
```

### 2. Supabase Edge Function

The sync function is located at:
- `supabase/functions/sync-sanity-car/index.ts`

To deploy it:
```bash
supabase functions deploy sync-sanity-car
```

Set environment variables in Supabase:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Sanity Webhook Setup

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. Create a new webhook:
   - **Name**: Sync to Supabase
   - **URL**: `https://your-project.supabase.co/functions/v1/sync-sanity-car`
   - **Dataset**: `car-inventory`
   - **Trigger on**: `create`, `update`, `delete`
   - **Filter**: `_type == "car"`
   - **HTTP method**: `POST`
   - **API version**: `v2021-03-25`
   - **Secret**: (optional, for security)

### 4. Manual Sync

You can also trigger sync manually from your application:

```typescript
import { triggerSync } from '@/lib/sync/webhook-handler';

// Sync a specific car
await triggerSync('sanity-car-id');

// Or use the direct function
import { syncCarFromSanity } from '@/lib/sync';
await syncCarFromSanity('sanity-car-id');
```

## Field Mapping

### Sanity → Supabase

| Sanity Field | Supabase Field | Notes |
|-------------|----------------|-------|
| `_id` | `sanity_id` | Unique identifier |
| `stockNumber` | `reference_number` | Stock/reference number |
| `brand` | `make` | Manufacturer |
| `model` | `model` | Model name |
| `year` | `year` | Manufacturing year |
| `finalPrice` | `price` | Final price |
| `status` | `status` | Mapped: available/reserved/sold |
| `specs.engine` | `engine_type` | Engine name |
| `specs.power` | `horsepower` | Horsepower |
| `specs.transmission` | `transmission` | Transmission type |
| `specs.drivetrain` | `drivetrain` | Drivetrain type |
| `exteriorColor` | `color` | Exterior color |
| `images[]` | `car_images[]` | Multiple images |
| `specs.*` | `car_specs[]` | Detailed specifications |

## Usage

### Adding a Car in Sanity

1. Open Sanity Studio
2. Create a new "Car Inventory" document
3. Fill in all required fields
4. Publish the document
5. The webhook automatically syncs to Supabase

### Viewing Synced Cars

Cars are available in both systems:

**From Sanity:**
```typescript
import { cms } from '@/lib/cms';
const cars = await cms.getCars();
```

**From Supabase:**
```typescript
import { supabase } from '@/lib/supabase';
const { data } = await supabase.from('cars').select('*');
```

### Syncing All Cars

To sync all existing cars from Sanity to Supabase:

```typescript
import { syncAllCarsFromSanity } from '@/lib/sync';

const results = await syncAllCarsFromSanity();
console.log(`Synced ${results.length} cars`);
```

## Troubleshooting

### Sync Not Working

1. Check webhook is configured correctly in Sanity
2. Verify Edge Function is deployed
3. Check environment variables are set
4. Review Supabase function logs

### Data Mismatch

If data doesn't match:
1. Check field mappings in `src/lib/sync/sanity-to-supabase.ts`
2. Verify Sanity schema matches expected format
3. Check Supabase table structure

### Manual Sync

If automatic sync fails, you can manually trigger:
```typescript
import { syncCarFromSanity } from '@/lib/sync';
await syncCarFromSanity('sanity-document-id');
```

## Best Practices

1. **Always publish in Sanity first** - Sanity is the source of truth
2. **Use Supabase for user features** - Wishlists, comparisons, etc.
3. **Monitor sync status** - Check `sanity_synced_at` field in Supabase
4. **Handle errors gracefully** - Sync failures shouldn't break the app

## Next Steps

- Set up Sanity webhook
- Deploy Supabase Edge Function
- Test sync with a sample car
- Monitor sync logs

