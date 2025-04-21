-- Create shipping_calculations table if it doesn't exist
CREATE TABLE IF NOT EXISTS shipping_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  dimensions jsonb NOT NULL,
  origin text NOT NULL,
  destination text NOT NULL,
  cbm numeric NOT NULL,
  chargeable_weight numeric NOT NULL,
  calculated_rates jsonb NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS if not already enabled
ALTER TABLE shipping_calculations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create shipping calculations" ON shipping_calculations;
DROP POLICY IF EXISTS "Users can view own shipping calculations" ON shipping_calculations;

-- Create new policies
CREATE POLICY "Users can create shipping calculations"
  ON shipping_calculations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own shipping calculations"
  ON shipping_calculations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create indices if they don't exist
CREATE INDEX IF NOT EXISTS idx_shipping_calculations_user_id ON shipping_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_shipping_calculations_created_at ON shipping_calculations(created_at DESC);