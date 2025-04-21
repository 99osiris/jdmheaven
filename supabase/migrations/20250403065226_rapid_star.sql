/*
  # Add support for Google OAuth

  1. Changes
    - Add Google OAuth provider configuration
    - Update user profile handling for Google sign-ins
    - Add migration to handle Google authenticated users

  2. Security
    - Maintain existing RLS policies
    - Ensure proper role assignment for Google users
*/

-- Function to handle new user creation (including Google OAuth)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Get role and full name from metadata or set defaults
  INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'User'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to sync user metadata with profile
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS trigger AS $$
BEGIN
  -- Update profile when user metadata changes
  UPDATE profiles
  SET
    full_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      profiles.full_name
    ),
    avatar_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      profiles.avatar_url
    ),
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for metadata synchronization
DROP TRIGGER IF EXISTS sync_user_metadata_trigger ON auth.users;
CREATE TRIGGER sync_user_metadata_trigger
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_metadata();