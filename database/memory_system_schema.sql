-- ==========================================
-- MEMORY SYSTEM DATABASE SCHEMA (SIMPLIFIED)
-- ==========================================
-- Vector-based memory for intelligent agents
-- Compatible with existing schema
-- No RLS policies (add later if needed)
-- ==========================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ========================================
-- PART 1: Chat Sessions Table
-- ========================================

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agent_configs(id) ON DELETE SET NULL,
  title TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_agent_id ON chat_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);

-- ========================================
-- PART 2: Messages Table
-- ========================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- ========================================
-- PART 3: Update agent_memories Table
-- ========================================

-- Add session_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memories' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE agent_memories 
    ADD COLUMN session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL;
    
    CREATE INDEX idx_agent_memories_session_id ON agent_memories(session_id);
  END IF;
END $$;

-- Add summary column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memories' AND column_name = 'summary'
  ) THEN
    ALTER TABLE agent_memories ADD COLUMN summary TEXT;
  END IF;
END $$;

-- Add memory_type column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memories' AND column_name = 'memory_type'
  ) THEN
    ALTER TABLE agent_memories 
    ADD COLUMN memory_type TEXT CHECK (memory_type IN ('conversation', 'insight', 'preference', 'goal'));
  END IF;
END $$;

-- Add importance column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memories' AND column_name = 'importance'
  ) THEN
    ALTER TABLE agent_memories 
    ADD COLUMN importance REAL DEFAULT 0.5 CHECK (importance BETWEEN 0 AND 1);
    
    CREATE INDEX idx_agent_memories_importance ON agent_memories(importance DESC);
  END IF;
END $$;

-- Add access tracking columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memories' AND column_name = 'last_accessed_at'
  ) THEN
    ALTER TABLE agent_memories ADD COLUMN last_accessed_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agent_memories' AND column_name = 'access_count'
  ) THEN
    ALTER TABLE agent_memories ADD COLUMN access_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Create vector similarity search index
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_agent_memories_embedding'
  ) THEN
    CREATE INDEX idx_agent_memories_embedding 
      ON agent_memories 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Could not create vector index (pgvector may need more data): %', SQLERRM;
END $$;

-- ========================================
-- PART 4: Context Windows Table
-- ========================================

CREATE TABLE IF NOT EXISTS context_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  retrieved_memories JSONB DEFAULT '[]'::jsonb,
  token_count INTEGER DEFAULT 0,
  max_tokens INTEGER DEFAULT 4000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_context_windows_user_id ON context_windows(user_id);
CREATE INDEX IF NOT EXISTS idx_context_windows_session_id ON context_windows(session_id);

-- ========================================
-- PART 5: Helper Functions
-- ========================================

-- Function to search similar memories
CREATE OR REPLACE FUNCTION search_similar_memories(
  p_user_id UUID,
  p_query_embedding VECTOR(1536),
  p_limit INTEGER DEFAULT 5,
  p_min_similarity REAL DEFAULT 0.7
)
RETURNS TABLE (
  memory_id UUID,
  content TEXT,
  summary TEXT,
  similarity REAL,
  importance REAL,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    am.id,
    am.content,
    am.summary,
    1 - (am.embedding <=> p_query_embedding) AS similarity,
    am.importance,
    am.created_at
  FROM agent_memories am
  WHERE am.user_id = p_user_id
    AND am.embedding IS NOT NULL
    AND 1 - (am.embedding <=> p_query_embedding) >= p_min_similarity
  ORDER BY 
    am.embedding <=> p_query_embedding,
    am.importance DESC
  LIMIT p_limit;
END;
$$;

-- Function to update memory access
CREATE OR REPLACE FUNCTION update_memory_access(p_memory_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE agent_memories
  SET 
    last_accessed_at = NOW(),
    access_count = access_count + 1
  WHERE id = p_memory_id;
END;
$$;

-- Function to prune old memories
CREATE OR REPLACE FUNCTION prune_old_memories(
  p_user_id UUID,
  p_days_old INTEGER DEFAULT 90,
  p_min_importance REAL DEFAULT 0.3
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM agent_memories
  WHERE user_id = p_user_id
    AND created_at < NOW() - (p_days_old || ' days')::INTERVAL
    AND importance < p_min_importance
    AND access_count < 3;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- ========================================
-- PART 6: Grant Permissions
-- ========================================

GRANT SELECT, INSERT, UPDATE, DELETE ON chat_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON context_windows TO authenticated;
GRANT EXECUTE ON FUNCTION search_similar_memories TO authenticated;
GRANT EXECUTE ON FUNCTION update_memory_access TO authenticated;
GRANT EXECUTE ON FUNCTION prune_old_memories TO authenticated;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
DECLARE
  extension_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'vector'
  ) INTO extension_exists;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MEMORY SYSTEM SCHEMA DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🧠 Vector-Based Memory System';
  RAISE NOTICE '✅ pgvector: %', CASE WHEN extension_exists THEN 'ENABLED' ELSE 'NOT FOUND' END;
  RAISE NOTICE '✅ chat_sessions table created';
  RAISE NOTICE '✅ messages table created';
  RAISE NOTICE '✅ agent_memories enhanced';
  RAISE NOTICE '✅ context_windows created';
  RAISE NOTICE '';
  RAISE NOTICE '📊 New Columns in agent_memories:';
  RAISE NOTICE '   - session_id (link to conversations)';
  RAISE NOTICE '   - summary (memory summary)';
  RAISE NOTICE '   - memory_type (conversation/insight/preference/goal)';
  RAISE NOTICE '   - importance (0-1 score)';
  RAISE NOTICE '   - last_accessed_at (usage tracking)';
  RAISE NOTICE '   - access_count (popularity)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions Available:';
  RAISE NOTICE '   - search_similar_memories()';
  RAISE NOTICE '   - update_memory_access()';
  RAISE NOTICE '   - prune_old_memories()';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  Note: RLS policies not added (use existing policies)';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Track B: Memory System Ready!';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
