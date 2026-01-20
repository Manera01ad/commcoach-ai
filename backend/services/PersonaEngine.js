/**
 * Persona Engine
 * Manages agent personalities and persona-specific responses
 */

import { supabase } from '../config/supabase.js';

class PersonaEngine {
    constructor() {
        this.personas = new Map();
        this.loadPersonas();
    }

    /**
     * Load all personas from database
     */
    async loadPersonas() {
        try {
            const { data, error } = await supabase
                .from('agent_personas')
                .select('*')
                .eq('is_active', true);

            if (error) throw error;

            data.forEach(persona => {
                this.personas.set(persona.archetype, persona);
            });

            console.log(`[PersonaEngine] Loaded ${this.personas.size} personas`);
        } catch (error) {
            console.error('[PersonaEngine] Error loading personas:', error);
        }
    }

    /**
     * Get persona by archetype
     */
    async getPersona(archetype) {
        // Try cache first
        if (this.personas.has(archetype)) {
            return this.personas.get(archetype);
        }

        // Fetch from database
        try {
            const { data, error } = await supabase
                .rpc('get_persona_by_archetype', { p_archetype: archetype });

            if (error) throw error;

            if (data && data.length > 0) {
                const persona = data[0];
                this.personas.set(archetype, persona);
                return persona;
            }

            return null;
        } catch (error) {
            console.error('[PersonaEngine] Error getting persona:', error);
            return null;
        }
    }

    /**
     * Get user's preferred persona
     */
    async getUserPreferredPersona(userId) {
        try {
            const { data, error } = await supabase
                .rpc('get_user_preferred_persona', { p_user_id: userId });

            if (error) throw error;

            // Get full persona details
            const { data: persona, error: personaError } = await supabase
                .from('agent_personas')
                .select('*')
                .eq('id', data)
                .single();

            if (personaError) throw personaError;

            return persona;
        } catch (error) {
            console.error('[PersonaEngine] Error getting user preference:', error);
            // Return default (Empathetic Mirror)
            return await this.getPersona('empathetic_mirror');
        }
    }

    /**
     * Set user's preferred persona
     */
    async setUserPreferredPersona(userId, personaId) {
        try {
            const { error } = await supabase
                .from('user_persona_preferences')
                .upsert({
                    user_id: userId,
                    preferred_persona_id: personaId,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('[PersonaEngine] Error setting preference:', error);
            throw error;
        }
    }

    /**
     * Apply persona to system prompt
     */
    applyPersonaToPrompt(basePrompt, persona) {
        if (!persona) return basePrompt;

        return `${persona.system_prompt}\n\n${basePrompt}`;
    }

    /**
     * Adjust response based on persona traits
     */
    adjustResponseForPersona(response, persona) {
        if (!persona) return response;

        // This is a placeholder for more sophisticated persona-based adjustments
        // In production, you might use different models or temperature settings

        return response;
    }

    /**
     * Log persona interaction
     */
    async logInteraction(userId, personaId, sessionId, messageCount, durationSeconds) {
        try {
            const { error } = await supabase
                .rpc('log_persona_interaction', {
                    p_user_id: userId,
                    p_persona_id: personaId,
                    p_session_id: sessionId,
                    p_message_count: messageCount,
                    p_duration_seconds: durationSeconds
                });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('[PersonaEngine] Error logging interaction:', error);
            // Don't throw - logging failure shouldn't break the flow
            return { success: false, error: error.message };
        }
    }

    /**
     * Get persona statistics
     */
    async getPersonaStats(personaId) {
        try {
            const { data, error } = await supabase
                .from('persona_interactions')
                .select('user_rating, duration_seconds, message_count')
                .eq('persona_id', personaId);

            if (error) throw error;

            const totalInteractions = data.length;
            const avgRating = data
                .filter(i => i.user_rating)
                .reduce((sum, i) => sum + i.user_rating, 0) / totalInteractions || 0;
            const avgDuration = data
                .reduce((sum, i) => sum + (i.duration_seconds || 0), 0) / totalInteractions || 0;
            const avgMessages = data
                .reduce((sum, i) => sum + (i.message_count || 0), 0) / totalInteractions || 0;

            return {
                success: true,
                stats: {
                    totalInteractions,
                    averageRating: Math.round(avgRating * 10) / 10,
                    averageDuration: Math.round(avgDuration),
                    averageMessages: Math.round(avgMessages)
                }
            };
        } catch (error) {
            console.error('[PersonaEngine] Error getting stats:', error);
            throw error;
        }
    }

    /**
     * Get all available personas
     */
    async getAllPersonas() {
        try {
            const { data, error } = await supabase
                .from('agent_personas')
                .select('id, name, description, archetype, directness, empathy, formality, humor, patience')
                .eq('is_active', true)
                .order('name');

            if (error) throw error;

            return { success: true, personas: data };
        } catch (error) {
            console.error('[PersonaEngine] Error getting all personas:', error);
            throw error;
        }
    }

    /**
     * Get persona-specific prompt modifiers
     */
    getPromptModifiers(persona) {
        if (!persona) return {};

        return {
            temperature: this.calculateTemperature(persona),
            maxTokens: 1000,
            topP: 0.9,
            frequencyPenalty: persona.directness * 0.5,
            presencePenalty: persona.humor * 0.3
        };
    }

    /**
     * Calculate temperature based on persona traits
     */
    calculateTemperature(persona) {
        // More empathetic and humorous = higher temperature (more creative)
        // More direct and formal = lower temperature (more focused)
        const creativityScore = (persona.empathy + persona.humor) / 2;
        const focusScore = (persona.directness + persona.formality) / 2;

        const baseTemp = 0.7;
        const adjustment = (creativityScore - focusScore) * 0.3;

        return Math.max(0.3, Math.min(1.0, baseTemp + adjustment));
    }
}

export default new PersonaEngine();
