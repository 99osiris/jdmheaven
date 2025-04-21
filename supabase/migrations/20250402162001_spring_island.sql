/*
  # Create or update admin account

  1. Changes
    - Create admin user if not exists
    - Update existing user to admin role if exists
    - Handle profile creation/update properly
*/

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'pn.celletti@gmail.com';

  -- If user doesn't exist, create it
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
      'pn.celletti@gmail.com',
      crypt('MitsubishiNissan2025!', gen_salt('bf')),
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

    -- Create profile only if it doesn't exist
    INSERT INTO public.profiles (
      id,
      email,
      role,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id,
      'pn.celletti@gmail.com',
      'admin',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      role = 'admin',
      updated_at = NOW();
  ELSE
    -- Update existing user to admin
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    )
    WHERE id = new_user_id;

    -- Update existing profile
    UPDATE public.profiles
    SET 
      role = 'admin',
      updated_at = NOW()
    WHERE id = new_user_id;
  END IF;
END $$;