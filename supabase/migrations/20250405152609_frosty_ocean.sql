/*
  # Update default system settings with new contact information

  1. Changes
    - Update contact email, phone, and address in system_settings table
    - Ensure settings are properly formatted
*/

-- Update default settings with new contact information
UPDATE system_settings
SET settings = jsonb_build_object(
  'siteName', 'JDM HEAVEN',
  'contactEmail', 'sales@jdmheaven.club',
  'phoneNumber', '+33 7 84 94 80 24',
  'address', '129 Boulevard de Grenelle, Paris, France 75015',
  'businessHours', jsonb_build_object(
    'weekdays', '09:00 - 18:00',
    'saturday', '10:00 - 16:00',
    'sunday', 'Closed'
  ),
  'socialMedia', jsonb_build_object(
    'facebook', 'https://facebook.com/jdmheaven',
    'instagram', 'https://instagram.com/jdmheaven',
    'youtube', 'https://youtube.com/jdmheaven'
  ),
  'notifications', jsonb_build_object(
    'emailNotifications', true,
    'smsNotifications', true,
    'newRequestNotifications', true,
    'newMessageNotifications', true
  )
)
WHERE id = 'global';

-- Insert default settings if they don't exist
INSERT INTO system_settings (id, settings)
VALUES (
  'global',
  '{
    "siteName": "JDM HEAVEN",
    "contactEmail": "sales@jdmheaven.club",
    "phoneNumber": "+33 7 84 94 80 24",
    "address": "129 Boulevard de Grenelle, Paris, France 75015",
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