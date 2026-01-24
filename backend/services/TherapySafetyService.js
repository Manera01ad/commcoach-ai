import GeminiService from './geminiService.js';

/**
 * TherapySafetyService implements Chain of Verification (CoVe) to ensure
 * therapy advice is safe and helpful.
 */
class TherapySafetyService {
    async verifyTherapyAdvice(therapyResponse, userContext) {
        const verificationPrompt = `
You are a Clinical Safety Supervisor reviewing therapy advice.
Verify this therapy advice using Chain of Verification (CoVe):

THERAPY ADVICE:
"${therapyResponse}"

USER CONTEXT:
"${userContext}"

VERIFICATION PROTOCOL:
1. Identify all recommendations.
2. Verify: Is it safe for emotional distress? Does it avoid harm? Is it CBT-grounded? Does it avoid gaslighting?
3. Provide an "Approved Response" which is either the original (if safe) or a corrected version.

Return structured JSON.
`;

        const schema = {
            type: 'object',
            properties: {
                safe: { type: 'boolean' },
                risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
                concerns: { type: 'array', items: { type: 'string' } },
                approved_response: { type: 'string' }
            },
            required: ['safe', 'risk_level', 'approved_response']
        };

        return await GeminiService.generateStructuredContent(
            'gemini-2.0-flash-exp',
            verificationPrompt,
            schema
        );
    }
}

export default new TherapySafetyService();
