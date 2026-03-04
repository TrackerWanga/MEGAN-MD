const { downloadMediaMessage } = require('gifted-baileys');
const { uploadToCatbox } = require('./upload');
const config = require('../config');
const fs = require('fs-extra');
const path = require('path');

class StatusHandler {
    constructor(bot, store) {
        this.bot = bot;
        this.sock = bot.sock;
        this.logger = bot.logger;
        this.db = bot.db;
        this.store = store;
        this.tempDir = path.join(__dirname, '../../temp');
        fs.ensureDirSync(this.tempDir);
    }

    // Main handler for status updates
    async handleStatus(message) {
        try {
            if (!message?.key || message.key.remoteJid !== 'status@broadcast') return;
            
            const sender = message.key.participant || message.key.remoteJid;
            const senderShort = sender.split('@')[0];
            const isFromMe = message.key.fromMe;
            
            // Don't process own status
            if (isFromMe) return;
            
            // Get status settings from database
            const autoView = await this.db.getSetting('status_auto_view', config.STATUS.AUTO_VIEW);
            const autoReact = await this.db.getSetting('status_auto_react', config.STATUS.AUTO_REACT);
            const autoDownload = await this.db.getSetting('status_auto_download', config.STATUS.AUTO_DOWNLOAD);
            const autoReply = await this.db.getSetting('status_auto_reply', config.STATUS.AUTO_REPLY);
            const antiDeleteStatus = await this.db.getSetting('status_anti_delete', config.STATUS.ANTI_DELETE);
            
            // Extract content
            const text = this.extractText(message.message);
            const mediaType = this.getMediaType(message.message);
            
            // Log status
            this.logger.status(`Status from ${senderShort}: ${text || mediaType || 'No content'}`);
            
            // AUTO VIEW - Mark as read (ON by default)
            if (autoView === true || autoView === 'true') {
                await this.markAsRead(message.key);
                this.logger.debug(`Auto-viewed status from ${senderShort}`);
            }
            
            // AUTO REACT (OFF by default)
            if (autoReact === true || autoReact === 'true') {
                await this.autoReactToStatus(message, sender);
            }
            
            // AUTO DOWNLOAD (OFF by default)
            if ((autoDownload === true || autoDownload === 'true') && mediaType) {
                await this.downloadAndSaveStatus(message, sender, text, mediaType);
            }
            
            // AUTO REPLY (OFF by default)
            if (autoReply === true || autoReply === 'true') {
                await this.autoReplyToStatus(message, sender);
            }
            
            // ANTI-DELETE STATUS - Store for potential deletion (OFF by default)
            if (antiDeleteStatus === true || antiDeleteStatus === 'true') {
                // Store in message store for anti-delete
                this.store.addMessage(message);
            }
            
        } catch (error) {
            this.logger.error(`Status handler error: ${error.message}`);
        }
    }

    // Extract text from message
    extractText(message) {
        if (!message) return '';
        
        if (message.conversation) return message.conversation;
        if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
        if (message.imageMessage?.caption) return message.imageMessage.caption;
        if (message.videoMessage?.caption) return message.videoMessage.caption;
        
        return '';
    }

    // Get media type
    getMediaType(message) {
        if (!message) return null;
        
        if (message.imageMessage) return 'IMAGE';
        if (message.videoMessage) return 'VIDEO';
        if (message.audioMessage) return 'AUDIO';
        if (message.stickerMessage) return 'STICKER';
        if (message.documentMessage) return 'DOCUMENT';
        
        return null;
    }

    // Mark status as read
    async markAsRead(key) {
        try {
            await this.sock.readMessages([key]);
        } catch (error) {
            this.logger.error(`Mark as read error: ${error.message}`);
        }
    }

    // Auto react to status
    async autoReactToStatus(message, sender) {
        try {
            const emojisString = await this.db.getSetting('status_react_emojis', config.STATUS.REACT_EMOJIS);
            const emojis = emojisString.split(',').map(e => e.trim());
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            
            await this.sock.sendMessage('status@broadcast', {
                react: { key: message.key, text: randomEmoji }
            });
            
            this.logger.debug(`Auto-reacted to status from ${sender.split('@')[0]} with ${randomEmoji}`);
        } catch (error) {
            this.logger.error(`Auto react error: ${error.message}`);
        }
    }

    // Auto reply to status
    async autoReplyToStatus(message, sender) {
        try {
            const replyText = await this.db.getSetting('status_reply_text', config.STATUS.REPLY_TEXT);
            
            await this.sock.sendMessage(sender, {
                text: replyText
            });
            
            this.logger.debug(`Auto-replied to status from ${sender.split('@')[0]}`);
        } catch (error) {
            this.logger.error(`Auto reply error: ${error.message}`);
        }
    }

    // Download and save status
    async downloadAndSaveStatus(message, sender, text, mediaType) {
        let tempFilePath = null;
        
        try {
            // Download media
            const buffer = await downloadMediaMessage(message, 'buffer', {}, {
                logger: this.logger
            });
            
            if (!buffer) return;
            
            // Generate filename
            const ext = this.getExtension(mediaType);
            const filename = `status_${Date.now()}.${ext}`;
            
            // Upload to Catbox
            const { url, success } = await uploadToCatbox(buffer, filename);
            
            if (success && url) {
                // Send to owner DM
                const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
                const senderShort = sender.split('@')[0];
                
                await this.sock.sendMessage(ownerJid, {
                    text: `📥 *STATUS DOWNLOADED*\n\n👤 *From:* @${senderShort}\n📎 *Type:* ${mediaType}\n📝 *Caption:* ${text || 'None'}\n🔗 *URL:* ${url}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`,
                    mentions: [sender]
                });
                
                this.logger.info(`Status from ${senderShort} saved to DM`);
            }
            
        } catch (error) {
            this.logger.error(`Download status error: ${error.message}`);
        } finally {
            // Clean up temp file if any
            if (tempFilePath) {
                fs.unlink(tempFilePath).catch(() => {});
            }
        }
    }

    // Handle status deletion
    async handleStatusDelete(deletedMsg, key, deleter) {
        try {
            const antiDeleteStatus = await this.db.getSetting('status_anti_delete', config.STATUS.ANTI_DELETE);
            
            if (!antiDeleteStatus || antiDeleteStatus === 'false') return;
            
            const sender = deletedMsg.key?.participant || deletedMsg.key?.remoteJid;
            const senderShort = sender?.split('@')[0] || 'Unknown';
            const deleterShort = deleter?.split('@')[0] || 'Unknown';
            
            // Extract content
            const text = this.extractText(deletedMsg.message);
            const mediaType = this.getMediaType(deletedMsg.message);
            
            this.logger.warn(`Status deleted - From: ${senderShort}, Deleted by: ${deleterShort}`);
            
            const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
            
            // If it's media, download and upload
            if (mediaType) {
                try {
                    const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {}, {
                        logger: this.logger
                    });
                    
                    if (buffer) {
                        const ext = this.getExtension(mediaType);
                        const filename = `deleted_status_${Date.now()}.${ext}`;
                        const { url, success } = await uploadToCatbox(buffer, filename);
                        
                        if (success && url) {
                            await this.sock.sendMessage(ownerJid, {
                                text: `🚨 *STATUS DELETED - MEDIA* 🚨\n\n👤 *From:* @${senderShort}\n🗑️ *Deleted by:* @${deleterShort}\n📎 *Type:* ${mediaType}\n📝 *Caption:* ${text || 'None'}\n🔗 *URL:* ${url}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`,
                                mentions: [sender, deleter]
                            });
                            return;
                        }
                    }
                } catch (mediaError) {
                    this.logger.error(`Media processing error: ${mediaError.message}`);
                }
            }
            
            // If text only or media failed
            await this.sock.sendMessage(ownerJid, {
                text: `🚨 *STATUS DELETED* 🚨\n\n👤 *From:* @${senderShort}\n🗑️ *Deleted by:* @${deleterShort}\n📝 *Content:* ${text || 'No text content'}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`,
                mentions: [sender, deleter]
            });
            
        } catch (error) {
            this.logger.error(`Status delete handler error: ${error.message}`);
        }
    }

    // Handle view once media
    async handleViewOnce(message, from, sender) {
        try {
            const autoViewOnce = await this.db.getSetting('auto_view_once', config.FEATURES.AUTO_VIEW_ONCE);
            
            if (autoViewOnce !== 'true' && autoViewOnce !== true) return;
            
            const mediaType = this.getMediaType(message.message);
            if (!mediaType) return;
            
            const senderShort = sender.split('@')[0];
            
            this.logger.info(`View once detected from ${senderShort}`);
            
            // Download media
            const buffer = await downloadMediaMessage(message, 'buffer', {}, {
                logger: this.logger,
                reuploadRequest: true
            });
            
            if (!buffer) return;
            
            // Upload to Catbox
            const ext = this.getExtension(mediaType);
            const filename = `viewonce_${Date.now()}.${ext}`;
            const { url, success } = await uploadToCatbox(buffer, filename);
            
            if (success && url) {
                const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
                
                await this.sock.sendMessage(ownerJid, {
                    text: `🔐 *VIEW ONCE MEDIA DETECTED* 🔐\n\n👤 *From:* @${senderShort}\n💬 *Chat:* ${from.includes('@g.us') ? 'Group' : 'Private'}\n📎 *Type:* ${mediaType}\n🔗 *URL:* ${url}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`,
                    mentions: [sender]
                });
                
                this.logger.info(`View once from ${senderShort} saved to DM`);
            }
            
        } catch (error) {
            this.logger.error(`View once handler error: ${error.message}`);
        }
    }

    // Save status command (when user replies with .save)
    async saveStatusForUser(message, userJid, quotedMsg) {
        try {
            const mediaType = this.getMediaType(quotedMsg.message);
            if (!mediaType) {
                await this.sock.sendMessage(userJid, {
                    text: '❌ Cannot save: No media found in this status'
                });
                return;
            }
            
            await this.sock.sendMessage(userJid, {
                text: '🔄 Downloading status media...'
            });
            
            // Download media
            const buffer = await downloadMediaMessage(quotedMsg, 'buffer', {}, {
                logger: this.logger
            });
            
            if (!buffer) throw new Error('Failed to download media');
            
            // Upload to Catbox
            const ext = this.getExtension(mediaType);
            const filename = `status_${Date.now()}.${ext}`;
            const { url, success } = await uploadToCatbox(buffer, filename);
            
            if (success && url) {
                const caption = this.extractText(quotedMsg.message);
                
                await this.sock.sendMessage(userJid, {
                    text: `✅ *Status saved!*\n\n📎 *Type:* ${mediaType}\n📝 *Caption:* ${caption || 'None'}\n🔗 *URL:* ${url}`
                });
            } else {
                throw new Error('Upload failed');
            }
            
        } catch (error) {
            this.logger.error(`Save status error: ${error.message}`);
            await this.sock.sendMessage(userJid, {
                text: `❌ Error saving status: ${error.message}`
            });
        }
    }

    // Get file extension from media type
    getExtension(mediaType) {
        const extensions = {
            'IMAGE': 'jpg',
            'VIDEO': 'mp4',
            'AUDIO': 'mp3',
            'STICKER': 'webp',
            'DOCUMENT': 'bin'
        };
        return extensions[mediaType] || 'bin';
    }
}

module.exports = StatusHandler;
