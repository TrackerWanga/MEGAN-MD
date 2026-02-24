const GroupHelper = require('../../megan/helpers/group');

const config = require('../../megan/config');

const commands = [];

const formatJid = (jid) => {

  if (!jid) return 'N/A';

  return `@${jid.split('@')[0]}`;

};

const extractPhone = (input) => {

    if (!input) return null;

    let phone = input.replace('@s.whatsapp.net', '');

    phone = phone.replace(/\D/g, '');

    return phone || null;

};

const getJidFromMention = (msg, input) => {

    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

        return msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

    }

    

    const phone = extractPhone(input);

    if (phone) {

        return `${phone}@s.whatsapp.net`;

    }

    

    return null;

};

// ============================================

// 1. LEAVE GROUP

// ============================================

commands.push({

    name: 'leave',

    description: 'Leave a group',

    aliases: ['left', 'exit', 'leavegc'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let targetGroup = from;

        if (!from.endsWith('@g.us') && args.length > 0) {

            const link = args[0];

            if (link.includes('chat.whatsapp.com')) {

                const code = link.split('/').pop();

                try {

                    const groupData = await sock.groupGetInviteInfo(code);

                    targetGroup = groupData.id;

                } catch (e) {

                    await react('❌');

                    return reply('❌ Invalid group invite link!');

                }

            } else {

                targetGroup = link.endsWith('@g.us') ? link : `${link}@g.us`;

            }

        }

        if (!targetGroup.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ Please use this command in a group or provide a group link!');

        }

        await react('👋');

        try {

            await sock.sendMessage(targetGroup, {

                text: `👋 *${config.BOT_NAME} is leaving this group.*\n\nThank you for having me!`

            });

            await sock.groupLeave(targetGroup);

            if (!from.endsWith('@g.us')) {

                await sock.sendMessage(from, { text: `✅ Successfully left the group.` });

            }

            

            await react('✅');

        } catch (error) {

            bot.logger.error('Leave group error:', error);

            await react('❌');

            await reply(`❌ Failed to leave group: ${error.message}`);

        }

    }

});

// ============================================

// 2. ADD PARTICIPANTS

// ============================================

commands.push({

    name: 'add',

    description: 'Add participants to group',

    aliases: ['addmember', 'invite'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *ADD PARTICIPANTS*\n\nUsage: ${config.PREFIX}add <phone numbers>\n\n*Examples:*\n• ${config.PREFIX}add 254700000000\n• Reply to a message with ${config.PREFIX}add`);

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can add participants!');

            }

            const participants = [];

            

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

                participants.push(msg.message.extendedTextMessage.contextInfo.participant);

            }

            for (const arg of args) {

                const jid = getJidFromMention(msg, arg);

                if (jid && !participants.includes(jid)) {

                    participants.push(jid);

                } else {

                    const phone = extractPhone(arg);

                    if (phone && phone.length >= 10) {

                        participants.push(`${phone}@s.whatsapp.net`);

                    }

                }

            }

            if (participants.length === 0) {

                return reply('❌ No valid participants specified!');

            }

            const result = await sock.groupParticipantsUpdate(from, participants, 'add');

            

            const added = result.filter(r => r.status === '200').length;

            const failed = result.filter(r => r.status !== '200').length;

            const resultText = `✅ *Add Participants Result*\n\n` +

                             `➕ Added: ${added}\n` +

                             `❌ Failed: ${failed}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Add participants error:', error);

            await react('❌');

            await reply(`❌ Failed to add participants: ${error.message}`);

        }

    }

});

// ============================================

// 3. REMOVE PARTICIPANTS

// ============================================

commands.push({

    name: 'remove',

    description: 'Remove participants from group',

    aliases: ['kick', 'rm'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can remove participants!');

            }

            const participants = [];

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

                participants.push(msg.message.extendedTextMessage.contextInfo.participant);

            }

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {

                participants.push(...msg.message.extendedTextMessage.contextInfo.mentionedJid);

            }

            for (const arg of args) {

                const jid = getJidFromMention(msg, arg);

                if (jid && !participants.includes(jid)) {

                    participants.push(jid);

                } else {

                    const phone = extractPhone(arg);

                    if (phone && phone.length >= 10) {

                        participants.push(`${phone}@s.whatsapp.net`);

                    }

                }

            }

            if (participants.length === 0) {

                return reply('❌ No participants specified to remove!');

            }

            const result = await sock.groupParticipantsUpdate(from, participants, 'remove');

            

            const removed = result.filter(r => r.status === '200').length;

            const failed = result.filter(r => r.status !== '200').length;

            const resultText = `✅ *Remove Participants Result*\n\n` +

                             `➖ Removed: ${removed}\n` +

                             `❌ Failed: ${failed}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Remove participants error:', error);

            await react('❌');

            await reply(`❌ Failed to remove participants: ${error.message}`);

        }

    }

});

// ============================================

// 4. PROMOTE TO ADMIN

// ============================================

commands.push({

    name: 'promote',

    description: 'Promote members to admin',

    aliases: ['makeadmin', 'admin'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can promote members!');

            }

            const participants = [];

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

                participants.push(msg.message.extendedTextMessage.contextInfo.participant);

            }

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {

                participants.push(...msg.message.extendedTextMessage.contextInfo.mentionedJid);

            }

            for (const arg of args) {

                const jid = getJidFromMention(msg, arg);

                if (jid && !participants.includes(jid)) {

                    participants.push(jid);

                }

            }

            if (participants.length === 0) {

                return reply('❌ No members specified to promote!');

            }

            const result = await sock.groupParticipantsUpdate(from, participants, 'promote');

            

            const promoted = result.filter(r => r.status === '200').length;

            const failed = result.filter(r => r.status !== '200').length;

            const resultText = `✅ *Promote Result*\n\n` +

                             `👑 Promoted: ${promoted}\n` +

                             `❌ Failed: ${failed}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Promote error:', error);

            await react('❌');

            await reply(`❌ Failed to promote members: ${error.message}`);

        }

    }

});

// ============================================

// 5. DEMOTE FROM ADMIN

// ============================================

commands.push({

    name: 'demote',

    description: 'Demote admins to members',

    aliases: ['removeadmin', 'unadmin'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can demote members!');

            }

            const participants = [];

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

                participants.push(msg.message.extendedTextMessage.contextInfo.participant);

            }

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {

                participants.push(...msg.message.extendedTextMessage.contextInfo.mentionedJid);

            }

            for (const arg of args) {

                const jid = getJidFromMention(msg, arg);

                if (jid && !participants.includes(jid)) {

                    participants.push(jid);

                }

            }

            if (participants.length === 0) {

                return reply('❌ No admins specified to demote!');

            }

            const result = await sock.groupParticipantsUpdate(from, participants, 'demote');

            

            const demoted = result.filter(r => r.status === '200').length;

            const failed = result.filter(r => r.status !== '200').length;

            const resultText = `✅ *Demote Result*\n\n` +

                             `👤 Demoted: ${demoted}\n` +

                             `❌ Failed: ${failed}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Demote error:', error);

            await react('❌');

            await reply(`❌ Failed to demote members: ${error.message}`);

        }

    }

});

module.exports = { commands };