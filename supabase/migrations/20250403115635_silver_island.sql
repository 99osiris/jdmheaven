/*
  # Fix Cars Table RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies without role type casting
    - Add necessary indices for performance

  2. Security
    - Allow public access to available cars
    - Restrict management to staff and admin users
    - Use EXISTS subqueries for role checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;

-- Create new public access policy
CREATE POLICY "Anyone can view available cars"
  ON cars
  FOR SELECT
  TO public
  USING (status = 'available');

-- Create management policy for staff and admins
CREATE POLICY "Staff and admins can manage cars"
  ON cars
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role::text IN ('staff', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role::text IN ('staff', 'admin')
    )
  );

-- Ensure proper indices exist
CREATE INDEX IF NOT EXISTS idx_cars_status_created ON cars(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_reference ON cars(reference_number);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);