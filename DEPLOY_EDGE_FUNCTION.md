sync-sanity-car# 🚀 How to Deploy Edge Function to Supabase (Easy Guide)

This guide will help you deploy the `sync-sanity-car` function to Supabase so that Sanity changes automatically sync to your database.

## Method 1: Using Supabase Dashboard (Easiest) ⭐

### Step 1: Prepare the Function File

1. Open the file: `supabase/functions/sync-sanity-car/index.ts`
2. Copy all the code (Ctrl+A, Ctrl+C)

### Step 2: Go to Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in to your account
3. Select your project (the one with URL like `vnkawvjagxngghzwojjm.supabase.co`)

### Step 3: Create the Edge Function

1. In the left sidebar, click **Edge Functions**
2. Click **Create a new function** button (or **New Function**)
3. Fill in:
   - **Function name**: `sync-sanity-car`
   - **Function slug**: `sync-sanity-car` (auto-filled)
4. Click **Create function**

### Step 4: Add the Code

1. You'll see a code editor
2. Delete any default code
3. Paste the code from `index.ts` file
4. Click **Deploy** (or **Save**)

### Step 5: Set Environment Variables

1. In the function page, go to **Settings** tab (or click the gear icon)
2. Scroll to **Environment Variables** section
3. Click **Add new variable** for each of these:

   **Variable 1:**
   - Name: `SANITY_PROJECT_ID`
   - Value: `uye9uitb` (or your Sanity project ID)
   - Click **Save**

   **Variable 2:**
   - Name: `SANITY_DATASET`
   - Value: `car-inventory` (or your dataset name)
   - Click **Save**

   **Variable 3:**
   - Name: `SANITY_API_TOKEN`
   - Value: (your Sanity API token - see how to get it below)
   - Click **Save**

   **Variable 4:**
   - Name: `SUPABASE_URL`
   - Value: `https://vnkawvjagxngghzwojjm.supabase.co` (your Supabase URL)
   - Click **Save**

   **Variable 5:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (your service role key - see how to get it below)
   - Click **Save**

### Step 6: Get Your Sanity API Token

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click on your project
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Name it: "Supabase Sync"
6. Set permission: **Read** (or **Editor**)
7. Click **Generate**
8. **Copy the token** (it starts with `sk...`)
9. Paste it as the value for `SANITY_API_TOKEN`

### Step 7: Get Your Supabase Service Role Key

1. In Supabase Dashboard, go to **Settings** (gear icon in sidebar)
2. Click **API**
3. Find **Project API keys** section
4. Look for **service_role** key (it's secret, starts with `eyJ...`)
5. Click **Reveal** to show it
6. **Copy the key**
7. Paste it as the value for `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** Never share your service_role key publicly!

### Step 8: Test the Function

1. Go back to **Edge Functions** → `sync-sanity-car`
2. Click **Invoke** tab
3. In the request body, paste:
   ```json
   {
     "sanityId": "test-id"
   }
   ```
4. Click **Invoke**
5. You should see a response (even if it's an error, that's okay - it means the function is working!)

## Method 2: Using Supabase CLI (For Developers)

### Step 1: Install Supabase CLI

**Windows (PowerShell):**
```powershell
# Using Scoop (if you have it)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

**Mac/Linux:**
```bash
brew install supabase/tap/supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

```bash
# From your project root directory
supabase link --project-ref vnkawvjagxngghzwojjm
```

Replace `vnkawvjagxngghzwojjm` with your actual project reference ID.

### Step 4: Set Environment Variables

```bash
supabase secrets set SANITY_PROJECT_ID=uye9uitb
supabase secrets set SANITY_DATASET=car-inventory
supabase secrets set SANITY_API_TOKEN=your-sanity-token-here
supabase secrets set SUPABASE_URL=https://vnkawvjagxngghzwojjm.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 5: Deploy the Function

```bash
supabase functions deploy sync-sanity-car
```

That's it! The function is now deployed.

## Verify It's Working

### Check Function Status

1. Go to Supabase Dashboard → **Edge Functions**
2. You should see `sync-sanity-car` listed
3. Status should be **Active**

### Test the Function

1. Go to the function page
2. Click **Invoke** tab
3. Use this test payload:
   ```json
   {
     "sanityId": "test"
   }
   ```
4. Click **Invoke**
5. Check the response

### Check Logs

1. In the function page, click **Logs** tab
2. You should see function execution logs
3. Any errors will appear here

## Troubleshooting

### Function Not Appearing

- Make sure you're in the correct Supabase project
- Check that you clicked "Deploy" after adding the code
- Refresh the page

### Environment Variables Not Working

- Make sure variable names are **exact** (case-sensitive)
- No extra spaces before/after values
- Click "Save" after adding each variable
- Redeploy the function after adding variables

### Function Errors

1. Check the **Logs** tab for error messages
2. Verify all environment variables are set correctly
3. Make sure the code was copied completely
4. Check that your Sanity API token is valid

### Can't Find Service Role Key

1. Go to **Settings** → **API**
2. Look for **Project API keys**
3. Find **service_role** (it's the secret one)
4. Click **Reveal** to show it

## Next Steps

After deploying the function:

1. ✅ Function is deployed
2. ✅ Environment variables are set
3. ⏭️ **Next:** Set up the Sanity webhook (see `SETUP_SANITY_WEBHOOK.md`)

## Quick Checklist

- [ ] Function created in Supabase Dashboard
- [ ] Code pasted into function
- [ ] Function deployed
- [ ] `SANITY_PROJECT_ID` environment variable set
- [ ] `SANITY_DATASET` environment variable set
- [ ] `SANITY_API_TOKEN` environment variable set
- [ ] `SUPABASE_URL` environment variable set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` environment variable set
- [ ] Function tested and working

## Need Help?

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Function Logs:** Check in Supabase Dashboard → Edge Functions → Logs
- **Support:** Check `SETUP_SANITY_WEBHOOK.md` for more details

---

**That's it!** Your Edge Function is now deployed and ready to sync Sanity changes to Supabase! 🎉

