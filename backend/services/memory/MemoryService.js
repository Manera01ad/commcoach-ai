import { supabase } from '../../config/supabase.js';
import EmbeddingService from './EmbeddingService.js';

/**
 * Memory Service (The "Hippocampus")
 * Manages storing and retrieving memories using Vector Search.
 */
class MemoryService {

    /**
     * Search for relevant memories
     * @param {string} userId - User ID
     * @param {string} query - The current user message/context
     * @param {number} limit - Number of memories to return
     */
    async searchMemories(userId, query, limit = 5) {
        try {
            // 1. Convert query to vector
            const queryEmbedding = await EmbeddingService.generateEmbedding(query);

            // 2. Perform Similarity Search via Supabase RPC
            const { data, error } = await supabase.rpc('match_memories', {
                match_user_id: userId,
                query_embedding: queryEmbedding,
                match_threshold: 0.7, // Only relevant memories
                match_count: limit
            });

            if (error) throw error;

            return data.map(mem => mem.content).join('\n\n');

        } catch (error) {
            console.error("Memory Search Error:", error);
            return ""; // Fail gracefully (empty context is better than crash)
        }
    }

    /**
     * Store a new memory
     * @param {string} userId - User ID
     * @param {string} agentId - UUID of the agent (optional)
     * @param {string} content - The text to remember
     * @param {object} metadata - Extra info (tags, session_id)
     */
    async storeMemory(userId, agentId, content, metadata = {}) {
        try {
            // 1. Generate Vector
            const embedding = await EmbeddingService.generateEmbedding(content);

            // 2. Insert into Supabase
            const { error } = await supabase
                .from('agent_memories')
                .insert({
                    user_id: userId,
                    agent_id: agentId,
                    content: content,
                    embedding: embedding,
                    metadata: metadata
                });

            if (error) throw error;
            console.log(`[MemoryService] Stored memory for user ${userId}`);

        } catch (error) {
            console.error("Store Memory Error:", error);
        }
    }
}

export default new MemoryService();
