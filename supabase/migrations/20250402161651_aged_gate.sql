/*
  # Set VoiturePilotageJDM2025 as admin

  1. Changes
    - Set admin role for specified user ID
    - Update user metadata and profile role
*/

-- Set admin role for VoiturePilotageJDM2025
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get user ID by email
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'VoiturePilotageJDM2025';

  IF admin_id IS NOT NULL THEN
    -- Set admin role using the function
    PERFORM set_admin_role(admin_id);
  END IF;
END $$;