/*
  # Fix schema issues and ensure proper permissions

  1. Changes
    - Ensure proper schema access for authenticated users
    - Add missing RLS policies
    - Fix profile table constraints
*/

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Ensure proper RLS policies exist
DO $$ BEGIN
  -- Profiles policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Enable RLS if not already enabled
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
END $$;

-- Ensure proper foreign key constraints
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure proper indices exist
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Grant necessary table permissions
GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Fix any orphaned profiles
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- Ensure admin user exists and has proper role
DO $$ 
DECLARE
  admin_id uuid;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'pn.celletti@gmail.com';

  IF admin_id IS NOT NULL THEN
    -- Update user metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    )
    WHERE id = admin_id;

    -- Update or insert profile
    INSERT INTO profiles (id, email, role, created_at, updated_at)
    VALUES (
      admin_id,
      'pn.celletti@gmail.com',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      role = 'admin',
      updated_at = NOW();
  END IF;
END $$;