/*
  # Add car relationship to wishlists table

  1. Changes
    - Add foreign key constraint between wishlists.car_id and cars.id
    - Enable RLS on wishlists table
    - Add RLS policies for wishlist management

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their wishlists
*/

-- Add foreign key constraint if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'wishlists_car_id_fkey'
  ) THEN
    ALTER TABLE wishlists
    ADD CONSTRAINT wishlists_car_id_fkey
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Add RLS policies if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wishlists' AND policyname = 'Users can manage own wishlist'
  ) THEN
    CREATE POLICY "Users can manage own wishlist"
    ON wishlists
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'wishlists' AND policyname = 'Users can view own wishlist'
  ) THEN
    CREATE POLICY "Users can view own wishlist"
    ON wishlists
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;