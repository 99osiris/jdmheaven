/*
  # Add admin role and update profiles table

  1. Changes
    - Add role field to profiles table
    - Add admin role to auth.users
*/

-- Add role column to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create function to set admin role
CREATE OR REPLACE FUNCTION set_admin_role(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"admin"'
  )
  WHERE id = user_id;

  -- Update profiles role
  UPDATE profiles
  SET role = 'admin'
  WHERE id = user_id;
END;
$$;