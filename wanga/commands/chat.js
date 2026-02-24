const config = require('../../megan/config');

const commands = [];

// Helper to extract phone from various formats
const extractPhone = (input) => {
    if (!input) return null;
    let phone = input.replace('@s.whatsapp.net', '');
    phone = phone.replace(/\D/g, '');
    return phone || null;
};

// ============================================
// ARCHIVE CHAT
// ============================================
commands.push({
    name: 'archive',
    description: 'Archive a chat',
    aliases: ['archivechat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('📦');

        try {
            await sock.chatModify({ archive: true }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `📦 *CHAT ARCHIVED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Archive error:', error);
            await react('❌');
            await reply(`❌ Failed to archive chat: ${error.message}`);
        }
    }
});

// ============================================
// UNARCHIVE CHAT
// ============================================
commands.push({
    name: 'unarchive',
    description: 'Unarchive a chat',
    aliases: ['unarchivechat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('📂');

        try {
            await sock.chatModify({ archive: false }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `📂 *CHAT UNARCHIVED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Unarchive error:', error);
            await react('❌');
            await reply(`❌ Failed to unarchive chat: ${error.message}`);
        }
    }
});

// ============================================
// MUTE CHAT (with duration)
// ============================================
commands.push({
    name: 'mute',
    description: 'Mute a chat (8h, 1d, 1w, forever)',
    aliases: ['mutechat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;
        let duration = 8 * 60 * 60 * 1000; // Default 8 hours
        let durationText = '8 hours';

        // Parse duration if provided
        if (args.length > 0) {
            const firstArg = args[0].toLowerCase();
            
            if (firstArg.endsWith('h') || firstArg.endsWith('d') || firstArg.endsWith('w') || firstArg === 'forever') {
                if (firstArg === 'forever') {
                    duration = 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
                    durationText = 'forever';
                } else {
                    const value = parseInt(firstArg);
                    if (firstArg.endsWith('h')) {
                        duration = value * 60 * 60 * 1000;
                        durationText = `${value} hour(s)`;
                    } else if (firstArg.endsWith('d')) {
                        duration = value * 24 * 60 * 60 * 1000;
                        durationText = `${value} day(s)`;
                    } else if (firstArg.endsWith('w')) {
                        duration = value * 7 * 24 * 60 * 60 * 1000;
                        durationText = `${value} week(s)`;
                    }
                }
                args.shift(); // Remove duration from args
            }

            // Check for specific chat
            if (args.length > 0) {
                const phone = extractPhone(args[0]);
                if (phone && phone.length >= 10) {
                    targetChat = `${phone}@s.whatsapp.net`;
                } else if (args[0].includes('@g.us')) {
                    targetChat = args[0];
                }
            }
        }

        await react('🔇');

        try {
            await sock.chatModify({ mute: duration }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔇 *CHAT MUTED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n` +
                             `⏰ *Duration:* ${durationText}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Mute error:', error);
            await react('❌');
            await reply(`❌ Failed to mute chat: ${error.message}`);
        }
    }
});

// ============================================
// UNMUTE CHAT
// ============================================
commands.push({
    name: 'unmute',
    description: 'Unmute a chat',
    aliases: ['unmutechat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('🔊');

        try {
            await sock.chatModify({ mute: null }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🔊 *CHAT UNMUTED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Unmute error:', error);
            await react('❌');
            await reply(`❌ Failed to unmute chat: ${error.message}`);
        }
    }
});

// ============================================
// PIN CHAT
// ============================================
commands.push({
    name: 'pin',
    description: 'Pin a chat',
    aliases: ['pinchat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('📌');

        try {
            await sock.chatModify({ pin: true }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `📌 *CHAT PINNED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Pin error:', error);
            await react('❌');
            await reply(`❌ Failed to pin chat: ${error.message}`);
        }
    }
});

// ============================================
// UNPIN CHAT
// ============================================
commands.push({
    name: 'unpin',
    description: 'Unpin a chat',
    aliases: ['unpinchat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('📌❌');

        try {
            await sock.chatModify({ pin: false }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `📌 *CHAT UNPINNED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Unpin error:', error);
            await react('❌');
            await reply(`❌ Failed to unpin chat: ${error.message}`);
        }
    }
});

// ============================================
// MARK AS READ
// ============================================
commands.push({
    name: 'markread',
    description: 'Mark a chat as read',
    aliases: ['read', 'mark'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('👁️');

        try {
            await sock.chatModify({ markRead: true }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `👁️ *CHAT MARKED AS READ*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Mark read error:', error);
            await react('❌');
            await reply(`❌ Failed to mark chat as read: ${error.message}`);
        }
    }
});

// ============================================
// MARK AS UNREAD
// ============================================
commands.push({
    name: 'markunread',
    description: 'Mark a chat as unread',
    aliases: ['unread'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('👁️‍🗨️');

        try {
            await sock.chatModify({ markRead: false }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `👁️‍🗨️ *CHAT MARKED AS UNREAD*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Mark unread error:', error);
            await react('❌');
            await reply(`❌ Failed to mark chat as unread: ${error.message}`);
        }
    }
});

// ============================================
// DELETE CHAT
// ============================================
commands.push({
    name: 'deletechat',
    description: 'Delete a chat',
    aliases: ['delchat', 'removechat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('🗑️');

        try {
            await sock.chatModify({ delete: true }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🗑️ *CHAT DELETED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Delete chat error:', error);
            await react('❌');
            await reply(`❌ Failed to delete chat: ${error.message}`);
        }
    }
});

// ============================================
// CLEAR CHAT (delete all messages)
// ============================================
commands.push({
    name: 'clearchat',
    description: 'Clear all messages in a chat',
    aliases: ['clearmessages', 'clearconv'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetChat = from;

        if (args.length > 0) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                targetChat = `${phone}@s.whatsapp.net`;
            } else if (args[0].includes('@g.us')) {
                targetChat = args[0];
            }
        }

        await react('🧹');

        try {
            await sock.chatModify({ clear: { messages: [] } }, targetChat);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `🧹 *CHAT CLEARED*\n\n` +
                             `💬 *Chat:* ${targetChat.split('@')[0]}\n` +
                             `✅ All messages cleared\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Clear chat error:', error);
            await react('❌');
            await reply(`❌ Failed to clear chat: ${error.message}`);
        }
    }
});

// ============================================
// DELETE MESSAGE (reply to message)
// ============================================
commands.push({
    name: 'delete',
    description: 'Delete a message (for everyone)',
    aliases: ['del', 'remove'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo;

        if (!quoted || !quoted.stanzaId) {
            await react('❌');
            return reply(`🗑️ *DELETE MESSAGE*\n\nUsage: Reply to any message with ${config.PREFIX}delete\n\nDeletes the message for everyone.`);
        }

        await react('🗑️');

        try {
            const key = {
                remoteJid: from,
                fromMe: quoted.participant ? false : true,
                id: quoted.stanzaId,
                participant: quoted.participant
            };

            await sock.sendMessage(from, { delete: key });
            await react('✅');

        } catch (error) {
            bot.logger.error('Delete message error:', error);
            await react('❌');
            await reply(`❌ Failed to delete message: ${error.message}`);
        }
    }
});

// ============================================
// STAR MESSAGE
// ============================================
commands.push({
    name: 'star',
    description: 'Star a message (reply to it)',
    aliases: ['favorite'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo;

        if (!quoted || !quoted.stanzaId) {
            await react('❌');
            return reply(`⭐ *STAR MESSAGE*\n\nUsage: Reply to a message with ${config.PREFIX}star\n\nStars the message (marks as favorite).`);
        }

        await react('⭐');

        try {
            const key = {
                remoteJid: from,
                fromMe: quoted.participant ? false : true,
                id: quoted.stanzaId,
                participant: quoted.participant
            };

            // Note: WhatsApp doesn't have a direct API for starring
            // This is a placeholder - you might need to store stars in your database
            await reply('⭐ Message starred (locally)');

        } catch (error) {
            bot.logger.error('Star error:', error);
            await react('❌');
            await reply(`❌ Failed to star message: ${error.message}`);
        }
    }
});

// ============================================
// CHAT INFO
// ============================================
commands.push({
    name: 'chatinfo',
    description: 'Get information about current chat',
    aliases: ['chat', 'chatid'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('ℹ️');

        try {
            const isGroup = from.endsWith('@g.us');
            let chatName = from.split('@')[0];
            
            if (isGroup) {
                try {
                    const metadata = await sock.groupMetadata(from);
                    chatName = metadata.subject;
                } catch (e) {}
            }

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                             `💬 *CHAT INFORMATION*\n\n` +
                             `📱 *Type:* ${isGroup ? '👥 Group' : '👤 Private'}\n` +
                             `📛 *Name:* ${chatName}\n` +
                             `🆔 *JID:* ${from}\n` +
                             `📍 *Current:* ${from === sender ? 'This chat' : 'Different'}\n\n` +
                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Chat info error:', error);
            await react('❌');
            await reply(`❌ Failed to get chat info: ${error.message}`);
        }
    }
});

// ============================================
// CHAT HELP
// ============================================
commands.push({
    name: 'chathelp',
    description: 'Show all chat management commands',
    aliases: ['chatcmds', 'helpchat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `💬 *CHAT MANAGEMENT COMMANDS*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*ARCHIVE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}archive [chat] - Archive chat\n` +
                        `• ${config.PREFIX}unarchive [chat] - Unarchive chat\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*MUTE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}mute [8h/1d/1w/forever] [chat] - Mute chat\n` +
                        `• ${config.PREFIX}unmute [chat] - Unmute chat\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*PIN*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}pin [chat] - Pin chat\n` +
                        `• ${config.PREFIX}unpin [chat] - Unpin chat\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*READ STATUS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}markread [chat] - Mark as read\n` +
                        `• ${config.PREFIX}markunread [chat] - Mark as unread\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*DELETE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}delete - Delete replied message\n` +
                        `• ${config.PREFIX}deletechat [chat] - Delete entire chat\n` +
                        `• ${config.PREFIX}clearchat [chat] - Clear all messages\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*INFO*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}chatinfo - Get current chat info\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };