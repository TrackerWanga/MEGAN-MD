// MEGAN-MD Simple Memory Manager - In-memory, auto-cleanup after 24h

class SimpleMemory {
    constructor() {
        this.memory = new Map(); // chatId -> array of messages
        this.retentionHours = 24;
        this.maxMessages = 20; // Keep last 20 messages per chat
        
        // Start auto-cleanup every hour
        setInterval(() => this.cleanup(), 60 * 60 * 1000);
        console.log('🧠 Simple memory manager initialized (24h retention)');
    }

    // Add message to memory
    addMessage(chatId, userId, role, content) {
        if (!chatId || !userId || !role || !content) return;
        
        if (!this.memory.has(chatId)) {
            this.memory.set(chatId, []);
        }
        
        const messages = this.memory.get(chatId);
        
        messages.push({
            role,
            content,
            userId,
            timestamp: Date.now()
        });
        
        // Keep only last maxMessages
        if (messages.length > this.maxMessages) {
            messages.shift();
        }
        
        this.memory.set(chatId, messages);
    }

    // Get conversation history
    getHistory(chatId, limit = 15) {
        const messages = this.memory.get(chatId) || [];
        return messages.slice(-limit);
    }

    // Get formatted conversation for AI
    getContext(chatId, systemPrompt, currentQuery, limit = 15) {
        const history = this.getHistory(chatId, limit);
        
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: currentQuery }
        ];
        
        return messages;
    }

    // Clear memory for a chat
    clearMemory(chatId) {
        if (this.memory.has(chatId)) {
            const count = this.memory.get(chatId).length;
            this.memory.delete(chatId);
            return count;
        }
        return 0;
    }

    // Get stats for a chat
    getStats(chatId) {
        const messages = this.memory.get(chatId) || [];
        const storageBytes = messages.reduce((total, msg) => {
            return total + (msg.content?.length || 0) * 2;
        }, 0);
        
        return {
            messageCount: messages.length,
            storageBytes: storageBytes,
            storageKB: (storageBytes / 1024).toFixed(2)
        };
    }

    // Get global stats
    getGlobalStats() {
        let totalMessages = 0;
        let totalBytes = 0;
        let activeChats = this.memory.size;
        
        for (const [chatId, messages] of this.memory) {
            totalMessages += messages.length;
            totalBytes += messages.reduce((sum, msg) => sum + (msg.content?.length || 0) * 2, 0);
        }
        
        return {
            activeChats,
            totalMessages,
            totalMB: (totalBytes / (1024 * 1024)).toFixed(2),
            retentionHours: this.retentionHours,
            maxMessagesPerChat: this.maxMessages
        };
    }

    // Cleanup old messages (older than retentionHours)
    cleanup() {
        const now = Date.now();
        const cutoff = now - (this.retentionHours * 60 * 60 * 1000);
        let cleaned = 0;
        
        for (const [chatId, messages] of this.memory) {
            const filtered = messages.filter(msg => msg.timestamp > cutoff);
            if (filtered.length !== messages.length) {
                cleaned += messages.length - filtered.length;
                if (filtered.length > 0) {
                    this.memory.set(chatId, filtered);
                } else {
                    this.memory.delete(chatId);
                }
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} old messages from memory`);
        }
    }
}

module.exports = SimpleMemory;
