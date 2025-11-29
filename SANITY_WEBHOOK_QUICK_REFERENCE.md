# 📋 Sanity Webhook - Quick Reference Card

**Copy and paste these exact values into the Sanity webhook form:**

## Webhook Configuration

### Name:
```
Sync to Supabase
```

### URL:
```
https://vnkawvjagxngghzwojjm.supabase.co/functions/v1/sync-sanity-car
```

### Dataset:
```
car-inventory
```

### Trigger on:
- ✅ **create**
- ✅ **update**  
- ✅ **delete**

### Filter:
```
_type == "car"
```

### HTTP method:
```
POST
```

### API version:
```
v2021-03-25
```
(or `v2024-01-01`)

### Secret:
```
(leave blank)
```

---

## Quick Steps

1. **Go to:** https://www.sanity.io/manage/p/uye9uitb/api/webhooks
2. **Click:** "Create webhook" or "Add webhook"
3. **Fill in the form** with values above
4. **Click:** "Save" or "Create"
5. **Done!** ✅

---

## Test It

1. Create a car in Sanity Studio
2. Publish it
3. Check Supabase → `cars` table
4. Car should appear automatically!

---

**Need help?** Run `.\setup-sanity-webhook.ps1` for interactive setup!

