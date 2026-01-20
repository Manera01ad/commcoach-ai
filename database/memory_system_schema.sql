-- ==========================================
-- MEMORY SYSTEM DATABASE SCHEMA
-- ==========================================
-- Vector-based memory for intelligent agents
-- Enables context-aware conversations
-- ==========================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ========================================
-- PART 1: Agent Memories Table
-- ========================================

CREATE TABLE IF NOT EXISTS agent_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agent_configs(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
  
  -- Memory content
  content TEXT NOT NULL,
  summary TEXT,
  
  -- Vector embedding (OpenAI text-embedding-3-small = 1536 dimensions)
  embedding VECTOR(1536),
  
  -- Metadata
  memory_type TEXT CHECK (memory_type IN ('conversation', 'insight', 'preference', 'goal')),
  importance REAL DEFAULT 0.5 CHECK (importance BETWEEN 0 AND 1),
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  access_count INTEGER DEFAULT 0,
  
  -- Indexes for performance
  CONSTRAINT agent_memories_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_memories_user_id ON agent_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_agent_id ON agent_memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_session_id ON agent_memories(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_created_at ON agent_memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_memories_importance ON agent_memories(importance DESC);

-- Vector similarity search index (IVFFlat for speed)
CREATE INDEX IF NOT EXISTS idx_agent_memories_embedding 
  ON agent_memories 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

COMMENT ON TABLE agent_memories IS 'Vector-based memory storage for intelligent agents';
COMMENT ON COLUMN agent_memories.embedding IS 'Vector embedding for semantic similarity search';
COMMENT ON COLUMN agent_memories.importance IS 'Memory importance score (0-1) for retrieval ranking';

-- ========================================
-- PART 2: Context Windows Table
-- ========================================

CREATE TABLE IF NOT EXISTS context_windows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  
  -- Context data
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  retrieved_memories JSONB DEFAULT '[]'::jsonb,
  token_count INTEGER DEFAULT 0,
  max_tokens INTEGER DEFAULT 4000,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_context_windows_user_id ON context_windows(user_id);
CREATE INDEX IF NOT EXISTS idx_context_windows_session_id ON context_windows(session_id);

COMMENT ON TABLE context_windows IS 'Active conversation context with token management';

-- ========================================
-- PART 3: Helper Functions
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
    AND 1 - (am.embedding <=> p_query_embedding) >= p_min_similarity
  ORDER BY 
    am.embedding <=> p_query_embedding,
    am.importance DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION search_similar_memories IS 'Search for semantically similar memories using vector similarity';

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

COMMENT ON FUNCTION update_memory_access IS 'Update memory access timestamp and count';

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

COMMENT ON FUNCTION prune_old_memories IS 'Delete old, low-importance, rarely accessed memories';

-- ========================================
-- PART 4: RLS Policies
-- ========================================

ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_windows ENABLE ROW LEVEL SECURITY;

-- Users can only access their own memories
CREATE POLICY "Users can view own memories"
  ON agent_memories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memories"
  ON agent_memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memories"
  ON agent_memories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own memories"
  ON agent_memories FOR DELETE
  USING (auth.uid() = user_id);

-- Context windows policies
CREATE POLICY "Users can view own context"
  ON context_windows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own context"
  ON context_windows FOR ALL
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all memories"
  ON agent_memories FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can view all context"
  ON context_windows FOR SELECT
  USING (is_admin());

-- ========================================
-- PART 5: Grant Permissions
-- ========================================

GRANT SELECT, INSERT, UPDATE, DELETE ON agent_memories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON context_windows TO authenticated;
GRANT EXECUTE ON FUNCTION search_similar_memories TO authenticated;
GRANT EXECUTE ON FUNCTION update_memory_access TO authenticated;
GRANT EXECUTE ON FUNCTION prune_old_memories TO authenticated;

-- ========================================
-- VERIFICATION & SUCCESS MESSAGE
-- ========================================

DO $$
DECLARE
  memory_count INTEGER;
  context_count INTEGER;
  extension_exists BOOLEAN;
BEGIN
  -- Check extension
  SELECT EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'vector'
  ) INTO extension_exists;
  
  -- Count tables
  SELECT COUNT(*) INTO memory_count FROM agent_memories;
  SELECT COUNT(*) INTO context_count FROM context_windows;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ MEMORY SYSTEM SCHEMA DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '🧠 Vector-Based Memory System';
  RAISE NOTICE '✅ pgvector extension: %', CASE WHEN extension_exists THEN 'ENABLED' ELSE 'NOT FOUND' END;
  RAISE NOTICE '✅ agent_memories table created';
  RAISE NOTICE '✅ context_windows table created';
  RAISE NOTICE '✅ Vector similarity search enabled';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Tables Created:';
  RAISE NOTICE '   - agent_memories (vector storage)';
  RAISE NOTICE '   - context_windows (active context)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions Created:';
  RAISE NOTICE '   - search_similar_memories() - Semantic search';
  RAISE NOTICE '   - update_memory_access() - Track usage';
  RAISE NOTICE '   - prune_old_memories() - Cleanup';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Security:';
  RAISE NOTICE '   - RLS policies enabled';
  RAISE NOTICE '   - Users can only access own memories';
  RAISE NOTICE '   - Admins have read access';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '1. Create EmbeddingService.js';
  RAISE NOTICE '2. Create VectorStore.js';
  RAISE NOTICE '3. Create ContextManager.js';
  RAISE NOTICE '4. Test memory storage and retrieval';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
