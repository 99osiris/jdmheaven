/*
  # Add RLS policies for shipping calculations

  1. Changes
    - Add RLS policy to allow public inserts into shipping_calculations table
    - Add RLS policy to allow authenticated users to view their own calculations
  
  2. Security
    - Enable RLS on shipping_calculations table (if not already enabled)
    - Add policy for public inserts if it doesn't exist
    - Add policy for authenticated users to view their calculations if it doesn't exist
*/

-- Enable RLS if not already enabled
ALTER TABLE shipping_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$ 
BEGIN
  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shipping_calculations' AND policyname = 'Anyone can create shipping calculations'
  ) THEN
    CREATE POLICY "Anyone can create shipping calculations"
      ON shipping_calculations
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  -- Check if the policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'shipping_calculations' AND policyname = 'Users can view own shipping calculations'
  ) THEN
    CREATE POLICY "Users can view own shipping calculations"
      ON shipping_calculations
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;