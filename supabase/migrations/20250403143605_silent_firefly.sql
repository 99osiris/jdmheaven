/*
  # Fix Car Comparisons RLS Policies

  1. Changes
    - Drop existing policies
    - Create new policies for car comparisons table
    - Add proper user_id check for INSERT operations

  2. Security
    - Enable RLS
    - Allow users to manage their own comparisons
    - Ensure proper user_id validation
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own comparisons" ON car_comparisons;
DROP POLICY IF EXISTS "Users can view own comparisons" ON car_comparisons;

-- Create new policies
CREATE POLICY "Users can manage own comparisons"
  ON car_comparisons
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() = user_id
  );

-- Ensure RLS is enabled
ALTER TABLE car_comparisons ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON car_comparisons TO authenticated;