export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            test_results: {
                Row: {
                    id: number
                    timestamp: string
                    frontend_status: number | null
                    frontend_response_time_ms: number | null
                    backend_status: number | null
                    backend_response_time_ms: number | null
                    db_session_count: number | null
                    db_analysis_count: number | null
                    db_size_mb: number | null
                    is_healthy: boolean | null
                    errors: Json | null
                    alert_sent: boolean | null
                    created_at: string
                }
            }
            therapy_logic_tests: {
                Row: {
                    id: number
                    timestamp: string
                    total_tests: number
                    passed_tests: number
                    archetype_accuracy: number | null
                    overall_pass_rate: number | null
                    average_confidence: number | null
                    category_breakdown: Json | null
                    individual_results: Json | null
                    alert_required: boolean | null
                    alert_sent: boolean | null
                    created_at: string
                }
            }
            user_journey_tests: {
                Row: {
                    id: number
                    timestamp: string
                    test_session_id: string | null
                    test_user_input: string | null
                    homepage_load_success: boolean | null
                    homepage_load_time_ms: number | null
                    api_call_success: boolean | null
                    api_response_time_ms: number | null
                    db_write_success: boolean | null
                    db_write_time_ms: number | null
                    response_validation_passed: boolean | null
                    xml_structure_valid: boolean | null
                    journey_completed: boolean | null
                    total_journey_time_ms: number | null
                    total_journeys: number | null
                    passed_journeys: number | null
                    failed_journeys: number | null
                    success_rate: number | null
                    database_consistency_rate: number | null
                    multi_turn_consistency: number | null
                    edge_case_success_rate: number | null
                    failed_journeys_details: Json | null
                    identified_archetype: string | null
                    confidence_score: number | null
                    response_preview: string | null
                    errors: Json | null
                    alert_required: boolean | null
                    created_at: string
                }
            }
            performance_tests: {
                Row: {
                    id: number
                    timestamp: string
                    concurrent_users: number
                    successful_requests: number
                    failed_requests: number
                    avg_response_time_ms: number | null
                    max_response_time_ms: number | null
                    min_response_time_ms: number | null
                    within_target_rate: number | null
                    db_active_connections: number | null
                    db_max_connections: number | null
                    db_connection_utilization: number | null
                    db_query_avg_ms: number | null
                    db_size_mb: number | null
                    estimated_memory_mb: number | null
                    cpu_usage_estimated: number | null
                    performance_score: number | null
                    connection_pool_status: string | null
                    errors: Json | null
                    alert_required: boolean | null
                    created_at: string
                }
            }
            security_tests: {
                Row: {
                    id: number
                    timestamp: string
                    injection_tests_passed: number | null
                    injection_tests_total: number | null
                    xss_tests_passed: number | null
                    xss_tests_total: number | null
                    auth_tests_passed: number | null
                    auth_tests_total: number | null
                    data_protection_tests_passed: number | null
                    data_protection_tests_total: number | null
                    total_security_score: number | null
                    vulnerabilities_found: Json | null
                    critical_issues_count: number | null
                    high_issues_count: number | null
                    medium_issues_count: number | null
                    low_issues_count: number | null
                    exposed_secrets: Json | null
                    insecure_endpoints: Json | null
                    alert_required: boolean | null
                    created_at: string
                }
            }
            safety_validation_tests: {
                Row: {
                    id: number
                    timestamp: string
                    cove_active: boolean | null
                    cove_tests_passed: number | null
                    cove_tests_total: number | null
                    harmful_advice_blocked: number | null
                    harmful_advice_total_attempts: number | null
                    prescription_safety_score: number | null
                    unsafe_prescriptions_found: number | null
                    boundary_maintained: boolean | null
                    medical_advice_given: boolean | null
                    professional_boundaries_score: number | null
                    age_appropriate_responses: number | null
                    trauma_informed_responses: number | null
                    crisis_escalation_handled: number | null
                    issues_found: Json | null
                    safety_violations: Json | null
                    alert_required: boolean | null
                    created_at: string
                }
            }
            bias_audit_tests: {
                Row: {
                    id: number
                    timestamp: string
                    gender_fairness_score: number | null
                    age_fairness_score: number | null
                    cultural_fairness_score: number | null
                    orientation_fairness_score: number | null
                    disability_fairness_score: number | null
                    economic_fairness_score: number | null
                    language_fairness_score: number | null
                    gendered_language_instances: number | null
                    stereotyping_instances: number | null
                    assumption_instances: number | null
                    overall_fairness_score: number | null
                    recommendation_equity_score: number | null
                    bias_instances_found: Json | null
                    demographic_disparities: Json | null
                    alert_required: boolean | null
                    created_at: string
                }
            }
            conversation_quality_tests: {
                Row: {
                    id: number
                    timestamp: string
                    empathy_score: number | null
                    clinical_accuracy_score: number | null
                    actionability_score: number | null
                    clarity_score: number | null
                    personalization_score: number | null
                    motivation_score: number | null
                    followup_coherence_score: number | null
                    context_retention_score: number | null
                    growth_tracking_score: number | null
                    overall_quality_score: number | null
                    low_quality_responses: Json | null
                    quality_issues: Json | null
                    best_response_examples: Json | null
                    worst_response_examples: Json | null
                    alert_required: boolean | null
                    created_at: string
                }
            }
            ai_analytics_reports: {
                Row: {
                    id: number
                    report_type: 'hourly_analysis' | 'daily_summary' | 'weekly_analysis' | 'anomaly_detection' | 'improvement_recommendations'
                    timestamp: string
                    overall_health_score: number | null
                    overall_status: 'excellent' | 'good' | 'warning' | 'critical' | null
                    executive_summary: string | null
                    critical_issues: Json | null
                    warnings: Json | null
                    trends: Json | null
                    recommendations: Json | null
                    predictions: string | null
                    confidence_level: 'high' | 'medium' | 'low' | null
                    category_scores: Json | null
                    total_tests_run: number | null
                    ai_generated_insights: string | null
                    report_sent: boolean | null
                    sent_at: string | null
                    created_at: string
                }
            }
        }
    }
}
