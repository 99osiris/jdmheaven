/*
  # Fix RLS Policies for Public Access

  1. Changes
    - Update cars table policies to allow public access without role checks
    - Fix role-based policies to use proper type casting
    - Add proper indices for performance

  2. Security
    - Maintain proper access control
    - Ensure public can view available cars
    - Allow staff and admin management based on role
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;

-- Create new policies without role checks for public access
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
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('staff', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('staff', 'admin')
    )
  );

-- Ensure proper indices exist
CREATE INDEX IF NOT EXISTS idx_cars_status_created ON cars(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_reference ON cars(reference_number);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);