# 🔧 Apply Auth Migration - Quick Guide

## Step 1: Apply Migration to Supabase

### **Method 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard:**
   - Visit: https://app.supabase.com
   - Select your project

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run Migration:**
   - Open file: `supabase/migrations/20250110000000_complete_auth_system.sql`
   - Copy ALL contents
   - Paste into SQL Editor
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verify Success:**
   - Should see "Success. No rows returned"
   - Check for any errors in the output

### **Method 2: Supabase CLI**

```bash
# If you have Supabase CLI installed
cd supabase
supabase db push

# Or link to your project first
supabase link --project-ref your-project-ref
supabase db push
```

---

## Step 2: Verify Database Setup

### **Check Tables:**
```sql
-- Check profiles table exists
SELECT * FROM information_schema.tables 
WHERE table_name = 'profiles';

-- Check all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
```

### **Check Trigger:**
```sql
-- Check trigger exists
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check function exists
SELECT * FROM pg_proc 
WHERE proname = 'handle_new_user';
```

### **Check RLS Policies:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check policies exist
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';
```

---

## Step 3: Test Authentication

### **Test Signup:**
1. Go to your website: `/auth`
2. Click "Sign up"
3. Fill in:
   - Email: `test@example.com`
   - Password: `Test1234` (must have uppercase, lowercase, number)
   - Full Name: `Test User`
   - Phone: `+1234567890`
   - Address fields
4. Click "Create Account"
5. **Check Supabase:**
   - Go to Authentication → Users
   - Should see new user
   - Go to Table Editor → `profiles`
   - Should see new profile with all data

### **Test Signin:**
1. Go to `/auth`
2. Enter email and password
3. Click "Sign in"
4. Should redirect to `/dashboard`

---

## Step 4: Verify Vercel Deployment

1. **Check Vercel Dashboard:**
   - Go to: https://vercel.com/dashboard
   - Select your project
   - Check "Deployments" tab
   - Should see new deployment from GitHub push

2. **Check Build Logs:**
   - Click on the latest deployment
   - Check "Build Logs" for any errors
   - Should see "Build Successful"

3. **Test Production:**
   - Visit your Vercel URL
   - Test authentication flow
   - Verify everything works

---

## 🐛 Troubleshooting

### **Migration Fails:**
- Check for syntax errors in SQL
- Verify you're running the complete migration
- Check Supabase logs for detailed errors
- Ensure you have proper permissions

### **Profile Not Created:**
- Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- Verify RLS allows insert
- Check Supabase logs for trigger errors

### **Vercel Build Fails:**
- Check environment variables are set
- Verify all dependencies are in `package.json`
- Check build logs for specific errors
- Ensure TypeScript compiles without errors

---

## ✅ Success Checklist

- [ ] Migration applied successfully
- [ ] `profiles` table has all columns
- [ ] `handle_new_user()` function exists
- [ ] `on_auth_user_created` trigger exists
- [ ] RLS policies are enabled
- [ ] Test signup creates user and profile
- [ ] Test signin works correctly
- [ ] Vercel deployment successful
- [ ] Production site works correctly

---

**Once all checks pass, your authentication system is fully operational!** 🎉

