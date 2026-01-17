import { GoogleGenerativeAI } from "@google/genai";

// Environment detection
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Securely generates content using the backend proxy.
 * Replaces direct client-side Gemini calls.
 */
export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch(`${API_URL}/api/gemini/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        // Handle different response shapes from backend if necessary
        return data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

/**
 * Legacy support wrapper if components expect the GoogleGenerativeAI interface.
 * Can be used to inject the proxy into existing code with minimal changes.
 */
export const getGenerativeModelProxy = () => {
    return {
        generateContent: async (prompt: string | any) => {
            const textPrompt = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
            const textResponse = await generateContent(textPrompt);
            // Return shape matching Gemini SDK response
            return {
                response: {
                    text: () => textResponse
                }
            };
        }
    };
};
