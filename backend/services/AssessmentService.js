import GeminiService from './geminiService.js';

class AssessmentService {
    async analyzeDNA(answers, userId) {
        const schema = {
            type: 'object',
            properties: {
                archetype: {
                    type: 'string',
                    description: 'The primary communication archetype (e.g., "The Diplomat", "The Commander", "The Analyst", "The Storyteller")'
                },
                traits: {
                    type: 'object',
                    properties: {
                        clarity: { type: 'number', description: 'Score 0-100' },
                        empathy: { type: 'number', description: 'Score 0-100' },
                        confidence: { type: 'number', description: 'Score 0-100' },
                        persuasion: { type: 'number', description: 'Score 0-100' }
                    },
                    required: ['clarity', 'empathy', 'confidence', 'persuasion']
                },
                strengths: {
                    type: 'array',
                    items: { type: 'string' }
                },
                weaknesses: {
                    type: 'array',
                    items: { type: 'string' }
                },
                recommendedTone: {
                    type: 'string',
                    description: 'Recommended setting for AI coaching (e.g., "Direct", "Supportive", "Analytical")'
                }
            },
            required: ['archetype', 'traits', 'strengths', 'weaknesses', 'recommendedTone']
        };

        const prompt = `
            You are an expert communication psychologist. Analyze the following user responses to determine their "Communication DNA" profile.
            
            USER RESPONSES:
            ${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}`).join('\n\n')}

            Based on these answers, classify their communication style, score their key traits (0-100), identify top 3 strengths and 3 areas for improvement, and recommend the best AI coaching tone for them.
        `;

        try {
            const result = await GeminiService.generateStructuredContent('gemini-2.0-flash-exp', prompt, schema);

            // In a real app, we would save this to the database here
            // await supabase.from('user_assessments').insert({ user_id: userId, result });

            return result;
        } catch (error) {
            console.error('Assessment Analysis Failed:', error);
            throw new Error('Failed to analyze assessment');
        }
    }
}

export default new AssessmentService();
