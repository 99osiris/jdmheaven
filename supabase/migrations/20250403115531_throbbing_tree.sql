/*
  # Fix RLS Policies for Cars Table

  1. Changes
    - Drop existing policies
    - Create new policies that properly handle role checks
    - Add necessary indices for performance

  2. Security
    - Allow public access to available cars
    - Restrict management to staff and admin users
    - Use proper role checking through profiles table
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;
DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;

-- Create new policies
CREATE POLICY "Anyone can view available cars"
  ON cars
  FOR SELECT
  TO public
  USING (status = 'available');

CREATE POLICY "Staff and admins can manage cars"
  ON cars
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff'::user_role, 'admin'::user_role)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff'::user_role, 'admin'::user_role)
    )
  );

-- Ensure proper indices exist
CREATE INDEX IF NOT EXISTS idx_cars_status_created ON cars(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cars_reference ON cars(reference_number);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);