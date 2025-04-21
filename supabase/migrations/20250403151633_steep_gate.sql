/*
  # Fix user creation and role handling

  1. Changes
    - Drop and recreate handle_new_user function with proper role handling
    - Update trigger to properly handle user metadata
    - Fix role type casting issues

  2. Security
    - Maintain existing RLS policies
    - Ensure proper role assignment
*/

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles with proper role handling
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'user'::user_role
    ),
    NOW(),
    NOW()
  );

  -- Update user metadata if role is not set
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      CASE 
        WHEN raw_user_meta_data IS NULL THEN 
          jsonb_build_object('role', 'user')
        ELSE 
          raw_user_meta_data || jsonb_build_object('role', 'user')
      END
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure proper permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Update existing users without roles
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN 
      jsonb_build_object('role', 'user')
    WHEN raw_user_meta_data->>'role' IS NULL THEN
      raw_user_meta_data || jsonb_build_object('role', 'user')
    ELSE 
      raw_user_meta_data
  END
WHERE raw_user_meta_data->>'role' IS NULL;

-- Update profiles without roles
UPDATE profiles
SET role = 'user'
WHERE role IS NULL;