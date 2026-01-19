-- CommCoach AI Database Schema
-- PostgreSQL + Supabase
-- Date: 2026-01-18

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ========================================
-- CORE USER TABLES
-- ========================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT UNIQUE,
  admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  voice_settings JSONB DEFAULT '{"voice_id": "default", "speed": 1.0, "pitch": 1.0}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User API keys (encrypted)
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'elevenlabs', 'google')),
  encrypted_key TEXT NOT NULL,
  key_name TEXT,
  is_valid BOOLEAN DEFAULT TRUE,
  last_validated_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  monthly_budget NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider, key_name)
);

-- ========================================
-- AGENT TABLES
-- ========================================

-- Agent templates (system-provided)
CREATE TABLE agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('chat', 'voice', 'autonomous')),
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-1.5-flash',
  temperature REAL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1000 CHECK (max_tokens > 0),
  memory_enabled BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  category TEXT,
  tags TEXT[],
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User agent configurations
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES agent_templates(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('chat', 'voice', 'autonomous')),
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gemini-1.5-flash',
  temperature REAL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1000 CHECK (max_tokens > 0),
  memory_enabled BOOLEAN DEFAULT TRUE,
  voice_settings JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent memories (vector embeddings)
CREATE TABLE agent_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES agent_configs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embedding dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- SESSION & MESSAGE TABLES
-- ========================================

-- Chat sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agent_configs(id) ON DELETE SET NULL,
  title TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  token_count INTEGER DEFAULT 0,
  cost_usd NUMERIC(10, 6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  audio_url TEXT,
  tokens INTEGER,
  latency_ms INTEGER,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice recordings
CREATE TABLE voice_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  audio_url TEXT NOT NULL,
  transcription TEXT,
  analysis JSONB,
  duration_seconds REAL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- PROGRESS & GAMIFICATION
-- ========================================

-- User progress tracking
CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  total_voice_minutes REAL DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  metrics JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  category TEXT,
  criteria JSONB NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ========================================
-- SUBSCRIPTION & PAYMENTS
-- ========================================

-- Subscription plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tier TEXT UNIQUE NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  stripe_price_id TEXT UNIQUE NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  features JSONB NOT NULL,
  limits JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment history
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount_usd NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'failed', 'pending', 'refunded')),
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ADMIN & ANALYTICS
-- ========================================

-- Admin actions (audit log)
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES profiles(id),
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System analytics (daily aggregates)
CREATE TABLE system_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  dau INTEGER DEFAULT 0,
  mau INTEGER DEFAULT 0,
  new_signups INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  revenue_usd NUMERIC(10, 2) DEFAULT 0,
  api_cost_usd NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_configs_updated_at BEFORE UPDATE ON agent_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user preferences on profile creation
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  
  INSERT INTO user_progress (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- ========================================
-- SEED DATA
-- ========================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, tier, stripe_price_id, price_usd, features, limits) VALUES
('Free', 'free', 'price_free', 0.00, 
  '{"chats": "10 per month", "voice_minutes": "5 per month", "agents": 1, "memory": false}'::jsonb,
  '{"max_chats_per_month": 10, "max_voice_minutes_per_month": 5, "max_agents": 1}'::jsonb),
('Pro', 'pro', 'price_pro', 19.00,
  '{"chats": "unlimited", "voice_minutes": "500 per month", "agents": 5, "memory": true, "priority_support": true}'::jsonb,
  '{"max_chats_per_month": -1, "max_voice_minutes_per_month": 500, "max_agents": 5}'::jsonb),
('Enterprise', 'enterprise', 'price_enterprise', 99.00,
  '{"chats": "unlimited", "voice_minutes": "unlimited", "agents": "unlimited", "memory": true, "priority_support": true, "api_access": true, "team_management": true}'::jsonb,
  '{"max_chats_per_month": -1, "max_voice_minutes_per_month": -1, "max_agents": -1}'::jsonb);

-- Insert default agent templates
INSERT INTO agent_templates (name, description, type, system_prompt, category, tags) VALUES
('Interview Coach', 'Practice job interviews with realistic scenarios', 'chat',
  'You are an experienced interview coach. Help the user practice for job interviews by asking realistic questions, providing feedback on their answers, and offering improvement suggestions.',
  'career', ARRAY['interview', 'career', 'practice']),
('Presentation Coach', 'Improve your presentation and public speaking skills', 'chat',
  'You are a presentation coach. Help the user improve their presentation skills by providing feedback on structure, delivery, and engagement techniques.',
  'public-speaking', ARRAY['presentation', 'public-speaking', 'communication']),
('Sales Coach', 'Master sales conversations and objection handling', 'chat',
  'You are a sales coach. Help the user practice sales conversations, handle objections, and close deals effectively.',
  'sales', ARRAY['sales', 'negotiation', 'business']);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, category, criteria, points) VALUES
('First Steps', 'Complete your first coaching session', '🎯', 'milestone', '{"sessions": 1}'::jsonb, 10),
('Consistent Learner', 'Maintain a 7-day streak', '🔥', 'streak', '{"streak_days": 7}'::jsonb, 50),
('Conversation Master', 'Complete 100 coaching sessions', '💬', 'milestone', '{"sessions": 100}'::jsonb, 100),
('Voice Champion', 'Practice 60 minutes of voice coaching', '🎤', 'voice', '{"voice_minutes": 60}'::jsonb, 75);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '✅ 16 tables created';
  RAISE NOTICE '✅ Triggers and functions set up';
  RAISE NOTICE '✅ Seed data inserted';
END $$;
