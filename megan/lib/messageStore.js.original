// MEGAN-MD Message Store - Memory + SQLite

const config = require('../config');

class MessageStore {
    constructor() {
        this.chats = new Map();
        this.maxStore = config.CACHE.MAX_STORE || 200;
        this.db = null;
        this.originalMessages = new Map();
    }
    
    setDatabase(db) {
        this.db = db;
    }
    
    async addMessage(message) {
        if (!config.CACHE.STORE_MESSAGES) return;
        if (!message?.key?.remoteJid || !message?.key?.id) return;
        
        const jid = message.key.remoteJid;
        const sender = message.key.participant || jid;
        
        const isViewOnce = message.message?.imageMessage?.viewOnce === true ||
                          message.message?.videoMessage?.viewOnce === true;
        const isStatus = jid === 'status@broadcast';
        
        let messageType = 'text';
        if (message.message?.imageMessage) messageType = 'image';
        else if (message.message?.videoMessage) messageType = 'video';
        else if (message.message?.audioMessage) messageType = 'audio';
        else if (message.message?.stickerMessage) messageType = 'sticker';
        else if (message.message?.documentMessage) messageType = 'document';
        
        let textContent = null;
        if (message.message?.conversation) textContent = message.message.conversation;
        else if (message.message?.extendedTextMessage?.text) textContent = message.message.extendedTextMessage.text;
        else if (message.message?.imageMessage?.caption) textContent = message.message.imageMessage.caption;
        else if (message.message?.videoMessage?.caption) textContent = message.message.videoMessage.caption;
        
        // Store in memory cache
        if (!this.chats.has(jid)) {
            this.chats.set(jid, []);
        }
        
        const messages = this.chats.get(jid);
        const storeEntry = {
            message: message,
            key: message.key,
            storedAt: Date.now(),
            isViewOnce,
            isStatus,
            messageType,
            textContent
        };
        
        messages.push(storeEntry);
        
        if (messages.length > this.maxStore) {
            this.chats.set(jid, messages.slice(-this.maxStore));
        }
        
        // Store in SQLite with FULL message data
        if (this.db && this.db.models.Message) {
            try {
                await this.db.saveMessage({
                    messageId: message.key.id,
                    chatJid: jid,
                    senderJid: sender,
                    messageData: JSON.stringify(message),
                    textContent: textContent,
                    mediaUrl: null,
                    messageType: messageType,
                    isViewOnce: isViewOnce,
                    isStatus: isStatus,
                    timestamp: new Date()
                });
            } catch (error) {}
        }
        
        return storeEntry;
    }
    
    async storeOriginalMessage(message) {
        if (!message?.key?.remoteJid || !message?.key?.id) return;
        
        const jid = message.key.remoteJid;
        const messageId = message.key.id;
        
        // Store in memory for quick access
        if (!this.originalMessages.has(jid)) {
            this.originalMessages.set(jid, new Map());
        }
        this.originalMessages.get(jid).set(messageId, message);
        
        // Store in SQLite
        if (this.db && this.db.models.OriginalMessage) {
            try {
                await this.db.storeOriginalMessage(messageId, jid, message);
            } catch (error) {}
        }
        
        // Cleanup old original messages (keep last 50 per chat)
        const messages = this.originalMessages.get(jid);
        if (messages.size > 50) {
            const oldest = Array.from(messages.keys())[0];
            messages.delete(oldest);
        }
    }
    
    async getMessage(jid, messageId) {
        const messages = this.chats.get(jid);
        if (messages) {
            const found = messages.find(m => m.key?.id === messageId);
            if (found) return found.message;
        }
        
        if (this.db && this.db.models.Message) {
            try {
                const record = await this.db.getMessage(jid, messageId);
                if (record && record.messageData) {
                    return JSON.parse(record.messageData);
                }
            } catch (error) {}
        }
        
        return null;
    }
    
    async getOriginalMessage(jid, messageId) {
        const jidMap = this.originalMessages.get(jid);
        if (jidMap && jidMap.has(messageId)) {
            return jidMap.get(messageId);
        }
        
        if (this.db && this.db.models.OriginalMessage) {
            try {
                const record = await this.db.getOriginalMessage(jid, messageId);
                if (record) return record;
            } catch (error) {}
        }
        
        return null;
    }
    
    removeMessage(jid, messageId) {
        const messages = this.chats.get(jid);
        if (messages) {
            const index = messages.findIndex(m => m.key?.id === messageId);
            if (index !== -1) {
                messages.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    
    cleanup() {
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;
        
        for (const [jid, messages] of this.chats.entries()) {
            const filtered = messages.filter(m => now - m.storedAt < oneHour);
            if (filtered.length > 0) {
                this.chats.set(jid, filtered);
            } else {
                this.chats.delete(jid);
            }
        }
        
        // Cleanup original messages older than 1 hour
        for (const [jid, messages] of this.originalMessages.entries()) {
            for (const [id, msg] of messages) {
                if (msg.timestamp && (now - msg.timestamp) > oneHour) {
                    messages.delete(id);
                }
            }
            if (messages.size === 0) {
                this.originalMessages.delete(jid);
            }
        }
        
        // Database cleanup
        if (this.db) {
            this.db.cleanupOldMessages(1).catch(() => {});
        }
    }
    
    getStats() {
        let memoryMessages = 0;
        for (const messages of this.chats.values()) {
            memoryMessages += messages.length;
        }
        
        let originalMessages = 0;
        for (const messages of this.originalMessages.values()) {
            originalMessages += messages.size;
        }
        
        return {
            memoryCache: { chats: this.chats.size, messages: memoryMessages },
            originalCache: { chats: this.originalMessages.size, messages: originalMessages }
        };
    }
}

module.exports = MessageStore;
