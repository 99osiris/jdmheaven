/*
  # Fix admin authentication and role handling

  1. Changes
    - Reset and recreate admin user with proper credentials
    - Ensure proper role handling in auth and profiles tables
    - Fix role type casting issues in policies

  2. Security
    - Maintain existing RLS policies
    - Update role checks to use proper type casting
*/

-- Ensure user_role type exists
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Function to properly handle role updates
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS trigger AS $$
BEGIN
  -- Update auth.users metadata when profile role changes
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      to_jsonb(NEW.role::text)
    )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for role synchronization
DROP TRIGGER IF EXISTS sync_user_role_trigger ON profiles;
CREATE TRIGGER sync_user_role_trigger
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_role();

-- Reset and create admin user
DO $$
DECLARE
  admin_email text := 'admin@jdmicons.com';
  admin_password text := 'AdminJDM2025!';
  admin_id uuid;
BEGIN
  -- Remove existing admin user if exists
  DELETE FROM auth.users WHERE email = admin_email;
  
  -- Create new admin user
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
    jsonb_build_object(
      'role', 'admin',
      'full_name', 'System Administrator'
    ),
    NOW(),
    NOW(),
    '',
    '',
    ''
  )
  RETURNING id INTO admin_id;

  -- Create or update admin profile
  INSERT INTO profiles (
    id,
    email,
    role,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    admin_id,
    admin_email,
    'admin'::user_role,
    'System Administrator',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = 'admin'::user_role,
    updated_at = NOW();
END $$;

-- Update RLS policies to use proper type casting
DO $$ BEGIN
  -- Update profiles policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  CREATE POLICY "Users can view own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    );

  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
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

  -- Update blog posts policies
  DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
  CREATE POLICY "Admins can manage blog posts"
    ON blog_posts
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role')::user_role = 'admin'::user_role)
    WITH CHECK ((auth.jwt() ->> 'role')::user_role = 'admin'::user_role);
END $$;