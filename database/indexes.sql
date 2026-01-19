-- Performance Indexes for CommCoach AI
-- Date: 2026-01-18

-- ========================================
-- PROFILES
-- ========================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- ========================================
-- USER API KEYS
-- ========================================

CREATE INDEX idx_user_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX idx_user_api_keys_provider ON user_api_keys(provider);
CREATE INDEX idx_user_api_keys_is_valid ON user_api_keys(is_valid);

-- ========================================
-- AGENT CONFIGS
-- ========================================

CREATE INDEX idx_agent_configs_user_id ON agent_configs(user_id);
CREATE INDEX idx_agent_configs_template_id ON agent_configs(template_id);
CREATE INDEX idx_agent_configs_type ON agent_configs(type);
CREATE INDEX idx_agent_configs_is_active ON agent_configs(is_active);

-- ========================================
-- AGENT TEMPLATES
-- ========================================

CREATE INDEX idx_agent_templates_type ON agent_templates(type);
CREATE INDEX idx_agent_templates_is_public ON agent_templates(is_public);
CREATE INDEX idx_agent_templates_category ON agent_templates(category);
CREATE INDEX idx_agent_templates_created_by ON agent_templates(created_by);

-- ========================================
-- AGENT MEMORIES (Vector Search)
-- ========================================

CREATE INDEX idx_agent_memories_agent_id ON agent_memories(agent_id);
CREATE INDEX idx_agent_memories_user_id ON agent_memories(user_id);

-- Vector similarity search index (IVFFlat for faster approximate search)
CREATE INDEX idx_agent_memories_embedding ON agent_memories 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ========================================
-- CHAT SESSIONS
-- ========================================

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_agent_id ON chat_sessions(agent_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- Composite index for user's recent sessions
CREATE INDEX idx_chat_sessions_user_recent ON chat_sessions(user_id, created_at DESC);

-- ========================================
-- MESSAGES
-- ========================================

CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_role ON messages(role);

-- Composite index for session messages ordered by time
CREATE INDEX idx_messages_session_time ON messages(session_id, created_at);

-- ========================================
-- VOICE RECORDINGS
-- ========================================

CREATE INDEX idx_voice_recordings_user_id ON voice_recordings(user_id);
CREATE INDEX idx_voice_recordings_session_id ON voice_recordings(session_id);
CREATE INDEX idx_voice_recordings_created_at ON voice_recordings(created_at DESC);

-- ========================================
-- USER PROGRESS
-- ========================================

CREATE INDEX idx_user_progress_last_activity ON user_progress(last_activity_at DESC);
CREATE INDEX idx_user_progress_streak_days ON user_progress(streak_days DESC);

-- ========================================
-- USER ACHIEVEMENTS
-- ========================================

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);

-- ========================================
-- SUBSCRIPTIONS
-- ========================================

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end);

-- ========================================
-- PAYMENT HISTORY
-- ========================================

CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_stripe_invoice ON payment_history(stripe_invoice_id);
CREATE INDEX idx_payment_history_status ON payment_history(status);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at DESC);

-- ========================================
-- ADMIN ACTIONS
-- ========================================

CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_target_user ON admin_actions(target_user_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);

-- ========================================
-- SYSTEM ANALYTICS
-- ========================================

CREATE INDEX idx_system_analytics_date ON system_analytics(date DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Performance indexes created successfully!';
  RAISE NOTICE '✅ 50+ indexes created';
  RAISE NOTICE '✅ Vector search optimized';
  RAISE NOTICE '✅ Query performance improved';
END $$;
