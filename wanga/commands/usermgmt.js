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
// BLACKLIST USER
// ============================================
commands.push({
    name: 'blacklist',
    description: 'Blacklist a user (add/remove)',
    aliases: ['bl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const action = args[0]?.toLowerCase();
        let target = null;

        // Check mentions
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[1]) {
            const phone = extractPhone(args[1]);
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!action || !['add', 'remove'].includes(action) || !target) {
            return reply(`🚫 *Blacklist*\n\nUsage: ${config.PREFIX}blacklist add <@user/phone>\n${config.PREFIX}blacklist remove <@user/phone>\n\nBlacklisted users cannot use the bot.`);
        }

        const userShort = target.split('@')[0];
        const blacklist = await bot.db.getSetting('blacklist', []);

        if (action === 'add') {
            if (!blacklist.includes(target)) {
                blacklist.push(target);
                await bot.db.setSetting('blacklist', blacklist);
                await react('✅');
                await reply(`🚫 @${userShort} added to blacklist`, { mentions: [target] });
            } else {
                await reply(`⚠️ @${userShort} already in blacklist`, { mentions: [target] });
            }
        } else {
            const index = blacklist.indexOf(target);
            if (index > -1) {
                blacklist.splice(index, 1);
                await bot.db.setSetting('blacklist', blacklist);
                await react('✅');
                await reply(`✅ @${userShort} removed from blacklist`, { mentions: [target] });
            } else {
                await reply(`⚠️ @${userShort} not in blacklist`, { mentions: [target] });
            }
        }
    }
});

// ============================================
// WHITELIST USER
// ============================================
commands.push({
    name: 'whitelist',
    description: 'Whitelist a user (add/remove)',
    aliases: ['wl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const action = args[0]?.toLowerCase();
        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[1]) {
            const phone = extractPhone(args[1]);
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!action || !['add', 'remove'].includes(action) || !target) {
            return reply(`✅ *Whitelist*\n\nUsage: ${config.PREFIX}whitelist add <@user/phone>\n${config.PREFIX}whitelist remove <@user/phone>\n\nWhitelisted users bypass blacklist.`);
        }

        const userShort = target.split('@')[0];
        const whitelist = await bot.db.getSetting('whitelist', []);

        if (action === 'add') {
            if (!whitelist.includes(target)) {
                whitelist.push(target);
                await bot.db.setSetting('whitelist', whitelist);
                await react('✅');
                await reply(`✅ @${userShort} added to whitelist`, { mentions: [target] });
            } else {
                await reply(`⚠️ @${userShort} already in whitelist`, { mentions: [target] });
            }
        } else {
            const index = whitelist.indexOf(target);
            if (index > -1) {
                whitelist.splice(index, 1);
                await bot.db.setSetting('whitelist', whitelist);
                await react('✅');
                await reply(`✅ @${userShort} removed from whitelist`, { mentions: [target] });
            } else {
                await reply(`⚠️ @${userShort} not in whitelist`, { mentions: [target] });
            }
        }
    }
});

// ============================================
// LIST BLACKLIST
// ============================================
commands.push({
    name: 'listblacklist',
    description: 'Show all blacklisted users',
    aliases: ['blacklistlist', 'bllist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('📋');

        const blacklist = await bot.db.getSetting('blacklist', []);
        
        if (blacklist.length === 0) {
            return reply('📋 *Blacklist is empty.*');
        }

        let listText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                      `┃ *${config.BOT_NAME}*\n` +
                      `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                      `🚫 *BLACKLISTED USERS*\n\n` +
                      `Total: ${blacklist.length}\n\n`;

        blacklist.forEach((jid, index) => {
            listText += `${index + 1}. @${jid.split('@')[0]}\n`;
        });

        listText += `\n> created by wanga`;

        await sock.sendMessage(from, {
            text: listText,
            mentions: blacklist
        }, { quoted: msg });
        await react('✅');
    }
});

// ============================================
// LIST WHITELIST
// ============================================
commands.push({
    name: 'listwhitelist',
    description: 'Show all whitelisted users',
    aliases: ['whitelistlist', 'wllist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('📋');

        const whitelist = await bot.db.getSetting('whitelist', []);
        
        if (whitelist.length === 0) {
            return reply('📋 *Whitelist is empty.*');
        }

        let listText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                      `┃ *${config.BOT_NAME}*\n` +
                      `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                      `✅ *WHITELISTED USERS*\n\n` +
                      `Total: ${whitelist.length}\n\n`;

        whitelist.forEach((jid, index) => {
            listText += `${index + 1}. @${jid.split('@')[0]}\n`;
        });

        listText += `\n> created by wanga`;

        await sock.sendMessage(from, {
            text: listText,
            mentions: whitelist
        }, { quoted: msg });
        await react('✅');
    }
});

// ============================================
// MUTE USER
// ============================================
commands.push({
    name: 'muteuser',
    description: 'Mute a user for specified minutes',
    aliases: ['mute'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = null;
        let duration = 60; // Default 60 minutes

        // Check mentions
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        if (!target || args.length < 1) {
            return reply(`🔇 *Mute User*\n\nUsage: ${config.PREFIX}muteuser <@user> [minutes]\nExample: ${config.PREFIX}muteuser @user 30\n\nMutes user for specified minutes (default: 60).`);
        }

        if (args.length > 1) {
            duration = parseInt(args[1]);
            if (isNaN(duration) || duration < 1) duration = 60;
        }

        const userShort = target.split('@')[0];
        const mutedUntil = Date.now() + (duration * 60 * 1000);

        // Store muted users in database
        const muted = await bot.db.getSetting('muted', {});
        muted[target] = mutedUntil;
        await bot.db.setSetting('muted', muted);

        await react('🔇');
        await reply(`🔇 @${userShort} muted for ${duration} minutes`, { mentions: [target] });
    }
});

// ============================================
// UNMUTE USER
// ============================================
commands.push({
    name: 'unmuteuser',
    description: 'Unmute a user',
    aliases: ['unmute'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!target) {
            return reply(`🔊 *Unmute User*\n\nUsage: ${config.PREFIX}unmuteuser <@user/phone>`);
        }

        const userShort = target.split('@')[0];
        const muted = await bot.db.getSetting('muted', {});

        if (muted[target]) {
            delete muted[target];
            await bot.db.setSetting('muted', muted);
            await react('🔊');
            await reply(`🔊 @${userShort} unmuted`, { mentions: [target] });
        } else {
            await reply(`⚠️ @${userShort} is not muted`, { mentions: [target] });
        }
    }
});

// ============================================
// LIST MUTED USERS
// ============================================
commands.push({
    name: 'listmuted',
    description: 'Show all muted users',
    aliases: ['mutedlist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('📋');

        const muted = await bot.db.getSetting('muted', {});
        const now = Date.now();
        const mutedList = [];
        
        // Filter out expired mutes
        for (const [jid, until] of Object.entries(muted)) {
            if (until > now) {
                const remaining = Math.round((until - now) / 60000);
                mutedList.push({ jid, remaining });
            }
        }

        if (mutedList.length === 0) {
            return reply('📋 *No muted users.*');
        }

        let listText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                      `┃ *${config.BOT_NAME}*\n` +
                      `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                      `🔇 *MUTED USERS*\n\n` +
                      `Total: ${mutedList.length}\n\n`;

        mutedList.forEach((item, index) => {
            listText += `${index + 1}. @${item.jid.split('@')[0]} - ${item.remaining} min remaining\n`;
        });

        listText += `\n> created by wanga`;

        await sock.sendMessage(from, {
            text: listText,
            mentions: mutedList.map(m => m.jid)
        }, { quoted: msg });
        await react('✅');
    }
});

// ============================================
// WARN USER
// ============================================
commands.push({
    name: 'warnuser',
    description: 'Warn a user (auto-kick after 3 warnings)',
    aliases: ['warn'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = null;
        let reason = 'No reason provided';

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            if (args.length > 1) {
                reason = args.slice(1).join(' ');
            }
        }

        if (!target) {
            return reply(`⚠️ *Warn User*\n\nUsage: ${config.PREFIX}warnuser <@user> [reason]\n\nAuto-kicks after 3 warnings.`);
        }

        const userShort = target.split('@')[0];
        const warns = await bot.db.getSetting('warns', {});

        if (!warns[target]) {
            warns[target] = { count: 1, reasons: [reason] };
        } else {
            warns[target].count += 1;
            warns[target].reasons.push(reason);
        }

        await bot.db.setSetting('warns', warns);

        await react('⚠️');
        await reply(`⚠️ @${userShort} warned (${warns[target].count}/3)\nReason: ${reason}`, { mentions: [target] });

        // Auto-kick after 3 warnings (only in groups)
        if (warns[target].count >= 3 && from.endsWith('@g.us')) {
            try {
                await sock.groupParticipantsUpdate(from, [target], 'remove');
                await reply(`👋 @${userShort} kicked after 3 warnings`, { mentions: [target] });
                delete warns[target];
                await bot.db.setSetting('warns', warns);
            } catch (error) {
                bot.logger.error('Auto-kick error:', error);
            }
        }
    }
});

// ============================================
// RESET WARNS
// ============================================
commands.push({
    name: 'resetwarns',
    description: 'Reset warnings for a user',
    aliases: ['rw'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!target) {
            return reply(`🔄 *Reset Warnings*\n\nUsage: ${config.PREFIX}resetwarns <@user/phone>`);
        }

        const userShort = target.split('@')[0];
        const warns = await bot.db.getSetting('warns', {});

        if (warns[target]) {
            delete warns[target];
            await bot.db.setSetting('warns', warns);
            await react('✅');
            await reply(`✅ Warnings reset for @${userShort}`, { mentions: [target] });
        } else {
            await reply(`⚠️ @${userShort} has no warnings`, { mentions: [target] });
        }
    }
});

// ============================================
// USER INFO
// ============================================
commands.push({
    name: 'userinfo',
    description: 'Get detailed user information',
    aliases: ['ui', 'info'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        let target = sender;

        // Check mentions
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            const phone = extractPhone(args[0]);
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        await react('ℹ️');

        try {
            const userShort = target.split('@')[0];

            // Get user about/bio if available
            let about = 'Not available';
            let aboutTime = 'Unknown';
            try {
                const status = await sock.fetchStatus(target);
                about = status.status || 'Not set';
                aboutTime = new Date(status.setAt).toLocaleString();
            } catch (e) {
                // No about found
            }

            // Get profile picture
            let ppUrl = 'Not available';
            try {
                ppUrl = await sock.profilePictureUrl(target, 'image');
            } catch (e) {
                ppUrl = 'No profile picture';
            }

            // Get user warnings
            const warns = await bot.db.getSetting('warns', {});
            const userWarns = warns[target]?.count || 0;
            const warnReasons = warns[target]?.reasons || [];

            // Check if muted
            const muted = await bot.db.getSetting('muted', {});
            const isMuted = muted[target] ? new Date(muted[target]) > new Date() : false;
            const mutedUntil = isMuted ? new Date(muted[target]).toLocaleString() : 'Not muted';
            const muteRemaining = isMuted ? Math.round((muted[target] - Date.now()) / 60000) : 0;

            // Check blacklist/whitelist
            const blacklist = await bot.db.getSetting('blacklist', []);
            const whitelist = await bot.db.getSetting('whitelist', []);
            const isBlacklisted = blacklist.includes(target);
            const isWhitelisted = whitelist.includes(target);

            let infoText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                          `┃ *${config.BOT_NAME}*\n` +
                          `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                          `👤 *USER INFORMATION*\n\n` +
                          `━━━━━━━━━━━━━━━━━━━\n` +
                          `📱 *Phone:* ${userShort}\n` +
                          `🆔 *JID:* ${target}\n` +
                          `📝 *About:* ${about}\n` +
                          `🕒 *About set:* ${aboutTime}\n` +
                          `🖼️ *Profile pic:* ${ppUrl.substring(0, 50)}...\n\n` +

                          `━━━━━━━━━━━━━━━━━━━\n` +
                          `*STATUS*\n` +
                          `━━━━━━━━━━━━━━━━━━━\n` +
                          `⚠️ *Warnings:* ${userWarns}/3\n`;

            if (userWarns > 0) {
                infoText += `📋 *Reasons:* ${warnReasons.join(', ')}\n`;
            }

            infoText += `🔇 *Muted:* ${isMuted ? `Yes (${muteRemaining} min left)` : 'No'}\n` +
                       `🚫 *Blacklisted:* ${isBlacklisted ? 'Yes' : 'No'}\n` +
                       `✅ *Whitelisted:* ${isWhitelisted ? 'Yes' : 'No'}\n\n` +
                       `> created by wanga`;

            await sock.sendMessage(from, {
                text: infoText,
                mentions: [target]
            }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('User info error:', error);
            await react('❌');
            await reply(`❌ Failed to get user info: ${error.message}`);
        }
    }
});

// ============================================
// USERMGMT HELP
// ============================================
commands.push({
    name: 'usermgmt',
    description: 'Show all user management commands',
    aliases: ['userhelp', 'um'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `👥 *USER MANAGEMENT COMMANDS*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*BLACKLIST/WHITELIST*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}blacklist add <@user> - Blacklist user\n` +
                        `• ${config.PREFIX}blacklist remove <@user> - Unblacklist\n` +
                        `• ${config.PREFIX}listblacklist - Show blacklisted\n` +
                        `• ${config.PREFIX}whitelist add <@user> - Whitelist user\n` +
                        `• ${config.PREFIX}whitelist remove <@user> - Unwhitelist\n` +
                        `• ${config.PREFIX}listwhitelist - Show whitelisted\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*MUTE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}muteuser <@user> [min] - Mute user\n` +
                        `• ${config.PREFIX}unmuteuser <@user> - Unmute user\n` +
                        `• ${config.PREFIX}listmuted - Show muted users\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*WARNINGS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}warnuser <@user> [reason] - Warn user\n` +
                        `• ${config.PREFIX}resetwarns <@user> - Reset warnings\n` +
                        `• ${config.PREFIX}userinfo <@user> - Get user details\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };