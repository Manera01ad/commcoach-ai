import { supabaseAdmin } from '../config/supabase.js';

/**
 * Repository for handling AI Session persistence in Supabase
 */
class SessionRepository {
    /**
     * Log a therapy/archetype analysis session
     */
    async logTherapySession({
        userId,
        message,
        archetype,
        confidence,
        response,
        safety,
        evidence,
        history = []
    }) {
        if (!supabaseAdmin) return null;

        try {
            // We'll use the 'persona_interactions' table if it exists, 
            // or a more generic 'sessions' table if we create one.
            // For now, let's try to log to a generic sessions structure 
            // that matches the implementation guide's suggestion.

            const { data, error } = await supabaseAdmin
                .from('chat_sessions') // Using existing 'chat_sessions'
                .insert({
                    user_id: userId,
                    title: `Therapy: ${archetype}`,
                    status: 'completed',
                    // We'll store the rest in metadata or similar if we can,
                    // but chat_sessions is limited.
                    // Let's check if we can insert into a 'sessions' table as suggested
                })
                .select()
                .single();

            if (error) {
                console.warn('[SessionRepo] Error logging to chat_sessions:', error.message);
                // Fallback: Continue session even if logging fails
                return null;
            }

            // Log the messages
            const messages = [
                { session_id: data.id, role: 'user', content: message },
                { session_id: data.id, role: 'assistant', content: response, model_used: 'gemini-pro' }
            ];

            await supabaseAdmin.from('messages').insert(messages);

            return data;
        } catch (err) {
            console.error('[SessionRepo] Critical Error:', err);
            return null;
        }
    }

    /**
     * Log a generic Gemini API interaction
     */
    async logGeminiUsage({ userId, model, tokens, cost }) {
        if (!supabaseAdmin) return null;

        try {
            // Update user progress / usage
            await supabaseAdmin
                .from('user_progress')
                .update({
                    total_messages: supabaseAdmin.rpc('increment', { row_id: userId, column_name: 'total_messages', amount: 1 }),
                    last_activity_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            // Note: 'increment' RPC needs to be defined in PG, 
            // otherwise we'd need to fetch and update.
        } catch (err) {
            console.error('[SessionRepo] Usage Tracking Error:', err);
        }
    }
}

export default new SessionRepository();
