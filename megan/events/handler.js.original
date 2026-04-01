// MEGAN-MD Event Handler - Complete Anti-Delete Fix

const {
    isJidGroup,
    isJidStatusBroadcast,
    downloadMediaMessage,
    areJidsSameUser
} = require('gifted-baileys');

const MessageHelper = require('../lib/message');
const config = require('../config');
const fs = require('fs-extra');
const path = require('path');
const Uploader = require('../lib/upload');
const axios = require('axios');
const OwnerManager = require('../helpers/OwnerManager');
const { initializeLidStore, getLidMapping, storeLidMapping } = require('../lib/groupCache');
const { resolveRealJid } = require('../lib/lidResolver');
const timeUtils = require('../lib/timeUtils');

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';

class EventHandler {
    constructor(bot, logger, cache, features) {
        this.bot = bot;
        this.sock = bot.sock;
        this.logger = logger;
        this.cache = cache;
        this.features = features;
        this.tempDir = path.join(__dirname, '../../temp');
        this.presenceTimers = new Map();
        this.ownerManager = new OwnerManager();
        fs.ensureDirSync(this.tempDir);
    }

    async initOwnerManager(db, ownerJid, ownerLid) {
        await this.ownerManager.initialize(db, ownerJid, ownerLid);
    }

    async initLidStore() {
        if (this.sock) {
            const count = await initializeLidStore(this.sock);
            this.logger.info(`📊 LID store initialized with ${count} mappings`);
        }
    }

    async isOwner(jid) {
        if (!jid) return false;
        const resolvedJid = await resolveRealJid(this.sock, jid);
        const phoneNumber = resolvedJid.split('@')[0].split(':')[0].replace(/\D/g, '');
        const ownerNumber = config.OWNER_NUMBER.replace(/\D/g, '');

        if (phoneNumber === ownerNumber) return true;
        if (this.ownerManager && this.ownerManager.initialized) {
            return this.ownerManager.isOwner(resolvedJid);
        }
        if (this.bot.ownerJid && areJidsSameUser(resolvedJid, this.bot.ownerJid)) return true;
        if (this.bot.ownerLid && areJidsSameUser(resolvedJid, this.bot.ownerLid)) return true;
        return false;
    }

    // ==================== BUTTON HELPER ====================
    async sendButtonMessage(sock, from, text, quotedMsg, buttons = null) {
        const { sendButtons } = require('gifted-btns');
        
        const finalButtons = (buttons && buttons.length > 0) ? buttons : [
            { id: `${config.PREFIX}menu`, text: '📋 Menu' },
            { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
        ];
        
        try {
            return await sendButtons(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: text,
                footer: '> created by wanga',
                image: { url: BOT_LOGO },
                buttons: finalButtons
            }, { quoted: quotedMsg });
        } catch (error) {
            await sock.sendMessage(from, { text: text }, { quoted: quotedMsg });
        }
    }

    // ==================== CONVERSATION HELPERS ====================
    async setActiveConversation(chatId, command, context = {}) {
        if (this.bot.setActiveConversation) {
            this.bot.setActiveConversation(chatId, command, context);
        }
    }

    async clearActiveConversation(chatId) {
        if (this.bot.clearActiveConversation) {
            this.bot.clearActiveConversation(chatId);
        }
    }

    async sendModeIndicator(chatId, command, isActive = true) {
        const modeMessages = {
            'gpt': '🤖 *AI MODE ACTIVE*\nSend messages without prefix to continue chatting!\nType *!end* or *.end* to stop.',
            'megan': '🤖 *AI MODE ACTIVE*\nSend messages without prefix to continue chatting!\nType *!end* or *.end* to stop.',
            'gemini': '🤖 *AI MODE ACTIVE*\nSend messages without prefix to continue chatting!\nType *!end* or *.end* to stop.',
            'play': '🎵 *PLAY MODE ACTIVE*\nSend song names without prefix to download!\nType *!end* or *.end* to stop.',
            'imagine': '🎨 *IMAGE MODE ACTIVE*\nSend prompts without prefix to generate images!\nType *!end* or *.end* to stop.',
            'google': '🔍 *SEARCH MODE ACTIVE*\nSend search queries without prefix!\nType *!end* or *.end* to stop.',
            'youtube': '🎬 *YOUTUBE MODE ACTIVE*\nSend video names without prefix to search!\nType *!end* or *.end* to stop.',
            'weather': '🌤️ *WEATHER MODE ACTIVE*\nSend city names without prefix!\nType *!end* or *.end* to stop.'
        };

        const defaultMsg = `✨ *${command.toUpperCase()} MODE ACTIVE*\nSend messages without prefix to continue!\nType *!end* or *.end* to stop.`;

        if (isActive && this.sock) {
            await this.sock.sendMessage(chatId, { text: modeMessages[command] || defaultMsg });
        }
    }

    async handleEndCommand(chatId) {
        const active = this.bot.getActiveConversation?.(chatId);
        if (active) {
            await this.clearActiveConversation(chatId);
            await this.sock.sendMessage(chatId, {
                text: `✅ *${active.command.toUpperCase()} mode ended*\n\nYou can start a new command anytime.`
            });
            return true;
        }
        return false;
    }

    // ==================== IMPROVED PROCESS MEDIA MESSAGE ====================
    async processMediaMessage(deletedMsg, maxRetries = 3) {
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

        let buffer = null;
        let attempts = 0;

        while (attempts < maxRetries && !buffer) {
            try {
                attempts++;
                buffer = await downloadMediaMessage(deletedMsg, 'buffer', {}, {
                    logger: console,
                    reuploadRequest: true
                });
                
                if (!buffer && attempts < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                }
            } catch (error) {
                console.log(`Download attempt ${attempts} failed: ${error.message}`);
                if (attempts < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
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
        const filename = `deleted_${Date.now()}.${ext}`;
        const uploadResult = await Uploader.uploadAuto(buffer, filename);

        return {
            buffer: buffer,
            type: mediaType,
            caption: mediaInfo.caption || '',
            mimetype: mediaInfo.mimetype,
            fileName: mediaInfo.fileName || filename,
            ptt: mediaInfo.ptt,
            url: uploadResult?.success ? uploadResult.url : null,
            uploadSuccess: uploadResult?.success || false,
            uploadService: uploadResult?.service || null
        };
    }

    // ==================== IMPROVED ANTI-DELETE ====================
    async handleAntiDelete(deletedMsg, key, deleter, sender) {
        try {
            const antiDelete = await this.bot.db?.getSetting('antidelete', 'on');
            if (antiDelete !== 'on') return;
            if (!this.bot.ownerJid) return;

            const resolvedDeleter = await resolveRealJid(this.sock, deleter);
            const resolvedSender = await resolveRealJid(this.sock, sender);
            const isGroup = key.remoteJid.endsWith('@g.us');
            const currentTime = await this.getFormattedTime(Date.now());
            const currentDate = await this.getFormattedDate(Date.now());
            const deleterShort = resolvedDeleter.split('@')[0];
            const senderShort = resolvedSender.split('@')[0];

            let senderName = senderShort, deleterName = deleterShort;
            try {
                if (resolvedSender) {
                    const contact = await this.sock.getContact(resolvedSender);
                    if (contact?.name) senderName = contact.name;
                }
                if (resolvedDeleter) {
                    const contact = await this.sock.getContact(resolvedDeleter);
                    if (contact?.name) deleterName = contact.name;
                }
            } catch (e) {}

            let chatInfo = 'Private Chat', groupName = '';
            if (isGroup) {
                try {
                    const metadata = await this.sock.groupMetadata(key.remoteJid);
                    groupName = metadata.subject;
                    chatInfo = `Group: ${groupName}`;
                } catch (e) {}
            }

            const baseAlert = `🚨 *DELETED MESSAGE DETECTED*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `_👤 Sent By:_ @${senderName} (@${senderShort})\n` +
                `_🗑️ Deleted By:_ @${deleterName} (@${deleterShort})\n` +
                `_⏰ Time:_ ${currentTime}\n` +
                `_📅 Date:_ ${currentDate}\n` +
                `_💬 Chat:_ ${chatInfo}\n\n`;

            // Handle text messages
            const textContent = deletedMsg.message?.conversation || 
                               deletedMsg.message?.extendedTextMessage?.text ||
                               deletedMsg.message?.imageMessage?.caption ||
                               deletedMsg.message?.videoMessage?.caption;

            if (textContent && typeof textContent === 'string' && textContent.length > 0) {
                const text = textContent.length > 2000 ? textContent.substring(0, 2000) + '...' : textContent;
                
                const alertText = `${baseAlert}📝 *Content:*\n${text}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;
                
                await this.sendButtonMessage(this.sock, this.bot.ownerJid, alertText, null);
                
                await this.bot.db?.logDeletedMessage({
                    messageId: key.id,
                    chatJid: key.remoteJid,
                    senderJid: resolvedSender,
                    deleterJid: resolvedDeleter,
                    messageType: 'text',
                    content: text
                });
                return;
            }
            
            // Handle media messages
            const media = await this.processMediaMessage(deletedMsg);
            
            if (media && media.buffer) {
                let caption = `${baseAlert}📎 *Type:* ${media.type.toUpperCase()}\n`;
                if (media.caption) caption += `_📝 Caption:_ ${media.caption}\n\n`;
                if (media.url) {
                    caption += `🔗 *Backup Link:* ${media.url}\n`;
                    if (media.uploadService) caption += `📡 *Service:* ${media.uploadService}\n`;
                }
                caption += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

                const buttons = [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ];
                
                if (media.url) {
                    buttons.unshift({
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({ display_text: '📋 Copy URL', copy_code: media.url })
                    });
                }

                if (media.type === 'image') {
                    await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                    await this.sock.sendMessage(this.bot.ownerJid, {
                        image: media.buffer,
                        caption: caption
                    });
                } else if (media.type === 'video') {
                    await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                    await this.sock.sendMessage(this.bot.ownerJid, {
                        video: media.buffer,
                        caption: caption
                    });
                } else if (media.type === 'audio') {
                    await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                    await this.sock.sendMessage(this.bot.ownerJid, {
                        audio: media.buffer,
                        mimetype: 'audio/mpeg',
                        ptt: media.ptt || false,
                        caption: caption
                    });
                } else {
                    await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                    await this.sock.sendMessage(this.bot.ownerJid, {
                        document: media.buffer,
                        fileName: media.fileName,
                        mimetype: media.mimetype,
                        caption: caption
                    });
                }

                await this.bot.db?.logDeletedMessage({
                    messageId: key.id,
                    chatJid: key.remoteJid,
                    senderJid: resolvedSender,
                    deleterJid: resolvedDeleter,
                    messageType: media.type,
                    content: media.caption,
                    mediaUrl: media.url
                });
            } else if (media && media.url) {
                const caption = `${baseAlert}📎 *Type:* ${media.type?.toUpperCase() || 'MEDIA'}\n` +
                    (media.caption ? `_📝 Caption:_ ${media.caption}\n\n` : '\n') +
                    `🔗 *URL:* ${media.url}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;
                
                await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, [
                    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy URL', copy_code: media.url }) },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]);
            } else {
                const caption = `${baseAlert}📎 *Type:* MEDIA\n❌ Could not retrieve content.\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;
                await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null);
            }
        } catch (error) {
            this.logger.error(`AntiDelete error: ${error.message}`);
        }
    }

    // ==================== IMPROVED STATUS DELETE HANDLER ====================
    async handleStatusDelete(deletedMsg, key, deleter) {
        try {
            const antiDeleteStatus = await this.bot.db?.getSetting('status_anti_delete', 'on');
            if (antiDeleteStatus !== 'on') return;

            const sender = await resolveRealJid(this.sock, deletedMsg.key?.participant || deletedMsg.key?.remoteJid);
            const deleterResolved = await resolveRealJid(this.sock, deleter);
            const senderShort = sender?.split('@')[0] || 'Unknown';
            const deleterShort = deleterResolved?.split('@')[0] || 'Unknown';
            const text = this.extractText(deletedMsg.message);
            const mediaType = this.getMediaType(deletedMsg.message);
            const currentTime = await this.getFormattedTime(Date.now());
            const currentDate = await this.getFormattedDate(Date.now());

            if (!this.bot.ownerJid) return;

            const baseAlert = `📱 *STATUS DELETED*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `_👤 From:_ @${senderShort}\n` +
                `_🗑️ Deleted by:_ @${deleterShort}\n` +
                `_⏰ Time:_ ${currentTime}\n` +
                `_📅 Date:_ ${currentDate}\n\n`;

            // Handle text status
            if (text && !mediaType) {
                const caption = `${baseAlert}📝 *Content:*\n${text}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;
                await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null);
                return;
            }

            // Try to recover media
            if (mediaType) {
                const media = await this.processMediaMessage(deletedMsg);
                
                if (media && media.buffer) {
                    let caption = `${baseAlert}📎 *Type:* ${mediaType.toUpperCase()}\n`;
                    if (text) caption += `_📝 Caption:_ ${text}\n\n`;
                    if (media.url) {
                        caption += `🔗 *Backup Link:* ${media.url}\n`;
                        if (media.uploadService) caption += `📡 *Service:* ${media.uploadService}\n`;
                    }
                    caption += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

                    const buttons = [
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ];
                    
                    if (media.url) {
                        buttons.unshift({
                            name: 'cta_copy',
                            buttonParamsJson: JSON.stringify({ display_text: '📋 Copy URL', copy_code: media.url })
                        });
                    }

                    if (mediaType === 'image') {
                        await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                        await this.sock.sendMessage(this.bot.ownerJid, {
                            image: media.buffer,
                            caption: caption
                        });
                    } else if (mediaType === 'video') {
                        await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                        await this.sock.sendMessage(this.bot.ownerJid, {
                            video: media.buffer,
                            caption: caption
                        });
                    } else if (mediaType === 'audio') {
                        await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                        await this.sock.sendMessage(this.bot.ownerJid, {
                            audio: media.buffer,
                            mimetype: 'audio/mpeg',
                            ptt: false,
                            caption: caption
                        });
                    } else {
                        await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, buttons);
                        await this.sock.sendMessage(this.bot.ownerJid, {
                            document: media.buffer,
                            fileName: media.fileName,
                            mimetype: media.mimetype,
                            caption: caption
                        });
                    }
                    return;
                } else if (media && media.url) {
                    const caption = `${baseAlert}📎 *Type:* ${mediaType.toUpperCase()}\n` +
                        (text ? `_📝 Caption:_ ${text}\n\n` : '\n') +
                        `🔗 *URL:* ${media.url}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;
                    
                    await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null, [
                        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy URL', copy_code: media.url }) },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]);
                    return;
                }
            }

            // Fallback
            const caption = `${baseAlert}${text ? `_📝 Content:_ ${text}\n\n` : '_📎 No content recovered_\n\n'}_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;
            await this.sendButtonMessage(this.sock, this.bot.ownerJid, caption, null);
            
        } catch (error) {
            this.logger.error(`Status delete error: ${error.message}`);
        }
    }

    // ==================== BUTTON RESPONSE HANDLER ====================
    async handleButtonResponse(msg, from, sender) {
        try {
            const templateButton = msg.message?.templateButtonReplyMessage;
            const buttonsResponse = msg.message?.buttonsResponseMessage;
            const interactiveResponse = msg.message?.interactiveResponseMessage?.nativeFlowResponseMessage;

            let buttonId = null;
            let buttonText = null;

            if (templateButton) {
                buttonId = templateButton.selectedId;
                buttonText = templateButton.selectedDisplayText;
                this.logger.info(`🔘 Template button clicked: ID=${buttonId}, Text=${buttonText}`);
            } else if (buttonsResponse) {
                buttonId = buttonsResponse.selectedButtonId;
                buttonText = buttonsResponse.selectedDisplayText;
                this.logger.info(`🔘 Buttons response: ID=${buttonId}, Text=${buttonText}`);
            } else if (interactiveResponse) {
                buttonId = interactiveResponse.params?.id;
                buttonText = interactiveResponse.params?.display_text;
                this.logger.info(`🔘 Interactive response: ID=${buttonId}, Text=${buttonText}`);
            }

            if (!buttonId && !buttonText) return false;

            const buttonToCommandMap = {
                '🤖 AI': 'aimenu', 'AI': 'aimenu',
                '🎨 AI Image': 'imagemen', 'AI Image': 'imagemen',
                '⬇️ Downloader': 'downloadhelp', 'Downloader': 'downloadhelp',
                '👥 Group': 'grouphelp', 'Group': 'grouphelp',
                '🎵 Media': 'media', 'Media': 'media',
                '🔍 Search': 'searchhelp', 'Search': 'searchhelp',
                '🛠️ Tools': 'tools', 'Tools': 'tools',
                '⚙️ Features': 'features', 'Features': 'features',
                '📋 Menu': 'menu', 'Menu': 'menu',
                '◀️ Back': 'menu', 'Back': 'menu',
                '📢 Channel': 'channel', 'Channel': 'channel'
            };

            let commandToExecute = null;
            let args = [];

            if (buttonId) {
                if (buttonId.startsWith(config.PREFIX)) {
                    commandToExecute = buttonId.slice(config.PREFIX.length);
                } else if (this.bot.commands.has(buttonId)) {
                    commandToExecute = buttonId;
                } else if (this.bot.commands.has(buttonId.toLowerCase())) {
                    commandToExecute = buttonId.toLowerCase();
                }
            }

            if (!commandToExecute && buttonText) {
                const cleanText = buttonText.replace(/[^\w\s]/g, '').trim().toLowerCase();
                const mappedCommand = buttonToCommandMap[buttonText] || buttonToCommandMap[cleanText];
                
                if (mappedCommand && this.bot.commands.has(mappedCommand)) {
                    commandToExecute = mappedCommand;
                }
                
                if (!commandToExecute && this.bot.commands.has(buttonText.toLowerCase())) {
                    commandToExecute = buttonText.toLowerCase();
                }
            }

            if (!commandToExecute && buttonText && buttonText.includes('🤖')) {
                const aiCommandMap = {
                    'Megan': 'megan', 'Gemini': 'gemini', 'GPT': 'gpt',
                    'DeepSeek': 'deepseek', 'Mistral': 'mistral', 'DuckAI': 'duckai',
                    'CodeLlama': 'codellama', 'Teacher': 'teacher',
                    'BibleAI': 'bibleai', 'Gita': 'gita'
                };
                const aiName = buttonText.replace('🤖', '').trim();
                if (aiCommandMap[aiName]) {
                    commandToExecute = aiCommandMap[aiName];
                    args = [];
                }
            }

            if (!commandToExecute && buttonText && (buttonText.includes('🎨') || buttonText.includes('✨'))) {
                const imageCommandMap = {
                    'Image Search': 'image', 'Bing Images': 'images', 'Pinterest': 'pinterest',
                    'Wallpaper': 'wallpaper', 'Imagine AI': 'imagine', 'Create Logo': 'create',
                    'Beautiful': 'beautiful', 'Circle Image': 'circle', 'Remove BG': 'removebg',
                    'TextPro': 'textpro'
                };
                const imageName = buttonText.replace(/[🎨✨]/g, '').trim();
                if (imageCommandMap[imageName]) {
                    commandToExecute = imageCommandMap[imageName];
                }
            }

            if (commandToExecute) {
                const cmd = this.bot.commands.get(commandToExecute);
                if (cmd) {
                    const resolvedSender = await resolveRealJid(this.sock, sender);
                    const isOwner = await this.isOwner(resolvedSender);
                    const isGroup = isJidGroup(from);

                    this.logger.info(`🎯 Executing command from button: ${commandToExecute}`);

                    const context = {
                        msg, from, sender: resolvedSender, isOwner, isGroup, args,
                        command: commandToExecute, text: buttonText || commandToExecute,
                        bot: this.bot, sock: this.sock, buttons: this.bot.buttons,
                        reply: MessageHelper.createReply(this.sock, from, msg),
                        react: MessageHelper.createReact(this.sock, msg.key),
                        db: this.bot.db, logger: this.logger, cache: this.cache,
                        ownerManager: this.ownerManager,
                        resolveRealJid: (jid) => resolveRealJid(this.sock, jid),
                        getFormattedTime: () => this.getFormattedTime(Date.now()),
                        getFormattedDate: () => this.getFormattedDate(Date.now()),
                        quoted: this.buildQuotedMessage(msg)
                    };
                    
                    await cmd.execute(context);
                    return true;
                }
            }

            this.logger.info(`⚠️ No command found for button: ID=${buttonId}, Text=${buttonText}`);
            return false;
            
        } catch (error) {
            this.logger.error(`Button response error: ${error.message}`);
            return false;
        }
    }

    // ==================== EXISTING METHODS ====================
    buildQuotedMessage(msg) {
        try {
            const contextInfo = msg.message?.extendedTextMessage?.contextInfo ||
                               msg.message?.imageMessage?.contextInfo ||
                               msg.message?.videoMessage?.contextInfo ||
                               msg.message?.audioMessage?.contextInfo ||
                               msg.message?.documentMessage?.contextInfo;

            if (!contextInfo) return null;
            const quotedMessage = contextInfo.quotedMessage;
            if (!quotedMessage) return null;

            const quotedStanzaId = contextInfo.stanzaId;
            const quotedParticipant = contextInfo.participant || msg.key.participant;

            return {
                key: {
                    remoteJid: msg.key.remoteJid,
                    id: quotedStanzaId,
                    participant: quotedParticipant,
                    fromMe: false
                },
                message: quotedMessage,
                participant: quotedParticipant,
                pushName: contextInfo.pushName || msg.pushName,
                sender: quotedParticipant || msg.key.remoteJid
            };
        } catch (error) {
            return null;
        }
    }

    async getFormattedTime(timestamp) {
        return await timeUtils.formatTime12h(timestamp, this.bot.db);
    }

    async getFormattedDate(timestamp) {
        return await timeUtils.formatDate(timestamp, this.bot.db);
    }

    getTimeBlock() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 20) return "evening";
        if (hour >= 20 || hour < 2) return "night";
        return "latenight";
    }

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

    getEmojis() {
        return ['🔥', '✅', '❤️', '💯', '👍', '🙌', '👏', '🎉', '⭐', '💫', '✨', '⚡', '💪', '👑', '💎', '🔮', '🎯', '🏆', '💝', '💖'];
    }

    getRandomEmoji() {
        const emojis = this.getEmojis();
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    extractText(message) {
        if (!message) return '';
        if (message.conversation) return message.conversation;
        if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
        if (message.imageMessage?.caption) return message.imageMessage.caption;
        if (message.videoMessage?.caption) return message.videoMessage.caption;
        if (message.documentMessage?.caption) return message.documentMessage.caption;
        return '';
    }

    getMediaType(message) {
        if (!message) return null;
        if (message.imageMessage) return 'image';
        if (message.videoMessage) return 'video';
        if (message.audioMessage) return 'audio';
        if (message.stickerMessage) return 'sticker';
        if (message.documentMessage) return 'document';
        return null;
    }

    getExtension(mediaType) {
        const extensions = { 'image': 'jpg', 'video': 'mp4', 'audio': 'mp3', 'sticker': 'webp', 'document': 'bin' };
        return extensions[mediaType] || 'bin';
    }

    async markAsRead(key) {
        try {
            await this.sock.readMessages([key]);
        } catch (error) {}
    }

    async autoReactToStatus(message, sender) {
        try {
            const emojisString = await this.bot.db?.getSetting('status_react_emojis', '💛,❤️,💜,💙,👍,🔥');
            const emojis = emojisString.split(',').map(e => e.trim());
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await this.sock.sendMessage('status@broadcast', { react: { key: message.key, text: randomEmoji } });
        } catch (error) {}
    }

    async autoReplyToStatus(message, sender) {
        try {
            const replyText = await this.bot.db?.getSetting('status_reply_text', '✅ Status viewed via Megan-MD');
            await this.sock.sendMessage(sender, { text: replyText });
        } catch (error) {}
    }

    async downloadAndSaveStatus(message, sender, text, mediaType) {
        try {
            const buffer = await downloadMediaMessage(message, 'buffer', {}, { logger: console });
            if (!buffer) return;
            const ext = this.getExtension(mediaType);
            const filename = `status_${Date.now()}.${ext}`;
            const { url, success } = await Uploader.uploadAuto(buffer, filename);
            if (success && url && this.bot.ownerJid) {
                const senderShort = sender.split('@')[0];
                const currentTime = await this.getFormattedTime(Date.now());
                await this.sock.sendMessage(this.bot.ownerJid, {
                    text: `📥 *STATUS DOWNLOADED*\n\n👤 *From:* @${senderShort}\n📎 *Type:* ${mediaType}\n📝 *Caption:* ${text || 'None'}\n🔗 *URL:* ${url}\n⏰ *Time:* ${currentTime}`,
                    mentions: [sender]
                });
            }
        } catch (error) {}
    }

    async handleViewOnce(message, from, sender) {
        try {
            const autoViewOnce = await this.bot.db?.getSetting('autoviewonce', 'on');
            if (autoViewOnce !== 'on') return;

            const msgContent = message.message;
            let viewOnceContent = null;
            let mediaType = null;

            if (msgContent.imageMessage?.viewOnce || msgContent.videoMessage?.viewOnce || msgContent.audioMessage?.viewOnce) {
                mediaType = Object.keys(msgContent).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t)));
                if (mediaType) viewOnceContent = { [mediaType]: msgContent[mediaType] };
            } else if (msgContent.viewOnceMessage) {
                viewOnceContent = msgContent.viewOnceMessage.message;
                mediaType = viewOnceContent ? Object.keys(viewOnceContent).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))) : null;
            } else if (msgContent.viewOnceMessageV2) {
                viewOnceContent = msgContent.viewOnceMessageV2.message;
                mediaType = viewOnceContent ? Object.keys(viewOnceContent).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))) : null;
            } else if (msgContent.viewOnceMessageV2Extension) {
                viewOnceContent = msgContent.viewOnceMessageV2Extension.message;
                mediaType = viewOnceContent ? Object.keys(viewOnceContent).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))) : null;
            }

            if (!viewOnceContent || !mediaType || !viewOnceContent[mediaType]) return;

            const resolvedSender = await resolveRealJid(this.sock, sender);
            const senderNum = resolvedSender.split('@')[0].split(':')[0];
            const botName = await this.bot.db.getSetting('bot_name', 'MEGAN-MD');
            const mediaMessage = { ...viewOnceContent[mediaType], viewOnce: false };
            const buffer = await downloadMediaMessage({ message: viewOnceContent[mediaType] }, 'buffer', {}, { logger: console, reuploadRequest: true });
            if (!buffer) return;

            let ext = 'bin';
            const type = mediaType.toLowerCase();
            if (type.includes('image')) ext = 'jpg';
            else if (type.includes('video')) ext = 'mp4';
            else if (type.includes('audio')) ext = 'mp3';

            const filename = `viewonce_${Date.now()}.${ext}`;
            const { url, success } = await Uploader.uploadAuto(buffer, filename);
            if (!success || !url) return;

            const originalCaption = mediaMessage.caption || '';
            const currentTime = await this.getFormattedTime(Date.now());
            const caption = `👁️ *VIEW ONCE REVEALED*\n\n📤 *From:* @${senderNum}\n${originalCaption ? `📝 *Caption:* ${originalCaption}\n` : ''}🔗 *Link:* ${url}\n⏰ *Time:* ${currentTime}\n\n> _Revealed by ${botName}_`;

            if (this.bot.ownerJid) {
                if (type.includes('image')) {
                    await this.sock.sendMessage(this.bot.ownerJid, { image: buffer, caption: caption, mentions: [`${senderNum}@s.whatsapp.net`] });
                } else if (type.includes('video')) {
                    await this.sock.sendMessage(this.bot.ownerJid, { video: buffer, caption: caption, mentions: [`${senderNum}@s.whatsapp.net`] });
                } else if (type.includes('audio')) {
                    await this.sock.sendMessage(this.bot.ownerJid, { audio: buffer, ptt: true, mimetype: "audio/mp4", caption: caption, mentions: [`${senderNum}@s.whatsapp.net`] });
                }
            }
        } catch (error) {}
    }

    isAnyLink(text) {
        const linkPattern = /https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+/gi;
        return linkPattern.test(text);
    }

    async handleAntiLink(msg, groupJid, sender) {
        try {
            const group = await this.bot.db?.getGroup(groupJid);
            if (!group || group.antilink === 'off') return false;

            const metadata = await this.sock.groupMetadata(groupJid);
            const isAdmin = metadata.participants.some(p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin'));
            if (isAdmin) return false;

            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || '';
            if (!body || !this.isAnyLink(body)) return false;

            await this.sock.sendMessage(groupJid, { delete: msg.key });
            const action = group.antilink;

            if (action === 'kick') {
                await this.sock.groupParticipantsUpdate(groupJid, [sender], 'remove');
                await this.sock.sendMessage(groupJid, { text: `⚠️ @${sender.split('@')[0]} was kicked for sending a link!`, mentions: [sender] });
            } else if (action === 'warn') {
                await this.sock.sendMessage(groupJid, { text: `⚠️ @${sender.split('@')[0]} Links are not allowed! Warning issued.`, mentions: [sender] });
                await this.bot.db?.addWarning(sender, groupJid, 'Sent link', 'auto');
            } else if (action === 'delete') {
                await this.sock.sendMessage(groupJid, { text: `⚠️ @${sender.split('@')[0]} Links are not allowed! Message deleted.`, mentions: [sender] });
            }
            return true;
        } catch (error) { return false; }
    }

    async handleAntiCall(callData) {
        try {
            const antiCall = await this.bot.db?.getSetting('anticall', 'false');
            if (antiCall === 'false') return;
            for (const call of callData) {
                if (call.status === 'offer') {
                    const callMsg = await this.bot.db?.getSetting('anticall_msg', '📞 Calls are not allowed!');
                    await this.sock.sendMessage(call.from, { text: callMsg });
                    await this.sock.rejectCall(call.id, call.from);
                    if (antiCall === 'block') { await this.sock.updateBlockStatus(call.from, 'block'); }
                }
            }
        } catch (error) {}
    }

    async updateAutoBio() {
        try {
            const setting = await this.bot.db?.getSetting('auto_bio', 'false');
            if (setting !== 'true') return;
            const block = this.getTimeBlock();
            const date = await this.getFormattedDate(Date.now());
            const quote = this.getRandomQuote();
            const bio = `${config.BOT_NAME} Online • ${date} • ${quote}`.substring(0, 139);
            await this.sock.updateProfileStatus(bio);
        } catch (error) {}
    }

    async setPresence(jid) {
        try {
            if (jid === 'status@broadcast') return;
            const isGroup = jid.endsWith('@g.us');
            let presence = await this.bot.db?.getSetting(isGroup ? 'presence_group' : 'presence_dm', isGroup ? 'typing' : 'typing');
            if (!presence || typeof presence !== 'string') presence = isGroup ? 'typing' : 'typing';
            let whatsappPresence;
            switch(presence.toLowerCase()) {
                case 'online': whatsappPresence = 'available'; break;
                case 'typing': whatsappPresence = 'composing'; break;
                case 'recording': whatsappPresence = 'recording'; break;
                default: whatsappPresence = 'available';
            }
            if (this.presenceTimers.has(jid)) clearTimeout(this.presenceTimers.get(jid));
            await this.sock.sendPresenceUpdate(whatsappPresence, jid);
            const timer = setTimeout(() => this.presenceTimers.delete(jid), 15 * 60 * 1000);
            this.presenceTimers.set(jid, timer);
        } catch (error) {}
    }

    async autoRead(msg) {
        try {
            const setting = await this.bot.db?.getSetting('autoread', 'off');
            if (setting !== 'on') return;
            if (!msg.key) return;
            if (msg.key.fromMe) return;
            if (msg.key.remoteJid === 'status@broadcast') return;
            await this.sock.readMessages([msg.key]);
        } catch (error) {}
    }

    async handleAutoTyping(msg, from, isGroup) {
        try {
            const setting = await this.bot.db?.getSetting(isGroup ? 'autotyping_group' : 'autotyping_dm', 'off');
            if (setting !== 'on') return;
            if (msg.key.fromMe) return;
            await this.sock.sendPresenceUpdate('composing', from);
        } catch (error) {}
    }

    async handleAutoRecording(msg, from, isGroup) {
        try {
            const setting = await this.bot.db?.getSetting(isGroup ? 'autorecording_group' : 'autorecording_dm', 'off');
            if (setting !== 'on') return;
            if (msg.key.fromMe) return;
            await this.sock.sendPresenceUpdate('recording', from);
        } catch (error) {}
    }

    // ==================== COMMAND HANDLER ====================
    async handleCommand(msg, text, from, sender, isGroup) {
        const parsed = MessageHelper.parseCommand(text, config.PREFIX);
        if (!parsed) return;

        const { name: commandName, args, fullText } = parsed;
        const resolvedSender = await resolveRealJid(this.sock, sender);
        const isOwner = await this.isOwner(resolvedSender);

        const mode = await this.bot.db?.getSetting('mode', 'public');
        if (mode === 'private' && !isOwner) {
            return;
        }

        const quoted = this.buildQuotedMessage(msg);

        let cmd = this.bot.commands.get(commandName);
        if (!cmd && this.bot.aliases.has(commandName)) {
            cmd = this.bot.commands.get(this.bot.aliases.get(commandName));
        }

        if (cmd) {
            try {
                const context = {
                    msg, from, sender: resolvedSender, isGroup, args,
                    command: commandName, text: fullText,
                    bot: this.bot, sock: this.sock,
                    buttons: this.bot.buttons,
                    reply: MessageHelper.createReply(this.sock, from, msg),
                    react: MessageHelper.createReact(this.sock, msg.key),
                    isOwner,
                    uploader: Uploader,
                    db: this.bot.db,
                    logger: this.logger,
                    cache: this.cache,
                    ownerManager: this.ownerManager,
                    resolveRealJid: (jid) => resolveRealJid(this.sock, jid),
                    getFormattedTime: () => this.getFormattedTime(Date.now()),
                    getFormattedDate: () => this.getFormattedDate(Date.now()),
                    quoted: quoted,
                    setActiveConversation: (chatId, command, context) => this.setActiveConversation(chatId, command, context),
                    clearActiveConversation: (chatId) => this.clearActiveConversation(chatId),
                    sendModeIndicator: (chatId, command) => this.sendModeIndicator(chatId, command)
                };
                await cmd.execute(context);
            } catch (error) {
                this.logger.error(`Command error (${commandName}): ${error.message}`);
                if (isOwner) {
                    await this.sock.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: msg });
                }
            }
        }
    }

    async handleMessageUpdate(update, originalMsg = null) {
        try {
            const { key, update: msgUpdate } = update;

            if (msgUpdate?.message?.protocolMessage?.type === 0) {
                const deletedId = msgUpdate.message.protocolMessage.key.id;
                const deletedMsg = this.bot.messageStore?.getMessage(key.remoteJid, deletedId);
                if (deletedMsg) {
                    this.logger.info(`🗑️ Deleted message detected in ${key.remoteJid}`);
                    
                    if (key.remoteJid === 'status@broadcast') {
                        const deleter = key.participant || key.remoteJid;
                        await this.handleStatusDelete(deletedMsg, key, deleter);
                    } else {
                        const deleter = key.participant || key.remoteJid;
                        const sender = deletedMsg.key?.participant || deletedMsg.key?.remoteJid;
                        await this.handleAntiDelete(deletedMsg, key, deleter, sender);
                    }
                    this.bot.messageStore?.removeMessage(key.remoteJid, deletedId);
                }
            }

            if (msgUpdate?.message?.protocolMessage?.type === 1 && originalMsg) {
                const antiEdit = await this.bot.db?.getSetting('antiedit', 'on');
                if (antiEdit !== 'on') return;

                const editedMsg = msgUpdate.message;
                const originalText = this.extractText(originalMsg.message);
                const editedText = this.extractText(editedMsg);
                if (originalText === editedText) return;

                this.logger.info(`✏️ Edited message detected in ${key.remoteJid}`);

                const sender = key.participant || key.remoteJid;
                const resolvedSender = await resolveRealJid(this.sock, sender);
                const senderShort = resolvedSender.split('@')[0];
                const currentTime = await this.getFormattedTime(Date.now());
                const currentDate = await this.getFormattedDate(Date.now());

                const isGroup = isJidGroup(key.remoteJid);
                let chatInfo = 'Private Chat';
                if (isGroup) {
                    try { const metadata = await this.sock.groupMetadata(key.remoteJid); chatInfo = `Group: ${metadata.subject}`; } catch (e) {}
                }

                const alertMsg = `✏️ *EDITED MESSAGE DETECTED*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                    `_👤 Sender:_ @${senderShort}\n` +
                    `_💬 Chat:_ ${chatInfo}\n` +
                    `_⏰ Time:_ ${currentTime}\n` +
                    `_📅 Date:_ ${currentDate}\n\n` +
                    `*Original:*\n${originalText}\n\n` +
                    `*Edited to:*\n${editedText}\n\n` +
                    `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

                if (this.bot.ownerJid) {
                    await this.sendButtonMessage(this.sock, this.bot.ownerJid, alertMsg, null);
                }
            }

            if (msgUpdate?.reaction) {
                this.logger.message(`Reaction on ${key.id.substring(0, 8)}: ${msgUpdate.reaction.text}`);
            }

            if (msgUpdate?.status !== undefined) {
                const statuses = { 1: '📤 Sent', 2: '✅ Delivered', 3: '👁️ Read', 4: '🕒 Pending' };
                this.logger.message(`Status update for ${key.id.substring(0, 8)}: ${statuses[msgUpdate.status] || msgUpdate.status}`);
            }
        } catch (error) {
            this.logger.error(`Message update error: ${error.message}`);
        }
    }

    async handleMessageDelete(deleteData) {
        try {
            const keys = deleteData.keys || deleteData;
            if (!keys || !Array.isArray(keys)) return;
            for (const key of keys) {
                const cachedMsg = this.bot.messageStore?.getMessage(key.remoteJid, key.id);
                if (cachedMsg && this.bot.db) {
                    const deleter = key.participant || key.remoteJid;
                    const sender = cachedMsg.key?.participant || cachedMsg.key?.remoteJid;
                    const antiDelete = await this.bot.db.getSetting('antidelete', 'off');
                    if (antiDelete === 'on') {
                        await this.handleAntiDelete(cachedMsg, key, deleter, sender);
                    }
                    this.bot.messageStore?.removeMessage(key.remoteJid, key.id);
                }
            }
        } catch (error) {}
    }

    async handleGroupUpdate(update) {
        const { id: groupJid, participants, action } = update;
        this.logger.group(`Participants ${action} in ${groupJid?.split('@')[0] || 'unknown'}:`);
        if (participants) {
            this.logger.group(`   └ ${participants.map(p => p.split('@')[0]).join(', ')}`);
        }

        if (action === 'add') {
            const welcomeEnabled = await this.bot.db?.getSetting('welcome', 'off');
            if (welcomeEnabled === 'on') {
                const welcomeMsg = await this.bot.db?.getSetting('welcomemessage', 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.');
                for (const participant of participants) {
                    const resolvedParticipant = await resolveRealJid(this.sock, participant);
                    const userNumber = resolvedParticipant.split('@')[0];
                    await this.sock.sendMessage(groupJid, { text: welcomeMsg.replace(/@user/g, `@${userNumber}`), mentions: [resolvedParticipant] });
                }
            }
        } else if (action === 'remove') {
            const goodbyeEnabled = await this.bot.db?.getSetting('goodbye', 'off');
            if (goodbyeEnabled === 'on') {
                const goodbyeMsg = await this.bot.db?.getSetting('goodbyemessage', 'Goodbye @user! 👋');
                for (const participant of participants) {
                    const resolvedParticipant = await resolveRealJid(this.sock, participant);
                    const userNumber = resolvedParticipant.split('@')[0];
                    await this.sock.sendMessage(groupJid, { text: goodbyeMsg.replace(/@user/g, `@${userNumber}`), mentions: [resolvedParticipant] });
                }
            }
        }
    }
}

module.exports = EventHandler;
