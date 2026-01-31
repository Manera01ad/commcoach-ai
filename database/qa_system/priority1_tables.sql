-- Priority 1 QA Tables for CommCoach AI
-- Run this in your Supabase SQL Editor

-- 1. Security Testing Table
CREATE TABLE IF NOT EXISTS security_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  injection_tests_passed INTEGER DEFAULT 0,
  injection_tests_total INTEGER DEFAULT 0,
  xss_tests_passed INTEGER DEFAULT 0,
  xss_tests_total INTEGER DEFAULT 0,
  total_security_score NUMERIC(5,2) DEFAULT 0,
  vulnerabilities_found JSONB DEFAULT '[]'::jsonb,
  critical_issues_count INTEGER DEFAULT 0,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_timestamp ON security_tests(timestamp DESC);

-- 2. Safety Validation Table
CREATE TABLE IF NOT EXISTS safety_validation_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  prescription_safety_score NUMERIC(5,2) DEFAULT 0,
  unsafe_prescriptions_found INTEGER DEFAULT 0,
  boundary_maintained BOOLEAN DEFAULT TRUE,
  issues_found JSONB DEFAULT '[]'::jsonb,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_timestamp ON safety_validation_tests(timestamp DESC);

-- 3. Bias & Fairness Audit Table
CREATE TABLE IF NOT EXISTS bias_audit_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  gender_fairness_score NUMERIC(5,2) DEFAULT 0,
  age_fairness_score NUMERIC(5,2) DEFAULT 0,
  overall_fairness_score NUMERIC(5,2) DEFAULT 0,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bias_timestamp ON bias_audit_tests(timestamp DESC);

-- 4. User Journey Tests table
CREATE TABLE IF NOT EXISTS user_journey_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  journey_id TEXT,
  session_id TEXT,
  success_rate NUMERIC(5,2) DEFAULT 0,
  passed_journeys INTEGER DEFAULT 0,
  total_journeys INTEGER DEFAULT 0,
  failed_journeys_details JSONB DEFAULT '[]'::jsonb,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journey_timestamp ON user_journey_tests(timestamp DESC);

-- 5. Therapy Logic Tests (RTCROS Validator)
CREATE TABLE IF NOT EXISTS therapy_logic_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_tests INTEGER DEFAULT 0,
  passed_tests INTEGER DEFAULT 0,
  archetype_accuracy NUMERIC(5,2) DEFAULT 0,
  overall_pass_rate NUMERIC(5,2) DEFAULT 0,
  average_confidence NUMERIC(5,2) DEFAULT 0,
  category_breakdown JSONB DEFAULT '{}'::jsonb,
  individual_results JSONB DEFAULT '[]'::jsonb,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_therapy_timestamp ON therapy_logic_tests(timestamp DESC);

-- 6. Performance Tests
CREATE TABLE IF NOT EXISTS performance_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  concurrent_users INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  max_response_time_ms INTEGER DEFAULT 0,
  min_response_time_ms INTEGER DEFAULT 0,
  performance_score NUMERIC(5,2) DEFAULT 0,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON performance_tests(timestamp DESC);

-- 7. Conversation Quality Tests
CREATE TABLE IF NOT EXISTS conversation_quality_tests (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  empathy_score NUMERIC(5,2) DEFAULT 0,
  clinical_accuracy_score NUMERIC(5,2) DEFAULT 0,
  actionability_score NUMERIC(5,2) DEFAULT 0,
  clarity_score NUMERIC(5,2) DEFAULT 0,
  personalization_score NUMERIC(5,2) DEFAULT 0,
  overall_quality_score NUMERIC(5,2) DEFAULT 0,
  alert_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quality_timestamp ON conversation_quality_tests(timestamp DESC);

-- Insert sample data for Priority 1 (Live Monitoring)
INSERT INTO security_tests (total_security_score, injection_tests_passed, injection_tests_total, xss_tests_passed, xss_tests_total, critical_issues_count)
VALUES (95.0, 10, 10, 8, 8, 0);

INSERT INTO safety_validation_tests (prescription_safety_score, boundary_maintained)
VALUES (92.0, TRUE);

INSERT INTO bias_audit_tests (gender_fairness_score, age_fairness_score, overall_fairness_score)
VALUES (88.0, 90.0, 89.0);

INSERT INTO user_journey_tests (success_rate, passed_journeys, total_journeys)
VALUES (85.0, 17, 20);

-- Insert sample data for Priority 2 (System Calibration - WIP)
INSERT INTO therapy_logic_tests (total_tests, passed_tests, archetype_accuracy, overall_pass_rate, average_confidence)
VALUES (6, 5, 83.3, 83.3, 75.0);

INSERT INTO performance_tests (concurrent_users, successful_requests, failed_requests, avg_response_time_ms, performance_score)
VALUES (10, 95, 5, 450, 78.0);

INSERT INTO conversation_quality_tests (empathy_score, clinical_accuracy_score, clarity_score, overall_quality_score)
VALUES (85.0, 82.0, 88.0, 85.0);

-- Verify all tables
SELECT 'security_tests' as table_name, COUNT(*) as rows FROM security_tests
UNION ALL
SELECT 'safety_validation_tests', COUNT(*) FROM safety_validation_tests
UNION ALL
SELECT 'bias_audit_tests', COUNT(*) FROM bias_audit_tests
UNION ALL
SELECT 'user_journey_tests', COUNT(*) FROM user_journey_tests
UNION ALL
SELECT 'therapy_logic_tests', COUNT(*) FROM therapy_logic_tests
UNION ALL
SELECT 'performance_tests', COUNT(*) FROM performance_tests
UNION ALL
SELECT 'conversation_quality_tests', COUNT(*) FROM conversation_quality_tests;
