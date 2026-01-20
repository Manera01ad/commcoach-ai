import AgentService from './AgentService.js';
import BrowserTool from '../tools/BrowserTool.js';

/**
 * Research Agent (The "Action Agent")
 * Uses the "Ghost Browser" to find information and answer queries.
 */
class ResearchAgent extends AgentService {
    constructor() {
        // Only initialize if API key exists
        super({ modelName: 'gemini-1.5-flash', temperature: 0.4 });
        this.enabled = !!process.env.GEMINI_API_KEY;
        if (!this.enabled) {
            console.warn('⚠️  ResearchAgent disabled: GEMINI_API_KEY not configured');
        }
    }

    /**
     * Conduct research on a topic
     * @param {string} query
     * @param {function} onEvent - Callback for browser events { type, description, ... }
     */
    async research(query, onEvent = null) {
        if (!this.enabled) {
            return "Research feature is currently unavailable. Please configure GEMINI_API_KEY in your environment.";
        }

        try {
            console.log(`[ResearchAgent] Starting research on: "${query}"`);

            if (onEvent) onEvent({ type: 'think', description: 'Planning research strategy...' });

            // Step 1: Browse (Search Google)
            if (onEvent) onEvent({ type: 'navigate', url: 'https://google.com', description: 'Navigating to Google' });
            if (onEvent) onEvent({ type: 'type', text: query, description: `Typing: "${query}"` });
            if (onEvent) onEvent({ type: 'click', description: 'Clicking Search' });

            const searchResults = await BrowserTool.searchGoogle(query);

            if (!searchResults || searchResults.length === 0) {
                return "I searched the web but couldn't find relevant results.";
            }

            console.log(`[ResearchAgent] Found ${searchResults.length} links. Reading top 2...`);
            if (onEvent) onEvent({ type: 'read', description: `Found ${searchResults.length} results. Scanning content...` });

            // Step 2: Read (Scrape Content) -> Parallel reading
            const pageContents = await Promise.all(
                searchResults.slice(0, 2).map(async (result) => {
                    if (onEvent) onEvent({ type: 'navigate', url: result.url, description: `Reading: ${result.title.substring(0, 30)}...` });
                    const content = await BrowserTool.readPage(result.url);
                    return `SOURCE: ${result.title} (${result.url})\nCONTENT: ${content}\n\n`;
                })
            );

            // Step 3: Reason (Synthesize Answer)
            if (onEvent) onEvent({ type: 'think', description: 'Synthesizing final answer...' });

            const researchContext = pageContents.join('\n');
            const messages = [
                {
                    role: 'user', content: `
                  You are a research assistant. Answer the user's question based ONLY on the provided research context below.
                  Include citations (URL) where appropriate.

                  USER QUESTION: ${query}

                  RESEARCH CONTEXT:
                  ${researchContext}
                `}
            ];

            const result = await this.generateResponse(messages);
            return result.content;

        } catch (error) {
            console.error("Research Agent Error:", error);
            return "I encountered an error while browsing the web.";
        }
    }
}

// Export the class, not an instance (lazy initialization)
// This prevents crashes when GEMINI_API_KEY is not configured
export default ResearchAgent;
