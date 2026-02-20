const GroupHelper = require('../helpers/group');

const { createContext, createContext2 } = require('../helpers/context');

const config = require('../../megan/config');

const commands = [];

// Helper function to format JID for display (wanga)

const formatJid = (jid) => {

  if (!jid) return 'N/A';

  const cleanJid = `@${jid.split('@')[0]}`;

  return cleanJid;

};

// ============================================

// TAG ALL COMMAND - USING GIFTED'S APPROACH

// ============================================

commands.push({

    name: 'tagall',

    description: 'Tag all group members',

    aliases: ['everyone', 'all'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!msg.key.remoteJid.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            

            // Get all participant JIDs for mentions array

            const mentions = participants.map(p => p.id);

            

            // Format participants list like Gifted does

            const superAdmins = [];

            const admins = [];

            const members = [];

            

            participants.forEach(p => {

                const formattedJid = formatJid(p.id);

                if (p.admin === 'superadmin') {

                    superAdmins.push(`• ${formattedJid} - 👑 Super Admin`);

                } else if (p.admin === 'admin') {

                    admins.push(`• ${formattedJid} - 👮 Admin`);

                } else {

                    members.push(`• ${formattedJid} - 👤 Member`);

                }

            });

            const allParticipants = [...superAdmins, ...admins, ...members].join('\n');

            

            const message = args.length > 0 

                ? args.join(' ') 

                : '📢 *Attention everyone!*';

            

            const context = createContext(sender, {

                title: '𝐌𝐄𝐆𝐀𝐍 𝐓𝐀𝐆𝐆𝐄𝐃 𝐀𝐋𝐋',

                body: `👥 Total: ${participants.length} members`

            });

            

            await sock.sendMessage(from, {

                text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n📢 *MESSAGE:*\n${message}\n\n👥 *MEMBERS:*\n${allParticipants}\n\n> ${config.FOOTER}`,

                mentions: mentions,

                ...context

            });

            

            await react('✅');

            

        } catch (error) {

            console.error('Tagall error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// TAG COMMAND

// ============================================

commands.push({

    name: 'tag',

    description: 'Tag all with custom message',

    aliases: ['mention', 'notify'],

    async execute({ msg, from, sender, args, sock, react, reply }) {

        if (!msg.key.remoteJid.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        // Check if replying to a message

        if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {

            const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;

            let quotedText = '';

            

            if (quotedMsg.conversation) {

                quotedText = quotedMsg.conversation;

            } else if (quotedMsg.extendedTextMessage?.text) {

                quotedText = quotedMsg.extendedTextMessage.text;

            } else if (quotedMsg.imageMessage?.caption) {

                quotedText = quotedMsg.imageMessage.caption;

            } else if (quotedMsg.videoMessage?.caption) {

                quotedText = quotedMsg.videoMessage.caption;

            }

            

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            const mentions = participants.map(p => p.id);

            

            // Format participants like Gifted

            const superAdmins = [];

            const admins = [];

            const members = [];

            

            participants.forEach(p => {

                const formattedJid = formatJid(p.id);

                if (p.admin === 'superadmin') {

                    superAdmins.push(`• ${formattedJid} - 👑 Super Admin`);

                } else if (p.admin === 'admin') {

                    admins.push(`• ${formattedJid} - 👮 Admin`);

                } else {

                    members.push(`• ${formattedJid} - 👤 Member`);

                }

            });

            const allParticipants = [...superAdmins, ...admins, ...members].join('\n');

            

            const context = createContext(sender, {

                title: '𝐌𝐄𝐆𝐀𝐍 𝐓𝐀𝐆𝐆𝐄𝐃 𝐀 𝐌𝐄𝐒𝐒𝐀𝐆𝐄',

                body: `📝 Replying to quoted message`

            });

            

            await sock.sendMessage(from, {

                text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n📢 *QUOTED MESSAGE:*\n${quotedText}\n\n👥 *MEMBERS:*\n${allParticipants}\n\n> ${config.FOOTER}`,

                mentions: mentions,

                ...context

            });

            

            await react('✅');

            return;

        }

        if (args.length === 0) {

            await react('❌');

            return reply('❌ Please provide a message!\nExample: .tag Hello everyone');

        }

        await react('🔄');

        

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            const mentions = participants.map(p => p.id);

            

            // Format participants like Gifted

            const superAdmins = [];

            const admins = [];

            const members = [];

            

            participants.forEach(p => {

                const formattedJid = formatJid(p.id);

                if (p.admin === 'superadmin') {

                    superAdmins.push(`• ${formattedJid} - 👑 Super Admin`);

                } else if (p.admin === 'admin') {

                    admins.push(`• ${formattedJid} - 👮 Admin`);

                } else {

                    members.push(`• ${formattedJid} - 👤 Member`);

                }

            });

            const allParticipants = [...superAdmins, ...admins, ...members].join('\n');

            

            const message = args.join(' ');

            

            const context = createContext(sender, {

                title: '𝐌𝐄𝐆𝐀𝐍 𝐓𝐀𝐆𝐆𝐄𝐃 𝐀 𝐌𝐄𝐒𝐒𝐀𝐆𝐄',

                body: `📝 Message: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`

            });

            

            await sock.sendMessage(from, {

                text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n📢 *MESSAGE:*\n${message}\n\n👥 *MEMBERS:*\n${allParticipants}\n\n> ${config.FOOTER}`,

                mentions: mentions,

                ...context

            });

            

            await react('✅');

            

        } catch (error) {

            console.error('Tag error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// TAG ADMINS COMMAND

// ============================================

commands.push({

    name: 'tagadmins',

    description: 'Tag all group admins',

    aliases: ['admins', 'tagadmin'],

    async execute({ msg, from, sender, args, sock, react, reply }) {

        if (!msg.key.remoteJid.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        

        try {

            const metadata = await sock.groupMetadata(from);

            

            // Filter only admins

            const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

            

            if (admins.length === 0) {

                await react('⚠️');

                return reply('⚠️ No admins found in this group!');

            }

            

            // Get admin IDs for mentions

            const mentions = admins.map(p => p.id);

            

            // Format admins like Gifted

            const superAdmins = [];

            const regularAdmins = [];

            

            admins.forEach(p => {

                const formattedJid = formatJid(p.id);

                if (p.admin === 'superadmin') {

                    superAdmins.push(`• ${formattedJid} - 👑 Super Admin`);

                } else {

                    regularAdmins.push(`• ${formattedJid} - 👮 Admin`);

                }

            });

            const allAdmins = [...superAdmins, ...regularAdmins].join('\n');

            

            const message = args.length > 0 ? args.join(' ') : '📢 Attention admins!';

            

            const context = createContext(sender, {

                title: '𝐀𝐃𝐌𝐈𝐍𝐒 𝐓𝐀𝐆𝐆𝐄𝐃',

                body: `👑 Total: ${admins.length} admins`

            });

            

            await sock.sendMessage(from, {

                text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n📢 *MESSAGE:*\n${message}\n\n👑 *ADMINS:*\n${allAdmins}\n\n> ${config.FOOTER}`,

                mentions: mentions,

                ...context

            });

            

            await react('✅');

            

        } catch (error) {

            console.error('Tagadmins error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// ANNOUNCE COMMAND

// ============================================

commands.push({

    name: 'announce',

    description: 'Make an announcement tagging all members',

    aliases: ['ann', 'broadcast'],

    async execute({ msg, from, sender, args, sock, react, reply }) {

        if (!msg.key.remoteJid.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        // Check if replying to a message

        if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {

            const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;

            let quotedText = '';

            

            if (quotedMsg.conversation) {

                quotedText = quotedMsg.conversation;

            } else if (quotedMsg.extendedTextMessage?.text) {

                quotedText = quotedMsg.extendedTextMessage.text;

            } else if (quotedMsg.imageMessage?.caption) {

                quotedText = quotedMsg.imageMessage.caption;

            } else if (quotedMsg.videoMessage?.caption) {

                quotedText = quotedMsg.videoMessage.caption;

            }

            

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            const mentions = participants.map(p => p.id);

            

            // Format participants

            const allParticipants = participants.map(p => `• ${formatJid(p.id)}`).join('\n');

            

            const context = createContext(sender, {

                title: '📢 𝐆𝐑𝐎𝐔𝐏 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓',

                body: `Announcement`

            });

            

            await sock.sendMessage(from, {

                text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n📢 *ANNOUNCEMENT*\n\n${quotedText}\n\n👥 *NOTIFIED MEMBERS:*\n${allParticipants}\n\n> ${config.FOOTER}`,

                mentions: mentions,

                ...context

            });

            

            await react('✅');

            return;

        }

        if (args.length === 0) {

            await react('❌');

            return reply('❌ Please provide an announcement message!\nExample: .announce Meeting at 5pm');

        }

        await react('🔄');

        

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            const mentions = participants.map(p => p.id);

            

            // Format participants

            const allParticipants = participants.map(p => `• ${formatJid(p.id)}`).join('\n');

            

            const message = args.join(' ');

            

            const context = createContext(sender, {

                title: '📢 𝐆𝐑𝐎𝐔𝐏 𝐀𝐍𝐍𝐎𝐔𝐍𝐂𝐄𝐌𝐄𝐍𝐓',

                body: message.substring(0, 50)

            });

            

            await sock.sendMessage(from, {

                text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n📢 *ANNOUNCEMENT*\n\n${message}\n\n👥 *NOTIFIED MEMBERS:*\n${allParticipants}\n\n> ${config.FOOTER}`,

                mentions: mentions,

                ...context

            });

            

            await react('✅');

            

        } catch (error) {

            console.error('Announce error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ... (keep all other commands - groupinfo, groupsettings, setsubject, setdescription, add, remove, promote, demote, invite, revoke, creategroup, poll, multipoll, leave)

module.exports = { commands };