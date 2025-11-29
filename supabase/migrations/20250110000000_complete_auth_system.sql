/*
  # Complete Authentication System Setup
  
  This migration ensures a fully working user registration and authentication system.
  
  1. Changes
    - Ensure profiles table has all required columns
    - Create/update handle_new_user function with complete profile creation
    - Set up proper RLS policies
    - Ensure user_role enum exists
    - Add proper indexes for performance
  
  2. Security
    - Enable RLS on all user-related tables
    - Add policies for authenticated users
    - Ensure proper role assignment
*/

-- Ensure user_role enum exists
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ensure profiles table exists with all columns
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  role user_role NOT NULL DEFAULT 'user'::user_role,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$ BEGIN
  -- Phone number
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone_number') THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;
  
  -- Street address
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'street_address') THEN
    ALTER TABLE profiles ADD COLUMN street_address text;
  END IF;
  
  -- City
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'city') THEN
    ALTER TABLE profiles ADD COLUMN city text;
  END IF;
  
  -- Postal code
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'postal_code') THEN
    ALTER TABLE profiles ADD COLUMN postal_code text;
  END IF;
  
  -- Country
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'country') THEN
    ALTER TABLE profiles ADD COLUMN country text;
  END IF;
  
  -- Preferred brands
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_brands') THEN
    ALTER TABLE profiles ADD COLUMN preferred_brands text[];
  END IF;
  
  -- Marketing email
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_email') THEN
    ALTER TABLE profiles ADD COLUMN marketing_email boolean DEFAULT false;
  END IF;
  
  -- Marketing SMS
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'marketing_sms') THEN
    ALTER TABLE profiles ADD COLUMN marketing_sms boolean DEFAULT false;
  END IF;
  
  -- Role
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE profiles ADD COLUMN role user_role NOT NULL DEFAULT 'user'::user_role;
  END IF;
  
  -- Avatar URL
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
  
  -- Updated at
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
    ALTER TABLE profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create or replace handle_new_user function with complete profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  default_role user_role;
  preferred_brands_array text[];
BEGIN
  -- Get role from metadata or default to 'user'
  default_role := COALESCE(
    NULLIF((NEW.raw_user_meta_data->>'role')::text, '')::user_role,
    'user'::user_role
  );

  -- Parse preferred_brands if provided
  IF NEW.raw_user_meta_data->>'preferred_brands' IS NOT NULL THEN
    preferred_brands_array := string_to_array(
      trim(NEW.raw_user_meta_data->>'preferred_brands'),
      ','
    );
    -- Clean up array (remove empty strings and trim)
    preferred_brands_array := array(
      SELECT trim(unnest(preferred_brands_array))
      WHERE trim(unnest(preferred_brands_array)) != ''
    );
    IF array_length(preferred_brands_array, 1) = 0 THEN
      preferred_brands_array := NULL;
    END IF;
  END IF;

  -- Create profile with all user data
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    phone_number,
    street_address,
    city,
    postal_code,
    country,
    preferred_brands,
    marketing_email,
    marketing_sms,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    default_role,
    NULLIF(NEW.raw_user_meta_data->>'phone_number', ''),
    NULLIF(NEW.raw_user_meta_data->>'street_address', ''),
    NULLIF(NEW.raw_user_meta_data->>'city', ''),
    NULLIF(NEW.raw_user_meta_data->>'postal_code', ''),
    NULLIF(NEW.raw_user_meta_data->>'country', ''),
    preferred_brands_array,
    COALESCE((NEW.raw_user_meta_data->>'marketing_email')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'marketing_sms')::boolean, false),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
    street_address = COALESCE(EXCLUDED.street_address, profiles.street_address),
    city = COALESCE(EXCLUDED.city, profiles.city),
    postal_code = COALESCE(EXCLUDED.postal_code, profiles.postal_code),
    country = COALESCE(EXCLUDED.country, profiles.country),
    preferred_brands = COALESCE(EXCLUDED.preferred_brands, profiles.preferred_brands),
    marketing_email = COALESCE(EXCLUDED.marketing_email, profiles.marketing_email),
    marketing_sms = COALESCE(EXCLUDED.marketing_sms, profiles.marketing_sms),
    updated_at = NOW();

  -- Update user metadata with role if not set
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', default_role::text)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate them cleanly)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create RLS policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (for backup creation)
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Public profiles are viewable by everyone (for basic info like name, avatar)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- Update existing users without roles
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'user')
WHERE raw_user_meta_data->>'role' IS NULL;

-- Update existing profiles without roles
UPDATE profiles
SET role = 'user'::user_role
WHERE role IS NULL;

-- Ensure all existing auth users have profiles
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  COALESCE(
    NULLIF((u.raw_user_meta_data->>'role')::text, '')::user_role,
    'user'::user_role
  ),
  u.created_at,
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

