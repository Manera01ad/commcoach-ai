import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
    constructor() {
        // Don't initialize here - lazy loading to avoid ES module issues
        this.genAI = null;
    }

    // Lazy initialization - only create when needed
    _ensureInitialized() {
        if (!this.genAI) {
            if (!process.env.GEMINI_API_KEY) {
                throw new Error('GEMINI_API_KEY is not set in environment variables');
            }
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
    }

    /**
     * Generate text content using Gemini
     * @param {string} model - Model name (e.g., 'gemini-2.0-flash-exp')
     * @param {string} prompt - User prompt
     * @param {object} config - Additional configuration
     * @returns {Promise<object>} Generated content
     */
    async generateContent(model, prompt, config = {}) {
        this._ensureInitialized();
        try {
            const generativeModel = this.genAI.getGenerativeModel({
                model,
                ...config
            });

            const result = await generativeModel.generateContent(prompt);
            const response = result.response;

            return {
                text: response.text(),
                candidates: response.candidates,
                promptFeedback: response.promptFeedback
            };
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Gemini generation failed: ${error.message}`);
        }
    }

    /**
     * Generate structured JSON output
     * @param {string} model - Model name
     * @param {string} prompt - User prompt
     * @param {object} schema - JSON schema for response
     * @returns {Promise<object>} Parsed JSON response
     */
    async generateStructuredContent(model, prompt, schema) {
        this._ensureInitialized();
        try {
            const generativeModel = this.genAI.getGenerativeModel({
                model,
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            });

            const result = await generativeModel.generateContent(prompt);
            const text = result.response.text();

            return JSON.parse(text);
        } catch (error) {
            console.error('Gemini Structured Generation Error:', error);
            throw new Error(`Structured generation failed: ${error.message}`);
        }
    }

    /**
     * Analyze communication transcript (Antigravity feature)
     * @param {string} transcript - Conversation transcript
     * @param {string} userId - User identifier
     * @returns {Promise<object>} Analysis results
     */
    async analyzeTranscript(transcript, userId) {
        this._ensureInitialized();
        const schema = {
            type: 'object',
            properties: {
                skillFocus: {
                    type: 'string',
                    description: 'Primary skill the user wants to improve'
                },
                confidenceLevel: {
                    type: 'number',
                    description: 'Confidence level from 1-5'
                },
                challenges: {
                    type: 'string',
                    description: 'Main communication challenges identified'
                },
                practiceTime: {
                    type: 'string',
                    description: 'Recommended practice duration'
                },
                contentConsumed: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        source: { type: 'string' },
                        title: { type: 'string' },
                        actionability: { type: 'number' }
                    }
                },
                metadata: {
                    type: 'object',
                    properties: {
                        role: { type: 'string' },
                        industry: { type: 'string' },
                        feedbackPreference: { type: 'string' }
                    }
                }
            },
            required: ['skillFocus', 'confidenceLevel', 'challenges']
        };

        const analysisPrompt = `
You are an expert communication coach analyzing a user's conversation transcript.

USER ID: ${userId}
TRANSCRIPT:
${transcript}

Analyze this transcript and provide:
1. Primary skill focus area (e.g., "Public Speaking", "Clarity", "Confidence")
2. Confidence level (1-5 scale)
3. Main communication challenges
4. Recommended practice time (e.g., "15 mins daily")
5. Content recommendation (training material that would help)
6. User metadata (infer role, industry, feedback preference from context)

Provide actionable, specific insights based on the CommCoach methodology.
`;

        return this.generateStructuredContent('gemini-2.0-flash-exp', analysisPrompt, schema);
    }
}

export default new GeminiService();
