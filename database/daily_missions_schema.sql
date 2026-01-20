-- ==========================================
-- DAILY MISSIONS SYSTEM DATABASE SCHEMA
-- ==========================================
-- Milestone A2: Daily Missions & XP System
-- ==========================================

-- ========================================
-- PART 1: Micro Drills Library
-- ========================================

CREATE TABLE IF NOT EXISTS micro_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  scenario TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('negotiation', 'empathy', 'assertiveness', 'conflict', 'presentation', 'feedback')),
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 10),
  duration_seconds INTEGER DEFAULT 180, -- 3 minutes default
  xp_reward INTEGER DEFAULT 50,
  unlock_level INTEGER DEFAULT 1,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_micro_drills_category ON micro_drills(category);
CREATE INDEX IF NOT EXISTS idx_micro_drills_difficulty ON micro_drills(difficulty);
CREATE INDEX IF NOT EXISTS idx_micro_drills_unlock_level ON micro_drills(unlock_level);

COMMENT ON TABLE micro_drills IS '2-3 minute practice scenarios for daily missions';

-- ========================================
-- PART 2: User Levels & XP
-- ========================================

CREATE TABLE IF NOT EXISTS user_levels (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 500,
  archetype TEXT DEFAULT 'Communicator',
  level_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_levels_level ON user_levels(current_level DESC);
CREATE INDEX IF NOT EXISTS idx_user_levels_xp ON user_levels(total_xp DESC);

COMMENT ON TABLE user_levels IS 'User progression and leveling system';

-- ========================================
-- PART 3: Daily Missions
-- ========================================

CREATE TABLE IF NOT EXISTS daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  drill_id UUID REFERENCES micro_drills(id) ON DELETE SET NULL,
  mission_type TEXT DEFAULT 'daily' CHECK (mission_type IN ('daily', 'bonus', 'challenge')),
  completed BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  completion_score INTEGER CHECK (completion_score BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, mission_type)
);

CREATE INDEX IF NOT EXISTS idx_daily_missions_user_date ON daily_missions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_missions_completed ON daily_missions(completed);

COMMENT ON TABLE daily_missions IS 'Daily missions assigned to users';

-- ========================================
-- PART 4: Mission Completions Log
-- ========================================

CREATE TABLE IF NOT EXISTS mission_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES daily_missions(id) ON DELETE CASCADE,
  drill_id UUID REFERENCES micro_drills(id),
  duration_seconds INTEGER,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  xp_earned INTEGER,
  feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mission_completions_user ON mission_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_mission_completions_created ON mission_completions(created_at DESC);

COMMENT ON TABLE mission_completions IS 'Detailed log of mission completions';

-- ========================================
-- PART 5: Helper Functions
-- ========================================

-- Function to calculate XP for next level
CREATE OR REPLACE FUNCTION calculate_xp_for_level(p_level INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- XP required increases exponentially
  RETURN 500 * p_level;
END;
$$;

-- Function to award XP and level up
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_current_level INTEGER;
  v_total_xp INTEGER;
  v_xp_to_next INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
BEGIN
  -- Get current user level data
  SELECT current_level, total_xp, xp_to_next_level
  INTO v_current_level, v_total_xp, v_xp_to_next
  FROM user_levels
  WHERE user_id = p_user_id;
  
  -- If user doesn't have level record, create one
  IF NOT FOUND THEN
    INSERT INTO user_levels (user_id, current_level, total_xp, xp_to_next_level)
    VALUES (p_user_id, 1, 0, 500)
    RETURNING current_level, total_xp, xp_to_next_level
    INTO v_current_level, v_total_xp, v_xp_to_next;
  END IF;
  
  -- Add XP
  v_total_xp := v_total_xp + p_xp_amount;
  
  -- Check for level up
  WHILE v_total_xp >= v_xp_to_next LOOP
    v_current_level := v_current_level + 1;
    v_xp_to_next := calculate_xp_for_level(v_current_level);
    v_leveled_up := TRUE;
  END LOOP;
  
  -- Update user level
  UPDATE user_levels
  SET 
    current_level = v_current_level,
    total_xp = v_total_xp,
    xp_to_next_level = v_xp_to_next,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Return result
  RETURN jsonb_build_object(
    'leveled_up', v_leveled_up,
    'new_level', v_current_level,
    'total_xp', v_total_xp,
    'xp_to_next', v_xp_to_next,
    'xp_gained', p_xp_amount
  );
END;
$$;

COMMENT ON FUNCTION award_xp IS 'Award XP to user and handle level ups';

-- Function to generate daily mission
CREATE OR REPLACE FUNCTION generate_daily_mission(p_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_level INTEGER;
  v_drill_id UUID;
  v_mission_id UUID;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Get user level
  SELECT current_level INTO v_user_level
  FROM user_levels
  WHERE user_id = p_user_id;
  
  -- Default to level 1 if not found
  v_user_level := COALESCE(v_user_level, 1);
  
  -- Check if mission already exists for today
  SELECT id INTO v_mission_id
  FROM daily_missions
  WHERE user_id = p_user_id 
    AND date = v_today
    AND mission_type = 'daily';
  
  IF FOUND THEN
    RETURN v_mission_id;
  END IF;
  
  -- Select random drill appropriate for user level
  SELECT id INTO v_drill_id
  FROM micro_drills
  WHERE unlock_level <= v_user_level
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Create daily mission
  INSERT INTO daily_missions (user_id, date, drill_id, mission_type)
  VALUES (p_user_id, v_today, v_drill_id, 'daily')
  RETURNING id INTO v_mission_id;
  
  RETURN v_mission_id;
END;
$$;

COMMENT ON FUNCTION generate_daily_mission IS 'Generate or get daily mission for user';

-- ========================================
-- PART 6: Insert Sample Drills
-- ========================================

INSERT INTO micro_drills (title, description, scenario, category, difficulty, xp_reward, unlock_level) VALUES
  -- Level 1 Drills (Easy)
  ('The Awkward Pause', 'Practice handling silence in conversation', 'Your colleague stops mid-sentence and looks uncomfortable. How do you respond?', 'empathy', 2, 50, 1),
  ('Polite Decline', 'Learn to say no professionally', 'Your manager asks you to work this weekend. You have plans. How do you decline?', 'assertiveness', 3, 50, 1),
  ('Active Listening', 'Show you are truly listening', 'A team member is explaining a complex problem. Demonstrate active listening.', 'empathy', 2, 50, 1),
  ('Quick Introduction', 'Introduce yourself confidently', 'You are at a networking event. Introduce yourself to someone new in 30 seconds.', 'presentation', 2, 50, 1),
  ('Clarifying Question', 'Ask for clarification without seeming confused', 'Your boss gave unclear instructions. Ask for clarification professionally.', 'assertiveness', 3, 50, 1),
  
  -- Level 2 Drills (Medium)
  ('Constructive Feedback', 'Give feedback that helps, not hurts', 'A junior colleague made a mistake. Provide constructive feedback.', 'feedback', 5, 75, 2),
  ('Negotiating Deadline', 'Push back on unrealistic timelines', 'You are given a project with an impossible deadline. Negotiate for more time.', 'negotiation', 6, 75, 2),
  ('Conflict Mediation', 'Help two colleagues resolve a disagreement', 'Two team members are arguing about project approach. Mediate the conflict.', 'conflict', 7, 75, 2),
  ('Difficult Question', 'Handle a challenging question in a presentation', 'During your presentation, someone asks a question you do not know the answer to.', 'presentation', 5, 75, 2),
  ('Salary Negotiation', 'Ask for a raise confidently', 'You have been performing well. Ask your manager for a salary increase.', 'negotiation', 7, 75, 2),
  
  -- Level 3 Drills (Hard)
  ('Firing with Empathy', 'Deliver bad news compassionately', 'You must let go of an underperforming employee. Handle it with empathy.', 'feedback', 9, 100, 3),
  ('Executive Presence', 'Command attention in a room of executives', 'Present your idea to the executive team. Show executive presence.', 'presentation', 8, 100, 3),
  ('Crisis Communication', 'Communicate during a company crisis', 'There is a data breach. Communicate the situation to stakeholders.', 'conflict', 10, 100, 3),
  ('Tough Negotiation', 'Negotiate with someone who has more power', 'A major client is threatening to leave. Negotiate to keep them.', 'negotiation', 9, 100, 3),
  ('Giving Upward Feedback', 'Give feedback to your boss', 'Your manager has a habit that affects team morale. Provide feedback.', 'feedback', 10, 100, 3)
ON CONFLICT DO NOTHING;

-- ========================================
-- PART 7: Grant Permissions
-- ========================================

GRANT SELECT, INSERT, UPDATE ON micro_drills TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_levels TO authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_missions TO authenticated;
GRANT SELECT, INSERT ON mission_completions TO authenticated;
GRANT EXECUTE ON FUNCTION award_xp TO authenticated;
GRANT EXECUTE ON FUNCTION generate_daily_mission TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_xp_for_level TO authenticated;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
DECLARE
  drills_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO drills_count FROM micro_drills;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ DAILY MISSIONS SYSTEM DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🎮 Gamification System Ready';
  RAISE NOTICE '✅ micro_drills table created';
  RAISE NOTICE '✅ user_levels table created';
  RAISE NOTICE '✅ daily_missions table created';
  RAISE NOTICE '✅ mission_completions table created';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Sample Drills: % scenarios', drills_count;
  RAISE NOTICE '   - Level 1 (Easy): 5 drills';
  RAISE NOTICE '   - Level 2 (Medium): 5 drills';
  RAISE NOTICE '   - Level 3 (Hard): 5 drills';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions Available:';
  RAISE NOTICE '   - award_xp() - Award XP and level up';
  RAISE NOTICE '   - generate_daily_mission() - Create daily mission';
  RAISE NOTICE '   - calculate_xp_for_level() - XP requirements';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Milestone A2: Daily Missions Ready!';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
