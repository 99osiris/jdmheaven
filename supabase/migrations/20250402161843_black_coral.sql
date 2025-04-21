/*
  # Update admin credentials

  1. Changes
    - Update admin email to pn.celletti@gmail.com
    - Set new admin role for the updated email
*/

-- Revoke admin role from old email
DO $$
DECLARE
  old_admin_id uuid;
BEGIN
  -- Get old admin user ID
  SELECT id INTO old_admin_id
  FROM auth.users
  WHERE email = 'VoiturePilotageJDM2025';

  IF old_admin_id IS NOT NULL THEN
    -- Reset to regular user
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data - 'role'
    WHERE id = old_admin_id;

    UPDATE profiles
    SET role = 'user'
    WHERE id = old_admin_id;
  END IF;
END $$;

-- Set admin role for new email
DO $$
DECLARE
  new_admin_id uuid;
BEGIN
  -- Get user ID by email
  SELECT id INTO new_admin_id
  FROM auth.users
  WHERE email = 'pn.celletti@gmail.com';

  IF new_admin_id IS NOT NULL THEN
    -- Set admin role using the function
    PERFORM set_admin_role(new_admin_id);
  END IF;
END $$;