const GroupHelper = require('../../megan/helpers/group');

const config = require('../../megan/config');

const commands = [];

// Helper function to format JID for display

const formatJid = (jid) => {

  if (!jid) return 'N/A';

  return `@${jid.split('@')[0]}`;

};

// Helper to extract phone number from various formats

const extractPhone = (input) => {

    if (!input) return null;

    let phone = input.replace('@s.whatsapp.net', '');

    phone = phone.replace(/\D/g, '');

    return phone || null;

};

// ============================================

// 1. CREATE GROUP

// ============================================

commands.push({

    name: 'creategroup',

    description: 'Create a new WhatsApp group',

    aliases: ['creategc', 'newgroup'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length < 1) {

            await react('❌');

            return reply(`📝 *CREATE GROUP*\n\nUsage:\n• ${config.PREFIX}creategroup Group Name\n• ${config.PREFIX}creategroup Group Name 2547xxxxxx\n\n*Example:*\n${config.PREFIX}creategroup Megan Fans 254700000000`);

        }

        await react('🔄');

        try {

            const groupName = args[0];

            const participants = [`${config.OWNER_NUMBER}@s.whatsapp.net`];

            for (let i = 1; i < args.length; i++) {

                const phone = extractPhone(args[i]);

                if (phone && phone.length >= 10) {

                    participants.push(`${phone}@s.whatsapp.net`);

                }

            }

            const group = await sock.groupCreate(groupName, participants);

            

            const resultText = `✅ *Group Created Successfully!*\n\n` +

                             `📛 *Name:* ${groupName}\n` +

                             `🆔 *ID:* ${group.id}\n` +

                             `👥 *Members:* ${participants.length}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Create group error:', error);

            await react('❌');

            await reply(`❌ Failed to create group: ${error.message}`);

        }

    }

});

// ============================================

// 2. CREATE GROUP WITH ADD

// ============================================

commands.push({

    name: 'creategcadd',

    description: 'Create group and add multiple members',

    aliases: ['creategroupadd', 'newgroupadd'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length < 2) {

            await react('❌');

            return reply(`📝 *CREATE GROUP WITH MEMBERS*\n\nUsage: ${config.PREFIX}creategcadd Group Name 2547xxxxxx 2547xxxxxx ...\n\n*Example:*\n${config.PREFIX}creategcadd Megan Team 254700000000 254711111111`);

        }

        await react('🔄');

        try {

            const groupName = args[0];

            const participants = [`${config.OWNER_NUMBER}@s.whatsapp.net`];

            for (let i = 1; i < args.length; i++) {

                const phone = extractPhone(args[i]);

                if (phone && phone.length >= 10) {

                    participants.push(`${phone}@s.whatsapp.net`);

                }

            }

            const group = await sock.groupCreate(groupName, participants);

            

            setTimeout(async () => {

                await sock.sendMessage(group.id, {

                    text: `🎉 *Welcome to ${groupName}!*\n\n` +

                          `👑 *Group Owner:* @${config.OWNER_NUMBER}\n` +

                          `📝 *Created by:* ${config.BOT_NAME}\n\n` +

                          `Use ${config.PREFIX}help to see available commands.`,

                    mentions: participants

                });

            }, 2000);

            const resultText = `✅ *Group Created with ${participants.length} Members!*\n\n` +

                             `📛 *Name:* ${groupName}\n` +

                             `🆔 *ID:* ${group.id}\n` +

                             `👥 *Members Added:* ${participants.length - 1}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Create group add error:', error);

            await react('❌');

            await reply(`❌ Failed to create group: ${error.message}`);

        }

    }

});

// ============================================

// 3. GROUP INFO

// ============================================

commands.push({

    name: 'groupinfo',

    description: 'Get detailed group information',

    aliases: ['ginfo', 'gcinfo', 'infogc'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let targetGroup = from;

        

        if (args.length > 0) {

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

            return reply('❌ This command only works for groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(targetGroup);

            const { subject, desc, size, creation, owner, participants, id } = metadata;

            const created = new Date(creation * 1000).toLocaleDateString('en-KE', {

                dateStyle: 'full',

                timeStyle: 'short'

            });

            

            const ownerJid = owner ? formatJid(owner) : 'Not available';

            const groupLink = `https://chat.whatsapp.com/${await sock.groupInviteCode(id).catch(() => 'N/A')}`;

            const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

            

            const infoText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                           `┃ *${config.BOT_NAME}*\n` +

                           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                           `📌 *GROUP INFORMATION*\n\n` +

                           `📛 *Name:* ${subject}\n` +

                           `🆔 *ID:* ${id.split('@')[0]}\n` +

                           `👥 *Total Members:* ${size}\n` +

                           `👑 *Admins:* ${admins.length}\n` +

                           `📅 *Created:* ${created}\n` +

                           `👤 *Owner:* ${ownerJid}\n` +

                           `🔗 *Invite Link:* ${groupLink}\n\n` +

                           `📝 *Description:*\n${desc || 'No description'}\n\n` +

                           `> created by wanga`;

            await sock.sendMessage(from, { text: infoText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Group info error:', error);

            await react('❌');

            await reply(`❌ Failed to get group info: ${error.message}`);

        }

    }

});

// ============================================

// 4. LIST GROUPS

// ============================================

commands.push({

    name: 'groups',

    description: 'List all groups the bot is in',

    aliases: ['grouplist', 'mygroups', 'gcs'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('🔄');

        try {

            const groups = await sock.groupFetchAllParticipating();

            const groupList = Object.values(groups);

            

            if (groupList.length === 0) {

                return reply('❌ Bot is not in any groups.');

            }

            let listText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                         `┃ *${config.BOT_NAME}*\n` +

                         `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                         `📋 *GROUPS (${groupList.length})*\n\n`;

            groupList.slice(0, 20).forEach((group, index) => {

                const size = group.participants.length;

                const admins = group.participants.filter(p => p.admin).length;

                listText += `${index + 1}. *${group.subject}*\n`;

                listText += `   👥 ${size} members | 👑 ${admins} admins\n`;

                listText += `   🆔 ${group.id.split('@')[0]}\n\n`;

            });

            if (groupList.length > 20) {

                listText += `... and ${groupList.length - 20} more groups\n\n`;

            }

            listText += `> created by wanga`;

            await sock.sendMessage(from, { text: listText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('List groups error:', error);

            await react('❌');

            await reply(`❌ Failed to list groups: ${error.message}`);

        }

    }

});

// ============================================

// 5. GROUP METADATA

// ============================================

commands.push({

    name: 'metadata',

    description: 'Get group metadata from invite link',

    aliases: ['groupmeta', 'gcinfo'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *GROUP METADATA*\n\nUsage: ${config.PREFIX}metadata <invite link>\n\n*Example:*\n${config.PREFIX}metadata https://chat.whatsapp.com/XXXXXX`);

        }

        await react('🔄');

        try {

            const link = args[0];

            if (!link.includes('chat.whatsapp.com')) {

                return reply('❌ Invalid WhatsApp group link!');

            }

            const code = link.split('/').pop();

            const data = await sock.groupGetInviteInfo(code);

            const created = new Date(data.creation * 1000).toLocaleDateString();

            const owner = data.owner ? formatJid(data.owner) : 'Unknown';

            

            const infoText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                           `┃ *${config.BOT_NAME}*\n` +

                           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                           `📌 *GROUP METADATA*\n\n` +

                           `📛 *Name:* ${data.subject}\n` +

                           `👥 *Members:* ${data.size}\n` +

                           `📅 *Created:* ${created}\n` +

                           `👑 *Owner:* ${owner}\n` +

                           `🔗 *Invite Link:* ${link}\n\n` +

                           `📝 *Description:*\n${data.desc || 'No description'}\n\n` +

                           `> created by wanga`;

            await sock.sendMessage(from, { text: infoText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Metadata error:', error);

            await react('❌');

            await reply(`❌ Failed to get metadata: ${error.message}`);

        }

    }

});

// ============================================

// 6. PARTICIPANTS

// ============================================

commands.push({

    name: 'participants',

    description: 'List all group participants',

    aliases: ['members', 'memberlist', 'participantlist'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            

            const superAdmins = [];

            const admins = [];

            const members = [];

            participants.forEach(p => {

                const formatted = `@${p.id.split('@')[0]}`;

                if (p.admin === 'superadmin') {

                    superAdmins.push(`👑 ${formatted} (Super Admin)`);

                } else if (p.admin === 'admin') {

                    admins.push(`👮 ${formatted} (Admin)`);

                } else {

                    members.push(`👤 ${formatted}`);

                }

            });

            const allParticipants = [...superAdmins, ...admins, ...members].join('\n');

            

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                             `┃ *${config.BOT_NAME}*\n` +

                             `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📋 *GROUP PARTICIPANTS*\n\n` +

                             `👑 *Super Admins (${superAdmins.length})*\n${superAdmins.join('\n') || 'None'}\n\n` +

                             `👮 *Admins (${admins.length})*\n${admins.join('\n') || 'None'}\n\n` +

                             `👤 *Members (${members.length})*\n${members.join('\n') || 'None'}\n\n` +

                             `━━━━━━━━━━━━━━━━━━━\n` +

                             `👥 *Total:* ${participants.length}\n\n` +

                             `> created by wanga`;

            const mentions = participants.map(p => p.id);

            await sock.sendMessage(from, {

                text: resultText,

                mentions: mentions

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Participants error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

module.exports = { commands };