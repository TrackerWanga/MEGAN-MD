// MEGAN-MD User Management Commands - Consistent styling with buttons

const config = require('../../megan/config');

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

// Helper to extract phone from various formats
const extractPhone = (input) => {
    if (!input) return null;
    let phone = input.replace('@s.whatsapp.net', '');
    phone = phone.replace(/\D/g, '');
    return phone || null;
};

// ============================================
// BLACKLIST USER - OWNER ONLY
// ============================================
commands.push({
    name: 'blacklist',
    description: 'Blacklist a user (add/remove) - Owner Only',
    aliases: ['bl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {

        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

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
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🚫 *BLACKLIST*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n${config.PREFIX}blacklist add <@user/phone>\n${config.PREFIX}blacklist remove <@user/phone>\n\n_Blacklisted users cannot use the bot._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const userShort = target.split('@')[0];
        const blacklist = await bot.db.getSetting('blacklist', []);

        if (action === 'add') {
            if (!blacklist.includes(target)) {
                blacklist.push(target);
                await bot.db.setSetting('blacklist', blacklist);
                await react('✅');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `✅ *BLACKLIST ADDED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been added to the blacklist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            } else {
                await react('⚠️');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `⚠️ *ALREADY BLACKLISTED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} is already in the blacklist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }
        } else {
            const index = blacklist.indexOf(target);
            if (index > -1) {
                blacklist.splice(index, 1);
                await bot.db.setSetting('blacklist', blacklist);
                await react('✅');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `✅ *BLACKLIST REMOVED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been removed from the blacklist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            } else {
                await react('⚠️');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `⚠️ *NOT IN BLACKLIST*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} is not in the blacklist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }
        }
    }
});

// ============================================
// WHITELIST USER - OWNER ONLY
// ============================================
commands.push({
    name: 'whitelist',
    description: 'Whitelist a user (add/remove) - Owner Only',
    aliases: ['wl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {

        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

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
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *WHITELIST*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n${config.PREFIX}whitelist add <@user/phone>\n${config.PREFIX}whitelist remove <@user/phone>\n\n_Whitelisted users bypass blacklist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const userShort = target.split('@')[0];
        const whitelist = await bot.db.getSetting('whitelist', []);

        if (action === 'add') {
            if (!whitelist.includes(target)) {
                whitelist.push(target);
                await bot.db.setSetting('whitelist', whitelist);
                await react('✅');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `✅ *WHITELIST ADDED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been added to the whitelist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            } else {
                await react('⚠️');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `⚠️ *ALREADY WHITELISTED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} is already in the whitelist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }
        } else {
            const index = whitelist.indexOf(target);
            if (index > -1) {
                whitelist.splice(index, 1);
                await bot.db.setSetting('whitelist', whitelist);
                await react('✅');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `✅ *WHITELIST REMOVED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been removed from the whitelist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            } else {
                await react('⚠️');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `⚠️ *NOT IN WHITELIST*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} is not in the whitelist._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }
        }
    }
});

// ============================================
// LIST BLACKLIST - Public
// ============================================
commands.push({
    name: 'listblacklist',
    description: 'Show all blacklisted users',
    aliases: ['blacklistlist', 'bllist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {

        await react('📋');
        const blacklist = await bot.db.getSetting('blacklist', []);

        if (blacklist.length === 0) {
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📋 *BLACKLIST*\n━━━━━━━━━━━━━━━━━━━\n_The blacklist is currently empty._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let listText = `🚫 *BLACKLISTED USERS*\n━━━━━━━━━━━━━━━━━━━\n_Total:_ ${blacklist.length}\n\n`;
        blacklist.forEach((jid, index) => {
            listText += `${index + 1}. @${jid.split('@')[0]}\n`;
        });
        listText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: listText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ============================================
// LIST WHITELIST - Public
// ============================================
commands.push({
    name: 'listwhitelist',
    description: 'Show all whitelisted users',
    aliases: ['whitelistlist', 'wllist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {

        await react('📋');
        const whitelist = await bot.db.getSetting('whitelist', []);

        if (whitelist.length === 0) {
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📋 *WHITELIST*\n━━━━━━━━━━━━━━━━━━━\n_The whitelist is currently empty._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let listText = `✅ *WHITELISTED USERS*\n━━━━━━━━━━━━━━━━━━━\n_Total:_ ${whitelist.length}\n\n`;
        whitelist.forEach((jid, index) => {
            listText += `${index + 1}. @${jid.split('@')[0]}\n`;
        });
        listText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: listText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ============================================
// MUTE USER - OWNER ONLY
// ============================================
commands.push({
    name: 'muteuser',
    description: 'Mute a user for specified minutes - Owner Only',
    aliases: ['mute'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {

        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let target = null;
        let duration = 60;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        if (!target || args.length < 1) {
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔇 *MUTE USER*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n${config.PREFIX}muteuser <@user> [minutes]\n\n_Example:_\n${config.PREFIX}muteuser @user 30\n\n_Mutes user for specified minutes (default: 60)._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length > 1) {
            duration = parseInt(args[1]);
            if (isNaN(duration) || duration < 1) duration = 60;
        }

        const userShort = target.split('@')[0];
        const mutedUntil = Date.now() + (duration * 60 * 1000);

        const muted = await bot.db.getSetting('muted', {});
        muted[target] = mutedUntil;
        await bot.db.setSetting('muted', muted);
        await react('🔇');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🔇 *USER MUTED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been muted for ${duration} minute(s)._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// UNMUTE USER - OWNER ONLY
// ============================================
commands.push({
    name: 'unmuteuser',
    description: 'Unmute a user - Owner Only',
    aliases: ['unmute'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {

        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

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
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔊 *UNMUTE USER*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n${config.PREFIX}unmuteuser <@user/phone>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const userShort = target.split('@')[0];
        const muted = await bot.db.getSetting('muted', {});

        if (muted[target]) {
            delete muted[target];
            await bot.db.setSetting('muted', muted);
            await react('🔊');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔊 *USER UNMUTED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been unmuted._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } else {
            await react('⚠️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚠️ *NOT MUTED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} is not currently muted._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// LIST MUTED USERS - Public
// ============================================
commands.push({
    name: 'listmuted',
    description: 'Show all muted users',
    aliases: ['mutedlist'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {

        await react('📋');
        const muted = await bot.db.getSetting('muted', {});
        const now = Date.now();
        const mutedList = [];

        for (const [jid, until] of Object.entries(muted)) {
            if (until > now) {
                const remaining = Math.round((until - now) / 60000);
                mutedList.push({ jid, remaining });
            }
        }

        if (mutedList.length === 0) {
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📋 *MUTED USERS*\n━━━━━━━━━━━━━━━━━━━\n_No users are currently muted._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let listText = `🔇 *MUTED USERS*\n━━━━━━━━━━━━━━━━━━━\n_Total:_ ${mutedList.length}\n\n`;
        mutedList.forEach((item, index) => {
            listText += `${index + 1}. @${item.jid.split('@')[0]} - ${item.remaining} min remaining\n`;
        });
        listText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: listText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ============================================
// WARN USER - OWNER ONLY
// ============================================
commands.push({
    name: 'warnuser',
    description: 'Warn a user (auto-kick after 3 warnings) - Owner Only',
    aliases: ['warn'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {

        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let target = null;
        let reason = 'No reason provided';

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            if (args.length > 1) {
                reason = args.slice(1).join(' ');
            }
        }

        if (!target) {
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚠️ *WARN USER*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n${config.PREFIX}warnuser <@user> [reason]\n\n_Example:_\n${config.PREFIX}warnuser @user Spamming\n\n_Auto-kicks after 3 warnings._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
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

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `⚠️ *USER WARNED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been warned (${warns[target].count}/3)_\n_Reason:_ ${reason}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);

        if (warns[target].count >= 3 && from.endsWith('@g.us')) {
            try {
                await sock.groupParticipantsUpdate(from, [target], 'remove');
                await sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `👋 *USER KICKED*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has been kicked after reaching 3 warnings._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
                delete warns[target];
                await bot.db.setSetting('warns', warns);
            } catch (error) {
                console.error('Auto-kick error:', error);
            }
        }
    }
});

// ============================================
// RESET WARNS - OWNER ONLY
// ============================================
commands.push({
    name: 'resetwarns',
    description: 'Reset warnings for a user - Owner Only',
    aliases: ['rw'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {

        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

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
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔄 *RESET WARNINGS*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n${config.PREFIX}resetwarns <@user/phone>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const userShort = target.split('@')[0];
        const warns = await bot.db.getSetting('warns', {});

        if (warns[target]) {
            delete warns[target];
            await bot.db.setSetting('warns', warns);
            await react('✅');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *WARNINGS RESET*\n━━━━━━━━━━━━━━━━━━━\n_Warnings for @${userShort} have been reset._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } else {
            await react('⚠️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚠️ *NO WARNINGS*\n━━━━━━━━━━━━━━━━━━━\n_@${userShort} has no warnings._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// USER INFO - Public
// ============================================
commands.push({
    name: 'userinfo',
    description: 'Get detailed user information',
    aliases: ['ui'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {

        let target = sender;

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

            let about = 'Not available';
            let aboutTime = 'Unknown';
            try {
                const status = await sock.fetchStatus(target);
                about = status.status || 'Not set';
                aboutTime = new Date(status.setAt).toLocaleString();
            } catch (e) {}

            let ppUrl = 'No profile picture';
            try {
                ppUrl = await sock.profilePictureUrl(target, 'image');
            } catch (e) {}

            const warns = await bot.db.getSetting('warns', {});
            const userWarns = warns[target]?.count || 0;
            const warnReasons = warns[target]?.reasons || [];

            const muted = await bot.db.getSetting('muted', {});
            const isMuted = muted[target] ? new Date(muted[target]) > new Date() : false;
            const muteRemaining = isMuted ? Math.round((muted[target] - Date.now()) / 60000) : 0;

            const blacklist = await bot.db.getSetting('blacklist', []);
            const whitelist = await bot.db.getSetting('whitelist', []);
            const isBlacklisted = blacklist.includes(target);
            const isWhitelisted = whitelist.includes(target);

            let infoText = `👤 *USER INFORMATION*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `_📱 Phone:_ ${userShort}\n` +
                `_🆔 JID:_ ${target}\n` +
                `_📝 About:_ ${about}\n` +
                `_🕒 About set:_ ${aboutTime}\n\n` +
                `*STATUS*\n` +
                `━━━━━━━━━━━━━━━━━━━\n` +
                `_⚠️ Warnings:_ ${userWarns}/3\n`;

            if (userWarns > 0) {
                infoText += `_📋 Reasons:_ ${warnReasons.join(', ')}\n`;
            }

            infoText += `_🔇 Muted:_ ${isMuted ? `Yes (${muteRemaining} min left)` : 'No'}\n` +
                `_🚫 Blacklisted:_ ${isBlacklisted ? 'Yes' : 'No'}\n` +
                `_✅ Whitelisted:_ ${isWhitelisted ? 'Yes' : 'No'}\n\n` +
                `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: infoText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');

        } catch (error) {
            console.error('User info error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *ERROR*\n━━━━━━━━━━━━━━━━━━━\n_Failed to get user info: ${error.message}_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}usermgmt`, text: '👥 User Mgmt' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// USERMGMT HELP - Public
// ============================================
commands.push({
    name: 'usermgmt',
    description: 'Show all user management commands',
    aliases: ['userhelp', 'um'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;

        const helpText = `👥 *USER MANAGEMENT COMMANDS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*👑 OWNER ONLY*\n` +
            `_${prefix}blacklist add <@user>_ - Blacklist user\n` +
            `_${prefix}blacklist remove <@user>_ - Unblacklist\n` +
            `_${prefix}whitelist add <@user>_ - Whitelist user\n` +
            `_${prefix}whitelist remove <@user>_ - Unwhitelist\n` +
            `_${prefix}muteuser <@user> [min]_ - Mute user\n` +
            `_${prefix}unmuteuser <@user>_ - Unmute user\n` +
            `_${prefix}warnuser <@user> [reason]_ - Warn user\n` +
            `_${prefix}resetwarns <@user>_ - Reset warnings\n\n` +

            `*👤 PUBLIC*\n` +
            `_${prefix}listblacklist_ - Show blacklisted\n` +
            `_${prefix}listwhitelist_ - Show whitelisted\n` +
            `_${prefix}listmuted_ - Show muted users\n` +
            `_${prefix}userinfo <@user>_ - Get user details\n\n` +

            `> created by wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: helpText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

module.exports = { commands };
