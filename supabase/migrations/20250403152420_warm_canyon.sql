/*
  # Fix User Signup and Role Handling

  1. Changes
    - Drop and recreate handle_new_user function with better error handling
    - Add proper role validation and default values
    - Fix profile creation process
    - Update existing trigger

  2. Security
    - Maintain RLS policies
    - Ensure proper role assignment
*/

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role user_role;
BEGIN
  -- Set default role if not provided
  default_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'user'::user_role
  );

  -- Create profile with proper error handling
  BEGIN
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
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      default_role,
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
      COALESCE((NEW.raw_user_meta_data->>'marketing_sms')::boolean, false),
      NOW(),
      NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
  END;

  -- Update user metadata with role if not set
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      CASE 
        WHEN raw_user_meta_data IS NULL THEN 
          jsonb_build_object('role', default_role)
        ELSE 
          raw_user_meta_data || jsonb_build_object('role', default_role)
      END
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
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