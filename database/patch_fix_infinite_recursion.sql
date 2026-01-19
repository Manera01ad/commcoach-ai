-- ==========================================
-- FIX: Infinite Recursion in Profiles Policy
-- ==========================================

-- 1. Create a secure function to check admin status
-- This function runs with "SECURITY DEFINER" privileges, bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND admin = TRUE
  );
END;
$$;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- 3. Re-create policies using the safe function

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- 4. Update other Admin policies to be safer (optional but recommended)
-- We can update them to use is_admin() for cleaner code, but let's stick to the critical fix first.

-- Verify
DO $$
BEGIN
  RAISE NOTICE '✅ Infinite recursion fix applied successfully!';
END $$;
