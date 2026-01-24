import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

/**
 * Base Agent Service
 * Handles LLM initialization, message formatting, and basic generation.
 */
class AgentService {
    constructor(config = {}) {
        this.config = config;
        this.model = null; // Lazy initialization
    }

    /**
     * Get the model instance, initializing it if necessary
     * @param {Object} overrideConfig - Dynamic overrides (apiKey, model)
     */
    async getModel(overrideConfig = {}) {
        // If override config is provided (like a user-specific API key),
        // we always create a fresh instance for that request.
        if (Object.keys(overrideConfig).length > 0) {
            return this.initializeModel({ ...this.config, ...overrideConfig });
        }

        if (!this.model) {
            this.model = this.initializeModel(this.config);
        }
        return this.model;
    }


    /**
     * Initialize the LLM based on configuration
     */
    initializeModel(config) {
        const temperature = config.temperature || 0.7;
        const modelName = config.modelName || "gemini-1.5-flash";
        const apiKey = config.apiKey || process.env.GEMINI_API_KEY;

        if (modelName.startsWith("gemini")) {
            if (!apiKey) {
                console.warn('⚠️  GEMINI_API_KEY not found. Agent features will be limited.');
                return null;
            }
            return new ChatGoogleGenerativeAI({
                model: modelName,
                maxOutputTokens: config.maxTokens || 1000,
                temperature: temperature,
                apiKey: apiKey,
            });
        } else if (modelName.startsWith("gpt")) {
            const openAIApiKey = config.apiKey || process.env.OPENAI_API_KEY;
            if (!openAIApiKey) {
                console.warn('⚠️  OPENAI_API_KEY not found. Agent features will be limited.');
                return null;
            }
            return new ChatOpenAI({
                modelName: modelName,
                temperature: temperature,
                openAIApiKey: openAIApiKey,
            });
        } else {
            if (!apiKey) {
                console.warn('⚠️  GEMINI_API_KEY not found. Agent features will be limited.');
                return null;
            }
            return new ChatGoogleGenerativeAI({
                model: "gemini-1.5-flash",
                maxOutputTokens: 1000,
                temperature: 0.7,
                apiKey: apiKey,
            });
        }
    }

    /**
     * Generate a response
     * @param {Array} messages - List of message objects { role, content }
     * @param {Object} context - Additional context to inject (user profile, etc.)
     */
    async generateResponse(messages, config = {}) {
        try {
            const formattedMessages = messages.map(msg => {
                if (msg.role === 'user') return ["human", msg.content];
                if (msg.role === 'assistant') return ["ai", msg.content];
                return ["system", msg.content];
            });

            const model = await this.getModel(config);
            if (!model) {
                throw new Error('Model not initialized. Please configure API keys.');
            }
            const response = await model.invoke(formattedMessages);

            return {
                content: response.content,
                metadata: response.response_metadata || {}
            };

        } catch (error) {
            console.error("Agent Generation Error:", error);
            throw error;
        }
    }

    /**
     * Stream a response (for real-time chat)
     */
    async streamResponse(messages, onChunk, config = {}) {
        try {
            const formattedMessages = messages.map(msg => {
                if (msg.role === 'human' || msg.role === 'user') return ["human", msg.content];
                if (msg.role === 'ai' || msg.role === 'assistant') return ["ai", msg.content];
                return ["system", msg.content];
            });

            const model = await this.getModel(config);
            if (!model) {
                throw new Error('Model not initialized. Please configure API keys.');
            }
            const stream = await model.stream(formattedMessages);

            for await (const chunk of stream) {
                if (chunk.content) {
                    onChunk(chunk.content);
                }
            }

        } catch (error) {
            console.error("Agent Streaming Error:", error);
            throw error;
        }
    }
}

export default AgentService;
