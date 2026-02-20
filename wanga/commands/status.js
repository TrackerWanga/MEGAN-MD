const config = require('../../megan/config');
const { downloadMediaMessage } = require('gifted-baileys');
const { uploadToCatbox } = require('../../megan/lib/upload');

const commands = [];

// Helper to extract view once content
const extractViewOnceContent = (quotedMsg) => {
    // Check different view once formats
    if (quotedMsg.viewOnceMessage?.message) {
        return quotedMsg.viewOnceMessage.message;
    }
    if (quotedMsg.viewOnceMessageV2?.message) {
        return quotedMsg.viewOnceMessageV2.message;
    }
    if (quotedMsg.viewOnceMessageV2Extension?.message) {
        return quotedMsg.viewOnceMessageV2Extension.message;
    }
    return quotedMsg;
};

// Helper to check if message is view once
const isViewOnce = (msg) => {
    return !!(
        msg?.imageMessage?.viewOnce ||
        msg?.videoMessage?.viewOnce ||
        msg?.audioMessage?.viewOnce ||
        msg?.viewOnceMessage ||
        msg?.viewOnceMessageV2 ||
        msg?.viewOnceMessageV2Extension
    );
};

// ============================================
// AUTO VIEW STATUS COMMAND
// ============================================
commands.push({
    name: 'autoviewstatus',
    description: 'Toggle auto-view status (on/off)',
    aliases: ['avs'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_view', config.STATUS.AUTO_VIEW);
            const status = current === true || current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`👁️ *Auto View Status*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_view', option === 'on' ? 'true' : 'false');

        await react('✅');
        await reply(`✅ Auto-view status turned ${option}`);
    }
});

// ============================================
// AUTO DOWNLOAD STATUS COMMAND
// ============================================
commands.push({
    name: 'autodownloadstatus',
    description: 'Toggle auto-download status (on/off)',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_download', config.STATUS.AUTO_DOWNLOAD);
            const status = current === true || current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`📥 *Auto Download Status*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_download', option === 'on' ? 'true' : 'false');

        await react('✅');
        await reply(`✅ Auto-download status turned ${option}`);
    }
});

// ============================================
// AUTO REACT STATUS COMMAND
// ============================================
commands.push({
    name: 'autoreactstatus',
    description: 'Toggle auto-react status (on/off)',
    aliases: ['ars'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_react', config.STATUS.AUTO_REACT);
            const status = current === true || current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`🎯 *Auto React Status*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_react', option === 'on' ? 'true' : 'false');

        await react('✅');
        await reply(`✅ Auto-react status turned ${option}`);
    }
});

// ============================================
// SET STATUS EMOJI COMMAND
// ============================================
commands.push({
    name: 'setstatusemoji',
    description: 'Set emojis for status reactions',
    aliases: ['sse'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_react_emojis', config.STATUS.REACT_EMOJIS);
            await react('ℹ️');
            return reply(`🎯 *Status Reaction Emojis*\n\nCurrent: ${current}\n\nUsage: .setstatusemoji ❤️,👍,🔥,💯`);
        }

        const emojis = args.join(' ');
        await react('🔄');
        await bot.db.setSetting('status_react_emojis', emojis);

        await react('✅');
        await reply(`✅ Status reaction emojis set to: ${emojis}`);
    }
});

// ============================================
// AUTO REPLY STATUS COMMAND
// ============================================
commands.push({
    name: 'autoreplystatus',
    description: 'Toggle auto-reply status (on/off)',
    aliases: ['arsr'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_reply', config.STATUS.AUTO_REPLY);
            const status = current === true || current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`💬 *Auto Reply Status*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_reply', option === 'on' ? 'true' : 'false');

        await react('✅');
        await reply(`✅ Auto-reply status turned ${option}`);
    }
});

// ============================================
// SET STATUS REPLY TEXT COMMAND
// ============================================
commands.push({
    name: 'setstatusreply',
    description: 'Set text for auto-reply to status',
    aliases: ['ssr'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_reply_text', config.STATUS.REPLY_TEXT);
            await react('ℹ️');
            return reply(`💬 *Status Reply Text*\n\nCurrent: ${current}\n\nUsage: .setstatusreply Thank you for your status!`);
        }

        const text = args.join(' ');
        await react('🔄');
        await bot.db.setSetting('status_reply_text', text);

        await react('✅');
        await reply(`✅ Status reply text set to: ${text}`);
    }
});

// ============================================
// ANTI DELETE STATUS COMMAND
// ============================================
commands.push({
    name: 'antideletestatus',
    description: 'Toggle anti-delete for status (on/off)',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('status_anti_delete', config.STATUS.ANTI_DELETE);
            const status = current === true || current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`🚨 *Anti-Delete Status*\n\nCurrent: ${status}\n\nWhen ON, deleted statuses will be sent to your DM\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('status_anti_delete', option === 'on' ? 'true' : 'false');

        await react('✅');
        await reply(`✅ Anti-delete status turned ${option}`);
    }
});

// ============================================
// AUTO VIEW ONCE COMMAND
// ============================================
commands.push({
    name: 'autoviewonce',
    description: 'Toggle auto-save view once media (on/off)',
    aliases: ['avo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('auto_view_once', config.FEATURES.AUTO_VIEW_ONCE);
            const status = current === true || current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`🔐 *Auto View Once*\n\nCurrent: ${status}\n\nWhen ON, view once media will be saved to your DM\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('auto_view_once', option === 'on' ? 'true' : 'false');

        await react('✅');
        await reply(`✅ Auto view once turned ${option}`);
    }
});

// ============================================
// SAVE STATUS COMMAND (for users)
// ============================================
commands.push({
    name: 'save',
    description: 'Save a status media to your DM',
    aliases: ['savestatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        // Check if replying to a status
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedKey = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        
        if (!quotedMsg || !quotedKey) {
            await react('❌');
            return reply('❌ Please reply to a status message with .save');
        }
        
        await react('🔄');
        
        // Get the full quoted message from store
        const statusJid = 'status@broadcast';
        const fullMsg = bot.messageStore?.getMessage(statusJid, quotedKey);
        
        if (!fullMsg) {
            await react('❌');
            return reply('❌ Could not find the status message. It may have expired.');
        }
        
        // Use status handler to save
        if (bot.statusHandler) {
            await bot.statusHandler.saveStatusForUser(fullMsg, sender, fullMsg);
            await react('✅');
        } else {
            await react('❌');
            await reply('❌ Status handler not initialized');
        }
    }
});

// ============================================
// VV COMMAND (View Once Revealer - to DM)
// ============================================
commands.push({
    name: 'vv',
    description: 'Reveal view once media to your DM',
    aliases: ['reveal'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedKey = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        
        if (!quotedMsg || !quotedKey) {
            await react('❌');
            return reply('❌ Please reply to a view once message');
        }
        
        await react('🔄');
        
        try {
            // Get the full message from store
            const chatJid = msg.key.remoteJid;
            let fullMsg = bot.messageStore?.getMessage(chatJid, quotedKey);
            
            if (!fullMsg) {
                await react('❌');
                return reply('❌ Could not find the original message. View once messages expire quickly.');
            }
            
            // Extract view once content
            let mediaContent = null;
            let mediaType = null;
            
            // Check different message formats
            if (fullMsg.message?.imageMessage) {
                mediaContent = fullMsg.message.imageMessage;
                mediaType = 'image';
            } else if (fullMsg.message?.videoMessage) {
                mediaContent = fullMsg.message.videoMessage;
                mediaType = 'video';
            } else if (fullMsg.message?.audioMessage) {
                mediaContent = fullMsg.message.audioMessage;
                mediaType = 'audio';
            } else if (fullMsg.originalMessage?.message?.imageMessage) {
                mediaContent = fullMsg.originalMessage.message.imageMessage;
                mediaType = 'image';
            } else if (fullMsg.originalMessage?.message?.videoMessage) {
                mediaContent = fullMsg.originalMessage.message.videoMessage;
                mediaType = 'video';
            } else if (fullMsg.originalMessage?.message?.audioMessage) {
                mediaContent = fullMsg.originalMessage.message.audioMessage;
                mediaType = 'audio';
            }
            
            if (!mediaContent || !mediaType) {
                await react('❌');
                return reply('❌ Could not extract media from this view once message');
            }
            
            // Download media
            const buffer = await downloadMediaMessage(fullMsg.originalMessage || fullMsg, 'buffer', {}, {
                logger: console,
                reuploadRequest: true
            });
            
            if (!buffer) throw new Error('Failed to download media');
            
            // Upload to Catbox
            const ext = mediaType === 'image' ? 'jpg' : mediaType === 'video' ? 'mp4' : 'mp3';
            const filename = `viewonce_${Date.now()}.${ext}`;
            const { url, success } = await uploadToCatbox(buffer, filename);
            
            if (!success || !url) throw new Error('Upload failed');
            
            // Send to user's DM (the person who used the command)
            const caption = mediaContent.caption || '';
            const senderShort = sender.split('@')[0];
            
            await sock.sendMessage(sender, {
                text: `🔐 *VIEW ONCE REVEALED* 🔐\n\n👤 *Requested by:* @${senderShort}\n💬 *Chat:* ${chatJid.includes('@g.us') ? 'Group' : 'Private'}\n📎 *Type:* ${mediaType.toUpperCase()}\n📝 *Caption:* ${caption || 'None'}\n🔗 *URL:* ${url}\n⏰ *Time:* ${new Date().toLocaleTimeString()}`,
                mentions: [sender]
            });
            
            await react('✅');
            await reply('✅ View once media saved to your DM! Check your private messages.');
            
        } catch (error) {
            console.error('VV error:', error);
            await react('❌');
            await reply(`❌ Error: ${error.message}`);
        }
    }
});

// ============================================
// VV2 COMMAND (View Once Revealer - to current chat)
// ============================================
commands.push({
    name: 'vv2',
    description: 'Reveal view once media in current chat',
    aliases: ['reveal2'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedKey = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
        
        if (!quotedMsg || !quotedKey) {
            await react('❌');
            return reply('❌ Please reply to a view once message');
        }
        
        await react('🔄');
        
        try {
            // Get the full message from store
            const chatJid = msg.key.remoteJid;
            let fullMsg = bot.messageStore?.getMessage(chatJid, quotedKey);
            
            if (!fullMsg) {
                await react('❌');
                return reply('❌ Could not find the original message. View once messages expire quickly.');
            }
            
            // Extract view once content
            let mediaContent = null;
            let mediaType = null;
            
            // Check different message formats
            if (fullMsg.message?.imageMessage) {
                mediaContent = fullMsg.message.imageMessage;
                mediaType = 'image';
            } else if (fullMsg.message?.videoMessage) {
                mediaContent = fullMsg.message.videoMessage;
                mediaType = 'video';
            } else if (fullMsg.message?.audioMessage) {
                mediaContent = fullMsg.message.audioMessage;
                mediaType = 'audio';
            } else if (fullMsg.originalMessage?.message?.imageMessage) {
                mediaContent = fullMsg.originalMessage.message.imageMessage;
                mediaType = 'image';
            } else if (fullMsg.originalMessage?.message?.videoMessage) {
                mediaContent = fullMsg.originalMessage.message.videoMessage;
                mediaType = 'video';
            } else if (fullMsg.originalMessage?.message?.audioMessage) {
                mediaContent = fullMsg.originalMessage.message.audioMessage;
                mediaType = 'audio';
            }
            
            if (!mediaContent || !mediaType) {
                await react('❌');
                return reply('❌ Could not extract media from this view once message');
            }
            
            // Download media
            const buffer = await downloadMediaMessage(fullMsg.originalMessage || fullMsg, 'buffer', {}, {
                logger: console,
                reuploadRequest: true
            });
            
            if (!buffer) throw new Error('Failed to download media');
            
            // Upload to Catbox
            const ext = mediaType === 'image' ? 'jpg' : mediaType === 'video' ? 'mp4' : 'mp3';
            const filename = `viewonce_${Date.now()}.${ext}`;
            const { url, success } = await uploadToCatbox(buffer, filename);
            
            if (!success || !url) throw new Error('Upload failed');
            
            // Prepare message to send in current chat
            const caption = mediaContent.caption || '';
            
            // Send the URL to current chat
            await sock.sendMessage(from, {
                text: `🔓 *VIEW ONCE REVEALED*\n\n📎 *Type:* ${mediaType.toUpperCase()}\n📝 *Caption:* ${caption || 'None'}\n🔗 *URL:* ${url}\n\n> _This link will expire when Catbox deletes it_`
            });
            
            await react('✅');
            
        } catch (error) {
            console.error('VV2 error:', error);
            await react('❌');
            await reply(`❌ Error: ${error.message}`);
        }
    }
});

module.exports = { commands };
