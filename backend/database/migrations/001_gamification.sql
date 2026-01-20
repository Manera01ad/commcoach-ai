-- Gamification Tables

-- User Progress (XP & Level)
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    total_sessions INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_activity_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP Ledger (History of XP gains)
CREATE TABLE IF NOT EXISTS xp_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_ledger_user_id ON xp_ledger(user_id);

-- Trigger to create user_progress on signup (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users (if possible, otherwise app must handle creation)
-- Note: In Supabase, usually we bind to public.profiles insertion
