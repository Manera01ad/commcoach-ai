
// Environment detection
const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:3001";

/**
 * Securely generates content using the backend proxy (Streaming Support).
 */
export const streamContent = async (prompt: string, onChunk: (chunk: string) => void): Promise<string> => {
    try {
        const token = localStorage.getItem('supabase.auth.token');
        const accessToken = token ? JSON.parse(token).access_token : '';

        const response = await fetch(`${API_URL}/agents/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ message: prompt, stream: true }),
        });

        if (!response.ok) throw new Error(`Stream Error: ${response.status}`);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        if (!reader) return "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        // Handle standard chat content
                        if (parsed.content) {
                            onChunk(parsed.content);
                            fullText += parsed.content;
                        }
                        // Handle raw text fallback
                        else if (typeof parsed === 'string') {
                            onChunk(parsed);
                            fullText += parsed;
                        }
                    } catch (e) {
                        // Fallback for plain text data
                        onChunk(data);
                        fullText += data;
                    }
                }
            }
        }
        return fullText;

    } catch (error) {
        console.error("Stream Error:", error);
        throw error;
    }
};

/**
 * Securely generates content using the backend proxy (Standard).
 */
export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const token = localStorage.getItem('supabase.auth.token');
        const accessToken = token ? JSON.parse(token).access_token : '';

        const response = await fetch(`${API_URL}/gemini/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data.text || data.response || data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

/**
 * Reports user activity to update streaks and XP
 */
export const reportActivity = async (activityWeight: number = 1): Promise<any> => {
    try {
        const token = localStorage.getItem('supabase.auth.token');
        const accessToken = token ? JSON.parse(token).access_token : '';

        const response = await fetch(`${API_URL}/api/streak/activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                activityWeight,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }),
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Activity Reporting Error:", error);
        return null;
    }
};

/**
 * Legacy support wrapper
 */
export const getGenerativeModelProxy = () => {
    return {
        generateContent: async (prompt: string | any) => {
            const textPrompt = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
            const textResponse = await generateContent(textPrompt);
            return {
                response: {
                    text: () => textResponse
                }
            };
        },
        streamContent: streamContent,
        reportActivity: reportActivity
    };
};
