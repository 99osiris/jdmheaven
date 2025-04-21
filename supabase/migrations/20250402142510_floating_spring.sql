/*
  # Enhance profiles table with additional user information

  1. Changes
    - Add address fields (street, city, postal_code, country)
    - Add phone number
    - Add preferred brands/cars field
    - Add marketing preferences

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS street_address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS preferred_brands text[],
ADD COLUMN IF NOT EXISTS marketing_email boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS marketing_sms boolean DEFAULT false;