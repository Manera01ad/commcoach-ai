-- =====================================================
-- CommCoach AI - SaaS Metrics & Business Intelligence
-- SAFE DEPLOYMENT VERSION
-- =====================================================
-- This version checks for existing tables and handles conflicts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- DROP EXISTING TABLES (OPTIONAL - COMMENT OUT IF YOU WANT TO KEEP DATA)
-- =====================================================
-- Uncomment these lines if you want to start fresh
-- DROP TABLE IF EXISTS saas_metrics_daily CASCADE;
-- DROP TABLE IF EXISTS user_moderation CASCADE;
-- DROP TABLE IF EXISTS user_activity CASCADE;
-- DROP TABLE IF EXISTS support_tickets CASCADE;
-- DROP TABLE IF EXISTS token_usage CASCADE;
-- DROP TABLE IF EXISTS revenue_transactions CASCADE;
-- DROP TABLE IF EXISTS user_subscriptions CASCADE;
-- DROP TABLE IF EXISTS subscription_plans CASCADE;

-- =====================================================
-- 1. SUBSCRIPTION PLANS
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subscription_plans') THEN
    CREATE TABLE subscription_plans (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      display_name VARCHAR(100) NOT NULL,
      description TEXT,
      price_monthly DECIMAL(10, 2) NOT NULL,
      price_yearly DECIMAL(10, 2),
      token_limit INTEGER NOT NULL DEFAULT 10000,
      features JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Add missing columns if table exists
    ALTER TABLE subscription_plans 
      ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS price_yearly DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS token_limit INTEGER DEFAULT 10000,
      ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- =====================================================
-- 2. USER SUBSCRIPTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_subscriptions_user_id_key'
  ) THEN
    ALTER TABLE user_subscriptions ADD CONSTRAINT user_subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- =====================================================
-- 3. REVENUE TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS revenue_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_gateway VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(255) UNIQUE,
  transaction_type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TOKEN USAGE TRACKING
-- =====================================================
CREATE TABLE IF NOT EXISTS token_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  tokens_used INTEGER NOT NULL,
  model_used VARCHAR(100),
  cost_usd DECIMAL(10, 4),
  endpoint VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. SUPPORT TICKETS
-- =====================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 6. USER ACTIVITY & ENGAGEMENT
-- =====================================================
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. BANNED/FLAGGED USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_moderation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  reason TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_moderation_user_id_key'
  ) THEN
    ALTER TABLE user_moderation ADD CONSTRAINT user_moderation_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- =====================================================
-- 8. SAAS METRICS SNAPSHOT (Daily Aggregates)
-- =====================================================
CREATE TABLE IF NOT EXISTS saas_metrics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  mrr DECIMAL(10, 2) NOT NULL DEFAULT 0,
  arr DECIMAL(10, 2) NOT NULL DEFAULT 0,
  active_users INTEGER NOT NULL DEFAULT 0,
  total_users INTEGER NOT NULL DEFAULT 0,
  new_signups INTEGER NOT NULL DEFAULT 0,
  churned_users INTEGER NOT NULL DEFAULT 0,
  total_token_usage BIGINT NOT NULL DEFAULT 0,
  total_token_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
  open_tickets INTEGER NOT NULL DEFAULT 0,
  resolved_tickets INTEGER NOT NULL DEFAULT 0,
  banned_users INTEGER NOT NULL DEFAULT 0,
  revenue_today DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_user_id ON revenue_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_created_at ON revenue_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON token_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_saas_metrics_daily_date ON saas_metrics_daily(date);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_metrics_daily ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active subscription plans" ON subscription_plans;
DROP POLICY IF EXISTS "Users can view their own subscription" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON revenue_transactions;
DROP POLICY IF EXISTS "Users can view their own token usage" ON token_usage;
DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can create their own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can view their own activity" ON user_activity;

-- Subscription Plans: Public read access
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans FOR SELECT
  USING (is_active = true);

-- User Subscriptions: Users can view their own
CREATE POLICY "Users can view their own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Revenue Transactions: Users can view their own
CREATE POLICY "Users can view their own transactions"
  ON revenue_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Token Usage: Users can view their own
CREATE POLICY "Users can view their own token usage"
  ON token_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Support Tickets: Users can view their own
CREATE POLICY "Users can view their own tickets"
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Activity: Users can view their own
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
DROP TRIGGER IF EXISTS update_revenue_transactions_updated_at ON revenue_transactions;
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
DROP TRIGGER IF EXISTS update_user_moderation_updated_at ON user_moderation;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_transactions_updated_at
  BEFORE UPDATE ON revenue_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_moderation_updated_at
  BEFORE UPDATE ON user_moderation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Default Subscription Plans
-- =====================================================
-- Update display_name for existing plans if needed
UPDATE subscription_plans 
SET display_name = CASE 
  WHEN name = 'free' THEN 'Free Tier'
  WHEN name = 'pro' THEN 'Pro Plan'
  WHEN name = 'enterprise' THEN 'Enterprise'
  ELSE name
END
WHERE display_name IS NULL;

-- Insert new plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, token_limit, features)
VALUES 
  ('free', 'Free Tier', 'Get started with basic features', 0.00, 0.00, 10000, 
   '["10K tokens/month", "Basic AI coaching", "Email support"]'::jsonb),
  
  ('pro', 'Pro Plan', 'For serious personal growth', 29.00, 290.00, 100000,
   '["100K tokens/month", "Advanced AI coaching", "Priority support", "Progress analytics", "Custom archetypes"]'::jsonb),
  
  ('enterprise', 'Enterprise', 'For organizations and teams', 99.00, 990.00, 500000,
   '["500K tokens/month", "Team management", "Dedicated support", "Custom integrations", "Advanced analytics", "White-label options"]'::jsonb)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  token_limit = EXCLUDED.token_limit,
  features = EXCLUDED.features;

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View: Current MRR
CREATE OR REPLACE VIEW current_mrr AS
SELECT 
  SUM(
    CASE 
      WHEN us.billing_cycle = 'monthly' THEN sp.price_monthly
      WHEN us.billing_cycle = 'yearly' THEN sp.price_yearly / 12
      ELSE 0
    END
  ) as mrr,
  COUNT(*) as active_subscriptions
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.status = 'active'
  AND us.current_period_end > NOW();

-- View: Token usage summary
CREATE OR REPLACE VIEW token_usage_summary AS
SELECT 
  user_id,
  DATE(created_at) as usage_date,
  SUM(tokens_used) as total_tokens,
  SUM(cost_usd) as total_cost,
  COUNT(*) as api_calls
FROM token_usage
GROUP BY user_id, DATE(created_at);

-- View: Support metrics
CREATE OR REPLACE VIEW support_metrics AS
SELECT 
  status,
  priority,
  COUNT(*) as ticket_count,
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) as avg_resolution_hours
FROM support_tickets
WHERE resolved_at IS NOT NULL
GROUP BY status, priority;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$ 
BEGIN
  RAISE NOTICE '✅ SaaS Metrics Schema deployed successfully!';
  RAISE NOTICE '📊 Tables created: 8';
  RAISE NOTICE '🔒 RLS policies enabled';
  RAISE NOTICE '📈 Analytics views created';
  RAISE NOTICE '🎯 Ready to use!';
END $$;
