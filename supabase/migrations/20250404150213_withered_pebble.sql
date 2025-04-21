/*
  # Fix drivetrain column name

  1. Changes
    - Rename drivetrain_type to drivetrain in cars table
    - Update create_car_with_details function
    - Add missing column if it doesn't exist

  2. Security
    - Maintain existing RLS policies
*/

-- Check if drivetrain column exists, if not create it
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cars' AND column_name = 'drivetrain'
  ) THEN
    ALTER TABLE cars ADD COLUMN drivetrain text;
  END IF;
END $$;

-- Drop and recreate the function with correct column names
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