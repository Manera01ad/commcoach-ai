import GeminiService from './geminiService.js';

/**
 * ArchetypeService handles communication pattern analysis using the RTCROS framework.
 */
class ArchetypeService {
    constructor() {
        this.archetypes = {
            // Tier 1: Problematic Patterns (Diagnosis)
            FORTRESS: {
                tier: 1,
                name: "The Fortress",
                icon: "🏰",
                traits: ["defensive", "silent", "withdrawn", "guarded"],
                description: "Uses silence as protection and resists opening up.",
                growthPath: "BUILDER"
            },
            PROSECUTOR: {
                tier: 1,
                name: "The Prosecutor",
                icon: "⚖️",
                traits: ["aggressive", "logic-driven", "confrontational", "winning"],
                description: "Seeks to 'win' the argument at the cost of connection.",
                growthPath: "WARRIOR"
            },
            PLEASER: {
                tier: 1,
                name: "The Pleaser",
                icon: "🕊️",
                traits: ["passive", "self-sacrificing", "avoiding conflict", "apologetic"],
                description: "Sacrifices own needs to keep the peace.",
                growthPath: "LISTENER"
            },
            SOLVER: {
                tier: 1,
                name: "The Solver",
                icon: "🔧",
                traits: ["dismissive of emotions", "solution-focused", "impatient"],
                description: "Jumps to fixes without acknowledging emotional weight.",
                growthPath: "BUILDER"
            },

            // Tier 2: Healthy Growth (Unlockable)
            BUILDER: {
                tier: 2,
                name: "The Builder",
                icon: "🏗️",
                traits: ["constructive", "collaborative", "patient", "solution-oriented"],
                description: "Builds bridges through structured problem-solving.",
                unlockRequirements: { requiredArchetypes: ["FORTRESS"], minSessions: 10 }
            },
            LISTENER: {
                tier: 2,
                name: "The Listener",
                icon: "👂",
                traits: ["empathetic", "reflective", "curious", "non-judgmental"],
                description: "Creates space for others through active listening.",
                unlockRequirements: { requiredArchetypes: ["PLEASER"], minSessions: 10 }
            },
            WARRIOR: {
                tier: 2,
                name: "The Warrior",
                icon: "⚔️",
                traits: ["assertive", "confident", "direct", "protective"],
                description: "Stands firm in truth while respecting others.",
                unlockRequirements: { requiredArchetypes: ["PROSECUTOR"], minSessions: 10 }
            },

            // Tier 3: Mastery
            SAGE: {
                tier: 3,
                name: "The Sage",
                icon: "🧙",
                traits: ["wise", "balanced", "adaptive", "integrative"],
                description: "Synthesizes all communication styles with wisdom.",
                unlockRequirements: {
                    requiredArchetypes: ["BUILDER", "LISTENER", "WARRIOR"],
                    allMustBeMastered: true
                }
            }
        };
    }

    /**
     * Analyzes user message to detect communication archetype
     */
    async analyzeArchetype(userMessage, conversationHistory = []) {
        const systemRole = `You are the "Archetype Architect," an advanced clinical communication coach with expertise in Cognitive Behavioral Therapy (CBT). You analyze communication patterns objectively without judgment.`;

        const context = `
The user is seeking to understand their communication style. They may be emotional, defensive, or unaware.
Previous conversation context: ${conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}
`;

        const cotPrompt = `
${systemRole}
${context}

TASK: Analyze the user's communication and identify their dominant archetype.

AVAILABLE ARCHETYPES:
${Object.entries(this.archetypes).map(([key, arch]) => `- ${arch.name}: ${arch.traits.join(', ')}`).join('\n')}

REASONING STEPS (Chain of Thought):
1. Analyze user's tone and word choice.
2. Identify behavioral patterns.
3. Match to archetype traits.
4. Calculate confidence.
5. Identify specific evidence (phrases).

USER MESSAGE: "${userMessage}"

Return structured JSON according to the schema.
`;

        const schema = {
            type: 'object',
            properties: {
                thinking: { type: 'string', description: 'Internal reasoning' },
                identified_archetype: { type: 'string', nullable: true },
                confidence_score: { type: 'number', minimum: 0, maximum: 100 },
                evidence: { type: 'array', items: { type: 'string' } },
                needs_clarification: { type: 'boolean' },
                clarifying_question: { type: 'string', nullable: true }
            },
            required: ['thinking', 'confidence_score', 'needs_clarification']
        };

        return await GeminiService.generateStructuredContent(
            'gemini-2.0-flash-exp',
            cotPrompt,
            schema
        );
    }

    /**
     * Generates a clinical-warmth therapy response
     */
    async generateTherapyResponse(archetypeName, userMessage) {
        const prompt = `
You are a Clinical Communication Coach using "Clinical Warmth" - professional yet empathetic.
The user's archetype is "${archetypeName}".
MESSAGE: "${userMessage}"

Generate a micro-therapy session with exactly these sections:

### The Mirror 🪞
Reflect specific behaviors observed in their message. Be objective and gentle.

### The Prescription 💊
Provide ONE concrete CBT exercise they can practice today. Make it specific and measurable.

Keep the total response under 200 words. Avoid medical jargon.
`;

        const response = await GeminiService.generateContent('gemini-2.0-flash-exp', prompt);
        return response.text;
    }
}

export default new ArchetypeService();
