-- CommCoach AI - Testing & Monitoring Database Schema
-- Deploy this in your Supabase SQL Editor

-- ============================================
-- Table 1: Health Monitor Results
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Frontend metrics
  frontend_status INTEGER,
  frontend_response_time_ms INTEGER,
  
  -- Backend metrics
  backend_status INTEGER,
  backend_response_time_ms INTEGER,
  
  -- Database metrics
  db_session_count INTEGER,
  db_analysis_count INTEGER,
  db_size_mb NUMERIC(10, 2),
  
  -- Overall health
  is_healthy BOOLEAN DEFAULT FALSE,
  errors JSONB,
  alert_sent BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_test_results_timestamp ON test_results(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_health ON test_results(is_healthy, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_alerts ON test_results(timestamp DESC) 
  WHERE alert_sent = TRUE OR is_healthy = FALSE;

-- ============================================
-- Table 2: RTCROS Therapy Logic Test Results
-- ============================================
CREATE TABLE IF NOT EXISTS therapy_logic_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Test metrics
  total_tests INTEGER NOT NULL,
  passed_tests INTEGER NOT NULL,
  archetype_accuracy NUMERIC(5, 2), -- Percentage (0-100)
  overall_pass_rate NUMERIC(5, 2),  -- Percentage (0-100)
  average_confidence NUMERIC(5, 2), -- Percentage (0-100)
  
  -- Detailed results
  category_breakdown JSONB, -- {fortress: {total: 2, correct: 2}, prosecutor: {...}}
  individual_results JSONB, -- [{test_id: 'fortress_test_1', passed: true, ...}]
  
  -- Alerting
  alert_required BOOLEAN DEFAULT FALSE,
  alert_sent BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_therapy_tests_timestamp ON therapy_logic_tests(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_therapy_tests_accuracy ON therapy_logic_tests(archetype_accuracy DESC);
CREATE INDEX IF NOT EXISTS idx_therapy_tests_alerts ON therapy_logic_tests(timestamp DESC) 
  WHERE alert_required = TRUE;

-- ============================================
-- Table 3: User Journey Test Results
-- ============================================
CREATE TABLE IF NOT EXISTS user_journey_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Test details
  test_session_id UUID,
  test_user_input TEXT,
  
  -- Journey steps
  homepage_load_success BOOLEAN,
  homepage_load_time_ms INTEGER,
  
  api_call_success BOOLEAN,
  api_response_time_ms INTEGER,
  
  db_write_success BOOLEAN,
  db_write_time_ms INTEGER,
  
  response_validation_passed BOOLEAN,
  xml_structure_valid BOOLEAN,
  
  -- Overall result
  journey_completed BOOLEAN DEFAULT FALSE,
  total_journey_time_ms INTEGER,
  
  -- Aggregated metrics (for workflow 3)
  total_journeys INTEGER,
  passed_journeys INTEGER,
  failed_journeys INTEGER,
  success_rate NUMERIC(5,2),
  database_consistency_rate NUMERIC(5,2),
  multi_turn_consistency NUMERIC(5,2),
  edge_case_success_rate NUMERIC(5,2),
  failed_journeys_details JSONB,
  
  -- Response data
  identified_archetype TEXT,
  confidence_score NUMERIC(5, 2),
  response_preview TEXT,
  
  -- Errors
  errors JSONB,
  alert_required BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journey_tests_timestamp ON user_journey_tests(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_journey_tests_success ON user_journey_tests(journey_completed, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_journey_tests_session ON user_journey_tests(test_session_id);

-- ============================================
-- Table 4: Test Execution Log (Audit Trail)
-- ============================================
CREATE TABLE IF NOT EXISTS test_execution_log (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Workflow info
  workflow_name TEXT NOT NULL,
  workflow_id TEXT,
  execution_id TEXT,
  
  -- Execution details
  status TEXT CHECK (status IN ('running', 'success', 'failed', 'warning')),
  execution_time_ms INTEGER,
  
  -- Results summary
  tests_run INTEGER,
  tests_passed INTEGER,
  tests_failed INTEGER,
  
  -- Error details
  error_message TEXT,
  error_stack JSONB,
  
  -- Metadata
  triggered_by TEXT DEFAULT 'schedule',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_execution_log_timestamp ON test_execution_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_execution_log_workflow ON test_execution_log(workflow_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_execution_log_status ON test_execution_log(status, timestamp DESC);

-- ============================================
-- Views for Quick Monitoring
-- ============================================

-- View 1: Last 24 hours health summary
CREATE OR REPLACE VIEW health_summary_24h AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  COUNT(*) as total_checks,
  SUM(CASE WHEN is_healthy THEN 1 ELSE 0 END) as healthy_checks,
  AVG(frontend_response_time_ms) as avg_frontend_time,
  AVG(backend_response_time_ms) as avg_backend_time,
  MAX(db_size_mb) as current_db_size,
  ARRAY_AGG(DISTINCT errors) FILTER (WHERE errors IS NOT NULL) as all_errors
FROM test_results
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC;

-- View 2: Therapy logic accuracy trends
CREATE OR REPLACE VIEW therapy_accuracy_trends AS
SELECT 
  DATE_TRUNC('day', timestamp) as day,
  AVG(archetype_accuracy) as avg_accuracy,
  AVG(overall_pass_rate) as avg_pass_rate,
  AVG(average_confidence) as avg_confidence,
  COUNT(*) as test_runs,
  SUM(CASE WHEN alert_required THEN 1 ELSE 0 END) as alerts_triggered
FROM therapy_logic_tests
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY day DESC;

-- View 3: Current system status (most recent checks)
CREATE OR REPLACE VIEW current_system_status AS
WITH latest_health AS (
  SELECT * FROM test_results ORDER BY timestamp DESC LIMIT 1
),
latest_therapy AS (
  SELECT * FROM therapy_logic_tests ORDER BY timestamp DESC LIMIT 1
),
latest_journey AS (
  SELECT * FROM user_journey_tests ORDER BY timestamp DESC LIMIT 1
)
SELECT 
  NOW() as status_time,
  lh.is_healthy as system_healthy,
  lh.frontend_status,
  lh.backend_status,
  lh.db_session_count,
  lt.archetype_accuracy as therapy_accuracy,
  lj.journey_completed as last_journey_success,
  lh.timestamp as last_health_check,
  lt.timestamp as last_therapy_test,
  lj.timestamp as last_journey_test
FROM latest_health lh
CROSS JOIN latest_therapy lt
CROSS JOIN latest_journey lj;

-- ============================================
-- Functions for Automated Cleanup
-- ============================================

-- Function: Clean old test results (keep 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_test_results()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM test_results 
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM therapy_logic_tests 
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  DELETE FROM user_journey_tests 
  WHERE timestamp < NOW() - INTERVAL '30 days';
  
  DELETE FROM test_execution_log 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (run daily at 2 AM)
-- Note: You'll need to set this up in Supabase Dashboard -> Database -> Cron
-- SELECT cron.schedule('cleanup-old-tests', '0 2 * * *', 'SELECT cleanup_old_test_results();');

-- ============================================
-- Grant Permissions (if needed)
-- ============================================

-- Grant access to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant read access to authenticated users (optional - for dashboards)
GRANT SELECT ON health_summary_24h TO authenticated;
GRANT SELECT ON therapy_accuracy_trends TO authenticated;
GRANT SELECT ON current_system_status TO authenticated;

-- ============================================
-- Sample Queries for Monitoring
-- ============================================

-- Query 1: Get latest system status
-- SELECT * FROM current_system_status;

-- Query 2: Check health over last 24 hours
-- SELECT * FROM health_summary_24h;

-- Query 3: Find all failed health checks in last week
-- SELECT * FROM test_results 
-- WHERE timestamp > NOW() - INTERVAL '7 days' 
-- AND is_healthy = FALSE 
-- ORDER BY timestamp DESC;

-- Query 4: Get therapy accuracy trend
-- SELECT * FROM therapy_accuracy_trends;

-- Query 5: Find low accuracy tests
-- SELECT * FROM therapy_logic_tests 
-- WHERE archetype_accuracy < 80 
-- ORDER BY timestamp DESC 
-- LIMIT 10;

-- ============================================
-- Initial Data Validation
-- ============================================

-- Verify tables were created
DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM information_schema.tables 
          WHERE table_name IN ('test_results', 'therapy_logic_tests', 'user_journey_tests', 'test_execution_log')) = 4,
         'Not all tables were created successfully';
  
  RAISE NOTICE 'Database schema deployed successfully!';
  RAISE NOTICE 'Tables created: test_results, therapy_logic_tests, user_journey_tests, test_execution_log';
  RAISE NOTICE 'Views created: health_summary_24h, therapy_accuracy_trends, current_system_status';
END $$;
