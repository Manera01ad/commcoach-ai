import Orchestrator from '../services/agent/Orchestrator.js';

/**
 * Handle chat message
 * POST /api/agents/chat
 */
export const handleChat = async (req, res) => {
    try {
        const { message, sessionId, stream, config } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!message || !sessionId) {
            return res.status(400).json({ error: "Message and Session ID are required" });
        }

        if (stream) {
            // Set headers for SSE
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            await Orchestrator.processMessage(userId, sessionId, message, true, (chunk) => {
                res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            }, config);

            res.write('data: [DONE]\n\n');
            res.end();
        } else {
            // Standard JSON response
            const response = await Orchestrator.processMessage(userId, sessionId, message, false, null, config);
            res.json({ content: response });
        }

    } catch (error) {
        console.error("Agent Controller Error:", error);
        // If headers sent (streaming), we can't send JSON error
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        } else {
            res.end();
        }
    }
};
