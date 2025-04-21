/*
  # Add account deletion request table

  1. New Tables
    - `account_deletion_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `status` (text)
      - `requested_at` (timestamp)
      - `processed_at` (timestamp)
      - `processed_by` (uuid, references profiles)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create account_deletion_requests table
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  processed_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create deletion requests for their own account"
  ON account_deletion_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own deletion requests"
  ON account_deletion_requests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all deletion requests"
  ON account_deletion_requests
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

-- Create index for user lookups
CREATE INDEX idx_account_deletion_requests_user_id ON account_deletion_requests(user_id);
CREATE INDEX idx_account_deletion_requests_status ON account_deletion_requests(status);