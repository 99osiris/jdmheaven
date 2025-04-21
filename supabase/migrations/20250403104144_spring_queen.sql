-- Ensure auth schema exists and has proper permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO postgres, service_role;

-- Ensure public schema has proper permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, service_role;

-- Fix role handling function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role user_role;
BEGIN
  -- Get role from metadata or default to 'user'
  default_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'user'::user_role
  );

  -- Create profile
  INSERT INTO public.profiles (
    id,
    email,
    role,
    full_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );

  -- Update user metadata with role if not set
  IF NEW.raw_user_meta_data->>'role' IS NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(default_role::text)
      )
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix role synchronization function
CREATE OR REPLACE FUNCTION sync_user_role()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.role IS DISTINCT FROM NEW.role) THEN
    UPDATE auth.users
    SET raw_user_meta_data = 
      jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(NEW.role::text)
      )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix metadata synchronization function
CREATE OR REPLACE FUNCTION sync_user_metadata()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'UPDATE') AND (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data) THEN
    UPDATE profiles
    SET
      role = COALESCE((NEW.raw_user_meta_data->>'role')::user_role, role),
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', full_name),
      updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS sync_user_role_trigger ON profiles;
CREATE TRIGGER sync_user_role_trigger
  AFTER UPDATE OF role ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_user_role();

DROP TRIGGER IF EXISTS sync_user_metadata_trigger ON auth.users;
CREATE TRIGGER sync_user_metadata_trigger
  AFTER UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_metadata();

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION handle_new_user TO postgres, service_role;
GRANT EXECUTE ON FUNCTION sync_user_role TO postgres, service_role;
GRANT EXECUTE ON FUNCTION sync_user_metadata TO postgres, service_role;

-- Update RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

  -- Create new policies
  CREATE POLICY "Users can view own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    );

  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    )
    WITH CHECK (
      auth.uid() = id OR
      (auth.jwt() ->> 'role')::user_role = 'admin'::user_role
    );
END $$;

-- Grant necessary table permissions
GRANT ALL ON profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
