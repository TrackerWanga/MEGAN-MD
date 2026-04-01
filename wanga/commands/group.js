// MEGAN-MD Group Commands - Consistent styling with buttons

const GroupHelper = require('../../megan/helpers/groupHelper');
const config = require('../../megan/config');
const { downloadMediaMessage } = require('gifted-baileys');

const commands = [];

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';

// Helper function using same pattern as basic.js
async function sendButtonMenu(sock, from, options, quotedMsg) {
    const { sendButtons } = require('gifted-btns');
    
    try {
        return await sendButtons(sock, from, {
            title: options.title || '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: options.text,
            footer: options.footer || '> created by wanga',
            image: options.image ? { url: options.image } : null,
            buttons: options.buttons || []
        }, { quoted: quotedMsg });
    } catch (error) {
        console.error('Button error:', error);
        await sock.sendMessage(from, { text: options.text }, { quoted: quotedMsg });
    }
}

async function sendWithLogo(sock, to, text, quoted = null) {
    await sendButtonMenu(sock, to, {
        title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
        text: text,
        image: BOT_LOGO,
        buttons: [
            { id: `${config.PREFIX}grouphelp`, text: '👥 Group Help' },
            { id: `${config.PREFIX}menu`, text: '📋 Menu' },
            { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
        ]
    }, quoted);
}

// ============================================
// SECTION 1: CREATION & INFORMATION
// ============================================

// 1. CREATE GROUP
commands.push({
    name: 'creategroup',
    description: 'Create a new WhatsApp group',
    aliases: ['creategc', 'newgroup'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length < 1) {
            await react('❌');
            return sendWithLogo(sock, from, 
                `📝 *CREATE GROUP*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}creategroup <name> [phone numbers]\n\n_Example:_ ${config.PREFIX}creategroup My Team 254700000000\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`, 
                msg);
        }

        await react('🔄');

        try {
            const groupName = args[0];
            const participants = [`${config.OWNER_NUMBER}@s.whatsapp.net`];

            for (let i = 1; i < args.length; i++) {
                const phone = GroupHelper.extractPhone(args[i]);
                if (phone && phone.length >= 10) {
                    participants.push(`${phone}@s.whatsapp.net`);
                }
            }

            const group = await sock.groupCreate(groupName, participants);

            const result = `✅ *GROUP CREATED*\n━━━━━━━━━━━━━━━━━━━\n_📛 Name:_ ${groupName}\n_👥 Members:_ ${participants.length}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Create group error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 2. GROUP INFO
commands.push({
    name: 'groupinfo',
    description: 'Get detailed group information',
    aliases: ['ginfo', 'infogc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetGroup = from;

        if (args.length > 0) {
            const link = args[0];
            if (link.includes('chat.whatsapp.com')) {
                const code = GroupHelper.extractGroupCode(link);
                try {
                    const data = await sock.groupGetInviteInfo(code);
                    targetGroup = data.id;
                } catch (e) {
                    await react('❌');
                    return reply(`❌ *Invalid group invite link!*\n\n> created by wanga`);
                }
            } else {
                targetGroup = link.endsWith('@g.us') ? link : `${link}@g.us`;
            }
        }

        if (!GroupHelper.isGroupJid(targetGroup)) {
            await react('❌');
            return reply(`❌ *Invalid group ID or link!*\n\n> created by wanga`);
        }

        await react('ℹ️');

        try {
            const metadata = await sock.groupMetadata(targetGroup);
            const info = GroupHelper.formatGroupInfo(metadata);

            await sendWithLogo(sock, from, info, msg);
            await react('✅');
        } catch (error) {
            console.error('Group info error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 3. LIST GROUPS
commands.push({
    name: 'groups',
    description: 'List all groups bot is in',
    aliases: ['grouplist', 'mygroups'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('📋');

        try {
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups);

            if (groupList.length === 0) {
                return reply(`❌ *Bot is not in any groups.*\n\n> created by wanga`);
            }

            let list = `*📋 MY GROUPS (${groupList.length})*\n\n`;

            groupList.slice(0, 20).forEach((group, index) => {
                const size = group.participants.length;
                const admins = group.participants.filter(p => p.admin).length;
                const status = group.announce ? '🔒' : '🔓';
                list += `${index + 1}. ${status} *${group.subject}*\n`;
                list += `   👥 ${size} members | 👑 ${admins} admins\n`;
                list += `   🆔 ${group.id.split('@')[0]}\n\n`;
            });

            if (groupList.length > 20) {
                list += `... and ${groupList.length - 20} more groups\n`;
            }

            list += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, list, msg);
            await react('✅');
        } catch (error) {
            console.error('List groups error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 4. PARTICIPANTS LIST
commands.push({
    name: 'participants',
    description: 'List all group participants',
    aliases: ['members', 'memberlist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('📋');

        try {
            const metadata = await sock.groupMetadata(from);
            const list = await GroupHelper.formatParticipantList(metadata.participants, sock);

            const result = `*📋 PARTICIPANTS (${metadata.participants.length})*\n\n${list}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Participants error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// ============================================
// SECTION 2: MEMBER MANAGEMENT
// ============================================

// 5. LEAVE GROUP
commands.push({
    name: 'leave',
    description: 'Leave a group',
    aliases: ['exit', 'leavegc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let targetGroup = from;

        if (!GroupHelper.isGroupJid(from) && args.length > 0) {
            const link = args[0];
            if (link.includes('chat.whatsapp.com')) {
                const code = GroupHelper.extractGroupCode(link);
                try {
                    const data = await sock.groupGetInviteInfo(code);
                    targetGroup = data.id;
                } catch (e) {
                    await react('❌');
                    return reply(`❌ *Invalid group invite link!*\n\n> created by wanga`);
                }
            }
        }

        if (!GroupHelper.isGroupJid(targetGroup)) {
            await react('❌');
            return reply(`❌ *Please use this command in a group or provide a valid link!*\n\n> created by wanga`);
        }

        await react('👋');

        try {
            await sock.sendMessage(targetGroup, { text: `👋 *${config.BOT_NAME} is leaving this group.*\n\nThank you for having me!` });
            await sock.groupLeave(targetGroup);

            if (!GroupHelper.isGroupJid(from)) {
                await sendWithLogo(sock, from, `✅ *Successfully left the group.*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`, msg);
            }

            await react('✅');
        } catch (error) {
            console.error('Leave group error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 6. ADD MEMBERS
commands.push({
    name: 'add',
    description: 'Add members to group',
    aliases: ['addmember', 'invite'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0 && !msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            await react('❌');
            return reply(`📝 *ADD MEMBERS*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}add @user or ${config.PREFIX}add 254700000000\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can add members!*\n\n> created by wanga`);
            }

            const participants = [];
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            participants.push(...mentions);

            for (const arg of args) {
                const jid = GroupHelper.getJidFromInput(msg, arg);
                if (jid && !participants.includes(jid)) {
                    participants.push(jid);
                }
            }

            if (participants.length === 0) {
                return reply(`❌ *No valid participants specified!*\n\n> created by wanga`);
            }

            const results = await sock.groupParticipantsUpdate(from, participants, 'add');
            const result = GroupHelper.formatActionResult('add', results);

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Add error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 7. REMOVE MEMBERS
commands.push({
    name: 'remove',
    description: 'Remove members from group',
    aliases: ['kick', 'rm'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can remove members!*\n\n> created by wanga`);
            }

            const participants = [];
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            participants.push(...mentions);

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                participants.push(msg.message.extendedTextMessage.contextInfo.participant);
            }

            for (const arg of args) {
                const jid = GroupHelper.getJidFromInput(msg, arg);
                if (jid && !participants.includes(jid)) {
                    participants.push(jid);
                }
            }

            if (participants.length === 0) {
                return reply(`❌ *No participants specified to remove!*\n\n> created by wanga`);
            }

            const results = await sock.groupParticipantsUpdate(from, participants, 'remove');
            const result = GroupHelper.formatActionResult('remove', results);

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Remove error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 8. PROMOTE TO ADMIN
commands.push({
    name: 'promote',
    description: 'Promote members to admin',
    aliases: ['makeadmin'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can promote members!*\n\n> created by wanga`);
            }

            const participants = [];
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            participants.push(...mentions);

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                participants.push(msg.message.extendedTextMessage.contextInfo.participant);
            }

            if (participants.length === 0) {
                return reply(`❌ *No members specified to promote!*\n\n> created by wanga`);
            }

            const results = await sock.groupParticipantsUpdate(from, participants, 'promote');
            const result = GroupHelper.formatActionResult('promote', results);

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Promote error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 9. DEMOTE FROM ADMIN
commands.push({
    name: 'demote',
    description: 'Demote admins to members',
    aliases: ['removeadmin'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can demote members!*\n\n> created by wanga`);
            }

            const participants = [];
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            participants.push(...mentions);

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                participants.push(msg.message.extendedTextMessage.contextInfo.participant);
            }

            if (participants.length === 0) {
                return reply(`❌ *No admins specified to demote!*\n\n> created by wanga`);
            }

            const results = await sock.groupParticipantsUpdate(from, participants, 'demote');
            const result = GroupHelper.formatActionResult('demote', results);

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Demote error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// ============================================
// SECTION 3: TAGGING
// ============================================

// 10. TAG ALL MEMBERS
commands.push({
    name: 'tagall',
    description: 'Tag all group members',
    aliases: ['everyone', 'all'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const senderName = sender.split('@')[0];
            const mentions = GroupHelper.getAllMentions(participants);

            const formattedParticipants = await Promise.all(
                participants.map(async (p, i) => {
                    const formatted = await GroupHelper.formatJid(p.id, sock);
                    return `${i + 1}. ${formatted}`;
                })
            );
            const participantList = formattedParticipants.slice(0, 20).join('\n');
            const messageText = args.length > 0 ? args.join(' ') : '📢 Attention everyone!';

            let result = `𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐓𝐀𝐆\n\n📝 *Message:* ${messageText}\n\n👥 *Members (${participants.length}):*\n${participantList}`;
            if (participants.length > 20) {
                result += `\n... and ${participants.length - 20} more`;
            }
            result += `\n\n👤 *By:* @${senderName}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await sock.sendMessage(from, { text: ' ', mentions }, { quoted: msg });
            await react('✅');
        } catch (error) {
            console.error('Tagall error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 11. HIDE TAG (secret mentions)
commands.push({
    name: 'hidetag',
    description: 'Send message that secretly tags everyone',
    aliases: ['htag', 'hidden'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *HIDE TAG*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}hidetag <message>\n\n_Example:_ ${config.PREFIX}hidetag Meeting at 5pm\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🕵️');

        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            const senderName = sender.split('@')[0];
            const mentions = GroupHelper.getAllMentions(participants);
            const messageText = args.join(' ');

            const result = `𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐓𝐀𝐆\n\n${messageText}\n\n👤 *By:* @${senderName}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await sock.sendMessage(from, { text: ' ', mentions }, { quoted: msg });
            await react('✅');
        } catch (error) {
            console.error('Hidetag error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 12. TAG ADMINS
commands.push({
    name: 'tagadmins',
    description: 'Tag all group admins',
    aliases: ['admins'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('👑');

        try {
            const metadata = await sock.groupMetadata(from);
            const adminParticipants = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
            const adminJids = GroupHelper.getAdminMentions(metadata.participants);
            const senderName = sender.split('@')[0];

            if (adminJids.length === 0) {
                await react('⚠️');
                return reply(`⚠️ *No admins found in this group!*\n\n> created by wanga`);
            }

            const formattedAdmins = await Promise.all(
                adminParticipants.map(async (p, i) => {
                    const formatted = await GroupHelper.formatJid(p.id, sock);
                    const role = p.admin === 'superadmin' ? '👑' : '👮';
                    return `${i + 1}. ${role} ${formatted}`;
                })
            );
            const adminList = formattedAdmins.join('\n');
            const messageText = args.length > 0 ? args.join(' ') : '📢 Attention admins!';

            const result = `𝐌𝐄𝐆𝐀𝐍-𝐌𝐃 𝐓𝐀𝐆\n\n📝 *Message:* ${messageText}\n\n👑 *Admins (${adminJids.length}):*\n${adminList}\n\n👤 *By:* @${senderName}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await sock.sendMessage(from, { text: ' ', mentions: adminJids }, { quoted: msg });
            await react('✅');
        } catch (error) {
            console.error('Tagadmins error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// ============================================
// SECTION 4: SETTINGS & MODERATION
// ============================================

// 13. SET GROUP NAME
commands.push({
    name: 'setname',
    description: 'Change group name',
    aliases: ['setgcname', 'setgroupname'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *SET NAME*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}setname <new name>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can change group name!*\n\n> created by wanga`);
            }

            const newName = args.join(' ');
            await sock.groupUpdateSubject(from, newName);

            const result = `✅ *NAME UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_📛 New Name:_ ${newName}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Set name error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 14. SET GROUP DESCRIPTION
commands.push({
    name: 'setdesc',
    description: 'Change group description',
    aliases: ['setdescription', 'setgcdesc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *SET DESCRIPTION*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}setdesc <description>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can change group description!*\n\n> created by wanga`);
            }

            const newDesc = args.join(' ');
            await sock.groupUpdateDescription(from, newDesc);

            const result = `✅ *DESCRIPTION UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_📝 New Description:_\n${newDesc}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Set description error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 15. GET INVITE LINK
commands.push({
    name: 'invite',
    description: 'Get group invite link',
    aliases: ['link', 'gclink'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('🔗');

        try {
            const metadata = await sock.groupMetadata(from);
            const isAdmin = GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER);

            if (!isAdmin) {
                await react('⚠️');
                return reply(`❌ *Only admins can get invite link!*\n\n> created by wanga`);
            }

            const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = GroupHelper.isAdmin(metadata.participants, botJid);

            if (!isBotAdmin) {
                return reply(`⚠️ *Bot is not an admin!*\n\nMake the bot an admin first.\n\n> created by wanga`);
            }

            const code = await sock.groupInviteCode(from);
            const link = `https://chat.whatsapp.com/${code}`;

            const result = `🔗 *INVITE LINK*\n━━━━━━━━━━━━━━━━━━━\n_📛 Group:_ ${metadata.subject}\n_🔗 Link:_ ${link}\n\n⚠️ Expires in 7 days\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Invite error:', error);
            await react('❌');
            if (error.message === 'not-authorized' || error.data === 401) {
                reply(`❌ *Bot is not authorized!*\n\nMake sure the bot is an admin in this group.\n\n> created by wanga`);
            } else {
                reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
            }
        }
    }
});

// 16. REVOKE INVITE LINK
commands.push({
    name: 'revoke',
    description: 'Revoke and generate new invite link',
    aliases: ['revokelink', 'newlink'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);
            const isAdmin = GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER);

            if (!isAdmin) {
                await react('⚠️');
                return reply(`❌ *Only admins can revoke invite link!*\n\n> created by wanga`);
            }

            const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = GroupHelper.isAdmin(metadata.participants, botJid);

            if (!isBotAdmin) {
                return reply(`⚠️ *Bot is not an admin!*\n\nMake the bot an admin first.\n\n> created by wanga`);
            }

            await sock.groupRevokeInvite(from);
            const newCode = await sock.groupInviteCode(from);
            const newLink = `https://chat.whatsapp.com/${newCode}`;

            const result = `✅ *LINK REVOKED*\n━━━━━━━━━━━━━━━━━━━\n_📛 Group:_ ${metadata.subject}\n_🔗 New Link:_ ${newLink}\n\n⚠️ Old link no longer works\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Revoke error:', error);
            await react('❌');
            if (error.message === 'not-authorized' || error.data === 401) {
                reply(`❌ *Bot is not authorized!*\n\nMake sure the bot is an admin in this group.\n\n> created by wanga`);
            } else {
                reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
            }
        }
    }
});

// 17. JOIN GROUP
commands.push({
    name: 'join',
    description: 'Join a group using invite link',
    aliases: ['joingroup'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;
                const quotedText = quoted.conversation || quoted.extendedTextMessage?.text || '';
                const linkMatch = quotedText.match(/(https?:\/\/)?chat\.whatsapp\.com\/[A-Za-z0-9]+/);
                if (linkMatch) args[0] = linkMatch[0];
            }
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *JOIN GROUP*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}join <invite link>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔄');

        try {
            const link = args[0];
            if (!link.includes('chat.whatsapp.com')) {
                return reply(`❌ *Invalid WhatsApp group link!*\n\n> created by wanga`);
            }

            const code = GroupHelper.extractGroupCode(link);
            const result = await sock.groupAcceptInvite(code);

            const replyMsg = `✅ *JOINED GROUP*\n━━━━━━━━━━━━━━━━━━━\n_🆔 ID:_ ${result.split('@')[0]}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, replyMsg, msg);
            await react('✅');
        } catch (error) {
            console.error('Join error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\nMake sure the link is valid.\n\n> created by wanga`);
        }
    }
});

// 18. LOCK MESSAGES
commands.push({
    name: 'lock',
    description: 'Lock/unlock group messages (on/off)',
    aliases: ['lockmessages'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
            await react('❌');
            return reply(`📝 *LOCK MESSAGES*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}lock on (admins only) or ${config.PREFIX}lock off (everyone)\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔒');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can change group settings!*\n\n> created by wanga`);
            }

            const setting = args[0].toLowerCase() === 'on' ? 'announcement' : 'not_announcement';
            await sock.groupSettingUpdate(from, setting);

            const status = setting === 'announcement' ? '🔒 *Locked* (admins only)' : '🔓 *Unlocked* (everyone)';
            const result = `✅ *Messages ${status}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Lock error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 19. LOCK INFO EDITING
commands.push({
    name: 'lockinfo',
    description: 'Lock/unlock group info editing (on/off)',
    aliases: ['lockedit'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0 || !['on', 'off'].includes(args[0].toLowerCase())) {
            await react('❌');
            return reply(`📝 *LOCK INFO*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}lockinfo on (admins only) or ${config.PREFIX}lockinfo off (everyone)\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔒');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can change group settings!*\n\n> created by wanga`);
            }

            const setting = args[0].toLowerCase() === 'on' ? 'locked' : 'unlocked';
            await sock.groupSettingUpdate(from, setting);

            const status = setting === 'locked' ? '🔒 *Locked* (admins only)' : '🔓 *Unlocked* (everyone)';
            const result = `✅ *Info Editing ${status}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Lock info error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 20. DISAPPEARING MESSAGES
commands.push({
    name: 'disappear',
    description: 'Set disappearing messages (24h/7d/90d/off)',
    aliases: ['ephemeral'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *DISAPPEARING MESSAGES*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}disappear <24h/7d/90d/off>\n\n_Examples:_\n• ${config.PREFIX}disappear 24h\n• ${config.PREFIX}disappear off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('⏱️');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can change this setting!*\n\n> created by wanga`);
            }

            const option = args[0].toLowerCase();
            let expiration = 0;
            let text = 'off';

            if (option === '24h') {
                expiration = 86400;
                text = '24 hours';
            } else if (option === '7d') {
                expiration = 604800;
                text = '7 days';
            } else if (option === '90d') {
                expiration = 7776000;
                text = '90 days';
            }

            await sock.groupToggleEphemeral(from, expiration);

            const result = `✅ *Disappearing messages set to ${text}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Disappear error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 21. ADD MEMBER MODE
commands.push({
    name: 'addmode',
    description: 'Set who can add members (all/admins)',
    aliases: ['memberaddmode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0 || !['all', 'admins'].includes(args[0].toLowerCase())) {
            await react('❌');
            return reply(`📝 *ADD MEMBER MODE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}addmode all (everyone) or ${config.PREFIX}addmode admins (only admins)\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔄');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can change this setting!*\n\n> created by wanga`);
            }

            const mode = args[0].toLowerCase() === 'all' ? 'all_member_add' : 'admin_add';
            await sock.groupMemberAddMode(from, mode);

            const result = `✅ *Member add mode set to ${args[0].toLowerCase()}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Addmode error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// ============================================
// SECTION 5: INTERACTIVE
// ============================================

// 22. CREATE POLL
commands.push({
    name: 'poll',
    description: 'Create a poll (single choice)',
    aliases: ['createpoll'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length < 3) {
            await react('❌');
            return reply(`📊 *CREATE POLL*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}poll "Question" "Option1" "Option2" ...\n\n_Example:_ ${config.PREFIX}poll "Best color?" "Red" "Blue" "Green"\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('📊');

        try {
            const parsed = GroupHelper.parsePollArgs(args);
            if (parsed.length < 2) {
                return reply(`❌ *Please provide at least 2 options!*\n\n> created by wanga`);
            }

            const question = parsed[0];
            const options = parsed.slice(1);

            await sock.sendMessage(from, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: 1
                }
            });

            await react('✅');
        } catch (error) {
            console.error('Poll error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 23. MULTI-POLL
commands.push({
    name: 'multipoll',
    description: 'Create a poll with multiple selections',
    aliases: ['mpoll'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length < 4) {
            await react('❌');
            return reply(`📊 *MULTI-POLL*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}multipoll "Question" "Option1" "Option2" ... [max selections]\n\n_Example:_ ${config.PREFIX}multipoll "Choose toppings" "Cheese" "Pepperoni" "Mushrooms" 2\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('📊');

        try {
            const parsed = GroupHelper.parsePollArgs(args);
            if (parsed.length < 3) {
                return reply(`❌ *Please provide at least 2 options!*\n\n> created by wanga`);
            }

            let selectableCount = 1;
            const last = parsed[parsed.length - 1];
            if (!isNaN(last) && !last.startsWith('"')) {
                selectableCount = parseInt(last);
                parsed.pop();
            }

            const question = parsed[0];
            const options = parsed.slice(1);

            await sock.sendMessage(from, {
                poll: {
                    name: question,
                    values: options,
                    selectableCount: selectableCount
                }
            });

            await react('✅');
        } catch (error) {
            console.error('Multi-poll error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 24. GROUP STATUS
commands.push({
    name: 'gstatus',
    description: 'Send a status/story in the group',
    aliases: ['groupstatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
        const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;
        const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;

        if (args.length === 0 && !hasImage && !hasVideo && !hasAudio) {
            await react('❌');
            return reply(`📝 *GROUP STATUS*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n• ${config.PREFIX}gstatus <text>\n• Reply to image/video/audio\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('🔄');

        try {
            if (args.length > 0) {
                const text = args.join(' ');
                await sock.sendMessage(from, {
                    groupStatusMessage: { text }
                });
            } else if (hasImage || hasVideo || hasAudio) {
                const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage
                    ? msg
                    : { ...msg, message: quoted };

                const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, { logger: console });

                const content = {};
                if (hasImage) content.image = buffer;
                if (hasVideo) content.video = buffer;
                if (hasAudio) {
                    content.audio = buffer;
                    content.ptt = true;
                }

                await sock.sendMessage(from, {
                    groupStatusMessage: content
                });
            }

            await react('✅');
        } catch (error) {
            console.error('Group status error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 25. JOIN REQUESTS
commands.push({
    name: 'requests',
    description: 'List pending join requests',
    aliases: ['joinrequests', 'pending'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        await react('📋');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can view join requests!*\n\n> created by wanga`);
            }

            const requests = await sock.groupRequestParticipantsList(from);

            if (!requests || requests.length === 0) {
                return reply(`📋 *No pending join requests.*\n\n> created by wanga`);
            }

            let list = `*📋 PENDING REQUESTS (${requests.length})*\n\n`;
            for (let i = 0; i < requests.length; i++) {
                const formatted = await GroupHelper.formatJid(requests[i].jid, sock);
                list += `${i + 1}. ${formatted}\n`;
            }
            list += `\nUse ${config.PREFIX}approve <number> or ${config.PREFIX}reject <number>`;
            list += `\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, list, msg);
            await react('✅');
        } catch (error) {
            console.error('Requests error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 26. APPROVE JOIN REQUEST
commands.push({
    name: 'approve',
    description: 'Approve join request',
    aliases: ['accept'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *APPROVE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}approve <number from requests list>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('✅');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can approve requests!*\n\n> created by wanga`);
            }

            const requests = await sock.groupRequestParticipantsList(from);
            const index = parseInt(args[0]) - 1;

            if (isNaN(index) || index < 0 || index >= requests.length) {
                return reply(`❌ *Invalid request number!*\n\n> created by wanga`);
            }

            const targetJid = requests[index].jid;
            const formattedJid = await GroupHelper.formatJid(targetJid, sock);
            await sock.groupRequestParticipantsUpdate(from, [targetJid], 'approve');

            const result = `✅ *Approved ${formattedJid}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Approve error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 27. REJECT JOIN REQUEST
commands.push({
    name: 'reject',
    description: 'Reject join request',
    aliases: ['deny'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!GroupHelper.isGroupJid(from)) {
            await react('❌');
            return reply(`❌ *This command can only be used in groups!*\n\n> created by wanga`);
        }

        if (args.length === 0) {
            await react('❌');
            return reply(`📝 *REJECT*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}reject <number from requests list>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`);
        }

        await react('❌');

        try {
            const metadata = await sock.groupMetadata(from);

            if (!GroupHelper.canPerformAdminAction(metadata, sender, config.OWNER_NUMBER)) {
                await react('⚠️');
                return reply(`❌ *Only admins can reject requests!*\n\n> created by wanga`);
            }

            const requests = await sock.groupRequestParticipantsList(from);
            const index = parseInt(args[0]) - 1;

            if (isNaN(index) || index < 0 || index >= requests.length) {
                return reply(`❌ *Invalid request number!*\n\n> created by wanga`);
            }

            const targetJid = requests[index].jid;
            const formattedJid = await GroupHelper.formatJid(targetJid, sock);
            await sock.groupRequestParticipantsUpdate(from, [targetJid], 'reject');

            const result = `❌ *Rejected ${formattedJid}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendWithLogo(sock, from, result, msg);
            await react('✅');
        } catch (error) {
            console.error('Reject error:', error);
            await react('❌');
            reply(`❌ *Error:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 28. GROUP HELP
commands.push({
    name: 'grouphelp',
    description: 'Show all group commands',
    aliases: ['ghelp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const prefix = config.PREFIX;

        const help = `👥 *GROUP COMMANDS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*📋 INFO*\n` +
            `_${prefix}creategroup <name> [phones]_ - Create group\n` +
            `_${prefix}groupinfo [link]_ - Group details\n` +
            `_${prefix}groups_ - List groups\n` +
            `_${prefix}participants_ - List members\n\n` +

            `*👤 MEMBERS*\n` +
            `_${prefix}add <@user/phone>_ - Add members\n` +
            `_${prefix}remove <@user>_ - Remove members\n` +
            `_${prefix}promote <@user>_ - Make admin\n` +
            `_${prefix}demote <@user>_ - Remove admin\n` +
            `_${prefix}leave_ - Leave group\n\n` +

            `*🏷️ TAGGING*\n` +
            `_${prefix}tagall [message]_ - Tag all\n` +
            `_${prefix}hidetag <message>_ - Secret tag\n` +
            `_${prefix}tagadmins [message]_ - Tag admins\n\n` +

            `*⚙️ SETTINGS*\n` +
            `_${prefix}setname <name>_ - Change name\n` +
            `_${prefix}setdesc <desc>_ - Change description\n` +
            `_${prefix}lock on/off_ - Lock messages\n` +
            `_${prefix}lockinfo on/off_ - Lock info editing\n` +
            `_${prefix}disappear <24h/7d/90d/off>_ - Disappearing messages\n` +
            `_${prefix}addmode all/admins_ - Who can add\n\n` +

            `*🔗 INVITES*\n` +
            `_${prefix}invite_ - Get invite link\n` +
            `_${prefix}revoke_ - New invite link\n` +
            `_${prefix}join <link>_ - Join group\n\n` +

            `*📊 INTERACTIVE*\n` +
            `_${prefix}poll "Q" "A" "B"..._ - Create poll\n` +
            `_${prefix}multipoll "Q" "A" "B"... [count]_ - Multi poll\n` +
            `_${prefix}gstatus [text/media]_ - Group status\n\n` +

            `*👥 JOIN REQUESTS*\n` +
            `_${prefix}requests_ - Pending requests\n` +
            `_${prefix}approve <number>_ - Approve request\n` +
            `_${prefix}reject <number>_ - Reject request\n\n` +

            `> created by wanga`;

        await sendWithLogo(sock, from, help, msg);
        await react('✅');
    }
});

module.exports = { commands };
