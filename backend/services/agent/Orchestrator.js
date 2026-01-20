import AgentService from './AgentService.js';
import ResearchAgent from './ResearchAgent.js';
import MemoryService from '../memory/MemoryService.js'; // Import Memory Service
import { supabase } from '../../config/supabase.js';

/**
 * Agent Orchestrator
 * Manages the "Thinking Process": Intent Classification -> Context -> Agent Selection -> Response
 */
class AgentOrchestrator {
    constructor() {
        // We maintain a pool of specialized agents
        this.agents = {
            default: new AgentService({ modelName: 'gemini-1.5-flash', temperature: 0.7 }),
            coach: new AgentService({ modelName: 'gemini-1.5-pro', temperature: 0.8 }), // "Drill Sergeant" capability
            analyst: new AgentService({ modelName: 'gemini-1.5-flash', temperature: 0.2 }), // "Metrics" capability
            research: new ResearchAgent() // Instantiate the Action Agent
        };
    }

    /**
     * Main entry point for processing a user message
     * @param {string} userId - The user ID
     * @param {string} sessionId - The session ID
     * @param {string} message - The user's message
     * @param {boolean} stream - Whether to stream the response
     * @param {function} onChunk - Callback for streaming chunks
     */
    async processMessage(userId, sessionId, message, stream = false, onChunk = null) {
        try {
            console.log(`[Orchestrator] Processing message for session ${sessionId}`);

            // 1. Fetch Context (Profile + Session History + RAG Memories)
            const context = await this.buildContext(userId, sessionId, message);

            // 2. Select Agent (Simple Intent Logic)
            // Todo: Replace with real Intent Classifier (LLM-based)
            let agentType = context.agentConfig?.type || 'default';

            // Basic Keyword Trigger for Research Agent
            if (message.toLowerCase().includes('research') || message.toLowerCase().includes('find info') || message.toLowerCase().includes('search for')) {
                agentType = 'research';
            }

            console.log(`[Orchestrator] Selected Agent: ${agentType}`);
            const agent = this.agents[agentType] || this.agents.default;

            // 3. Execution Branch
            // Research Agent handles its own flow (Browse -> Read -> Answer)
            // 3. Execution Branch
            // Research Agent handles its own flow (Browse -> Read -> Answer)
            if (agentType === 'research') {
                const researchResult = await agent.research(message, (event) => {
                    if (stream && onChunk) {
                        // Send structured event as a special frame
                        onChunk(`[BROWSER_EVENT]${JSON.stringify(event)}`);
                    }
                });

                if (stream && onChunk) {
                    // streaming is handled by the callback for events, but we also send the final result
                    // However, usually we want the result to just be returned at the end or streamed.
                    // For now, let's just return it, and the controller will send the final chunks?
                    // Actually, we should stream the final answer too if possible, but ResearchAgent currently returns a block.
                    onChunk(researchResult);
                }
                return researchResult;
            }

            // Default Flow (Chat)
            // We will construct the prompt with system instructions + history + new message
            const systemPrompt = this.constructSystemPrompt(context, agentType);

            const messages = [
                { role: 'system', content: systemPrompt },
                ...context.history, // Latest 10 messages
                { role: 'user', content: message }
            ];

            // 4. Generate Response
            let responseContent = "";
            if (stream && onChunk) {
                await agent.streamResponse(messages, (chunk) => {
                    responseContent += chunk;
                    onChunk(chunk);
                });
                // Todo: Save full response to DB after streaming
            } else {
                const result = await agent.generateResponse(messages);
                responseContent = result.content;
                // Todo: Save message to DB
            }

            // 5. Async: Store this interaction in Memory (if useful)
            // We use a simple heuristic: if message > 50 chars, maybe it's worth remembering
            if (message.length > 50 || responseContent.length > 50) {
                // Non-blocking memory storage
                MemoryService.storeMemory(userId, context.session?.agent_id, `User asked: ${message}\nAI Answered: ${responseContent}`, { session_id: sessionId });
            }

            return responseContent;

        } catch (error) {
            console.error("Orchestrator Error:", error);
            throw error;
        }
    }

    /**
     * Build context from Database + Vector DB
     */
    async buildContext(userId, sessionId, currentMessage) {
        // Fetch User Profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, subscription_tier')
            .eq('id', userId)
            .single();

        // Fetch Last 10 Messages
        const { data: historyData } = await supabase
            .from('messages')
            .select('role, content')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(10);

        // Fetch active agent config for this session (if any)
        const { data: session } = await supabase
            .from('chat_sessions')
            .select('agent_id')
            .eq('id', sessionId)
            .single();

        let agentConfig = null;
        if (session?.agent_id) {
            const { data: config } = await supabase
                .from('agent_configs')
                .select('type, system_prompt, name')
                .eq('id', session.agent_id)
                .single();
            agentConfig = config;
        }

        // RAG: Fetch relevant memories
        const relevantMemories = await MemoryService.searchMemories(userId, currentMessage);

        return {
            user: profile,
            history: (historyData || []).reverse(), // LangChain expects oldest first
            agentConfig: agentConfig,
            session: session,
            memories: relevantMemories
        };
    }

    /**
     * Construct System Prompt
     */
    constructSystemPrompt(context, agentType) {
        let basePrompt = `You are CommCoach AI. Your goal is to help ${context.user?.full_name || 'the user'} improve their communication skills.`;

        // Inject Retrieved Memories (RAG)
        if (context.memories) {
            basePrompt += `\n\n[RELEVANT MEMORIES FROM PAST CONVERSATIONS]:\n${context.memories}\n[END MEMORIES]\nUse this context to personalize your advice.`;
        }

        if (context.agentConfig) {
            return `${basePrompt}\n\nRunning Agent Persona: ${context.agentConfig.name}\n${context.agentConfig.system_prompt}`;
        }

        // Default Fallbacks
        if (agentType === 'coach') {
            return `${basePrompt}\n\nAct as a tough negotiation coach. Be direct, point out weaknesses, and don't accept vague answers.`;
        }

        return basePrompt;
    }
}

export default new AgentOrchestrator();
