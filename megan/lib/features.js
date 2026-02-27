const config = require('../config');

const fs = require('fs-extra');

const path = require('path');

const { downloadMediaMessage } = require('gifted-baileys');

class FeatureHelper {

    constructor(bot) {

        this.bot = bot;

        this.sock = bot.sock;

        this.logger = bot.logger;

        this.db = bot.db;

        this.presenceTimers = new Map();

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

            const group = this.db.getGroup(groupJid);

            if (!group || group.antilink === 'false') return false;

            const metadata = await this.sock.groupMetadata(groupJid);

            const isAdmin = metadata.participants.some(p => 

                p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')

            );

            

            if (isAdmin) return false;

            const messageType = Object.keys(msg.message)[0];

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

                    mentions: [sender]

                });

            } else if (action === 'warn') {

                await this.sock.sendMessage(groupJid, {

                    text: `⚠️ @${sender.split('@')[0]} Links are not allowed! Warning issued.`,

                    mentions: [sender]

                });

            } else if (action === 'delete') {

                await this.sock.sendMessage(groupJid, {

                    text: `⚠️ @${sender.split('@')[0]} Links are not allowed! Message deleted.`,

                    mentions: [sender]

                });

            }

            return true;

        } catch (error) {

            this.logger.error(`AntiLink error: ${error.message}`);

            return false;

        }

    }

    // ==================== SIMPLIFIED ANTI DELETE (SEND TO OWNER ONLY) ====================

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

        try {

            const buffer = await downloadMediaMessage(deletedMsg, 'buffer', {}, {

                logger: console

            });

            

            const extensions = {

                image: 'jpg',

                video: 'mp4',

                audio: mediaInfo.mimetype?.includes('mpeg') ? 'mp3' : 'ogg',

                sticker: 'webp',

                document: mediaInfo.fileName?.split('.').pop() || 'bin'

            };

            

            const tempDir = path.join(__dirname, '../../temp');

            await fs.ensureDir(tempDir);

            

            const tempPath = path.join(tempDir, `deleted_${Date.now()}.${extensions[mediaType]}`);

            await fs.writeFile(tempPath, buffer);

            

            return {

                path: tempPath,

                type: mediaType,

                caption: mediaInfo.caption || '',

                mimetype: mediaInfo.mimetype,

                fileName: mediaInfo.fileName || `${mediaType}_${Date.now()}.${extensions[mediaType]}`,

                ptt: mediaInfo.ptt

            };

        } catch (error) {

            this.logger.error(`Media processing failed: ${error.message}`);

            return null;

        }

    }

    async handleAntiDelete(deletedMsg, key, deleter, sender) {

        try {

            // Check if anti-delete is enabled (simple on/off)

            const antiDelete = await this.db.getSetting('antidelete', 'off');

            

            if (antiDelete !== 'on') return;

            // Only send to owner

            const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;

            

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

                await this.sock.sendMessage(ownerJid, {

                    text: `${baseAlert}📝 *Content:*\n${text}`,

                    mentions: [deleter, sender]

                });

                this.logger.debug(`Anti-delete: Text message saved from ${senderShort}`);

            } 

            else if (deletedMsg.message?.extendedTextMessage?.text) {

                const text = deletedMsg.message.extendedTextMessage.text;

                await this.sock.sendMessage(ownerJid, {

                    text: `${baseAlert}📝 *Content:*\n${text}`,

                    mentions: [deleter, sender]

                });

                this.logger.debug(`Anti-delete: Extended text saved from ${senderShort}`);

            }

            // Handle media messages

            else {

                const media = await this.processMediaMessage(deletedMsg);

                if (media) {

                    const caption = `${baseAlert}📎 *Type:* ${media.type.toUpperCase()}\n` +

                                   (media.caption ? `📝 *Caption:* ${media.caption}` : '');

                    const msgOptions = {

                        [media.type]: fs.readFileSync(media.path),

                        caption: caption,

                        mentions: [deleter, sender]

                    };

                    if (media.type === 'document') {

                        msgOptions.mimetype = media.mimetype;

                        msgOptions.fileName = media.fileName;

                    }

                    if (media.type === 'audio') {

                        msgOptions.ptt = media.ptt;

                        msgOptions.mimetype = media.mimetype;

                    }

                    await this.sock.sendMessage(ownerJid, msgOptions);

                    // Clean up temp file

                    setTimeout(() => {

                        fs.unlink(media.path).catch(() => {});

                    }, 30000);

                    this.logger.debug(`Anti-delete: ${media.type} message saved from ${senderShort}`);

                } else {

                    // Unknown message type

                    await this.sock.sendMessage(ownerJid, {

                        text: `${baseAlert}📎 *Type:* UNKNOWN MEDIA\n❌ Could not retrieve content.`,

                        mentions: [deleter, sender]

                    });

                }

            }

        } catch (error) {

            this.logger.error(`AntiDelete error: ${error.message}`);

        }

    }

    // ==================== ANTI CALL ====================

    async handleAntiCall(callData) {

        try {

            const antiCall = await this.db.getSetting('anticall', 'false');

            

            if (antiCall === 'false') return;

            for (const call of callData) {

                if (call.status === 'offer') {

                    const callMsg = await this.db.getSetting('anticall_msg', config.MESSAGES.ANTICALL);

                    

                    await this.sock.sendMessage(call.from, {

                        text: callMsg,

                        mentions: [call.from]

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

            const setting = await this.db.getSetting('auto_bio', 'false');

            if (setting !== 'true') return;

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

            // Don't set presence for status broadcasts

            if (jid === 'status@broadcast') return;

            

            const isGroup = jid.endsWith('@g.us');

            

            let presence = await this.db.getSetting(

                isGroup ? 'presence_group' : 'presence_inbox',

                isGroup ? config.PRESENCE.GROUP : config.PRESENCE.INBOX

            );

            // Ensure presence is a string

            if (!presence || typeof presence !== 'string') {

                presence = isGroup ? config.PRESENCE.GROUP : config.PRESENCE.INBOX;

            }

            let whatsappPresence;

            switch(presence.toLowerCase()) {

                case 'online':

                    whatsappPresence = 'available';

                    break;

                case 'typing':

                    whatsappPresence = 'composing';

                    break;

                case 'recording':

                    whatsappPresence = 'recording';

                    break;

                case 'offline':

                    whatsappPresence = 'unavailable';

                    break;

                default:

                    whatsappPresence = 'available';

            }

            // Clear existing timer

            if (this.presenceTimers.has(jid)) {

                clearTimeout(this.presenceTimers.get(jid));

            }

            await this.sock.sendPresenceUpdate(whatsappPresence, jid);

            // Set timer to clear after 15 minutes

            const timer = setTimeout(() => {

                this.presenceTimers.delete(jid);

            }, 15 * 60 * 1000);

            this.presenceTimers.set(jid, timer);

        } catch (error) {

            // Silently ignore presence errors - they're not critical

        }

    }

    // ==================== AUTO READ ====================

    async autoRead(msg) {

        try {

            const setting = await this.db.getSetting('auto_read', 'false');

            if (setting !== 'true') return;

            if (msg.key && !msg.key.fromMe && msg.key.remoteJid !== 'status@broadcast') {

                await this.sock.readMessages([msg.key]);

            }

        } catch (error) {

            // Ignore read errors

        }

    }

}

module.exports = FeatureHelper;