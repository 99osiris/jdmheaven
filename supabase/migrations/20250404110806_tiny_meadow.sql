/*
  # Fix blog posts table and policies

  1. Changes
    - Add blog_posts table if not exists
    - Drop existing policies before recreating
    - Add proper RLS policies
    
  2. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  cover_image text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  tags text[],
  category text
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read published blog posts" ON blog_posts;
  DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- Create new policies
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role')::user_role = 'admin'::user_role)
  WITH CHECK ((auth.jwt() ->> 'role')::user_role = 'admin'::user_role);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);