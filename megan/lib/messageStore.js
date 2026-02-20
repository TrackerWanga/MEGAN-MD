const config = require('../config');

class MessageStore {

    constructor() {

        this.chats = new Map(); // Map of chat JID -> array of messages

        this.maxStore = config.CACHE.MAX_STORE || 100;

    }

    // Add message to store - KEEP ORIGINAL FORMAT

    addMessage(message) {

        if (!config.CACHE.STORE_MESSAGES) return;

        if (!message?.key?.remoteJid) return;

        if (message.key?.fromMe) return; // Don't store own messages

        

        const jid = message.key.remoteJid;

        

        if (!this.chats.has(jid)) {

            this.chats.set(jid, []);

        }

        

        const messages = this.chats.get(jid);

        

        // Store the COMPLETE original message - NO TRANSFORMATION

        messages.push({

            message: message, // The complete original message

            key: message.key, // Store key separately for quick access

            storedAt: Date.now()

        });

        

        // Keep only last maxStore messages

        if (messages.length > this.maxStore) {

            this.chats.set(jid, messages.slice(-this.maxStore));

        }

    }

    // Get message by ID - SIMPLIFIED

    getMessage(jid, messageId) {

        const messages = this.chats.get(jid);

        if (!messages) return null;

        

        // Direct key match - fastest

        return messages.find(m => m.key?.id === messageId)?.message || null;

    }

    // Get message by key object

    getMessageByKey(key) {

        if (!key?.remoteJid || !key?.id) return null;

        return this.getMessage(key.remoteJid, key.id);

    }

    // Remove message after processing

    removeMessage(jid, messageId) {

        const messages = this.chats.get(jid);

        if (!messages) return false;

        

        const index = messages.findIndex(m => m.key?.id === messageId);

        

        if (index !== -1) {

            messages.splice(index, 1);

            return true;

        }

        return false;

    }

    // Clean old messages (older than 1 hour)

    cleanup() {

        const now = Date.now();

        const oneHour = 60 * 60 * 1000;

        let cleaned = 0;

        

        for (const [jid, messages] of this.chats.entries()) {

            const filtered = messages.filter(m => now - m.storedAt < oneHour);

            if (filtered.length > 0) {

                this.chats.set(jid, filtered);

            } else {

                this.chats.delete(jid);

                cleaned++;

            }

        }

        

        if (cleaned > 0 && config.LOG_LEVEL !== 'silent') {

            console.log(`๐งน Cleaned ${cleaned} expired chats from message store`);

        }

    }

    // Get store stats

    getStats() {

        let totalMessages = 0;

        for (const messages of this.chats.values()) {

            totalMessages += messages.length;

        }

        return {

            chats: this.chats.size,

            messages: totalMessages

        };

    }

}

module.exports = MessageStore;