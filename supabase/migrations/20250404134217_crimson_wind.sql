/*
  # Enhance inventory tracking and locations

  1. Changes
    - Add location tracking for cars
    - Add stock status and alerts
    - Add real-time inventory updates
    - Add inventory history

  2. Security
    - Maintain RLS policies
    - Add proper role-based access
*/

-- Add locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add inventory_status enum
CREATE TYPE inventory_status AS ENUM (
  'available',
  'reserved',
  'sold',
  'in_transit',
  'maintenance'
);

-- Add inventory_history table
CREATE TABLE IF NOT EXISTS inventory_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  status inventory_status NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Add stock_alerts table
CREATE TABLE IF NOT EXISTS stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  make text,
  model text,
  year_min integer,
  year_max integer,
  price_max numeric(12,2),
  created_at timestamptz DEFAULT now(),
  last_notified_at timestamptz,
  is_active boolean DEFAULT true
);

-- Add location_id to cars table
ALTER TABLE cars
ADD COLUMN IF NOT EXISTS location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status inventory_status DEFAULT 'available'::inventory_status;

-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view locations"
  ON locations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Staff can manage locations"
  ON locations
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

CREATE POLICY "Staff can view inventory history"
  ON inventory_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage inventory history"
  ON inventory_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Users can manage own alerts"
  ON stock_alerts
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indices
CREATE INDEX IF NOT EXISTS idx_cars_location ON cars(location_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_inventory_history_car ON inventory_history(car_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_location ON inventory_history(location_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_user ON stock_alerts(user_id);

-- Insert sample locations
INSERT INTO locations (name, address, city, country) VALUES
('Rotterdam Port', 'Havenbedrijf Rotterdam', 'Rotterdam', 'Netherlands'),
('Amsterdam Showroom', 'Dam Square 1', 'Amsterdam', 'Netherlands'),
('Antwerp Warehouse', 'Port of Antwerp', 'Antwerp', 'Belgium');

-- Create function to track inventory changes
CREATE OR REPLACE FUNCTION track_inventory_changes()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND 
      (OLD.status IS DISTINCT FROM NEW.status OR OLD.location_id IS DISTINCT FROM NEW.location_id)) THEN
    INSERT INTO inventory_history (
      car_id,
      location_id,
      status,
      notes,
      created_by
    ) VALUES (
      NEW.id,
      NEW.location_id,
      NEW.status,
      CASE
        WHEN OLD.status IS DISTINCT FROM NEW.status THEN 
          'Status changed from ' || OLD.status || ' to ' || NEW.status
        ELSE 
          'Location changed'
      END,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for inventory tracking
DROP TRIGGER IF EXISTS inventory_changes_trigger ON cars;
CREATE TRIGGER inventory_changes_trigger
  AFTER UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION track_inventory_changes();

-- Create function to check stock alerts
CREATE OR REPLACE FUNCTION check_stock_alerts()
RETURNS void AS $$
DECLARE
  alert RECORD;
  matching_car RECORD;
BEGIN
  FOR alert IN
    SELECT * FROM stock_alerts WHERE is_active = true
  LOOP
    -- Check for matching cars
    SELECT * INTO matching_car
    FROM cars
    WHERE status = 'available'
    AND (alert.make IS NULL OR make = alert.make)
    AND (alert.model IS NULL OR model ILIKE '%' || alert.model || '%')
    AND (alert.year_min IS NULL OR year >= alert.year_min)
    AND (alert.year_max IS NULL OR year <= alert.year_max)
    AND (alert.price_max IS NULL OR price <= alert.price_max)
    AND (
      alert.last_notified_at IS NULL OR
      cars.created_at > alert.last_notified_at
    )
    LIMIT 1;

    -- If match found, create notification
    IF FOUND THEN
      -- Update last notified timestamp
      UPDATE stock_alerts
      SET last_notified_at = NOW()
      WHERE id = alert.id;

      -- Here you would typically trigger an external notification
      -- For now, we'll just log it in a notifications table
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type
      ) VALUES (
        alert.user_id,
        'Car Match Found',
        'A car matching your alert criteria is now available: ' || 
        matching_car.year || ' ' || matching_car.make || ' ' || matching_car.model,
        'stock_alert'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;