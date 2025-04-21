/*
  # Fix car creation permissions and function

  1. Changes
    - Update create_car_with_details function
    - Fix RLS policies for car creation
    - Add proper error handling

  2. Security
    - Maintain RLS policies
    - Ensure proper role checks
*/

-- Drop and recreate the function with better error handling
CREATE OR REPLACE FUNCTION create_car_with_details(
  car_data jsonb,
  image_data jsonb[],
  spec_data jsonb[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_car_id uuid;
  result jsonb;
BEGIN
  -- Verify user has proper role
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('staff', 'admin')
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only staff and admin can create cars';
  END IF;

  -- Start transaction
  BEGIN
    -- Insert car
    INSERT INTO cars (
      reference_number,
      make,
      model,
      year,
      price,
      mileage,
      engine_type,
      engine_size,
      transmission,
      drivetrain,
      horsepower,
      torque,
      color,
      location,
      status,
      description,
      features
    )
    SELECT
      car_data->>'reference_number',
      car_data->>'make',
      car_data->>'model',
      (car_data->>'year')::integer,
      (car_data->>'price')::decimal,
      (car_data->>'mileage')::integer,
      car_data->>'engine_type',
      car_data->>'engine_size',
      car_data->>'transmission',
      car_data->>'drivetrain',
      (car_data->>'horsepower')::integer,
      car_data->>'torque',
      car_data->>'color',
      car_data->>'location',
      COALESCE(car_data->>'status', 'available'),
      car_data->>'description',
      CASE 
        WHEN car_data->'features' IS NOT NULL 
        THEN ARRAY(SELECT jsonb_array_elements_text(car_data->'features'))
        ELSE NULL
      END
    RETURNING id INTO new_car_id;

    -- Insert images
    IF array_length(image_data, 1) > 0 THEN
      INSERT INTO car_images (car_id, url, is_primary)
      SELECT 
        new_car_id,
        (jsonb_array_elements(image_data::jsonb)->>'url')::text,
        (jsonb_array_elements(image_data::jsonb)->>'is_primary')::boolean;
    END IF;

    -- Insert specs
    IF array_length(spec_data, 1) > 0 THEN
      INSERT INTO car_specs (car_id, category, name, value)
      SELECT 
        new_car_id,
        (jsonb_array_elements(spec_data::jsonb)->>'category')::text,
        (jsonb_array_elements(spec_data::jsonb)->>'name')::text,
        (jsonb_array_elements(spec_data::jsonb)->>'value')::text;
    END IF;

    -- Get complete car data
    SELECT 
      jsonb_build_object(
        'car', car,
        'images', COALESCE(images, '[]'::json),
        'specs', COALESCE(specs, '[]'::json)
      ) INTO result
    FROM (
      SELECT 
        row_to_json(c.*) as car,
        COALESCE(json_agg(DISTINCT i.*) FILTER (WHERE i.id IS NOT NULL), '[]'::json) as images,
        COALESCE(json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL), '[]'::json) as specs
      FROM cars c
      LEFT JOIN car_images i ON c.id = i.car_id
      LEFT JOIN car_specs s ON c.id = s.car_id
      WHERE c.id = new_car_id
      GROUP BY c.id
    ) subq;

    RETURN result;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Failed to create car: %', SQLERRM;
  END;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_car_with_details TO authenticated;

-- Ensure RLS is enabled
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_specs ENABLE ROW LEVEL SECURITY;

-- Update RLS policies
DROP POLICY IF EXISTS "Staff and admins can manage cars" ON cars;
CREATE POLICY "Staff and admins can manage cars"
  ON cars
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

-- Add policies for car_images and car_specs
DROP POLICY IF EXISTS "Staff and admins can manage car images" ON car_images;
CREATE POLICY "Staff and admins can manage car images"
  ON car_images
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

DROP POLICY IF EXISTS "Staff and admins can manage car specs" ON car_specs;
CREATE POLICY "Staff and admins can manage car specs"
  ON car_specs
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