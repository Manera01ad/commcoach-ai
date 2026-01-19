-- ==========================================
-- SAFE SECURITY PATCH FOR COMMCOACH AI
-- ==========================================
-- Following Supabase's recommendation: Option A
-- Create replacement function, switch policies, then drop old function
-- NO CASCADE - explicit and safe
-- ==========================================

-- ========================================
-- STEP 1: Create New Secure Functions
-- ========================================

-- Create new is_admin() function with proper security
CREATE OR REPLACE FUNCTION public.is_admin_v2()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
BEGIN
  -- Use SECURITY DEFINER to bypass RLS and prevent infinite recursion
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND admin = TRUE
  );
END;
$$;

COMMENT ON FUNCTION public.is_admin_v2() IS 'Securely checks if current user is an admin. Uses SECURITY DEFINER to bypass RLS and prevent infinite recursion. Version 2 with search_path protection.';

-- Create new update_updated_at_column() with proper security
CREATE OR REPLACE FUNCTION public.update_updated_at_v2()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_v2() IS 'Updates updated_at timestamp. Version 2 with search_path protection.';

-- Create new create_user_preferences() with proper security
CREATE OR REPLACE FUNCTION public.create_user_preferences_v2()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Create user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create user progress
  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.create_user_preferences_v2() IS 'Creates user preferences and progress on profile creation. Version 2 with search_path protection.';

-- ========================================
-- STEP 2: Switch Policies to New Function
-- ========================================

-- Drop old policies that use is_admin()
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage templates" ON agent_templates;
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can view all payments" ON payment_history;
DROP POLICY IF EXISTS "Admins can view admin actions" ON admin_actions;
DROP POLICY IF EXISTS "Admins can insert admin actions" ON admin_actions;
DROP POLICY IF EXISTS "Admins can view analytics" ON system_analytics;

-- Recreate policies using new is_admin_v2() function
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin_v2());

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin_v2());

CREATE POLICY "Admins can manage templates"
  ON agent_templates FOR ALL
  USING (is_admin_v2());

CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (is_admin_v2());

CREATE POLICY "Admins can view all payments"
  ON payment_history FOR SELECT
  USING (is_admin_v2());

CREATE POLICY "Admins can view admin actions"
  ON admin_actions FOR SELECT
  USING (is_admin_v2());

CREATE POLICY "Admins can insert admin actions"
  ON admin_actions FOR INSERT
  WITH CHECK (is_admin_v2());

CREATE POLICY "Admins can view analytics"
  ON system_analytics FOR SELECT
  USING (is_admin_v2());

-- ========================================
-- STEP 3: Add Missing INSERT Policy for Profiles
-- ========================================
-- CRITICAL: This is needed for signup to work!

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========================================
-- STEP 4: Switch Triggers to New Functions
-- ========================================

-- Drop old triggers (no CASCADE needed - explicit)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
DROP TRIGGER IF EXISTS update_agent_configs_updated_at ON agent_configs;
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
DROP TRIGGER IF EXISTS on_profile_created ON profiles;

-- Create new triggers using v2 functions
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v2();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v2();

CREATE TRIGGER update_agent_configs_updated_at 
  BEFORE UPDATE ON agent_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v2();

CREATE TRIGGER update_chat_sessions_updated_at 
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v2();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v2();

CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_v2();

CREATE TRIGGER on_profile_created 
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences_v2();

-- ========================================
-- STEP 5: Drop Old Functions (Now Safe)
-- ========================================
-- All policies and triggers now use v2 functions
-- Safe to drop old functions without CASCADE

DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.create_user_preferences();

-- ========================================
-- STEP 6: Rename v2 Functions to Original Names
-- ========================================
-- Now that old functions are gone, rename v2 to original names

ALTER FUNCTION public.is_admin_v2() RENAME TO is_admin;
ALTER FUNCTION public.update_updated_at_v2() RENAME TO update_updated_at_column;
ALTER FUNCTION public.create_user_preferences_v2() RENAME TO create_user_preferences;

-- ========================================
-- STEP 7: Grant Permissions
-- ========================================

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_preferences() TO authenticated;

-- ========================================
-- STEP 8: Verification & Success Message
-- ========================================

DO $$
DECLARE
  func_count INTEGER;
  policy_count INTEGER;
  trigger_count INTEGER;
  v2_func_count INTEGER;
BEGIN
  -- Check for any remaining v2 functions (should be 0)
  SELECT COUNT(*) INTO v2_func_count
  FROM pg_proc
  WHERE proname LIKE '%_v2';
  
  -- Count final functions
  SELECT COUNT(*) INTO func_count
  FROM pg_proc
  WHERE proname IN ('is_admin', 'update_updated_at_column', 'create_user_preferences');
  
  -- Count policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename IN ('profiles', 'agent_templates', 'subscriptions', 'payment_history', 'admin_actions', 'system_analytics');
  
  -- Count triggers
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger
  WHERE tgname LIKE '%updated_at%' OR tgname = 'on_profile_created';
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SAFE SECURITY PATCH APPLIED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Created v2 functions with security fixes';
  RAISE NOTICE '✅ Switched all policies to v2 functions';
  RAISE NOTICE '✅ Switched all triggers to v2 functions';
  RAISE NOTICE '✅ Dropped old functions (no CASCADE)';
  RAISE NOTICE '✅ Renamed v2 functions to original names';
  RAISE NOTICE '✅ Added missing INSERT policy for profiles';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Security Improvements:';
  RAISE NOTICE '   ✅ Fixed: Infinite recursion in RLS policies';
  RAISE NOTICE '   ✅ Fixed: Function search_path vulnerabilities';
  RAISE NOTICE '   ✅ Fixed: Missing INSERT policy for profiles';
  RAISE NOTICE '   ✅ Added: SECURITY DEFINER with search_path protection';
  RAISE NOTICE '   ✅ Added: STABLE function optimization';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Final Statistics:';
  RAISE NOTICE '   - Functions (secure): %', func_count;
  RAISE NOTICE '   - V2 functions remaining: % (should be 0)', v2_func_count;
  RAISE NOTICE '   - Policies active: %', policy_count;
  RAISE NOTICE '   - Triggers active: %', trigger_count;
  RAISE NOTICE '';
  
  IF v2_func_count > 0 THEN
    RAISE WARNING '⚠️  Some v2 functions still exist - check for issues';
  ELSE
    RAISE NOTICE '✅ All v2 functions successfully renamed';
  END IF;
  
  IF func_count = 3 THEN
    RAISE NOTICE '✅ All required functions present';
  ELSE
    RAISE WARNING '⚠️  Expected 3 functions, found %', func_count;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Authentication Status: READY';
  RAISE NOTICE '🔒 Security Status: HARDENED';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Run: powershell -ExecutionPolicy Bypass -File test-auth.ps1';
  RAISE NOTICE '2. Test signup at: http://localhost:5173';
  RAISE NOTICE '3. Check Security Advisor for green status';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
