import { z } from 'zod';

/**
 * Request validation middleware using Zod
 * Validates request body, query params, and route params
 */

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Validate request body, query, and params
            const validated = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });

            // Replace request data with validated data
            req.body = validated.body || req.body;
            req.query = validated.query || req.query;
            req.params = validated.params || req.params;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: error.errors.map(err => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            next(error);
        }
    };
};

// Common validation schemas
export const schemas = {
    // Gemini generation request
    geminiGenerate: z.object({
        body: z.object({
            model: z.string().min(1, 'Model is required'),
            prompt: z.union([z.string(), z.array(z.any())]),
            config: z.object({
                temperature: z.number().min(0).max(2).optional(),
                topK: z.number().optional(),
                topP: z.number().optional(),
                maxOutputTokens: z.number().optional(),
                systemInstruction: z.string().optional()
            }).optional()
        })
    }),

    // Therapy analysis request
    therapyAnalyze: z.object({
        body: z.object({
            message: z.string().min(1, 'Message is required'),
            history: z.array(z.any()).optional()
        })
    }),

    // Antigravity analysis request
    antigravityAnalyze: z.object({
        body: z.object({
            transcript: z.string().min(1, 'Transcript is required'),
            userId: z.string().optional(),
            timestamp: z.string().optional()
        })
    }),

    // Agent creation request
    createAgent: z.object({
        body: z.object({
            name: z.string().min(1).max(100),
            type: z.enum(['chat', 'voice', 'autonomous']),
            system_prompt: z.string().min(1).max(5000),
            model: z.string().default('gemini-1.5-flash'),
            temperature: z.number().min(0).max(2).default(0.7),
            max_tokens: z.number().min(1).max(100000).default(1000),
            memory_enabled: z.boolean().default(true),
            voice_settings: z.object({
                voice_id: z.string().optional(),
                speed: z.number().min(0.5).max(2).optional(),
                pitch: z.number().min(0.5).max(2).optional()
            }).optional()
        })
    }),

    // Chat message request
    sendMessage: z.object({
        body: z.object({
            session_id: z.string().uuid(),
            content: z.string().min(1).max(10000),
            role: z.enum(['user', 'assistant', 'system']).default('user')
        })
    }),

    // User signup request
    signup: z.object({
        body: z.object({
            email: z.string().email('Invalid email address'),
            password: z.string().min(8, 'Password must be at least 8 characters'),
            full_name: z.string().min(1).max(100).optional()
        })
    }),

    // User signin request
    signin: z.object({
        body: z.object({
            email: z.string().email('Invalid email address'),
            password: z.string().min(1, 'Password is required')
        })
    })
};
