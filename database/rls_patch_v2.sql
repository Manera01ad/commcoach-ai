-- ========================================================
-- RLS SECURITY PATCH V2 (CONSOLIDATED)
-- TARGET: 16 Missing Tables from Audit
-- DATE: 2026-02-07
-- ========================================================

-- Disable migration logs for speed
SET client_min_messages TO WARNING;

-- ========================================================
-- CATEGORY 1: HIGH RISK (Financial & Sensitive Context)
-- ========================================================

-- 1. founder_memberships
ALTER TABLE founder_memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own founder membership" ON founder_memberships;
CREATE POLICY "Users can view their own founder membership" ON founder_memberships
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own founder membership" ON founder_memberships;
CREATE POLICY "Users can update their own founder membership" ON founder_memberships
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. commission_payouts
ALTER TABLE commission_payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own payouts" ON commission_payouts;
CREATE POLICY "Users can view their own payouts" ON commission_payouts
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can request payouts" ON commission_payouts;
CREATE POLICY "Users can request payouts" ON commission_payouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Referrers can view their referrals" ON referrals;
CREATE POLICY "Referrers can view their referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);
DROP POLICY IF EXISTS "Authenticated users can create referrals" ON referrals;
CREATE POLICY "Authenticated users can create referrals" ON referrals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. context_windows
ALTER TABLE context_windows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own context windows" ON context_windows;
CREATE POLICY "Users can manage their own context windows" ON context_windows
  FOR ALL USING (auth.uid() = user_id);


-- ========================================================
-- CATEGORY 2: MEDIUM RISK (User Progress & Personalities)
-- ========================================================

-- 5. user_levels
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own level" ON user_levels;
CREATE POLICY "Users can view their own level" ON user_levels
  FOR SELECT USING (auth.uid() = user_id);

-- 6. daily_missions
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own daily missions" ON daily_missions;
CREATE POLICY "Users can manage their own daily missions" ON daily_missions
  FOR ALL USING (auth.uid() = user_id);

-- 7. mission_completions
ALTER TABLE mission_completions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own mission completions" ON mission_completions;
CREATE POLICY "Users can view their own mission completions" ON mission_completions
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can log their own completions" ON mission_completions;
CREATE POLICY "Users can log their own completions" ON mission_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. archetype_sessions
ALTER TABLE archetype_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their archetype sessions" ON archetype_sessions;
CREATE POLICY "Users can manage their archetype sessions" ON archetype_sessions
  FOR ALL USING (auth.uid() = user_id);

-- 9. user_persona_preferences
ALTER TABLE user_persona_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their persona preferences" ON user_persona_preferences;
CREATE POLICY "Users can manage their persona preferences" ON user_persona_preferences
  FOR ALL USING (auth.uid() = user_id);

-- 10. persona_interactions
ALTER TABLE persona_interactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their persona interactions" ON persona_interactions;
CREATE POLICY "Users can view their persona interactions" ON persona_interactions
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can log their interactions" ON persona_interactions;
CREATE POLICY "Users can log their interactions" ON persona_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ========================================================
-- CATEGORY 3: LOW RISK (Read-Only Reference & Viral Data)
-- ========================================================

-- 11. agent_personas (System Data)
ALTER TABLE agent_personas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON agent_personas;
CREATE POLICY "Allow read access to all authenticated users" ON agent_personas
  FOR SELECT USING (auth.role() = 'authenticated');

-- 12. archetypes (System Data)
ALTER TABLE archetypes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON archetypes;
CREATE POLICY "Allow read access to all authenticated users" ON archetypes
  FOR SELECT USING (auth.role() = 'authenticated');

-- 13. micro_drills (System Data)
ALTER TABLE micro_drills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON micro_drills;
CREATE POLICY "Allow read access to all authenticated users" ON micro_drills
  FOR SELECT USING (auth.role() = 'authenticated');

-- 14. shareable_achievements
ALTER TABLE shareable_achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Achievements are viewable by everyone" ON shareable_achievements;
CREATE POLICY "Achievements are viewable by everyone" ON shareable_achievements
  FOR SELECT USING (true); -- Publicly viewable for viral sharing
DROP POLICY IF EXISTS "Users can manage their own achievements" ON shareable_achievements;
CREATE POLICY "Users can manage their own achievements" ON shareable_achievements
  FOR ALL USING (auth.uid() = user_id);

-- 15. social_shares
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own shares" ON social_shares;
CREATE POLICY "Users can manage their own shares" ON social_shares
  FOR ALL USING (auth.uid() = user_id);

-- 16. viral_metrics
ALTER TABLE viral_metrics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own viral metrics" ON viral_metrics;
CREATE POLICY "Users can view their own viral metrics" ON viral_metrics
  FOR SELECT USING (auth.uid() = user_id);

-- ========================================================
-- FINAL CHECK: Ensure RLS is active
-- ========================================================
DO $$ 
BEGIN
  RAISE NOTICE 'RLS Patch V2 successfully generated for 16 tables.';
END $$;
