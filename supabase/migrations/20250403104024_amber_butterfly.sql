/*
  # Fix admin authentication and role handling

  1. Changes
    - Create proper admin account with secure credentials
    - Update role handling functions
    - Fix role synchronization between auth and profiles
    - Add proper RLS policies for admin access

  2. Security
    - Ensure proper role assignment
    - Update security policies
    - Fix role synchronization
*/

-- Drop existing functions to recreate them properly
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS sync_user_role CASCADE;
DROP FUNCTION IF EXISTS sync_user_metadata CASCADE;

-- Create function to handle new user creation with proper role handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Get role from metadata or default to 'user'
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
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to sync role changes
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
      )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to sync metadata changes
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data) THEN
    UPDATE profiles
    SET
      role = COALESCE((NEW.raw_user_meta_data->>'role')::user_role, role),
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or recreate triggers
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

-- Create admin account with proper credentials
DO $$
DECLARE
  admin_email text := 'admin@jdmheaven.com';
  admin_password text := 'AdminJDM2025!';
  new_user_id uuid;
BEGIN
  -- Delete existing admin account if exists
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
    recovery_token,
    is_super_admin
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
    '',
    true
  )
  RETURNING id INTO new_user_id;

  -- Ensure admin profile exists
  INSERT INTO profiles (
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
    'admin'::user_role,
    'System Administrator',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    role = 'admin'::user_role,
    full_name = 'System Administrator',
    updated_at = NOW();
END $$;

-- Update RLS policies to properly handle admin access
DO $$ BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

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

  -- Update blog posts policy
  DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
  CREATE POLICY "Admins can manage blog posts"
    ON blog_posts
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role')::user_role = 'admin'::user_role)
    WITH CHECK ((auth.jwt() ->> 'role')::user_role = 'admin'::user_role);

  -- Update cars policy
  DROP POLICY IF EXISTS "Staff can manage cars" ON cars;
  CREATE POLICY "Staff and admins can manage cars"
    ON cars
    FOR ALL
    TO authenticated
    USING (
      (auth.jwt() ->> 'role')::user_role IN ('staff'::user_role, 'admin'::user_role)
    )
    WITH CHECK (
      (auth.jwt() ->> 'role')::user_role IN ('staff'::user_role, 'admin'::user_role)
    );
END $$;