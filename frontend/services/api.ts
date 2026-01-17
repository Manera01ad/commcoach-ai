const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface GenerationConfig {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
}

interface GenerateResponse {
    candidates?: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
    text?: string;
    error?: string;
}

export const geminiApi = {
    /**
     * Generate text content using Gemini via Backend Proxy
     */
    generateContent: async (
        model: string,
        prompt: string | any[],
        config?: GenerationConfig
    ): Promise<string> => {
        try {
            const response = await fetch(`${API_URL}/gemini/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    config
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }

            const data: GenerateResponse = await response.json();

            // Parse response to find text (handles raw string or Gemini candidate structure)
            if (data.text) return data.text;
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            }

            return JSON.stringify(data); // Fallback

        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    },

    /**
     * Generate structured JSON output via Backend Proxy
     */
    generateStructured: async (
        model: string,
        prompt: string,
        schema: any
    ): Promise<any> => {
        try {
            const response = await fetch(`${API_URL}/gemini/structured`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    schema
                }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Gemini Structured API Error:', error);
            throw error;
        }
    }
};
