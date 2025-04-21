/*
  # Create admin user if not exists
  
  1. Changes
    - Check if admin user exists
    - Create admin user if not exists
    - Update user role and profile
    
  2. Security
    - Use secure password hashing
    - Set proper user metadata
*/

DO $$
DECLARE
  admin_email text := 'admin@jdmicons.com';
  admin_password text := 'AdminJDM2025!';
  new_user_id uuid;
BEGIN
  -- Check if admin user exists
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = admin_email;

  -- If admin doesn't exist, create it
  IF new_user_id IS NULL THEN
    -- Insert into auth.users
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
    SELECT
      new_user_id,
      admin_email,
      'admin',
      'System Administrator',
      NOW(),
      NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = new_user_id
    );
  END IF;
END $$;