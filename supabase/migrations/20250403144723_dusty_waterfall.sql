/*
  # Add shipping calculations table

  1. New Tables
    - `shipping_calculations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `dimensions` (jsonb)
      - `origin` (text)
      - `destination` (text)
      - `cbm` (numeric)
      - `chargeable_weight` (numeric)
      - `calculated_rates` (jsonb)
      - `user_id` (uuid, references profiles)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create shipping_calculations table
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

-- Enable RLS
ALTER TABLE shipping_calculations ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create index for user lookups
CREATE INDEX idx_shipping_calculations_user_id ON shipping_calculations(user_id);
CREATE INDEX idx_shipping_calculations_created_at ON shipping_calculations(created_at DESC);