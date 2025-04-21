/*
  # Add vehicle tracking tables

  1. New Tables
    - `vehicle_history`
      - `id` (uuid, primary key)
      - `vin` (text)
      - `event` (text)
      - `location` (text)
      - `timestamp` (timestamptz)
      - `details` (text)
      - `status` (text)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create vehicle_history table
CREATE TABLE IF NOT EXISTS vehicle_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vin text NOT NULL,
  event text NOT NULL,
  location text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  details text,
  status text NOT NULL CHECK (status IN ('in_transit', 'customs', 'delivered', 'processing')),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE vehicle_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can manage vehicle history"
  ON vehicle_history
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Users can view vehicle history"
  ON vehicle_history
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indices
CREATE INDEX idx_vehicle_history_vin ON vehicle_history(vin);
CREATE INDEX idx_vehicle_history_timestamp ON vehicle_history(timestamp DESC);
CREATE INDEX idx_vehicle_history_status ON vehicle_history(status);