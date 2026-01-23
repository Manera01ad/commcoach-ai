import fetch from 'node-fetch';

/**
 * Ollama Service
 * Connects to self-hosted Ollama instance for free, unlimited AI generation
 */
class OllamaService {
    constructor() {
        // Ollama can run locally or on Railway
        this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
        this.defaultModel = 'llama3';
    }

    /**
     * Generate content using Ollama
     * @param {string} model - Model to use (llama3, mistral, codellama, etc.)
     * @param {string} prompt - User prompt
     * @param {object} config - Additional configuration
     * @returns {Promise<object>} Generated content
     */
    async generateContent(model, prompt, config = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model || this.defaultModel,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: config.temperature || 0.7,
                        num_predict: config.maxTokens || 500,
                        top_p: config.topP || 0.9
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();

            return {
                text: data.response,
                model: data.model,
                provider: 'ollama',
                cost: 0 // Free!
            };

        } catch (error) {
            console.error('[Ollama] Error:', error.message);
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
        const structuredPrompt = `${prompt}\n\nYou must respond with ONLY valid JSON matching this exact schema. Do not include any explanation or markdown formatting, just the raw JSON:\n${JSON.stringify(schema, null, 2)}`;

        const result = await this.generateContent(model, structuredPrompt, {
            temperature: 0.3 // Lower temperature for structured output
        });

        try {
            // Clean up response (remove markdown code blocks if present)
            let jsonText = result.text.trim();
            if (jsonText.startsWith('```')) {
                jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            }

            return JSON.parse(jsonText);
        } catch (error) {
            console.error('[Ollama] Failed to parse JSON:', error);
            throw new Error('Failed to generate valid JSON structure');
        }
    }

    /**
     * Check if Ollama is available
     * @returns {Promise<boolean>} True if Ollama is running
     */
    async isAvailable() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(3000) // 3 second timeout
            });
            return response.ok;
        } catch (error) {
            console.log('[Ollama] Not available:', error.message);
            return false;
        }
    }

    /**
     * List available models on Ollama instance
     * @returns {Promise<Array>} List of models
     */
    async listModels() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('[Ollama] Failed to list models:', error);
            return [];
        }
    }

    /**
     * Pull a model from Ollama registry
     * @param {string} model - Model name to pull
     * @returns {Promise<boolean>} True if successful
     */
    async pullModel(model) {
        try {
            const response = await fetch(`${this.baseUrl}/api/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: model,
                    stream: false
                })
            });

            return response.ok;
        } catch (error) {
            console.error(`[Ollama] Failed to pull model ${model}:`, error);
            return false;
        }
    }
}

export default new OllamaService();
