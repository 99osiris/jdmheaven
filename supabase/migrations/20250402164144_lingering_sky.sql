/*
  # Fix Authentication Issues

  1. Changes
    - Drop and recreate user_role enum type
    - Update profiles table role column
    - Fix role handling in auth policies
    - Create default admin user

  2. Security
    - Update RLS policies to use proper role checks
    - Ensure proper role assignment in user metadata
*/

-- Recreate user_role enum type
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');

-- Update profiles table
ALTER TABLE profiles
DROP COLUMN IF EXISTS role CASCADE;

ALTER TABLE profiles
ADD COLUMN role user_role NOT NULL DEFAULT 'user'::user_role;

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
  NULLIF(NEW.raw_user_meta_data->>'role', '')::user_role,
  'user'::user_role
)
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update existing users' roles
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'
)
WHERE raw_user_meta_data->>'role' IS NULL;

-- Create default admin user if not exists
DO $$
DECLARE
  admin_email text := 'admin@jdmicons.com';
  admin_password text := 'AdminJDM2025!';
  new_user_id uuid;
BEGIN
  -- Check if admin exists
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = admin_email;

  IF new_user_id IS NULL THEN
    -- Create admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      NOW(),
      NOW(),
      '',
      '',
      ''
    )
    RETURNING id INTO new_user_id;

    -- Create admin profile
    INSERT INTO public.profiles (
      id,
      email,
      role,
      full_name,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id,
      admin_email,
      'admin',
      'System Administrator',
      NOW(),
      NOW()
    );
  ELSE
    -- Update existing admin
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    )
    WHERE id = new_user_id;

    UPDATE profiles
    SET role = 'admin'::user_role
    WHERE id = new_user_id;
  END IF;
END $$;

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

  -- Create new policies
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