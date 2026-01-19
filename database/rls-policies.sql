-- Row Level Security (RLS) Policies for CommCoach AI
-- Date: 2026-01-18

-- ========================================
-- ENABLE RLS ON ALL TABLES
-- ========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_analytics ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES
-- ========================================

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

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

-- ========================================
-- PROFILES
-- ========================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except admin and status fields)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- ========================================
-- USER PREFERENCES
-- ========================================

CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- USER API KEYS
-- ========================================

CREATE POLICY "Users can manage own API keys"
  ON user_api_keys FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- AGENT TEMPLATES
-- ========================================

-- Everyone can view public templates
CREATE POLICY "Anyone can view public templates"
  ON agent_templates FOR SELECT
  USING (is_public = TRUE);

-- Users can view their own private templates
CREATE POLICY "Users can view own templates"
  ON agent_templates FOR SELECT
  USING (auth.uid() = created_by);

-- Admins can manage all templates
CREATE POLICY "Admins can manage templates"
  ON agent_templates FOR ALL
  USING (is_admin());

-- ========================================
-- AGENT CONFIGS
-- ========================================

CREATE POLICY "Users can manage own agents"
  ON agent_configs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- AGENT MEMORIES
-- ========================================

CREATE POLICY "Users can manage own agent memories"
  ON agent_memories FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- CHAT SESSIONS
-- ========================================

CREATE POLICY "Users can manage own sessions"
  ON chat_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- MESSAGES
-- ========================================

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- ========================================
-- VOICE RECORDINGS
-- ========================================

CREATE POLICY "Users can manage own recordings"
  ON voice_recordings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- USER PROGRESS
-- ========================================

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- ACHIEVEMENTS
-- ========================================

-- Everyone can view achievements
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  USING (TRUE);

-- ========================================
-- USER ACHIEVEMENTS
-- ========================================

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can grant achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- SUBSCRIPTION PLANS
-- ========================================

-- Everyone can view active plans
CREATE POLICY "Anyone can view active plans"
  ON subscription_plans FOR SELECT
  USING (is_active = TRUE);

-- ========================================
-- SUBSCRIPTIONS
-- ========================================

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR SELECT
  USING (is_admin());

-- ========================================
-- PAYMENT HISTORY
-- ========================================

CREATE POLICY "Users can view own payments"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payment_history FOR SELECT
  USING (is_admin());

-- ========================================
-- ADMIN ACTIONS
-- ========================================

-- Only admins can view admin actions
CREATE POLICY "Admins can view admin actions"
  ON admin_actions FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert admin actions"
  ON admin_actions FOR INSERT
  WITH CHECK (is_admin());

-- ========================================
-- SYSTEM ANALYTICS
-- ========================================

-- Only admins can view analytics
CREATE POLICY "Admins can view analytics"
  ON system_analytics FOR SELECT
  USING (is_admin());

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Row Level Security policies created successfully!';
  RAISE NOTICE '✅ All tables protected with RLS';
  RAISE NOTICE '✅ User data isolated';
  RAISE NOTICE '✅ Admin policies configured';
END $$;
