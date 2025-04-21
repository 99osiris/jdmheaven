/*
  # Fix RLS Policies for Cars Table

  1. Changes
    - Drop existing policies
    - Create new public access policy for viewing available cars
    - Create new management policy for staff and admins
    - Add necessary indices for performance

  2. Security
    - Enable public access for viewing available cars
    - Restrict management to staff and admin roles
    - Use proper role checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;
DROP POLICY IF EXISTS "Staff can manage cars" ON cars;

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
      AND p.role IN ('staff', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('staff', 'admin')
    )
  );

-- Ensure proper indices exist
CREATE INDEX IF NOT EXISTS idx_cars_status_created ON cars(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_reference ON cars(reference_number);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Ensure RLS is enabled
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;