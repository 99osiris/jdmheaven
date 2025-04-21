/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `subject` (text)
      - `message` (text)
      - `car_reference` (text, nullable)
      - `status` (text)

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policies for inserting new submissions
    - Add policies for staff to read submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  car_reference text,
  status text DEFAULT 'new'
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a new submission
CREATE POLICY "Anyone can create a contact submission"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users with specific roles can view submissions
CREATE POLICY "Staff can view contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'staff');