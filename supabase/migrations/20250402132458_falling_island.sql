/*
  # Vehicle Inventory System Schema

  1. New Tables
    - `cars`: Main vehicle inventory table
    - `car_images`: Vehicle images (multiple per car)
    - `car_specs`: Detailed vehicle specifications
    - `car_comparisons`: User car comparison lists
    - `custom_requests`: Custom car requests from users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for staff members

  3. Changes
    - Add foreign key relationships between tables
    - Add indexes for frequently queried fields
*/

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal(12,2) NOT NULL,
  mileage integer,
  engine_type text,
  engine_size text,
  transmission text,
  drivetrain text,
  horsepower integer,
  torque text,
  color text,
  location text,
  status text DEFAULT 'available',
  description text,
  features text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create car_images table
CREATE TABLE IF NOT EXISTS car_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  url text NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create car_specs table
CREATE TABLE IF NOT EXISTS car_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create car_comparisons table
CREATE TABLE IF NOT EXISTS car_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  cars uuid[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create custom_requests table
CREATE TABLE IF NOT EXISTS custom_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  make text NOT NULL,
  model text,
  year_min integer,
  year_max integer,
  price_min decimal(12,2),
  price_max decimal(12,2),
  preferred_specs text[],
  additional_notes text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_requests ENABLE ROW LEVEL SECURITY;

-- Cars policies
CREATE POLICY "Anyone can view available cars"
  ON cars
  FOR SELECT
  TO public
  USING (status = 'available');

CREATE POLICY "Staff can manage cars"
  ON cars
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'staff');

-- Car images policies
CREATE POLICY "Anyone can view car images"
  ON car_images
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Staff can manage car images"
  ON car_images
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'staff');

-- Car specs policies
CREATE POLICY "Anyone can view car specs"
  ON car_specs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Staff can manage car specs"
  ON car_specs
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff')
  WITH CHECK (auth.jwt() ->> 'role' = 'staff');

-- Car comparisons policies
CREATE POLICY "Users can manage own comparisons"
  ON car_comparisons
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Custom requests policies
CREATE POLICY "Users can manage own requests"
  ON custom_requests
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all requests"
  ON custom_requests
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cars_reference ON cars(reference_number);
CREATE INDEX IF NOT EXISTS idx_cars_make_model ON cars(make, model);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year);
CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images(car_id);
CREATE INDEX IF NOT EXISTS idx_car_specs_car_id ON car_specs(car_id);
CREATE INDEX IF NOT EXISTS idx_custom_requests_status ON custom_requests(status);