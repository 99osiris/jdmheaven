/*
  # Set up user roles and permissions

  1. Changes
    - Create role enum type
    - Add role-based policies for admin access
    - Create function to manage user roles
    - Set up initial admin user

  2. Security
    - Enable RLS
    - Add policies for role-based access
*/

-- Create role enum type
CREATE TYPE user_role AS ENUM ('user', 'staff', 'admin');

-- Create a temporary column for the role enum
ALTER TABLE profiles
ADD COLUMN role_enum user_role;

-- Convert existing text roles to enum values
UPDATE profiles
SET role_enum = CASE
  WHEN role = 'admin' THEN 'admin'::user_role
  WHEN role = 'staff' THEN 'staff'::user_role
  ELSE 'user'::user_role
END;

-- Drop the old role column and rename the new one
ALTER TABLE profiles
DROP COLUMN role,
ADD COLUMN role user_role DEFAULT 'user'::user_role;

-- Copy data from temporary column
UPDATE profiles
SET role = role_enum;

-- Drop the temporary column
ALTER TABLE profiles
DROP COLUMN role_enum;

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
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    OR auth.uid() = id
  );

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

-- Update existing admin policies to use the new role type
DO $$
BEGIN
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