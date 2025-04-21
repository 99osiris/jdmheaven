/*
  # Update role handling and policies

  1. Changes
    - Create user_role enum type
    - Convert role column to use enum
    - Update role management function
    - Update RLS policies to use enum type

  2. Security
    - Update policies to use type-safe role checks
    - Ensure proper role-based access control
*/

-- Create role enum type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add temporary column for the new enum type
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role_new user_role;

-- Update the temporary column with converted values
UPDATE profiles
SET role_new = CASE 
  WHEN role = 'admin' THEN 'admin'::user_role
  WHEN role = 'staff' THEN 'staff'::user_role
  ELSE 'user'::user_role
END;

-- Drop the old column and rename the new one
ALTER TABLE profiles 
DROP COLUMN IF EXISTS role;

ALTER TABLE profiles 
RENAME COLUMN role_new TO role;

-- Set the default value for the role column
ALTER TABLE profiles
ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Create function to manage user roles
CREATE OR REPLACE FUNCTION manage_user_role(
  user_id uuid,
  new_role user_role
)
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
    ('"' || new_role::text || '"')::jsonb
  )
  WHERE id = user_id;

  -- Update profiles role
  UPDATE profiles
  SET 
    role = new_role,
    updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Create admin-specific policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  CREATE POLICY "Admins can view all profiles"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
      OR auth.uid() = id
    );

  DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
  CREATE POLICY "Admins can update all profiles"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
      OR auth.uid() = id
    )
    WITH CHECK (
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
      OR auth.uid() = id
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
  DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;
  DROP POLICY IF EXISTS "Staff can manage cars" ON cars;
  CREATE POLICY "Staff and admins can manage cars"
    ON cars
    FOR ALL
    TO authenticated
    USING (
      (auth.jwt() ->> 'role')::user_role = ANY (ARRAY['staff'::user_role, 'admin'::user_role])
    )
    WITH CHECK (
      (auth.jwt() ->> 'role')::user_role = ANY (ARRAY['staff'::user_role, 'admin'::user_role])
    );
END $$;