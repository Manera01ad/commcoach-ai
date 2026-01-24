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

            socket.on('audio-packet', async (data) => {
                const { audio, userId } = data;
                console.log(`[VoiceService] Received audio packet from user: ${userId}`);

                // Mock behavior: respond every 10th packet
                if (!socket.packetCount) socket.packetCount = 0;
                socket.packetCount++;

                if (socket.packetCount % 10 === 0) {
                    this.sendVoiceResponse(userId, "Analysis update: Your pace is excellent. I'm detecting high clarity levels in your last segment.");
                }
            });

            socket.on('disconnect', () => {
                console.log(`[VoiceService] Client disconnected: ${socket.id}`);
            });
        });
    }

    // Broadcast a voice response back to the user
    async sendVoiceResponse(userId, text) {
        if (!this.io) return;

        this.io.to(`user-${userId}`).emit('voice-response', {
            text,
            // In a real implementation, we would also send a base64 encoded audio buffer (TTS)
            timestamp: new Date().toISOString()
        });
    }
}

export default new VoiceService();
