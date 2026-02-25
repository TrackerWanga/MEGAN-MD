const config = require('../../megan/config');

const commands = [];

// ============================================

// SET OWNER PHONE - Saves to database

// ============================================

commands.push({

    name: 'setownerphone',

    description: 'Change owner phone number',

    aliases: ['ownerphone'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length === 0) {

            const current = await bot.db.getSetting('ownerphone') || config.OWNER_NUMBER;

            return reply(`📞 *Current owner phone:* ${current}\n\nUsage: ${config.PREFIX}setownerphone <number>\nExample: ${config.PREFIX}setownerphone 254712345678`);

        }

        const newPhone = args[0].replace(/\D/g, '');

        if (newPhone.length < 10) {

            return reply('❌ Invalid phone number! Include country code (e.g., 254...)');

        }

        // Save to database

        await bot.db.setSetting('ownerphone', newPhone);

        

        // Also update config for current session

        config.OWNER_NUMBER = newPhone;

        

        await react('✅');

        await reply(`✅ Owner phone changed to: ${newPhone}`);

    }

});

// ============================================

// BLOCK USER - Direct execution, no saving needed

// ============================================

commands.push({

    name: 'block',

    description: 'Block a user',

    aliases: ['blockuser'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let target = null;

        // Check if replying to a message

        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

            target = msg.message.extendedTextMessage.contextInfo.participant;

        }

        // Check for mentions

        else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        }

        // Check for phone number in args

        else if (args.length > 0) {

            const phone = args[0].replace(/\D/g, '');

            if (phone && phone.length >= 10) {

                target = `${phone}@s.whatsapp.net`;

            }

        }

        if (!target) {

            await react('❌');

            return reply(`🔨 *BLOCK USER*\n\nUsage: ${config.PREFIX}block <@user/phone>\nOr reply to their message with ${config.PREFIX}block`);

        }

        await react('🔨');

        try {

            await sock.updateBlockStatus(target, 'block');

            

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🔨 *USER BLOCKED*\n\n` +

                             `👤 *User:* @${target.split('@')[0]}\n` +

                             `🚫 *Status:* Blocked successfully\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: [target]

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Block error:', error);

            await react('❌');

            await reply(`❌ Failed to block user: ${error.message}`);

        }

    }

});

// ============================================

// UNBLOCK USER - Direct execution, no saving needed

// ============================================

commands.push({

    name: 'unblock',

    description: 'Unblock a user',

    aliases: ['unblockuser'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

            target = msg.message.extendedTextMessage.contextInfo.participant;

        }

        else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        }

        else if (args.length > 0) {

            const phone = args[0].replace(/\D/g, '');

            if (phone && phone.length >= 10) {

                target = `${phone}@s.whatsapp.net`;

            }

        }

        if (!target) {

            await react('❌');

            return reply(`🔓 *UNBLOCK USER*\n\nUsage: ${config.PREFIX}unblock <@user/phone>\nOr reply to their message with ${config.PREFIX}unblock`);

        }

        await react('🔓');

        try {

            await sock.updateBlockStatus(target, 'unblock');

            

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🔓 *USER UNBLOCKED*\n\n` +

                             `👤 *User:* @${target.split('@')[0]}\n` +

                             `✅ *Status:* Unblocked successfully\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: [target]

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Unblock error:', error);

            await react('❌');

            await reply(`❌ Failed to unblock user: ${error.message}`);

        }

    }

});

// ============================================

// LIST BLOCKED USERS - Direct fetch from WhatsApp

// ============================================

commands.push({

    name: 'listblocked',

    description: 'List all blocked users',

    aliases: ['blocklist', 'blocked'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('📋');

        try {

            const blocklist = await sock.fetchBlocklist();

            

            if (!blocklist || blocklist.length === 0) {

                return reply('📋 *No blocked users found.*');

            }

            let listText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                          `📋 *BLOCKED USERS (${blocklist.length})*\n\n`;

            blocklist.forEach((jid, index) => {

                listText += `${index + 1}. @${jid.split('@')[0]}\n`;

            });

            listText += `\n> created by wanga`;

            await sock.sendMessage(from, {

                text: listText,

                mentions: blocklist

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Blocklist error:', error);

            await react('❌');

            await reply(`❌ Failed to fetch blocklist: ${error.message}`);

        }

    }

});

// ============================================

// SET LAST SEEN PRIVACY - WhatsApp API + Save to DB

// ============================================

commands.push({

    name: 'setlastseen',

    description: 'Set last seen privacy',

    aliases: ['lastseenprivacy'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const setting = args[0]?.toLowerCase();

        const validSettings = ['all', 'contacts', 'none'];

        if (!setting || !validSettings.includes(setting)) {

            await react('❌');

            return reply(`👁️ *LAST SEEN PRIVACY*\n\nUsage: ${config.PREFIX}setlastseen <all/contacts/none>\n\n*Options:*\n• all - Everyone can see\n• contacts - Only contacts\n• none - Nobody\n\n*Example:* ${config.PREFIX}setlastseen contacts`);

        }

        await react('👁️');

        try {

            await sock.updateLastSeenPrivacy(setting);

            

            // Save to database

            await bot.db.setSetting('lastseen', setting);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `👁️ *LAST SEEN PRIVACY UPDATED*\n\n` +

                             `⚙️ *Setting:* ${setting}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set last seen error:', error);

            await react('❌');

            await reply(`❌ Failed to update privacy: ${error.message}`);

        }

    }

});

// ============================================

// SET PROFILE PICTURE PRIVACY - WhatsApp API + Save to DB

// ============================================

commands.push({

    name: 'setprofilepic',

    description: 'Set profile picture privacy',

    aliases: ['profilepicprivacy', 'ppprivacy'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const setting = args[0]?.toLowerCase();

        const validSettings = ['all', 'contacts', 'none'];

        if (!setting || !validSettings.includes(setting)) {

            await react('❌');

            return reply(`🖼️ *PROFILE PICTURE PRIVACY*\n\nUsage: ${config.PREFIX}setprofilepic <all/contacts/none>\n\n*Options:*\n• all - Everyone can see\n• contacts - Only contacts\n• none - Nobody\n\n*Example:* ${config.PREFIX}setprofilepic contacts`);

        }

        await react('🖼️');

        try {

            await sock.updateProfilePicturePrivacy(setting);

            

            // Save to database

            await bot.db.setSetting('profilepic', setting);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🖼️ *PROFILE PICTURE PRIVACY UPDATED*\n\n` +

                             `⚙️ *Setting:* ${setting}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set profile pic privacy error:', error);

            await react('❌');

            await reply(`❌ Failed to update privacy: ${error.message}`);

        }

    }

});

// ============================================

// SET STATUS PRIVACY - WhatsApp API + Save to DB

// ============================================

commands.push({

    name: 'setstatusprivacy',

    description: 'Set status privacy',

    aliases: ['statusprivacy', 'storyprivacy'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const setting = args[0]?.toLowerCase();

        const validSettings = ['all', 'contacts', 'none'];

        if (!setting || !validSettings.includes(setting)) {

            await react('❌');

            return reply(`📱 *STATUS PRIVACY*\n\nUsage: ${config.PREFIX}setstatusprivacy <all/contacts/none>\n\n*Options:*\n• all - Everyone can see\n• contacts - Only contacts\n• none - Nobody\n\n*Example:* ${config.PREFIX}setstatusprivacy contacts`);

        }

        await react('📱');

        try {

            await sock.updateStatusPrivacy(setting);

            

            // Save to database

            await bot.db.setSetting('statusprivacy', setting);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📱 *STATUS PRIVACY UPDATED*\n\n` +

                             `⚙️ *Setting:* ${setting}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set status privacy error:', error);

            await react('❌');

            await reply(`❌ Failed to update privacy: ${error.message}`);

        }

    }

});

// ============================================

// SET READ RECEIPT PRIVACY - WhatsApp API + Save to DB

// ============================================

commands.push({

    name: 'setprivacyread',

    description: 'Set read receipt privacy',

    aliases: ['readprivacy', 'receiptprivacy'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const setting = args[0]?.toLowerCase();

        const validSettings = ['all', 'none'];

        if (!setting || !validSettings.includes(setting)) {

            await react('❌');

            return reply(`✅ *READ RECEIPT PRIVACY*\n\nUsage: ${config.PREFIX}setprivacyread <all/none>\n\n*Options:*\n• all - Send read receipts\n• none - Don't send read receipts\n\n*Example:* ${config.PREFIX}setprivacyread none`);

        }

        await react('✅');

        try {

            await sock.updateReadReceiptsPrivacy(setting);

            

            // Save to database

            await bot.db.setSetting('readreceipts', setting);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `✅ *READ RECEIPT PRIVACY UPDATED*\n\n` +

                             `⚙️ *Setting:* ${setting}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set read privacy error:', error);

            await react('❌');

            await reply(`❌ Failed to update privacy: ${error.message}`);

        }

    }

});

// ============================================

// SET ONLINE PRIVACY - WhatsApp API + Save to DB

// ============================================

commands.push({

    name: 'setonlineprivacy',

    description: 'Set online privacy',

    aliases: ['onlineprivacy'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const setting = args[0]?.toLowerCase();

        const validSettings = ['all', 'match_last_seen'];

        if (!setting || !validSettings.includes(setting)) {

            await react('❌');

            return reply(`🟢 *ONLINE PRIVACY*\n\nUsage: ${config.PREFIX}setonlineprivacy <all/match_last_seen>\n\n*Options:*\n• all - Everyone can see when you're online\n• match_last_seen - Same as last seen setting\n\n*Example:* ${config.PREFIX}setonlineprivacy match_last_seen`);

        }

        await react('🟢');

        try {

            await sock.updateOnlinePrivacy(setting);

            

            // Save to database

            await bot.db.setSetting('onlineprivacy', setting);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🟢 *ONLINE PRIVACY UPDATED*\n\n` +

                             `⚙️ *Setting:* ${setting}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set online privacy error:', error);

            await react('❌');

            await reply(`❌ Failed to update privacy: ${error.message}`);

        }

    }

});

// ============================================

// VIEW ALL PRIVACY SETTINGS

// ============================================

commands.push({

    name: 'privacysettings',

    description: 'View all current privacy settings',

    aliases: ['privacy', 'privacystatus'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('🔍');

        try {

            // Get settings from database

            const lastseen = await bot.db.getSetting('lastseen', 'all');

            const profilepic = await bot.db.getSetting('profilepic', 'all');

            const statusprivacy = await bot.db.getSetting('statusprivacy', 'all');

            const readreceipts = await bot.db.getSetting('readreceipts', 'all');

            const onlineprivacy = await bot.db.getSetting('onlineprivacy', 'all');

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🔐 *PRIVACY SETTINGS*\n\n` +

                             `👁️ *Last Seen:* ${lastseen}\n` +

                             `🖼️ *Profile Picture:* ${profilepic}\n` +

                             `📱 *Status:* ${statusprivacy}\n` +

                             `✅ *Read Receipts:* ${readreceipts}\n` +

                             `🟢 *Online Status:* ${onlineprivacy}\n\n` +

                             `*Options:* all, contacts, none\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Privacy settings error:', error);

            await react('❌');

            await reply(`❌ Failed to get privacy settings: ${error.message}`);

        }

    }

});

module.exports = { commands };