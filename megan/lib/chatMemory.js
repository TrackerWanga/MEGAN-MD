// megan/lib/chatMemory.js
/**
 * Chat Memory System - Like a real person's memory!
 * - Remembers conversations per user/group
 * - Auto-forgets after 5 minutes of silence
 * - Extended memory (30 min) for active chats
 * - Natural conversation flow
 */

class ChatMemory {
    constructor() {
        // Main memory storage
        this.memory = new Map();
        
        // Memory settings
        this.SHORT_TERM = 5 * 60 * 1000;      // 5 minutes
        this.LONG_TERM = 30 * 60 * 1000;      // 30 minutes
        
        // Start memory cleaner
        this.startMemoryCleaner();
    }

    /**
     * Get memory for a specific chat (user or group)
     */
    getChatMemory(chatId) {
        if (!this.memory.has(chatId)) {
            this.memory.set(chatId, {
                messages: [],
                lastActive: Date.now(),
                context: {},
                user: null
            });
        }
        return this.memory.get(chatId);
    }

    /**
     * Add a message to memory
     */
    addMessage(chatId, userId, message, response = null) {
        const chatMem = this.getChatMemory(chatId);
        
        // Store user info for greeting
        if (!chatMem.user && userId) {
            chatMem.user = {
                id: userId,
                firstSeen: Date.now()
            };
        }
        
        // Add user message
        chatMem.messages.push({
            role: 'user',
            content: message,
            timestamp: Date.now()
        });
        
        // Add bot response if provided
        if (response) {
            chatMem.messages.push({
                role: 'assistant',
                content: response,
                timestamp: Date.now()
            });
        }
        
        // Update last active
        chatMem.lastActive = Date.now();
        
        // Keep only last 20 messages (prevents memory bloat)
        if (chatMem.messages.length > 20) {
            chatMem.messages = chatMem.messages.slice(-20);
        }
        
        return chatMem;
    }

    /**
     * Get conversation context for AI
     */
    getContext(chatId, userId = null) {
        const chatMem = this.getChatMemory(chatId);
        const now = Date.now();
        const timeSinceLast = now - chatMem.lastActive;
        
        // Check if memory should be cleared (5 minutes silence)
        if (timeSinceLast > this.SHORT_TERM) {
            this.clearMemory(chatId);
            return this.createNewContext(chatId, userId);
        }
        
        // Build conversation context
        let context = "Conversation history:\n\n";
        
        chatMem.messages.forEach(msg => {
            const role = msg.role === 'user' ? 'Human' : 'Assistant';
            context += `${role}: ${msg.content}\n`;
        });
        
        // Add time context
        if (chatMem.messages.length > 0) {
            const lastMsg = chatMem.messages[chatMem.messages.length - 1];
            const minsAgo = Math.round((now - lastMsg.timestamp) / 60000);
            
            if (minsAgo > 0) {
                context += `\n(Last message was ${minsAgo} minute${minsAgo > 1 ? 's' : ''} ago)\n`;
            }
        }
        
        return context;
    }

    /**
     * Create fresh context for new conversation
     */
    createNewContext(chatId, userId) {
        const chatMem = this.getChatMemory(chatId);
        
        let context = `You are Megan AI, a friendly WhatsApp assistant. `;
        context += `You're talking to a user. Be natural, helpful, and conversational.\n\n`;
        
        // Check if it's a returning user
        if (chatMem.user && chatMem.user.id === userId) {
            const minsSinceLast = Math.round((Date.now() - chatMem.lastActive) / 60000);
            context += `Note: This user has chatted with you before, but it's been ${minsSinceLast} minutes since last conversation.\n`;
            context += `Acknowledge them naturally like "Hey! Good to see you again!"\n\n`;
        }
        
        return context;
    }

    /**
     * Get greeting based on time of day
     */
    getTimeBasedGreeting(userName) {
        const hour = new Date().getHours();
        let greeting = '';
        
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 17) greeting = 'Good afternoon';
        else if (hour < 21) greeting = 'Good evening';
        else greeting = 'Hey';
        
        return userName ? `${greeting} @${userName}!` : `${greeting}!`;
    }

    /**
     * Clear memory for a chat
     */
    clearMemory(chatId) {
        const chatMem = this.memory.get(chatId);
        if (chatMem) {
            // Keep user info but clear messages
            this.memory.set(chatId, {
                messages: [],
                lastActive: Date.now(),
                context: {},
                user: chatMem.user
            });
        }
    }

    /**
     * Delete memory completely
     */
    deleteMemory(chatId) {
        this.memory.delete(chatId);
    }

    /**
     * Memory cleaner - runs every minute
     */
    startMemoryCleaner() {
        setInterval(() => {
            const now = Date.now();
            let cleared = 0;
            
            for (const [chatId, chatMem] of this.memory.entries()) {
                const timeSinceLast = now - chatMem.lastActive;
                
                // Clear if inactive for more than SHORT_TERM
                if (timeSinceLast > this.SHORT_TERM) {
                    if (chatMem.messages.length > 0) {
                        // Keep user info but clear messages
                        this.memory.set(chatId, {
                            messages: [],
                            lastActive: chatMem.lastActive,
                            context: {},
                            user: chatMem.user
                        });
                        cleared++;
                    }
                }
                
                // Delete completely if inactive for more than LONG_TERM
                if (timeSinceLast > this.LONG_TERM) {
                    this.memory.delete(chatId);
                    cleared++;
                }
            }
            
            if (cleared > 0) {
                console.log(`🧹 Memory cleaner: Cleared ${cleared} old conversations`);
            }
        }, 60 * 1000); // Run every minute
    }

    /**
     * Get memory stats
     */
    getStats() {
        let activeChats = 0;
        let totalMessages = 0;
        
        for (const [_, chatMem] of this.memory.entries()) {
            if (chatMem.messages.length > 0) {
                activeChats++;
                totalMessages += chatMem.messages.length;
            }
        }
        
        return {
            activeChats,
            totalMessages,
            totalEntries: this.memory.size
        };
    }
}

module.exports = ChatMemory;