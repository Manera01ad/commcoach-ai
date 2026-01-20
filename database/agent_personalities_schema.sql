-- ==========================================
-- AGENT PERSONALITIES SYSTEM SCHEMA
-- ==========================================
-- Milestone B2: Agent Personalities
-- ==========================================

-- ========================================
-- PART 1: Persona Definitions
-- ========================================

CREATE TABLE IF NOT EXISTS agent_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  archetype TEXT NOT NULL CHECK (archetype IN ('drill_sergeant', 'empathetic_mirror', 'analyst', 'coach', 'mentor')),
  
  -- Personality traits (0-1 scale)
  directness REAL DEFAULT 0.5 CHECK (directness BETWEEN 0 AND 1),
  empathy REAL DEFAULT 0.5 CHECK (empathy BETWEEN 0 AND 1),
  formality REAL DEFAULT 0.5 CHECK (formality BETWEEN 0 AND 1),
  humor REAL DEFAULT 0.5 CHECK (humor BETWEEN 0 AND 1),
  patience REAL DEFAULT 0.5 CHECK (patience BETWEEN 0 AND 1),
  
  -- Persona configuration
  system_prompt TEXT NOT NULL,
  example_responses JSONB DEFAULT '[]'::jsonb,
  voice_settings JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_personas_archetype ON agent_personas(archetype);
CREATE INDEX IF NOT EXISTS idx_agent_personas_active ON agent_personas(is_active);

COMMENT ON TABLE agent_personas IS 'Predefined agent personalities with distinct traits';

-- ========================================
-- PART 2: User Persona Preferences
-- ========================================

CREATE TABLE IF NOT EXISTS user_persona_preferences (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_persona_id UUID REFERENCES agent_personas(id),
  persona_history JSONB DEFAULT '[]'::jsonb,
  interaction_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_persona_prefs_persona ON user_persona_preferences(preferred_persona_id);

COMMENT ON TABLE user_persona_preferences IS 'User preferences for agent personalities';

-- ========================================
-- PART 3: Persona Interaction Log
-- ========================================

CREATE TABLE IF NOT EXISTS persona_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES agent_personas(id),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_persona_interactions_user ON persona_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_persona_interactions_persona ON persona_interactions(persona_id);
CREATE INDEX IF NOT EXISTS idx_persona_interactions_rating ON persona_interactions(user_rating);

COMMENT ON TABLE persona_interactions IS 'Track user interactions with different personas';

-- ========================================
-- PART 4: Insert Core Personas
-- ========================================

INSERT INTO agent_personas (
  name, 
  description, 
  archetype, 
  directness, 
  empathy, 
  formality, 
  humor, 
  patience,
  system_prompt
) VALUES
  (
    'The Drill Sergeant',
    'Tough love approach. Direct, no-nonsense feedback that pushes you to improve.',
    'drill_sergeant',
    0.9,  -- Very direct
    0.2,  -- Low empathy
    0.6,  -- Moderately formal
    0.1,  -- Minimal humor
    0.3,  -- Low patience
    'You are The Drill Sergeant, a communication coach who believes in tough love. You are DIRECT and DEMANDING. You do not sugarcoat feedback. You push users hard because you know they can do better. Your goal is to eliminate weak communication habits through rigorous practice. Be blunt but constructive. Example: "Stop saying um. You sound weak. Try again, and this time, OWN your words."'
  ),
  (
    'The Empathetic Mirror',
    'Supportive and reflective. Validates your feelings while gently guiding improvement.',
    'empathetic_mirror',
    0.3,  -- Gentle
    0.9,  -- Very empathetic
    0.4,  -- Casual
    0.5,  -- Moderate humor
    0.9,  -- Very patient
    'You are The Empathetic Mirror, a communication coach who leads with compassion. You VALIDATE feelings first, then guide improvement. You reflect back what users are experiencing and help them find their own solutions. Be warm, understanding, and patient. Example: "I hear that you are nervous about this conversation. That is completely normal. Let us work through this together, one step at a time."'
  ),
  (
    'The Analyst',
    'Data-driven and logical. Focuses on metrics, patterns, and objective improvement.',
    'analyst',
    0.7,  -- Direct but not harsh
    0.3,  -- Low empathy
    0.8,  -- Very formal
    0.1,  -- Minimal humor
    0.6,  -- Moderate patience
    'You are The Analyst, a communication coach who relies on DATA and LOGIC. You focus on measurable metrics: filler words per minute, pause frequency, word choice precision. You provide objective feedback without emotional language. Be precise, factual, and metric-focused. Example: "You used 12 filler words in 60 seconds. Target: less than 5. Your average pause length: 2.3 seconds. Optimal: 1.5 seconds. Let us optimize."'
  )
ON CONFLICT (name) DO NOTHING;

-- ========================================
-- PART 5: Helper Functions
-- ========================================

-- Function to get persona by archetype
CREATE OR REPLACE FUNCTION get_persona_by_archetype(p_archetype TEXT)
RETURNS TABLE (
  persona_id UUID,
  name TEXT,
  description TEXT,
  directness REAL,
  empathy REAL,
  system_prompt TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    ap.name,
    ap.description,
    ap.directness,
    ap.empathy,
    ap.system_prompt
  FROM agent_personas ap
  WHERE ap.archetype = p_archetype
    AND ap.is_active = TRUE
  LIMIT 1;
END;
$$;

-- Function to log persona interaction
CREATE OR REPLACE FUNCTION log_persona_interaction(
  p_user_id UUID,
  p_persona_id UUID,
  p_session_id UUID,
  p_message_count INTEGER,
  p_duration_seconds INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO persona_interactions (
    user_id,
    persona_id,
    session_id,
    message_count,
    duration_seconds
  ) VALUES (
    p_user_id,
    p_persona_id,
    p_session_id,
    p_message_count,
    p_duration_seconds
  );
  
  -- Update persona usage count
  UPDATE agent_personas
  SET usage_count = usage_count + 1
  WHERE id = p_persona_id;
  
  -- Update user preference
  INSERT INTO user_persona_preferences (user_id, preferred_persona_id, interaction_count, last_used_at)
  VALUES (p_user_id, p_persona_id, 1, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    preferred_persona_id = p_persona_id,
    interaction_count = user_persona_preferences.interaction_count + 1,
    last_used_at = NOW(),
    updated_at = NOW();
END;
$$;

-- Function to get user's preferred persona
CREATE OR REPLACE FUNCTION get_user_preferred_persona(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_persona_id UUID;
BEGIN
  SELECT preferred_persona_id INTO v_persona_id
  FROM user_persona_preferences
  WHERE user_id = p_user_id;
  
  -- If no preference, return default (Empathetic Mirror)
  IF v_persona_id IS NULL THEN
    SELECT id INTO v_persona_id
    FROM agent_personas
    WHERE archetype = 'empathetic_mirror'
    LIMIT 1;
  END IF;
  
  RETURN v_persona_id;
END;
$$;

-- ========================================
-- PART 6: Grant Permissions
-- ========================================

GRANT SELECT ON agent_personas TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_persona_preferences TO authenticated;
GRANT SELECT, INSERT ON persona_interactions TO authenticated;
GRANT EXECUTE ON FUNCTION get_persona_by_archetype TO authenticated;
GRANT EXECUTE ON FUNCTION log_persona_interaction TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_preferred_persona TO authenticated;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
DECLARE
  personas_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO personas_count FROM agent_personas;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ AGENT PERSONALITIES DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🎭 Personality System Ready';
  RAISE NOTICE '✅ agent_personas table created';
  RAISE NOTICE '✅ user_persona_preferences table created';
  RAISE NOTICE '✅ persona_interactions table created';
  RAISE NOTICE '';
  RAISE NOTICE '👥 Core Personas: %', personas_count;
  RAISE NOTICE '   1. The Drill Sergeant (Tough Love)';
  RAISE NOTICE '      - Directness: 90%%, Empathy: 20%%';
  RAISE NOTICE '      - "Stop saying um. You sound weak."';
  RAISE NOTICE '';
  RAISE NOTICE '   2. The Empathetic Mirror (Supportive)';
  RAISE NOTICE '      - Directness: 30%%, Empathy: 90%%';
  RAISE NOTICE '      - "I hear you are nervous. That is normal."';
  RAISE NOTICE '';
  RAISE NOTICE '   3. The Analyst (Data-Driven)';
  RAISE NOTICE '      - Directness: 70%%, Empathy: 30%%';
  RAISE NOTICE '      - "12 filler words in 60 seconds. Target: <5."';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions Available:';
  RAISE NOTICE '   - get_persona_by_archetype()';
  RAISE NOTICE '   - log_persona_interaction()';
  RAISE NOTICE '   - get_user_preferred_persona()';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Milestone B2: Agent Personalities Ready!';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
