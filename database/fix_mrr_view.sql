-- =====================================================
-- Quick Fix: Check and Create MRR View
-- =====================================================
-- Run this to see the exact column name
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'subscription_plans'
ORDER BY ordinal_position;

-- Drop the problematic view
DROP VIEW IF EXISTS current_mrr CASCADE;

-- Create the view with the correct column reference
-- Using fully qualified column names
CREATE OR REPLACE VIEW current_mrr AS
SELECT 
  COALESCE(SUM(
    CASE 
      WHEN us.billing_cycle = 'monthly' THEN subscription_plans.price_usd
      WHEN us.billing_cycle = 'yearly' THEN subscription_plans.price_usd / 12
      ELSE 0
    END
  ), 0) as mrr,
  COUNT(*) as active_subscriptions
FROM user_subscriptions us
JOIN subscription_plans ON us.plan_id = subscription_plans.id
WHERE us.status = 'active'
  AND us.current_period_end > NOW();

-- Test the view
SELECT * FROM current_mrr;
