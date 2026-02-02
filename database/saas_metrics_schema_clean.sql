-- =====================================================
-- STEP 1: Check Existing Table Structure
-- =====================================================
-- Run this first to see what columns you have
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'subscription_plans'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 2: Backup Existing Data (IMPORTANT!)
-- =====================================================
-- Create a backup of your existing subscription_plans
CREATE TABLE IF NOT EXISTS subscription_plans_backup AS 
SELECT * FROM subscription_plans;

-- =====================================================
-- STEP 3: Drop and Recreate (Clean Approach)
-- =====================================================
-- This is the safest approach - drop everything and start fresh

-- Drop all dependent tables first (in reverse dependency order)
DROP TABLE IF EXISTS saas_metrics_daily CASCADE;
DROP TABLE IF EXISTS user_moderation CASCADE;
DROP TABLE IF EXISTS user_activity CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS token_usage CASCADE;
DROP TABLE IF EXISTS revenue_transactions CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;

-- Drop views
DROP VIEW IF EXISTS current_mrr CASCADE;
DROP VIEW IF EXISTS token_usage_summary CASCADE;
DROP VIEW IF EXISTS support_metrics CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE ALL TABLES FROM SCRATCH
-- =====================================================

-- 1. SUBSCRIPTION PLANS
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

-- 2. USER SUBSCRIPTIONS
CREATE TABLE user_subscriptions (
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. REVENUE TRACKING
CREATE TABLE revenue_transactions (
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

-- 4. TOKEN USAGE TRACKING
CREATE TABLE token_usage (
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

-- 5. SUPPORT TICKETS
CREATE TABLE support_tickets (
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

-- 6. USER ACTIVITY & ENGAGEMENT
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. BANNED/FLAGGED USERS
CREATE TABLE user_moderation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  reason TEXT,
  moderated_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 8. SAAS METRICS SNAPSHOT (Daily Aggregates)
CREATE TABLE saas_metrics_daily (
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
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_revenue_transactions_user_id ON revenue_transactions(user_id);
CREATE INDEX idx_revenue_transactions_created_at ON revenue_transactions(created_at);
CREATE INDEX idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX idx_token_usage_created_at ON token_usage(created_at);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX idx_saas_metrics_daily_date ON saas_metrics_daily(date);

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
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, token_limit, features)
VALUES 
  ('free', 'Free Tier', 'Get started with basic features', 0.00, 0.00, 10000, 
   '["10K tokens/month", "Basic AI coaching", "Email support"]'::jsonb),
  
  ('pro', 'Pro Plan', 'For serious personal growth', 29.00, 290.00, 100000,
   '["100K tokens/month", "Advanced AI coaching", "Priority support", "Progress analytics", "Custom archetypes"]'::jsonb),
  
  ('enterprise', 'Enterprise', 'For organizations and teams', 99.00, 990.00, 500000,
   '["500K tokens/month", "Team management", "Dedicated support", "Custom integrations", "Advanced analytics", "White-label options"]'::jsonb);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- View: Current MRR
CREATE OR REPLACE VIEW current_mrr AS
SELECT 
  COALESCE(SUM(
    CASE 
      WHEN us.billing_cycle = 'monthly' THEN sp.price_monthly
      WHEN us.billing_cycle = 'yearly' THEN sp.price_yearly / 12
      ELSE 0
    END
  ), 0) as mrr,
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
-- SAMPLE TEST DATA (Optional)
-- =====================================================
-- Uncomment to add sample data for testing

-- INSERT INTO saas_metrics_daily (date, mrr, active_users, total_users, total_token_usage, total_token_cost, revenue_today)
-- VALUES 
--   (CURRENT_DATE - 6, 8200, 850, 900, 100000, 750, 250),
--   (CURRENT_DATE - 5, 8400, 880, 910, 110000, 780, 270),
--   (CURRENT_DATE - 4, 8900, 920, 930, 120000, 810, 290),
--   (CURRENT_DATE - 3, 9500, 950, 950, 130000, 850, 310),
--   (CURRENT_DATE - 2, 10200, 1050, 980, 140000, 890, 330),
--   (CURRENT_DATE - 1, 11500, 1100, 1020, 150000, 920, 350),
--   (CURRENT_DATE, 12400, 1140, 1054, 160000, 950, 370);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$ 
BEGIN
  RAISE NOTICE '✅ SaaS Metrics Schema deployed successfully!';
  RAISE NOTICE '📊 Tables created: 8';
  RAISE NOTICE '🔒 RLS policies enabled';
  RAISE NOTICE '📈 Analytics views created';
  RAISE NOTICE '💾 Backup table: subscription_plans_backup (if existed)';
  RAISE NOTICE '🎯 Ready to use!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '1. Verify tables in Supabase dashboard';
  RAISE NOTICE '2. Uncomment sample data section if you want test data';
  RAISE NOTICE '3. Refresh your dashboard at http://localhost:3000';
END $$;
