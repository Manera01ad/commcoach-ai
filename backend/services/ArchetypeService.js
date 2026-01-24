import GeminiService from './geminiService.js';

/**
 * ArchetypeService handles communication pattern analysis using the RTCROS framework.
 */
class ArchetypeService {
    constructor() {
        this.archetypes = {
            FORTRESS: {
                name: "The Fortress",
                traits: ["defensive", "silent", "withdrawn", "guarded"],
                description: "Uses silence as protection and resists opening up."
            },
            PROSECUTOR: {
                name: "The Prosecutor",
                traits: ["aggressive", "logic-driven", "confrontational", "winning"],
                description: "Seeks to 'win' the argument at the cost of connection."
            },
            PLEASER: {
                name: "The Pleaser",
                traits: ["passive", "self-sacrificing", "avoiding conflict", "apologetic"],
                description: "Sacrifices own needs to keep the peace."
            },
            SOLVER: {
                name: "The Solver",
                traits: ["dismissive of emotions", "solution-focused", "impatient"],
                description: "Jumps to fixes without acknowledging emotional weight."
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
