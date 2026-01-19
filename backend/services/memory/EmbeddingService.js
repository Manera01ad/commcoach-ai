import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Embedding Service (The "Translator")
 * Converts text into vector numbers that the database can understand.
 */
class EmbeddingService {
    constructor() {
        // Using Gemini's efficient embedding model
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "embedding-001" });
    }

    /**
     * Generate embedding for a single string
     * @param {string} text - The text to embed
     * @returns {Promise<number[]>} - The vector array
     */
    async generateEmbedding(text) {
        if (!text || typeof text !== 'string') {
            throw new Error("Text is required for embedding generation");
        }

        try {
            // Clean text slightly
            const cleanText = text.replace(/\n/g, " ").trim();

            const result = await this.model.embedContent(cleanText);
            const embedding = result.embedding;

            return embedding.values;

        } catch (error) {
            console.error("Embedding Generation Error:", error);
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple documents
     */
    async generateBatchEmbeddings(texts) {
        // Gemini currently handles batching differently, so we map singular calls for simplicity first
        // In production, we would use batchEmbedContents
        return Promise.all(texts.map(text => this.generateEmbedding(text)));
    }
}

export default new EmbeddingService();
