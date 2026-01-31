-- ==========================================
-- ARCHETYPE PROGRESSION SYSTEM SCHEMA
-- ==========================================
-- RPG-style archetype mastery and progression tracking
-- ==========================================

-- ========================================
-- PART 1: Archetype Definitions
-- ========================================

CREATE TABLE IF NOT EXISTS archetypes (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  tier INTEGER CHECK (tier IN (1, 2, 3)),
  icon TEXT,
  traits TEXT[],
  description TEXT,
  growth_path TEXT, -- Which Tier 2 archetype this grows into
  unlock_requirements JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert all 8 archetypes
INSERT INTO archetypes (id, name, tier, icon, traits, description, growth_path, unlock_requirements) VALUES
-- Tier 1: Problematic Patterns
('FORTRESS', 'The Fortress', 1, '🏰', 
  ARRAY['Defensive', 'Silent', 'Withdrawn', 'Guarded'],
  'Uses silence as protection and resists opening up.',
  'BUILDER',
  '{}'::jsonb
),
('PROSECUTOR', 'The Prosecutor', 1, '⚖️',
  ARRAY['Aggressive', 'Logic-driven', 'Confrontational', 'Winning'],
  'Seeks to win the argument at the cost of connection.',
  'WARRIOR',
  '{}'::jsonb
),
('PLEASER', 'The Pleaser', 1, '🕊️',
  ARRAY['Passive', 'Self-sacrificing', 'Avoiding conflict', 'Apologetic'],
  'Sacrifices own needs to keep the peace.',
  'LISTENER',
  '{}'::jsonb
),
('SOLVER', 'The Solver', 1, '🔧',
  ARRAY['Dismissive of emotions', 'Solution-focused', 'Impatient'],
  'Jumps to fixes without acknowledging emotional weight.',
  'BUILDER',
  '{}'::jsonb
),
-- Tier 2: Healthy Growth
('BUILDER', 'The Builder', 2, '🏗️',
  ARRAY['Constructive', 'Collaborative', 'Patient', 'Solution-oriented'],
  'Builds bridges through structured problem-solving.',
  NULL,
  '{"requiredArchetypes": ["FORTRESS"], "minSessions": 10}'::jsonb
),
('LISTENER', 'The Listener', 2, '👂',
  ARRAY['Empathetic', 'Reflective', 'Curious', 'Non-judgmental'],
  'Creates space for others through active listening.',
  NULL,
  '{"requiredArchetypes": ["PLEASER"], "minSessions": 10}'::jsonb
),
('WARRIOR', 'The Warrior', 2, '⚔️',
  ARRAY['Assertive', 'Confident', 'Direct', 'Protective'],
  'Stands firm in truth while respecting others.',
  NULL,
  '{"requiredArchetypes": ["PROSECUTOR"], "minSessions": 10}'::jsonb
),
-- Tier 3: Mastery
('SAGE', 'The Sage', 3, '🧙',
  ARRAY['Wise', 'Balanced', 'Adaptive', 'Integrative'],
  'Synthesizes all communication styles with wisdom.',
  NULL,
  '{"requiredArchetypes": ["BUILDER", "LISTENER", "WARRIOR"], "allMustBeMastered": true}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_archetypes_tier ON archetypes(tier);

-- ========================================
-- PART 2: User Archetype Progress
-- ========================================

-- Add archetype columns to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS current_archetype TEXT DEFAULT 'FORTRESS' REFERENCES archetypes(id),
  ADD COLUMN IF NOT EXISTS unlocked_archetypes JSONB DEFAULT '["FORTRESS", "PROSECUTOR", "PLEASER", "SOLVER"]'::jsonb,
  ADD COLUMN IF NOT EXISTS archetype_mastery JSONB DEFAULT '{}'::jsonb;

-- Example archetype_mastery structure:
-- {
--   "FORTRESS": {"sessions": 15, "mastered": true, "unlocked_at": "2026-01-31T10:00:00Z"},
--   "BUILDER": {"sessions": 3, "mastered": false, "unlocked_at": "2026-01-31T15:00:00Z"}
-- }

CREATE INDEX IF NOT EXISTS idx_profiles_current_archetype ON profiles(current_archetype);

-- ========================================
-- PART 3: Archetype Session Tracking
-- ========================================

CREATE TABLE IF NOT EXISTS archetype_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  archetype TEXT NOT NULL REFERENCES archetypes(id),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  quality_score NUMERIC(5,2) CHECK (quality_score BETWEEN 0 AND 100),
  duration_seconds INTEGER,
  insights JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archetype_sessions_user ON archetype_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_archetype_sessions_archetype ON archetype_sessions(archetype);
CREATE INDEX IF NOT EXISTS idx_archetype_sessions_created ON archetype_sessions(created_at DESC);

COMMENT ON TABLE archetype_sessions IS 'Track individual sessions for archetype progression';

-- ========================================
-- PART 4: Helper Functions
-- ========================================

-- Function to get user's archetype progress
CREATE OR REPLACE FUNCTION get_user_archetype_progress(p_user_id UUID)
RETURNS TABLE (
  archetype_id TEXT,
  archetype_name TEXT,
  tier INTEGER,
  icon TEXT,
  sessions_completed INTEGER,
  is_unlocked BOOLEAN,
  is_mastered BOOLEAN,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.tier,
    a.icon,
    COALESCE((p.archetype_mastery->a.id->>'sessions')::INTEGER, 0) as sessions_completed,
    (p.unlocked_archetypes ? a.id) as is_unlocked,
    COALESCE((p.archetype_mastery->a.id->>'mastered')::BOOLEAN, false) as is_mastered,
    (p.current_archetype = a.id) as is_active
  FROM archetypes a
  CROSS JOIN profiles p
  WHERE p.id = p_user_id
  ORDER BY a.tier, a.id;
END;
$$;

-- Function to track archetype session
CREATE OR REPLACE FUNCTION track_archetype_session(
  p_user_id UUID,
  p_archetype TEXT,
  p_session_id UUID DEFAULT NULL,
  p_quality_score NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_current_sessions INTEGER;
  v_min_sessions INTEGER;
  v_newly_unlocked TEXT[];
  v_result JSONB;
BEGIN
  -- Insert session record
  INSERT INTO archetype_sessions (user_id, archetype, session_id, quality_score)
  VALUES (p_user_id, p_archetype, p_session_id, p_quality_score);
  
  -- Get current session count
  SELECT COALESCE((archetype_mastery->p_archetype->>'sessions')::INTEGER, 0) + 1
  INTO v_current_sessions
  FROM profiles
  WHERE id = p_user_id;
  
  -- Update session count in archetype_mastery
  UPDATE profiles
  SET archetype_mastery = jsonb_set(
    COALESCE(archetype_mastery, '{}'::jsonb),
    ARRAY[p_archetype, 'sessions'],
    to_jsonb(v_current_sessions)
  )
  WHERE id = p_user_id;
  
  -- Check if archetype should be mastered (10 sessions)
  IF v_current_sessions >= 10 THEN
    UPDATE profiles
    SET archetype_mastery = jsonb_set(
      archetype_mastery,
      ARRAY[p_archetype, 'mastered'],
      'true'::jsonb
    )
    WHERE id = p_user_id;
  END IF;
  
  -- Check for new unlocks
  v_newly_unlocked := ARRAY[]::TEXT[];
  
  -- Check each Tier 2 archetype
  FOR v_min_sessions IN 
    SELECT (unlock_requirements->>'minSessions')::INTEGER
    FROM archetypes
    WHERE tier = 2
  LOOP
    -- Logic to check unlock requirements would go here
    -- Simplified for now
  END LOOP;
  
  -- Build result
  SELECT jsonb_build_object(
    'sessions_completed', v_current_sessions,
    'is_mastered', v_current_sessions >= 10,
    'newly_unlocked', v_newly_unlocked
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Function to switch user's active archetype
CREATE OR REPLACE FUNCTION switch_archetype(
  p_user_id UUID,
  p_new_archetype TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_unlocked BOOLEAN;
BEGIN
  -- Check if archetype is unlocked
  SELECT unlocked_archetypes ? p_new_archetype
  INTO v_is_unlocked
  FROM profiles
  WHERE id = p_user_id;
  
  IF NOT v_is_unlocked THEN
    RAISE EXCEPTION 'Archetype % is not unlocked for user %', p_new_archetype, p_user_id;
  END IF;
  
  -- Switch archetype
  UPDATE profiles
  SET current_archetype = p_new_archetype
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$;

-- ========================================
-- PART 5: Grant Permissions
-- ========================================

GRANT SELECT ON archetypes TO authenticated;
GRANT SELECT, INSERT ON archetype_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_archetype_progress TO authenticated;
GRANT EXECUTE ON FUNCTION track_archetype_session TO authenticated;
GRANT EXECUTE ON FUNCTION switch_archetype TO authenticated;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
DECLARE
  archetypes_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO archetypes_count FROM archetypes;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ ARCHETYPE PROGRESSION SYSTEM DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🎮 RPG Archetype System Ready';
  RAISE NOTICE '✅ archetypes table created';
  RAISE NOTICE '✅ archetype_sessions table created';
  RAISE NOTICE '✅ profiles table extended';
  RAISE NOTICE '';
  RAISE NOTICE '🎭 Archetypes Loaded: %', archetypes_count;
  RAISE NOTICE '   Tier 1 (Diagnosis): Fortress, Prosecutor, Pleaser, Solver';
  RAISE NOTICE '   Tier 2 (Growth): Builder, Listener, Warrior';
  RAISE NOTICE '   Tier 3 (Mastery): Sage';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions Available:';
  RAISE NOTICE '   - get_user_archetype_progress()';
  RAISE NOTICE '   - track_archetype_session()';
  RAISE NOTICE '   - switch_archetype()';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Archetype Progression System Ready!';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
