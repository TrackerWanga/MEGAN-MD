// megan/lib/features.js

const config = require('../config');

const fs = require('fs-extra');

const path = require('path');

const { downloadMediaMessage } = require('gifted-baileys');

const Uploader = require('./upload');

const { createNewsletterContext } = require('../helpers/newsletter');

class FeatureHelper {

    constructor(bot) {

        this.bot = bot;

        this.sock = bot.sock;

        this.logger = bot.logger;

        this.db = bot.db;

        this.presenceTimers = new Map();

        this.tempDir = path.join(__dirname, '../../temp');

        fs.ensureDirSync(this.tempDir);

        

        // Use config owner directly for sending to owner

        this.ownerJid = config.OWNER_NUMBER.includes('@') ? 

            config.OWNER_NUMBER : `${config.OWNER_NUMBER}@s.whatsapp.net`;

    }

    // ==================== TIME UTILITIES ====================

    getTimeBlock() {

        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return "morning";

        if (hour >= 12 && hour < 17) return "afternoon";

        if (hour >= 17 && hour < 20) return "evening";

        if (hour >= 20 || hour < 2) return "night";

        return "latenight";

    }

    formatTime(timestamp) {

        const date = new Date(timestamp);

        return date.toLocaleTimeString('en-US', { 

            hour12: true, 

            hour: '2-digit', 

            minute: '2-digit' 

        });

    }

    formatDate(timestamp) {

        const date = new Date(timestamp);

        return date.toLocaleDateString('en-GB', {

            day: '2-digit',

            month: '2-digit',

            year: 'numeric'

        });

    }

    // ==================== QUOTES ====================

    getQuotes() {

        return {

            morning: [

                "☀️ Rise and shine. Great things never came from comfort zones.",

                "🌅 Each morning we are born again. What we do today is what matters most.",

                "⚡ Start your day with determination, end it with satisfaction.",

                "🌞 The sun is up, the day is yours.",

                "📖 Every morning is a new page of your story. Make it count."

            ],

            afternoon: [

                "⏳ Keep going. You're halfway to greatness.",

                "🔄 Stay focused. The grind doesn't stop at noon.",

                "🏗️ Success is built in the hours nobody talks about.",

                "🔥 Push through. Champions are made in the middle of the day.",

                "⏰ Don't watch the clock, do what it does—keep going."

            ],

            evening: [

                "🛌 Rest is part of the process. Recharge wisely.",

                "🌇 Evening brings silence that speaks louder than daylight.",

                "✨ You did well today. Prepare for an even better tomorrow.",

                "🌙 Let the night settle in, but keep your dreams wide awake.",

                "🧠 Growth doesn't end at sunset. It sleeps with you."

            ],

            night: [

                "🌌 The night is silent, but your dreams are loud.",

                "⭐ Stars shine brightest in the dark. So can you.",

                "🧘‍♂️ Let go of the noise. Embrace the peace.",

                "✅ You made it through the day. Now dream big.",

                "🌠 Midnight thoughts are the blueprint of tomorrow's greatness."

            ],

            latenight: [

                "🕶️ While the world sleeps, the minds of legends wander.",

                "⏱️ Late nights teach the deepest lessons.",

                "🔕 Silence isn't empty—it's full of answers.",

                "✨ Creativity whispers when the world is quiet.",

                "🌌 Rest or reflect, but never waste the night."

            ]

        };

    }

    getRandomQuote() {

        const block = this.getTimeBlock();

        const quotes = this.getQuotes()[block];

        return quotes[Math.floor(Math.random() * quotes.length)];

    }

    // ==================== EMOJI UTILITIES ====================

    getEmojis() {

        return ['🔥', '✅', '❤️', '💯', '👍', '🙌', '👏', '🎉', '⭐', '💫', '✨', '⚡', '💪', '👑', '💎', '🔮', '🎯', '🏆', '💝', '💖'];

    }

    getRandomEmoji() {

        const emojis = this.getEmojis();

        return emojis[Math.floor(Math.random() * emojis.length)];

    }

    // ==================== AUTO REACT ====================

    async autoReact(emoji, msg) {

        try {

            await this.sock.sendMessage(msg.key.remoteJid, {

                react: { text: emoji, key: msg.key }

            });

        } catch (error) {

            this.logger.error(`AutoReact error: ${error.message}`);

        }

    }

    // ==================== ANTI LINK ====================

    isAnyLink(text) {

        const linkPattern = /https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+/gi;

        return linkPattern.test(text);

    }

    async handleAntiLink(msg, groupJid, sender) {

        try {

            const group = await this.db.getGroup(groupJid);

            if (!group || group.antilink === 'false') return false;

            const metadata = await this.sock.groupMetadata(groupJid);

            const isAdmin = metadata.participants.some(p => 

                p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')

            );

            

            if (isAdmin) return false;

            const body = msg.message.conversation || 

                        msg.message.extendedTextMessage?.text || 

                        msg.message.imageMessage?.caption || '';

            if (!body || !this.isAnyLink(body)) return false;

            // Delete the message

            await this.sock.sendMessage(groupJid, { delete: msg.key });

            const action = group.antilink;

            if (action === 'kick') {

                await this.sock.groupParticipantsUpdate(groupJid, [sender], 'remove');

                await this.sock.sendMessage(groupJid, {

                    text: `⚠️ @${sender.split('@')[0]} was kicked for sending a link!`,

                    mentions: [sender],

                    ...createNewsletterContext(sender, {

                        title: "Anti-Link System",

                        body: "Link Protection Active"

                    })

                });

            } else if (action === 'warn') {

                await this.sock.sendMessage(groupJid, {

                    text: `⚠️ @${sender.split('@')[0]} Links are not allowed! Warning issued.`,

                    mentions: [sender],

                    ...createNewsletterContext(sender, {

                        title: "Anti-Link System",

                        body: "Warning Issued"

                    })

                });

            } else if (action === 'delete') {

                await this.sock.sendMessage(groupJid, {

                    text: `⚠️ @${sender.split('@')[0]} Links are not allowed! Message deleted.`,

                    mentions: [sender],

                    ...createNewsletterContext(sender, {

                        title: "Anti-Link System",

                        body: "Message Deleted"

                    })

                });

            }

            return true;

        } catch (error) {

            this.logger.error(`AntiLink error: ${error.message}`);

            return false;

        }

    }

    // ==================== PROCESS MEDIA MESSAGE ====================

    async processMediaMessage(deletedMsg) {

        let mediaType = null;

        let mediaInfo = null;

        

        const mediaTypes = {

            imageMessage: 'image',

            videoMessage: 'video',

            audioMessage: 'audio',

            stickerMessage: 'sticker',

            documentMessage: 'document'

        };

        for (const [key, type] of Object.entries(mediaTypes)) {

            if (deletedMsg.message?.[key]) {

                mediaType = type;

                mediaInfo = deletedMsg.message[key];

                break;

            }

        }

        if (!mediaType || !mediaInfo) return null;

        // Try to download with retries

        let buffer = null;

        let attempts = 0;

        const maxAttempts = 3;

        

        while (attempts < maxAttempts && !buffer) {

            try {

                attempts++;

                buffer = await downloadMediaMessage(deletedMsg, 'buffer', {}, {

                    logger: console,

                    reuploadRequest: true

                });

                

                if (!buffer && attempts < maxAttempts) {

                    await new Promise(resolve => setTimeout(resolve, 500 * attempts));

                }

            } catch (error) {

                if (attempts < maxAttempts) {

                    await new Promise(resolve => setTimeout(resolve, 500 * attempts));

                }

            }

        }

        if (!buffer) return null;

        const extensions = {

            image: 'jpg',

            video: 'mp4',

            audio: mediaInfo.mimetype?.includes('mpeg') ? 'mp3' : 'ogg',

            sticker: 'webp',

            document: mediaInfo.fileName?.split('.').pop() || 'bin'

        };

        const ext = extensions[mediaType] || 'bin';

        const tempPath = path.join(this.tempDir, `deleted_${Date.now()}.${ext}`);

        await fs.writeFile(tempPath, buffer);

        

        const filename = `deleted_${Date.now()}.${ext}`;

        const uploadResult = await Uploader.uploadAuto(buffer, filename);

        

        return {

            path: tempPath,

            type: mediaType,

            caption: mediaInfo.caption || '',

            mimetype: mediaInfo.mimetype,

            fileName: mediaInfo.fileName || `${mediaType}_${Date.now()}.${ext}`,

            ptt: mediaInfo.ptt,

            url: uploadResult?.success ? uploadResult.url : null

        };

    }

    // ==================== ANTI DELETE ====================

    async handleAntiDelete(deletedMsg, key, deleter, sender) {

        try {

            const antiDelete = await this.db.getSetting('antidelete', 'on');

            if (antiDelete !== 'on') return;

            if (!deleter || !sender) return;

            const isGroup = key.remoteJid.endsWith('@g.us');

            

            const currentTime = this.formatTime(Date.now());

            const currentDate = this.formatDate(Date.now());

            const deleterShort = deleter.split('@')[0];

            const senderShort = sender.split('@')[0];

            

            let chatInfo = 'Private Chat';

            if (isGroup) {

                try {

                    const metadata = await this.sock.groupMetadata(key.remoteJid);

                    chatInfo = `Group: ${metadata.subject}`;

                } catch (e) {

                    chatInfo = 'Group Chat';

                }

            }

            const baseAlert = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                            `🚨 *DELETED MESSAGE DETECTED*\n\n` +

                            `👤 *Sent By:* @${senderShort}\n` +

                            `🗑️ *Deleted By:* @${deleterShort}\n` +

                            `⏰ *Time:* ${currentTime}\n` +

                            `📅 *Date:* ${currentDate}\n` +

                            `💬 *Chat:* ${chatInfo}\n\n`;

            // Handle text messages

            if (deletedMsg.message?.conversation) {

                const text = deletedMsg.message.conversation;

                await this.sock.sendMessage(this.ownerJid, {

                    text: `${baseAlert}📝 *Content:*\n${text}`,

                    mentions: [deleter, sender],

                    ...createNewsletterContext(sender, {

                        title: "Anti-Delete System",

                        body: "Deleted Text Message"

                    })

                });

            } 

            else if (deletedMsg.message?.extendedTextMessage?.text) {

                const text = deletedMsg.message.extendedTextMessage.text;

                await this.sock.sendMessage(this.ownerJid, {

                    text: `${baseAlert}📝 *Content:*\n${text}`,

                    mentions: [deleter, sender],

                    ...createNewsletterContext(sender, {

                        title: "Anti-Delete System",

                        body: "Deleted Text Message"

                    })

                });

            }

            // Handle media messages

            else {

                const media = await this.processMediaMessage(deletedMsg);

                if (media) {

                    const caption = `${baseAlert}📎 *Type:* ${media.type.toUpperCase()}\n` +

                                   (media.caption ? `📝 *Caption:* ${media.caption}\n\n` : '\n') +

                                   `🔗 *URL:* ${media.url}`;

                    if (media.type === 'image') {

                        await this.sock.sendMessage(this.ownerJid, {

                            image: fs.readFileSync(media.path),

                            caption: caption,

                            mentions: [deleter, sender],

                            ...createNewsletterContext(sender, {

                                title: "Anti-Delete System",

                                body: `Deleted ${media.type.toUpperCase()}`

                            })

                        });

                    } else if (media.type === 'video') {

                        await this.sock.sendMessage(this.ownerJid, {

                            video: fs.readFileSync(media.path),

                            caption: caption,

                            mentions: [deleter, sender],

                            ...createNewsletterContext(sender, {

                                title: "Anti-Delete System",

                                body: `Deleted ${media.type.toUpperCase()}`

                            })

                        });

                    } else {

                        const msgOptions = {

                            [media.type]: fs.readFileSync(media.path),

                            caption: caption,

                            mentions: [deleter, sender],

                            ...createNewsletterContext(sender, {

                                title: "Anti-Delete System",

                                body: `Deleted ${media.type.toUpperCase()}`

                            })

                        };

                        if (media.type === 'document') {

                            msgOptions.mimetype = media.mimetype;

                            msgOptions.fileName = media.fileName;

                        }

                        if (media.type === 'audio') {

                            msgOptions.ptt = media.ptt;

                            msgOptions.mimetype = media.mimetype;

                        }

                        await this.sock.sendMessage(this.ownerJid, msgOptions);

                    }

                    setTimeout(() => {

                        fs.unlink(media.path).catch(() => {});

                    }, 30000);

                } else {

                    await this.sock.sendMessage(this.ownerJid, {

                        text: `${baseAlert}📎 *Type:* UNKNOWN MEDIA\n❌ Could not retrieve content.`,

                        mentions: [deleter, sender],

                        ...createNewsletterContext(sender, {

                            title: "Anti-Delete System",

                            body: "Unknown Media"

                        })

                    });

                }

            }

        } catch (error) {

            this.logger.error(`AntiDelete error: ${error.message}`);

        }

    }

    // ==================== VIEW ONCE HANDLER ====================

    async handleViewOnce(message, from, sender) {

        try {

            const autoViewOnce = await this.db.getSetting('auto_view_once', 'off');

            if (autoViewOnce !== 'on') return;

            

            const mediaType = this.getMediaType(message.message);

            if (!mediaType) return;

            

            const senderShort = sender.split('@')[0];

            

            const buffer = await downloadMediaMessage(message, 'buffer', {}, {

                logger: this.logger,

                reuploadRequest: true

            });

            

            if (!buffer) return;

            

            const ext = this.getExtension(mediaType);

            const filename = `viewonce_${Date.now()}.${ext}`;

            const { url, success } = await Uploader.uploadAuto(buffer, filename);

            

            if (success && url) {

                await this.sock.sendMessage(this.ownerJid, {

                    text: `🔐 *VIEW ONCE MEDIA DETECTED* 🔐\n\n` +

                          `👤 *From:* @${senderShort}\n` +

                          `💬 *Chat:* ${from.includes('@g.us') ? 'Group' : 'Private'}\n` +

                          `📎 *Type:* ${mediaType}\n` +

                          `🔗 *URL:* ${url}\n` +

                          `⏰ *Time:* ${new Date().toLocaleTimeString()}`,

                    mentions: [sender],

                    ...createNewsletterContext(sender, {

                        title: "View-Once Capture",

                        body: "Media Saved"

                    })

                });

            }

        } catch (error) {

            this.logger.error(`View once error: ${error.message}`);

        }

    }

    // ==================== FIXED AUTO READ ====================

    async autoRead(msg) {

        try {

            // FIXED: Check for 'on' (from commands) or 'true' (backward compatibility)

            const setting = await this.db.getSetting('auto_read', 'off');

            

            // Log for debugging (remove after testing)

            console.log(`📖 Auto-read check: setting=${setting}, msgId=${msg.key?.id}`);

            

            if (setting === 'on' || setting === 'true') {

                if (msg.key && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {

                    await this.sock.readMessages([msg.key]);

                    this.logger.debug(`✅ Auto-read message: ${msg.key.id}`);

                }

            }

        } catch (error) {

            // Ignore read errors

        }

    }

    // ==================== ANTI CALL ====================

    async handleAntiCall(callData) {

        try {

            const antiCall = await this.db.getSetting('anticall', 'off');

            

            if (antiCall === 'off') return;

            for (const call of callData) {

                if (call.status === 'offer') {

                    const callMsg = await this.db.getSetting('anticall_msg', '📞 Calls are not allowed!');

                    

                    await this.sock.sendMessage(call.from, {

                        text: callMsg,

                        mentions: [call.from],

                        ...createNewsletterContext(call.from, {

                            title: "Anti-Call System",

                            body: "Call Blocked"

                        })

                    });

                    

                    await this.sock.rejectCall(call.id, call.from);

                    

                    if (antiCall === 'block') {

                        await this.sock.updateBlockStatus(call.from, 'block');

                    }

                }

            }

        } catch (error) {

            this.logger.error(`AntiCall error: ${error.message}`);

        }

    }

    // ==================== AUTO BIO ====================

    async updateAutoBio() {

        try {

            const setting = await this.db.getSetting('auto_bio', 'off');

            if (setting !== 'on' && setting !== 'true') return;

            const block = this.getTimeBlock();

            const date = this.formatDate(Date.now());

            const quote = this.getRandomQuote();

            const bio = `${config.BOT_NAME} Online • ${date} • ${quote}`.substring(0, 139);

            

            await this.sock.updateProfileStatus(bio);

            this.logger.debug('Auto bio updated');

        } catch (error) {

            this.logger.error(`AutoBio error: ${error.message}`);

        }

    }

    // ==================== PRESENCE ====================

    async setPresence(jid) {

        try {

            if (jid === 'status@broadcast') return;

            

            const isGroup = jid.endsWith('@g.us');

            

            let presence = await this.db.getSetting(

                isGroup ? 'presence_group' : 'presence_inbox',

                isGroup ? config.PRESENCE?.GROUP || 'typing' : config.PRESENCE?.INBOX || 'typing'

            );

            

            if (!presence || typeof presence !== 'string') {

                presence = isGroup ? 'typing' : 'typing';

            }

            let whatsappPresence;

            switch(presence.toLowerCase()) {

                case 'online': whatsappPresence = 'available'; break;

                case 'typing': whatsappPresence = 'composing'; break;

                case 'recording': whatsappPresence = 'recording'; break;

                case 'offline': whatsappPresence = 'unavailable'; break;

                default: whatsappPresence = 'available';

            }

            if (this.presenceTimers.has(jid)) {

                clearTimeout(this.presenceTimers.get(jid));

            }

            await this.sock.sendPresenceUpdate(whatsappPresence, jid);

            const timer = setTimeout(() => {

                this.presenceTimers.delete(jid);

            }, 15 * 60 * 1000);

            this.presenceTimers.set(jid, timer);

        } catch (error) {

            // Silent fail

        }

    }

    // Helper for media type

    getMediaType(message) {

        if (!message) return null;

        if (message.imageMessage) return 'IMAGE';

        if (message.videoMessage) return 'VIDEO';

        if (message.audioMessage) return 'AUDIO';

        if (message.stickerMessage) return 'STICKER';

        if (message.documentMessage) return 'DOCUMENT';

        return null;

    }

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

module.exports = FeatureHelper;