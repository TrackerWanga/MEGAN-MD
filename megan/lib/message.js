const {
    getContentType,
    extractMessageContent,
    downloadMediaMessage
} = require('gifted-baileys');
const config = require('../config');

class MessageHelper {
    // Extract message text from various message types
    static extractText(message) {
        if (!message) return '';
        
        try {
            // Direct message properties
            if (message.conversation) return message.conversation;
            if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
            if (message.imageMessage?.caption) return message.imageMessage.caption;
            if (message.videoMessage?.caption) return message.videoMessage.caption;
            if (message.documentMessage?.caption) return message.documentMessage.caption;
            
            // Protocol and system messages
            if (message.protocolMessage) return null;
            if (message.senderKeyDistributionMessage) return null;
            
            // Get content type and extract
            const contentType = getContentType(message);
            if (contentType) {
                const content = extractMessageContent(message[contentType]);
                
                if (content) {
                    if (content.text) return content.text;
                    if (content.caption) return content.caption;
                    if (content.contentText) return content.contentText;
                    if (content.conversation) return content.conversation;
                    
                    // For list messages
                    if (content.listMessage?.description) return content.listMessage.description;
                    
                    // For buttons
                    if (content.buttonsMessage?.contentText) return content.buttonsMessage.contentText;
                    
                    // For template messages
                    if (content.templateMessage?.hydratedTemplate?.hydratedContentText) {
                        return content.templateMessage.hydratedTemplate.hydratedContentText;
                    }
                }
            }
            
            return null;
        } catch (error) {
            return null;
        }
    }

    // Get media type
    static getMediaType(message) {
        if (!message) return null;
        
        if (message.imageMessage) return 'IMAGE';
        if (message.videoMessage) return 'VIDEO';
        if (message.audioMessage) return 'AUDIO';
        if (message.stickerMessage) return 'STICKER';
        if (message.documentMessage) return 'DOCUMENT';
        if (message.contactMessage) return 'CONTACT';
        if (message.locationMessage) return 'LOCATION';
        if (message.liveLocationMessage) return 'LIVE_LOCATION';
        if (message.reactionMessage) return 'REACTION';
        
        try {
            const contentType = getContentType(message);
            if (!contentType) return null;
            
            if (contentType.includes('ImageMessage')) return 'IMAGE';
            if (contentType.includes('VideoMessage')) return 'VIDEO';
            if (contentType.includes('AudioMessage')) return 'AUDIO';
            if (contentType.includes('StickerMessage')) return 'STICKER';
            if (contentType.includes('DocumentMessage')) return 'DOCUMENT';
            if (contentType.includes('ContactMessage')) return 'CONTACT';
            if (contentType.includes('LocationMessage')) return 'LOCATION';
            
            return null;
        } catch (error) {
            return null;
        }
    }

    // Check if message is a command
    static isCommand(text, prefix) {
        return text && text.startsWith(prefix);
    }

    // Parse command
    static parseCommand(text, prefix) {
        if (!text || !text.startsWith(prefix)) return null;
        
        const commandText = text.slice(prefix.length).trim();
        const commandName = commandText.split(/ +/)[0].toLowerCase();
        const args = commandText.slice(commandName.length).trim().split(/ +/).filter(arg => arg);
        
        return {
            name: commandName,
            args,
            fullText: commandText
        };
    }

    // Create reply function
    static createReply(sock, from, quoted) {
        return async (replyText) => {
            return sock.sendMessage(from, { text: replyText }, { quoted });
        };
    }

    // Create react function
    static createReact(sock, key) {
        return async (emoji) => {
            return sock.sendMessage(key.remoteJid, {
                react: { key, text: emoji }
            });
        };
    }

    // Download media
    static async downloadMedia(message, type = 'buffer') {
        try {
            return await downloadMediaMessage(
                message,
                type,
                {},
                {
                    logger: console,
                    reuploadRequest: async (mediaKey) => {
                        // Handle reupload if needed
                    }
                }
            );
        } catch (error) {
            console.error('Media download error:', error);
            return null;
        }
    }
}

module.exports = MessageHelper;
