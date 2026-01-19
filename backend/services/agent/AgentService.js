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
     */
    async getModel() {
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

        if (modelName.startsWith("gemini")) {
            return new ChatGoogleGenerativeAI({
                model: modelName,
                maxOutputTokens: config.maxTokens || 1000,
                temperature: temperature,
                apiKey: process.env.GEMINI_API_KEY,
            });
        } else if (modelName.startsWith("gpt")) {
            return new ChatOpenAI({
                modelName: modelName,
                temperature: temperature,
                openAIApiKey: process.env.OPENAI_API_KEY,
            });
        } else {
            // Default to Gemini if unknown
            return new ChatGoogleGenerativeAI({
                model: "gemini-1.5-flash",
                maxOutputTokens: 1000,
                temperature: 0.7,
                apiKey: process.env.GEMINI_API_KEY,
            });
        }
    }

    /**
     * Generate a response
     * @param {Array} messages - List of message objects { role, content }
     * @param {Object} context - Additional context to inject (user profile, etc.)
     */
    async generateResponse(messages, context = {}) {
        try {
            // 1. Format messages for LangChain
            // This is a simplified formatting; in a real scenario, we'd clean/parse more
            const formattedMessages = messages.map(msg => {
                if (msg.role === 'user') return ["human", msg.content];
                if (msg.role === 'assistant') return ["ai", msg.content];
                return ["system", msg.content];
            });

            // 2. Invoke Model
            const model = await this.getModel();
            const response = await model.invoke(formattedMessages);

            // 3. Return Content
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
    async streamResponse(messages, onChunk) {
        try {
            const formattedMessages = messages.map(msg => {
                if (msg.role === 'user') return ["human", msg.content];
                if (msg.role === 'assistant') return ["ai", msg.content];
                return ["system", msg.content];
            });

            const model = await this.getModel();
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
