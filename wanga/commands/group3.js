const GroupHelper = require('../../megan/helpers/group');

const config = require('../../megan/config');

const commands = [];

const formatJid = (jid) => {

  if (!jid) return 'N/A';

  return `@${jid.split('@')[0]}`;

};

// ============================================

// 1. TAG ALL

// ============================================

commands.push({

    name: 'tagall',

    description: 'Tag all group members with @all',

    aliases: ['everyone', 'all', 'mentionall'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            

            const mentions = participants.map(p => p.id);

            const allMention = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');

            

            const message = args.length > 0 ? args.join(' ') : '📢 Attention everyone!';

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                             `┃ *${config.BOT_NAME}*\n` +

                             `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📢 *MESSAGE:*\n${message}\n\n` +

                             `👥 *TAGGED MEMBERS:*\n${allMention}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: mentions

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Tagall error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// 2. TAG

// ============================================

commands.push({

    name: 'tag',

    description: 'Send message tagging all members (shows @all)',

    aliases: ['mention', 'notify'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *TAG COMMAND*\n\nUsage: ${config.PREFIX}tag <message>\n\n*Example:*\n${config.PREFIX}tag Meeting at 5pm today!`);

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            const mentions = participants.map(p => p.id);

            const message = args.join(' ');

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                             `┃ *${config.BOT_NAME}*\n` +

                             `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📢 *@all*\n\n` +

                             `💬 *Message:*\n${message}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: mentions

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Tag error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// 3. ANNOUNCE

// ============================================

commands.push({

    name: 'announce',

    description: 'Make an announcement tagging all members',

    aliases: ['ann', 'broadcast'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *ANNOUNCE*\n\nUsage: ${config.PREFIX}announce <message>\n\n*Example:*\n${config.PREFIX}announce Group meeting in 10 minutes!`);

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            const participants = metadata.participants;

            const mentions = participants.map(p => p.id);

            const message = args.join(' ');

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                             `┃ *${config.BOT_NAME}*\n` +

                             `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📢 *📢 ANNOUNCEMENT 📢*\n\n` +

                             `💬 ${message}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: mentions

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Announce error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// 4. TAG ADMINS

// ============================================

commands.push({

    name: 'tagadmins',

    description: 'Tag all group admins',

    aliases: ['admins', 'tagadmin'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');

            

            if (admins.length === 0) {

                await react('⚠️');

                return reply('⚠️ No admins found in this group!');

            }

            const mentions = admins.map(p => p.id);

            const message = args.length > 0 ? args.join(' ') : '📢 Attention admins!';

            const adminList = admins.map(p => {

                const role = p.admin === 'superadmin' ? '👑 Super Admin' : '👮 Admin';

                return `${role} @${p.id.split('@')[0]}`;

            }).join('\n');

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                             `┃ *${config.BOT_NAME}*\n` +

                             `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📢 *MESSAGE TO ADMINS:*\n${message}\n\n` +

                             `👑 *ADMINS:*\n${adminList}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: mentions

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Tagadmins error:', error);

            await react('❌');

            await reply(`❌ Error: ${error.message}`);

        }

    }

});

// ============================================

// 5. SET GROUP NAME

// ============================================

commands.push({

    name: 'setgcname',

    description: 'Change group name',

    aliases: ['setname', 'setgroupname', 'setsubject'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *SET GROUP NAME*\n\nUsage: ${config.PREFIX}setgcname <new name>\n\n*Example:*\n${config.PREFIX}setgcname Megan Support Group`);

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can change group name!');

            }

            const newName = args.join(' ');

            await sock.groupUpdateSubject(from, newName);

            const resultText = `✅ *Group Name Updated*\n\n` +

                             `📛 *New Name:* ${newName}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set group name error:', error);

            await react('❌');

            await reply(`❌ Failed to update group name: ${error.message}`);

        }

    }

});

// ============================================

// 6. SET GROUP DESCRIPTION

// ============================================

commands.push({

    name: 'setdesc',

    description: 'Change group description',

    aliases: ['setdescription', 'setgcdesc', 'setabout'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *SET GROUP DESCRIPTION*\n\nUsage: ${config.PREFIX}setdesc <description>\n\n*Example:*\n${config.PREFIX}setdesc Welcome to our group! Please read rules.`);

        }

        await react('🔄');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can change group description!');

            }

            const newDesc = args.join(' ');

            await sock.groupUpdateDescription(from, newDesc);

            const resultText = `✅ *Group Description Updated*\n\n` +

                             `📝 *New Description:*\n${newDesc}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set description error:', error);

            await react('❌');

            await reply(`❌ Failed to update description: ${error.message}`);

        }

    }

});

// ============================================

// 7. GET INVITE LINK

// ============================================

commands.push({

    name: 'invite',

    description: 'Get group invite link',

    aliases: ['invitelink', 'link', 'gclink'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔗');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can get invite link!');

            }

            const code = await sock.groupInviteCode(from);

            const link = `https://chat.whatsapp.com/${code}`;

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                             `┃ *${config.BOT_NAME}*\n` +

                             `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🔗 *GROUP INVITE LINK*\n\n` +

                             `📛 *Group:* ${metadata.subject}\n` +

                             `🔗 *Link:* ${link}\n\n` +

                             `⚠️ *Link expires in 7 days*\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Invite link error:', error);

            await react('❌');

            await reply(`❌ Failed to get invite link: ${error.message}`);

        }

    }

});

// ============================================

// 8. REVOKE INVITE LINK

// ============================================

commands.push({

    name: 'revokeinvite',

    description: 'Revoke current invite link and generate new one',

    aliases: ['revoke', 'newlink', 'resetlink'],

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

                return reply('❌ Only admins can revoke invite link!');

            }

            await sock.groupRevokeInvite(from);

            const newCode = await sock.groupInviteCode(from);

            const newLink = `https://chat.whatsapp.com/${newCode}`;

            const resultText = `✅ *Invite Link Revoked*\n\n` +

                             `📛 *Group:* ${metadata.subject}\n` +

                             `🔗 *New Link:* ${newLink}\n\n` +

                             `⚠️ Old link no longer works\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Revoke invite error:', error);

            await react('❌');

            await reply(`❌ Failed to revoke invite link: ${error.message}`);

        }

    }

});

// ============================================

// 9. JOIN GROUP

// ============================================

commands.push({

    name: 'join',

    description: 'Join a group using invite link',

    aliases: ['acceptinvite', 'joingroup'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length === 0) {

            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {

                const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;

                let quotedText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '';

                

                const linkMatch = quotedText.match(/(https?:\/\/)?chat\.whatsapp\.com\/[A-Za-z0-9]+/);

                if (linkMatch) {

                    args[0] = linkMatch[0];

                }

            }

        }

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *JOIN GROUP*\n\nUsage: ${config.PREFIX}join <invite link>\n\n*Examples:*\n• ${config.PREFIX}join https://chat.whatsapp.com/XXXXXX\n• Reply to a message with invite link using ${config.PREFIX}join`);

        }

        await react('🔄');

        try {

            const link = args[0];

            if (!link.includes('chat.whatsapp.com')) {

                return reply('❌ Invalid WhatsApp group link!');

            }

            const code = link.split('/').pop();

            const result = await sock.groupAcceptInvite(code);

            const resultText = `✅ *Successfully Joined Group!*\n\n` +

                             `🆔 *Group ID:* ${result.split('@')[0]}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Join group error:', error);

            await react('❌');

            await reply(`❌ Failed to join group: ${error.message}\n\nMake sure the link is valid and not expired.`);

        }

    }

});

module.exports = { commands };