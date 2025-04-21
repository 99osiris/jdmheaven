/*
  # Add system settings table

  1. New Tables
    - `system_settings`
      - `id` (text, primary key)
      - `settings` (jsonb)
      - `updated_by` (uuid, references profiles)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id text PRIMARY KEY,
  settings jsonb NOT NULL,
  updated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO system_settings (id, settings)
VALUES (
  'global',
  '{
    "siteName": "JDM HEAVEN",
    "contactEmail": "info@jdmheaven.com",
    "phoneNumber": "+31 (0) 10 123 4567",
    "address": "123 Import Drive, Rotterdam, Netherlands",
    "businessHours": {
      "weekdays": "09:00 - 18:00",
      "saturday": "10:00 - 16:00",
      "sunday": "Closed"
    },
    "socialMedia": {
      "facebook": "https://facebook.com/jdmheaven",
      "instagram": "https://instagram.com/jdmheaven",
      "youtube": "https://youtube.com/jdmheaven"
    },
    "notifications": {
      "emailNotifications": true,
      "smsNotifications": true,
      "newRequestNotifications": true,
      "newMessageNotifications": true
    }
  }'
)
ON CONFLICT (id) DO NOTHING;