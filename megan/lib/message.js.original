// MEGAN-MD Message Helper

class MessageHelper {
    static extractText(message) {
        if (!message) return '';
        
        if (message.conversation) return message.conversation;
        if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
        if (message.imageMessage?.caption) return message.imageMessage.caption;
        if (message.videoMessage?.caption) return message.videoMessage.caption;
        if (message.documentMessage?.caption) return message.documentMessage.caption;
        
        return '';
    }
    
    static isCommand(text, prefix) {
        if (!text || typeof text !== 'string') return false;
        return text.startsWith(prefix);
    }
    
    static parseCommand(text, prefix) {
        if (!text || !text.startsWith(prefix)) return null;
        
        const withoutPrefix = text.slice(prefix.length).trim();
        const parts = withoutPrefix.split(/\s+/);
        const name = parts[0].toLowerCase();
        const args = parts.slice(1);
        const fullText = withoutPrefix;
        
        return { name, args, fullText };
    }
    
    static getMediaType(message) {
        if (!message) return null;
        if (message.imageMessage) return 'image';
        if (message.videoMessage) return 'video';
        if (message.audioMessage) return 'audio';
        if (message.stickerMessage) return 'sticker';
        if (message.documentMessage) return 'document';
        return null;
    }
    
    static createReply(sock, jid, quotedMsg) {
        return async (text, options = {}) => {
            return await sock.sendMessage(jid, { text, ...options }, { quoted: quotedMsg });
        };
    }
    
    static createReact(sock, key) {
        return async (emoji) => {
            return await sock.sendMessage(key.remoteJid, {
                react: { key, text: emoji }
            });
        };
    }
}

module.exports = MessageHelper;
