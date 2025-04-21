-- Fix role handling in handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles with role from metadata
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
    (NEW.raw_user_meta_data->>'role')::user_role,
    NEW.raw_user_meta_data->>'full_name',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure admin user exists with correct role
DO $$
DECLARE
  admin_email text := 'admin@jdmicons.com';
  admin_password text := 'AdminJDM2025!';
  admin_id uuid;
BEGIN
  -- Check if admin exists
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = admin_email;

  IF admin_id IS NULL THEN
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
      '{"role":"admin","full_name":"System Administrator"}',
      NOW(),
      NOW(),
      '',
      '',
      ''
    )
    RETURNING id INTO admin_id;
  ELSE
    -- Update existing admin
    UPDATE auth.users
    SET 
      raw_user_meta_data = jsonb_build_object('role', 'admin', 'full_name', 'System Administrator'),
      updated_at = NOW()
    WHERE id = admin_id;
  END IF;

  -- Ensure admin profile exists with correct role
  INSERT INTO public.profiles (
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
    'admin',
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

-- Update RLS policies to use proper role checking
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