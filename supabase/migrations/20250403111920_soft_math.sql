/*
  # Fix RLS policies to prevent infinite recursion

  1. Changes
    - Update RLS policies to avoid recursive checks
    - Use direct role checks from auth.jwt() instead of subqueries
    - Add proper indices for performance

  2. Security
    - Maintain existing security rules
    - Ensure proper role-based access
*/

-- Update cars policies
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
CREATE POLICY "Anyone can view available cars"
  ON cars
  FOR SELECT
  USING (status = 'available');

DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;
CREATE POLICY "Staff and admins can manage cars"
  ON cars
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::user_role IN ('staff', 'admin')
  )
  WITH CHECK (
    (auth.jwt() ->> 'role')::user_role IN ('staff', 'admin')
  );

-- Update blog posts policies
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON blog_posts;
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::user_role = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'role')::user_role = 'admin'
  );

-- Update profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    (auth.jwt() ->> 'role')::user_role = 'admin'
  );

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    id = auth.uid() OR
    (auth.jwt() ->> 'role')::user_role = 'admin'
  )
  WITH CHECK (
    id = auth.uid() OR
    (auth.jwt() ->> 'role')::user_role = 'admin'
  );

-- Add performance indices
CREATE INDEX IF NOT EXISTS idx_cars_status_created ON cars(status, created_at DESC);