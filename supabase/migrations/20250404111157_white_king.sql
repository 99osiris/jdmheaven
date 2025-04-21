/*
  # Add blog comments table

  1. New Tables
    - `blog_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references blog_posts)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for comment management
*/

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read comments"
  ON blog_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON blog_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON blog_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indices for performance
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX idx_blog_comments_created_at ON blog_comments(created_at DESC);