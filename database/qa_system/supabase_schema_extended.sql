-- CommCoach AI - Extended Database Schema
-- Adds tables for Workflows 5-10

-- ============================================
-- Performance Testing Table
-- ============================================
CREATE TABLE IF NOT EXISTS performance_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Load test metrics
  concurrent_users INTEGER NOT NULL,
  successful_requests INTEGER NOT NULL,
  failed_requests INTEGER NOT NULL,
  avg_response_time_ms INTEGER,
  max_response_time_ms INTEGER,
  min_response_time_ms INTEGER,
  within_target_rate NUMERIC(5,2),
  
  -- Database performance
  db_active_connections INTEGER,
  db_max_connections INTEGER,
  db_connection_utilization NUMERIC(5,2),
  db_query_avg_ms INTEGER,
  db_size_mb NUMERIC(10,2),
  
  -- Resource estimates
  estimated_memory_mb INTEGER,
  cpu_usage_estimated NUMERIC(5,2),
  
  -- Overall assessment
  performance_score NUMERIC(5,2),
  connection_pool_status TEXT,
  errors JSONB,
  alert_required BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_performance_timestamp ON performance_tests(timestamp DESC);
CREATE INDEX idx_performance_score ON performance_tests(performance_score DESC);
CREATE INDEX idx_performance_alerts ON performance_tests(timestamp DESC) WHERE alert_required = TRUE;

-- ============================================
-- Security Testing Table
-- ============================================
CREATE TABLE IF NOT EXISTS security_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Test results by category
  injection_tests_passed INTEGER,
  injection_tests_total INTEGER,
  xss_tests_passed INTEGER,
  xss_tests_total INTEGER,
  auth_tests_passed INTEGER,
  auth_tests_total INTEGER,
  data_protection_tests_passed INTEGER,
  data_protection_tests_total INTEGER,
  
  -- Overall security metrics
  total_security_score NUMERIC(5,2),
  vulnerabilities_found JSONB,
  critical_issues_count INTEGER,
  high_issues_count INTEGER,
  medium_issues_count INTEGER,
  low_issues_count INTEGER,
  
  -- Specific findings
  exposed_secrets JSONB,
  insecure_endpoints JSONB,
  
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_timestamp ON security_tests(timestamp DESC);
CREATE INDEX idx_security_score ON security_tests(total_security_score DESC);
CREATE INDEX idx_security_critical ON security_tests(timestamp DESC) WHERE critical_issues_count > 0;

-- ============================================
-- Therapeutic Safety Validation Table
-- ============================================
CREATE TABLE IF NOT EXISTS safety_validation_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- CoVe verification
  cove_active BOOLEAN,
  cove_tests_passed INTEGER,
  cove_tests_total INTEGER,
  harmful_advice_blocked INTEGER,
  harmful_advice_total_attempts INTEGER,
  
  -- Prescription safety
  prescription_safety_score NUMERIC(5,2),
  unsafe_prescriptions_found INTEGER,
  
  -- Boundary maintenance
  boundary_maintained BOOLEAN,
  medical_advice_given BOOLEAN,
  professional_boundaries_score NUMERIC(5,2),
  
  -- Vulnerable populations
  age_appropriate_responses INTEGER,
  trauma_informed_responses INTEGER,
  crisis_escalation_handled INTEGER,
  
  -- Issues
  issues_found JSONB,
  safety_violations JSONB,
  
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_safety_timestamp ON safety_validation_tests(timestamp DESC);
CREATE INDEX idx_safety_violations ON safety_validation_tests(timestamp DESC) WHERE alert_required = TRUE;
CREATE INDEX idx_safety_cove ON safety_validation_tests(cove_active, timestamp DESC);

-- ============================================
-- Bias & Fairness Audit Table
-- ============================================
CREATE TABLE IF NOT EXISTS bias_audit_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Fairness scores by dimension
  gender_fairness_score NUMERIC(5,2),
  age_fairness_score NUMERIC(5,2),
  cultural_fairness_score NUMERIC(5,2),
  orientation_fairness_score NUMERIC(5,2),
  disability_fairness_score NUMERIC(5,2),
  economic_fairness_score NUMERIC(5,2),
  language_fairness_score NUMERIC(5,2),
  
  -- Language bias detection
  gendered_language_instances INTEGER,
  stereotyping_instances INTEGER,
  assumption_instances INTEGER,
  
  -- Overall metrics
  overall_fairness_score NUMERIC(5,2),
  recommendation_equity_score NUMERIC(5,2),
  
  -- Detailed findings
  bias_instances_found JSONB,
  demographic_disparities JSONB,
  
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bias_timestamp ON bias_audit_tests(timestamp DESC);
CREATE INDEX idx_bias_score ON bias_audit_tests(overall_fairness_score DESC);
CREATE INDEX idx_bias_issues ON bias_audit_tests(timestamp DESC) WHERE alert_required = TRUE;

-- ============================================
-- Conversation Quality Table
-- ============================================
CREATE TABLE IF NOT EXISTS conversation_quality_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Quality dimension scores
  empathy_score NUMERIC(5,2),
  clinical_accuracy_score NUMERIC(5,2),
  actionability_score NUMERIC(5,2),
  clarity_score NUMERIC(5,2),
  personalization_score NUMERIC(5,2),
  motivation_score NUMERIC(5,2),
  
  -- Conversation flow metrics
  followup_coherence_score NUMERIC(5,2),
  context_retention_score NUMERIC(5,2),
  growth_tracking_score NUMERIC(5,2),
  
  -- Overall assessment
  overall_quality_score NUMERIC(5,2),
  
  -- Detailed results
  low_quality_responses JSONB,
  quality_issues JSONB,
  
  -- Examples
  best_response_examples JSONB,
  worst_response_examples JSONB,
  
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quality_timestamp ON conversation_quality_tests(timestamp DESC);
CREATE INDEX idx_quality_score ON conversation_quality_tests(overall_quality_score DESC);
CREATE INDEX idx_quality_low ON conversation_quality_tests(timestamp DESC) WHERE overall_quality_score < 80;

-- ============================================
-- AI Analytics Reports Table
-- ============================================
CREATE TABLE IF NOT EXISTS ai_analytics_reports (
  id BIGSERIAL PRIMARY KEY,
  report_type TEXT CHECK (report_type IN ('hourly_analysis', 'daily_summary', 'weekly_analysis', 'anomaly_detection', 'improvement_recommendations')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Overall health
  overall_health_score NUMERIC(5,2),
  overall_status TEXT CHECK (overall_status IN ('excellent', 'good', 'warning', 'critical')),
  
  -- AI-generated content
  executive_summary TEXT,
  critical_issues JSONB,
  warnings JSONB,
  trends JSONB,
  recommendations JSONB,
  predictions TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
  
  -- Raw data
  category_scores JSONB,
  total_tests_run INTEGER,
  
  -- Full AI analysis
  ai_generated_insights TEXT,
  
  -- Email tracking
  report_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_timestamp ON ai_analytics_reports(timestamp DESC);
CREATE INDEX idx_analytics_type ON ai_analytics_reports(report_type, timestamp DESC);
CREATE INDEX idx_analytics_status ON ai_analytics_reports(overall_status, timestamp DESC);
CREATE INDEX idx_analytics_critical ON ai_analytics_reports(timestamp DESC) WHERE overall_status = 'critical';
CREATE INDEX idx_analytics_sent ON ai_analytics_reports(report_sent, timestamp DESC);

-- ============================================
-- Comprehensive System Status View
-- ============================================
CREATE OR REPLACE VIEW comprehensive_system_status AS
WITH latest_tests AS (
  SELECT 
    'infrastructure' as category,
    (SELECT is_healthy FROM test_results ORDER BY timestamp DESC LIMIT 1) as healthy,
    (SELECT AVG(frontend_response_time_ms) FROM test_results WHERE timestamp > NOW() - INTERVAL '1 hour') as avg_metric
  UNION ALL
  SELECT 
    'therapy_logic',
    (SELECT archetype_accuracy >= 80 FROM therapy_logic_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(archetype_accuracy) FROM therapy_logic_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
  UNION ALL
  SELECT 
    'user_journeys',
    (SELECT success_rate >= 85 FROM user_journey_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(success_rate) FROM user_journey_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
  UNION ALL
  SELECT 
    'performance',
    (SELECT performance_score >= 80 FROM performance_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(performance_score) FROM performance_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
  UNION ALL
  SELECT 
    'security',
    (SELECT total_security_score >= 95 FROM security_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(total_security_score) FROM security_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
  UNION ALL
  SELECT 
    'safety',
    (SELECT NOT alert_required FROM safety_validation_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(prescription_safety_score) FROM safety_validation_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
  UNION ALL
  SELECT 
    'bias_fairness',
    (SELECT overall_fairness_score >= 90 FROM bias_audit_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(overall_fairness_score) FROM bias_audit_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
  UNION ALL
  SELECT 
    'conversation_quality',
    (SELECT overall_quality_score >= 80 FROM conversation_quality_tests ORDER BY timestamp DESC LIMIT 1),
    (SELECT AVG(overall_quality_score) FROM conversation_quality_tests WHERE timestamp > NOW() - INTERVAL '1 hour')
)
SELECT 
  category,
  healthy as current_status,
  avg_metric as hourly_average,
  NOW() as last_updated
FROM latest_tests;

-- ============================================
-- Quality Score Trends View (7 Days)
-- ============================================
CREATE OR REPLACE VIEW quality_trends_7d AS
SELECT 
  DATE_TRUNC('day', timestamp) as day,
  AVG(archetype_accuracy) as therapy_accuracy,
  AVG(success_rate) as journey_success,
  AVG(performance_score) as performance,
  AVG(total_security_score) as security,
  AVG(overall_fairness_score) as fairness,
  AVG(overall_quality_score) as conversation_quality,
  AVG(overall_health_score) as overall_health
FROM (
  SELECT timestamp, archetype_accuracy, NULL as success_rate, NULL as performance_score, 
         NULL as total_security_score, NULL as overall_fairness_score, NULL as overall_quality_score,
         NULL as overall_health_score
  FROM therapy_logic_tests WHERE timestamp > NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT timestamp, NULL, success_rate, NULL, NULL, NULL, NULL, NULL
  FROM user_journey_tests WHERE timestamp > NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT timestamp, NULL, NULL, performance_score, NULL, NULL, NULL, NULL
  FROM performance_tests WHERE timestamp > NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT timestamp, NULL, NULL, NULL, total_security_score, NULL, NULL, NULL
  FROM security_tests WHERE timestamp > NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT timestamp, NULL, NULL, NULL, NULL, overall_fairness_score, NULL, NULL
  FROM bias_audit_tests WHERE timestamp > NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT timestamp, NULL, NULL, NULL, NULL, NULL, overall_quality_score, NULL
  FROM conversation_quality_tests WHERE timestamp > NOW() - INTERVAL '7 days'
  
  UNION ALL
  
  SELECT timestamp, NULL, NULL, NULL, NULL, NULL, NULL, overall_health_score
  FROM ai_analytics_reports WHERE timestamp > NOW() - INTERVAL '7 days'
) combined
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY day DESC;

-- ============================================
-- Alert Summary View
-- ============================================
CREATE OR REPLACE VIEW alert_summary AS
SELECT 
  'Health Check' as source,
  COUNT(*) as total_alerts,
  MAX(timestamp) as last_alert
FROM test_results 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Therapy Logic',
  COUNT(*),
  MAX(timestamp)
FROM therapy_logic_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'User Journeys',
  COUNT(*),
  MAX(timestamp)
FROM user_journey_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Performance',
  COUNT(*),
  MAX(timestamp)
FROM performance_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Security',
  COUNT(*),
  MAX(timestamp)
FROM security_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Safety',
  COUNT(*),
  MAX(timestamp)
FROM safety_validation_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Bias/Fairness',
  COUNT(*),
  MAX(timestamp)
FROM bias_audit_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours'

UNION ALL

SELECT 
  'Conversation Quality',
  COUNT(*),
  MAX(timestamp)
FROM conversation_quality_tests 
WHERE alert_required AND timestamp > NOW() - INTERVAL '24 hours';

-- ============================================
-- Cleanup Function (Updated)
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_test_results()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Clean all test tables (keep 30 days)
  DELETE FROM test_results WHERE timestamp < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM therapy_logic_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  DELETE FROM user_journey_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  DELETE FROM performance_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  DELETE FROM security_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  DELETE FROM safety_validation_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  DELETE FROM bias_audit_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  DELETE FROM conversation_quality_tests WHERE timestamp < NOW() - INTERVAL '30 days';
  
  -- Keep AI analytics longer (90 days)
  DELETE FROM ai_analytics_reports WHERE timestamp < NOW() - INTERVAL '90 days';
  
  -- Clean execution logs (90 days)
  DELETE FROM test_execution_log WHERE timestamp < NOW() - INTERVAL '90 days';
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Grant Permissions
-- ============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

GRANT SELECT ON comprehensive_system_status TO authenticated;
GRANT SELECT ON quality_trends_7d TO authenticated;
GRANT SELECT ON alert_summary TO authenticated;

-- ============================================
-- Verification
-- ============================================
DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN (
            'performance_tests',
            'security_tests',
            'safety_validation_tests',
            'bias_audit_tests',
            'conversation_quality_tests',
            'ai_analytics_reports'
          )) = 6,
         'Not all new tables were created successfully';
  
  RAISE NOTICE 'Extended database schema deployed successfully!';
  RAISE NOTICE 'New tables created: 6';
  RAISE NOTICE 'New views created: 3 (comprehensive_system_status, quality_trends_7d, alert_summary)';
  RAISE NOTICE 'Total tables: 10';
END $$;
