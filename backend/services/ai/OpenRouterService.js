import fetch from 'node-fetch';

/**
 * OpenRouter Service
 * Provides access to multiple AI models through OpenRouter API
 * Using Claude Haiku for cost efficiency ($0.25/1M input, $1.25/1M output)
 */
class OpenRouterService {
    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY;
        this.baseUrl = 'https://openrouter.ai/api/v1';

        // Default to Claude Haiku (cheapest, high quality)
        this.defaultModel = 'anthropic/claude-3-haiku';
    }

    /**
     * Generate content using OpenRouter
     * @param {string} model - Model to use (defaults to Claude Haiku)
     * @param {string} prompt - User prompt
     * @param {object} config - Additional configuration
     * @returns {Promise<object>} Generated content with usage stats
     */
    async generateContent(model, prompt, config = {}) {
        if (!this.apiKey) {
            throw new Error('OpenRouter API key not configured');
        }

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.APP_URL || 'https://commcoach-ai.vercel.app',
                    'X-Title': 'CommCoach AI'
                },
                body: JSON.stringify({
                    model: model || this.defaultModel,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: config.temperature || 0.7,
                    max_tokens: config.maxTokens || 500
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `OpenRouter API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                text: data.choices[0].message.content,
                model: data.model,
                usage: data.usage,
                cost: this.calculateCost(data.usage, data.model),
                provider: 'openrouter'
            };

        } catch (error) {
            console.error('[OpenRouter] Error:', error.message);
            throw error;
        }
    }

    /**
     * Generate structured JSON output
     * @param {string} model - Model to use
     * @param {string} prompt - User prompt
     * @param {object} schema - JSON schema
     * @returns {Promise<object>} Parsed JSON response
     */
    async generateStructuredContent(model, prompt, schema) {
        const structuredPrompt = `${prompt}\n\nRespond with valid JSON matching this schema:\n${JSON.stringify(schema, null, 2)}`;

        const result = await this.generateContent(model, structuredPrompt, {
            temperature: 0.3 // Lower temperature for structured output
        });

        try {
            return JSON.parse(result.text);
        } catch (error) {
            console.error('[OpenRouter] Failed to parse JSON:', error);
            throw new Error('Failed to generate valid JSON structure');
        }
    }

    /**
     * Calculate cost based on usage
     * @param {object} usage - Token usage from API response
     * @param {string} model - Model used
     * @returns {number} Cost in USD
     */
    calculateCost(usage, model) {
        // OpenRouter pricing (per 1M tokens)
        const pricing = {
            'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
            'anthropic/claude-3.5-sonnet': { input: 3.00, output: 15.00 },
            'openai/gpt-4o-mini': { input: 0.15, output: 0.60 },
            'openai/gpt-4o': { input: 2.50, output: 10.00 },
            'meta-llama/llama-3-8b': { input: 0.06, output: 0.06 }
        };

        const price = pricing[model] || pricing['anthropic/claude-3-haiku'];

        const inputCost = (usage.prompt_tokens / 1000000) * price.input;
        const outputCost = (usage.completion_tokens / 1000000) * price.output;

        return inputCost + outputCost;
    }

    /**
     * List available models
     * @returns {Promise<object>} Available models
     */
    async listModels() {
        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            return await response.json();
        } catch (error) {
            console.error('[OpenRouter] Failed to list models:', error);
            return { data: [] };
        }
    }

    /**
     * Check if OpenRouter is available
     * @returns {Promise<boolean>} True if available
     */
    async isAvailable() {
        if (!this.apiKey) return false;

        try {
            const response = await fetch(`${this.baseUrl}/models`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

export default new OpenRouterService();
