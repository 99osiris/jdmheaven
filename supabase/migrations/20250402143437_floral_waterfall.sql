/*
  # Add RLS policies for car comparisons table

  1. Security
    - Enable RLS on car_comparisons table
    - Add policies for authenticated users to:
      - Create new comparisons
      - View their own comparisons
      - Manage their own comparisons
*/

-- Enable RLS
ALTER TABLE car_comparisons ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DO $$ BEGIN
  -- Create policy for managing own comparisons
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'car_comparisons' AND policyname = 'Users can manage own comparisons'
  ) THEN
    CREATE POLICY "Users can manage own comparisons"
    ON car_comparisons
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;

  -- Create policy for viewing own comparisons
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'car_comparisons' AND policyname = 'Users can view own comparisons'
  ) THEN
    CREATE POLICY "Users can view own comparisons"
    ON car_comparisons
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;