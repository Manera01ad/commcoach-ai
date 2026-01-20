-- ==========================================
-- VIRAL GROWTH SYSTEM SCHEMA
-- ==========================================
-- Milestone A5: Social Sharing & Viral Mechanics
-- ==========================================

-- ========================================
-- PART 1: Shareable Achievements
-- ========================================

CREATE TABLE IF NOT EXISTS shareable_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN (
    'streak_7', 'streak_30', 'streak_100', 'streak_365',
    'level_up', 'mission_complete', 'founder_joined'
  )),
  
  -- Achievement data
  achievement_data JSONB NOT NULL,
  card_image_url TEXT,
  
  -- Sharing stats
  share_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shareable_achievements_user ON shareable_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_shareable_achievements_type ON shareable_achievements(achievement_type);

COMMENT ON TABLE shareable_achievements IS 'Achievements that can be shared on social media';

-- ========================================
-- PART 2: Social Shares
-- ========================================

CREATE TABLE IF NOT EXISTS social_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES shareable_achievements(id) ON DELETE CASCADE,
  
  -- Share details
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'twitter', 'facebook', 'instagram', 'email')),
  share_url TEXT,
  
  -- Tracking
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_social_shares_user ON social_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_achievement ON social_shares(achievement_id);
CREATE INDEX IF NOT EXISTS idx_social_shares_platform ON social_shares(platform);

COMMENT ON TABLE social_shares IS 'Track social media shares and their performance';

-- ========================================
-- PART 3: Viral Metrics
-- ========================================

CREATE TABLE IF NOT EXISTS viral_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  
  -- Sharing metrics
  shares_count INTEGER DEFAULT 0,
  views_generated INTEGER DEFAULT 0,
  clicks_generated INTEGER DEFAULT 0,
  signups_generated INTEGER DEFAULT 0,
  
  -- Viral coefficient
  viral_coefficient REAL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_viral_metrics_user_date ON viral_metrics(user_id, metric_date DESC);

COMMENT ON TABLE viral_metrics IS 'Daily viral growth metrics per user';

-- ========================================
-- PART 4: Helper Functions
-- ========================================

-- Create shareable achievement
CREATE OR REPLACE FUNCTION create_shareable_achievement(
  p_user_id UUID,
  p_achievement_type TEXT,
  p_achievement_data JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_achievement_id UUID;
BEGIN
  INSERT INTO shareable_achievements (user_id, achievement_type, achievement_data)
  VALUES (p_user_id, p_achievement_type, p_achievement_data)
  RETURNING id INTO v_achievement_id;
  
  RETURN v_achievement_id;
END;
$$;

-- Log social share
CREATE OR REPLACE FUNCTION log_social_share(
  p_user_id UUID,
  p_achievement_id UUID,
  p_platform TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_share_id UUID;
BEGIN
  INSERT INTO social_shares (user_id, achievement_id, platform)
  VALUES (p_user_id, p_achievement_id, p_platform)
  RETURNING id INTO v_share_id;
  
  -- Update achievement share count
  UPDATE shareable_achievements
  SET share_count = share_count + 1
  WHERE id = p_achievement_id;
  
  RETURN v_share_id;
END;
$$;

-- Calculate viral coefficient
CREATE OR REPLACE FUNCTION calculate_viral_coefficient(p_user_id UUID)
RETURNS REAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_total_shares INTEGER;
  v_total_signups INTEGER;
  v_coefficient REAL;
BEGIN
  -- Get total shares
  SELECT COUNT(*) INTO v_total_shares
  FROM social_shares
  WHERE user_id = p_user_id;
  
  -- Get total signups from shares
  SELECT SUM(conversions) INTO v_total_signups
  FROM social_shares
  WHERE user_id = p_user_id;
  
  v_total_signups := COALESCE(v_total_signups, 0);
  
  -- Calculate coefficient (signups per user)
  IF v_total_shares > 0 THEN
    v_coefficient := v_total_signups::REAL / v_total_shares;
  ELSE
    v_coefficient := 0;
  END IF;
  
  RETURN v_coefficient;
END;
$$;

-- Get viral leaderboard
CREATE OR REPLACE FUNCTION get_viral_leaderboard(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  total_shares INTEGER,
  total_views INTEGER,
  total_signups INTEGER,
  viral_coefficient REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    COUNT(DISTINCT ss.id)::INTEGER AS total_shares,
    SUM(ss.views)::INTEGER AS total_views,
    SUM(ss.conversions)::INTEGER AS total_signups,
    CASE 
      WHEN COUNT(DISTINCT ss.id) > 0 
      THEN SUM(ss.conversions)::REAL / COUNT(DISTINCT ss.id)
      ELSE 0 
    END AS viral_coefficient
  FROM profiles p
  LEFT JOIN social_shares ss ON ss.user_id = p.id
  GROUP BY p.id, p.full_name
  HAVING COUNT(DISTINCT ss.id) > 0
  ORDER BY viral_coefficient DESC, total_shares DESC
  LIMIT p_limit;
END;
$$;

-- ========================================
-- PART 5: Grant Permissions
-- ========================================

GRANT SELECT, INSERT, UPDATE ON shareable_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON social_shares TO authenticated;
GRANT SELECT ON viral_metrics TO authenticated;
GRANT EXECUTE ON FUNCTION create_shareable_achievement TO authenticated;
GRANT EXECUTE ON FUNCTION log_social_share TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_viral_coefficient TO authenticated;
GRANT EXECUTE ON FUNCTION get_viral_leaderboard TO authenticated;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ VIRAL GROWTH SYSTEM DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Social Sharing Ready';
  RAISE NOTICE '✅ shareable_achievements table created';
  RAISE NOTICE '✅ social_shares table created';
  RAISE NOTICE '✅ viral_metrics table created';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Features:';
  RAISE NOTICE '   - Shareable milestone cards';
  RAISE NOTICE '   - Multi-platform sharing';
  RAISE NOTICE '   - Viral coefficient tracking';
  RAISE NOTICE '   - Conversion attribution';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions:';
  RAISE NOTICE '   - create_shareable_achievement()';
  RAISE NOTICE '   - log_social_share()';
  RAISE NOTICE '   - calculate_viral_coefficient()';
  RAISE NOTICE '   - get_viral_leaderboard()';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Milestone A5: Viral Growth Ready!';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
