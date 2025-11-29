# 🔐 Supabase Auth System - Complete Setup Guide

## Overview

The authentication system is fully integrated with Supabase Auth, providing secure user management, profile creation, and session handling.

---

## ✅ Features Implemented

### 1. **User Authentication**
- ✅ Email/Password signup
- ✅ Email/Password signin
- ✅ Password reset via email
- ✅ Email verification
- ✅ Session management
- ✅ Auto-refresh tokens
- ✅ Persistent sessions

### 2. **User Profiles**
- ✅ Automatic profile creation on signup (via database trigger)
- ✅ Profile upsert as backup (in code)
- ✅ Full user information stored in `profiles` table
- ✅ Role-based access control (user, staff, admin)

### 3. **Database Integration**
- ✅ `profiles` table with all user data
- ✅ Automatic profile creation trigger (`handle_new_user`)
- ✅ Row Level Security (RLS) policies
- ✅ Foreign key relationships

---

## 🏗️ Architecture

### **Signup Flow**
1. User fills signup form
2. `supabase.auth.signUp()` creates auth user
3. Database trigger `handle_new_user()` automatically creates profile
4. Code also upserts profile as backup (ensures all data is saved)
5. Email verification sent (if enabled)
6. User redirected to dashboard

### **Signin Flow**
1. User enters email/password
2. `supabase.auth.signInWithPassword()` authenticates
3. Session created and stored
4. User redirected based on role (admin → /admin, user → /dashboard)

### **Profile Creation**
The `handle_new_user()` database trigger automatically:
- Creates profile in `profiles` table
- Extracts data from `raw_user_meta_data`
- Sets default role to 'user'
- Handles all address and preference fields

---

## 📋 Database Schema

### **profiles Table**
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  phone_number text,
  street_address text,
  city text,
  postal_code text,
  country text,
  preferred_brands text[],
  marketing_email boolean DEFAULT false,
  marketing_sms boolean DEFAULT false,
  role user_role DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### **Database Trigger**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name, role, phone_number,
    street_address, city, postal_code, country,
    preferred_brands, marketing_email, marketing_sms
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'street_address',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'postal_code',
    NEW.raw_user_meta_data->>'country',
    CASE 
      WHEN NEW.raw_user_meta_data->>'preferred_brands' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data->>'preferred_brands', ',')
      ELSE NULL
    END,
    COALESCE((NEW.raw_user_meta_data->>'marketing_email')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'marketing_sms')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 🔧 Configuration

### **Environment Variables**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **Supabase Client Setup**
```typescript
// src/lib/supabase.ts
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);
```

---

## 🚀 Usage

### **Sign Up**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  options: {
    data: {
      full_name: 'John Doe',
      phone_number: '+1234567890',
      // ... other fields
      role: 'user'
    }
  }
});
```

### **Sign In**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securePassword123'
});
```

### **Sign Out**
```typescript
await supabase.auth.signOut();
```

### **Get Current User**
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### **Get User Profile**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
```

---

## 🔒 Security

### **Row Level Security (RLS)**
- Users can only view/update their own profile
- Admin users have additional permissions
- All tables have RLS enabled

### **Password Requirements**
- Minimum 8 characters
- Must contain uppercase, lowercase, and number
- Validated on client side (Zod schema)

### **Session Management**
- Auto-refresh tokens
- Persistent sessions
- Secure token storage
- PKCE flow for security

---

## 🐛 Troubleshooting

### **Issue: Profile not created**
**Solution:**
- Check database trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check trigger function: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- Verify RLS policies allow insert
- Check Supabase logs for errors

### **Issue: Signup fails**
**Solution:**
- Verify Supabase URL and key are correct
- Check email format is valid
- Ensure password meets requirements
- Check Supabase Auth settings (email confirmation enabled/disabled)

### **Issue: Signin fails**
**Solution:**
- Verify email and password are correct
- Check if email is verified (if email confirmation is required)
- Check Supabase Auth logs
- Verify user exists in `auth.users` table

### **Issue: Session not persisting**
**Solution:**
- Check `persistSession: true` in Supabase client config
- Verify localStorage is enabled
- Check browser console for errors
- Clear browser cache and try again

---

## 📝 Testing

### **Test Signup**
1. Go to `/auth`
2. Click "Sign up"
3. Fill in all required fields
4. Submit form
5. Check `auth.users` table in Supabase
6. Check `profiles` table - should have new entry

### **Test Signin**
1. Go to `/auth`
2. Enter email and password
3. Click "Sign in"
4. Should redirect to `/dashboard`
5. Check session is created

### **Test Profile Creation**
1. Sign up a new user
2. Check Supabase Dashboard → Table Editor → `profiles`
3. Verify all fields are populated correctly

---

## ✅ Status

**Fully Functional:**
- ✅ User signup with profile creation
- ✅ User signin with session management
- ✅ Password reset
- ✅ Email verification
- ✅ Profile management
- ✅ Role-based access

**The authentication system is ready for production use!** 🚀

