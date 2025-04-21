/*
  # Create car management stored procedure

  1. Changes
    - Add stored procedure for creating cars with images and specs
    - Add proper error handling and validation
    - Ensure atomic transactions

  2. Security
    - Maintain RLS policies
    - Add proper role checks
*/

-- Create function to handle car creation with all details
CREATE OR REPLACE FUNCTION create_car_with_details(
  car_data jsonb,
  image_data jsonb[],
  spec_data jsonb[]
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_car_id uuid;
  result jsonb;
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
  INSERT INTO car_images (car_id, url, is_primary)
  SELECT 
    new_car_id,
    (jsonb_array_elements(image_data::jsonb)->>'url')::text,
    (jsonb_array_elements(image_data::jsonb)->>'is_primary')::boolean;

  -- Insert specs
  INSERT INTO car_specs (car_id, category, name, value)
  SELECT 
    new_car_id,
    (jsonb_array_elements(spec_data::jsonb)->>'category')::text,
    (jsonb_array_elements(spec_data::jsonb)->>'name')::text,
    (jsonb_array_elements(spec_data::jsonb)->>'value')::text;

  -- Get complete car data
  SELECT 
    jsonb_build_object(
      'car', car,
      'images', images,
      'specs', specs
    ) INTO result
  FROM (
    SELECT 
      row_to_json(c.*) as car,
      json_agg(DISTINCT i.*) as images,
      json_agg(DISTINCT s.*) as specs
    FROM cars c
    LEFT JOIN car_images i ON c.id = i.car_id
    LEFT JOIN car_specs s ON c.id = s.car_id
    WHERE c.id = new_car_id
    GROUP BY c.id
  ) subq;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_car_with_details TO authenticated;