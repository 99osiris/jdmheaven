/*
  # Fix Authentication Schema and Role Handling

  1. Changes
    - Create user_role enum type
    - Add role column to profiles table
    - Fix functions and triggers
    - Update RLS policies

  2. Security
    - Maintain existing RLS policies
    - Ensure proper role assignment
*/

-- Create user_role enum type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table if it doesn't exist
DO $$ BEGIN
  ALTER TABLE profiles ADD COLUMN role user_role NOT NULL DEFAULT 'user'::user_role;
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- Fix handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role user_role;
BEGIN
  -- Get role from metadata with proper error handling
  BEGIN
    default_role := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'user'::user_role
    );
  EXCEPTION
    WHEN invalid_text_representation THEN
      default_role := 'user'::user_role;
  END;

  -- Create profile with safe defaults
  INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_role,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NOW(),
    NOW()
  );

  -- Ensure user metadata has role
  IF NEW.raw_user_meta_data IS NULL OR NEW.raw_user_meta_data->>'role' IS NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(default_role::text)
      )
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix role synchronization with error handling
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.role IS DISTINCT FROM NEW.role) THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(NEW.role::text)
      ),
    updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix metadata synchronization with error handling
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS trigger AS $$
DECLARE
  new_role user_role;
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data) THEN
    BEGIN
      new_role := (NEW.raw_user_meta_data->>'role')::user_role;
    EXCEPTION
      WHEN invalid_text_representation THEN
        new_role := NULL;
    END;

    UPDATE profiles
    SET
      role = COALESCE(new_role, role),
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS sync_user_role_trigger ON profiles;
CREATE TRIGGER sync_user_role_trigger
  AFTER UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_user_role();

DROP TRIGGER IF EXISTS sync_user_metadata_trigger ON auth.users;
CREATE TRIGGER sync_user_metadata_trigger
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_metadata();

-- Fix existing users
UPDATE auth.users
SET raw_user_meta_data = 
  CASE
    WHEN raw_user_meta_data->>'role' IS NULL THEN
      jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"user"')
    ELSE raw_user_meta_data
  END,
updated_at = NOW()
WHERE raw_user_meta_data->>'role' IS NULL;

-- Update profiles for consistency
UPDATE profiles
SET role = COALESCE(
  (SELECT (u.raw_user_meta_data->>'role')::user_role
   FROM auth.users u
   WHERE u.id = profiles.id),
  'user'::user_role
)
WHERE role IS NULL;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DO $$ BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

  -- Create new policies with proper role checks
  CREATE POLICY "Users can view own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    );

  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    )
    WITH CHECK (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    );
END $$;