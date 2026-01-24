import { Server } from 'socket.io';
import geminiService from './geminiService.js';

class VoiceService {
    constructor() {
        this.io = null;
    }

    init(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*', // In production, restrict this
                methods: ['GET', 'POST']
            }
        });

        this.io.on('connection', (socket) => {
            console.log(`[VoiceService] New client connected: ${socket.id}`);

            socket.on('start-voice', (data) => {
                const { userId } = data;
                console.log(`[VoiceService] Starting voice session for user: ${userId}`);
                socket.join(`user-${userId}`);
            });

            socket.on('speech-text', async (data) => {
                const { text, isFinal, userId } = data;
                console.log(`[VoiceService] Received speech text: "${text}" (Final: ${isFinal})`);

                // Real-time behavioral coaching logic
                if (isFinal) {
                    try {
                        const prompt = `
                        Analyze this spoken segment for communication effectiveness:
                        "${text}"
                        
                        Provide a very brief (1 sentence), high-impact coaching tip focused on:
                        1. Linguistic clarity
                        2. Tone
                        3. Confidence
                        
                        The tip must be direct and behavioral.
                        `;

                        const response = await geminiService.generateContent('gemini-2.0-flash-exp', prompt);
                        this.sendVoiceResponse(userId, response);
                    } catch (error) {
                        console.error('[VoiceService] Gemini error:', error);
                    }
                } else if (text.length > 30 && !socket.interimSent) {
                    // Quick interim encouragement/feedback
                    socket.interimSent = true;
                    this.sendVoiceResponse(userId, "I'm detecting your rhythm... continue.", { shouldSpeak: false });
                    setTimeout(() => { socket.interimSent = false; }, 5000);
                }
            });

            socket.on('disconnect', () => {
                console.log(`[VoiceService] Client disconnected: ${socket.id}`);
            });
        });
    }

    // Broadcast a voice response back to the user
    async sendVoiceResponse(userId, text, extra = {}) {
        if (!this.io) return;

        this.io.to(`user-${userId}`).emit('voice-response', {
            text,
            ...extra,
            timestamp: new Date().toISOString()
        });
    }
}

export default new VoiceService();
