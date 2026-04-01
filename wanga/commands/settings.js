// MEGAN-MD Settings Commands - Consistent styling with buttons

const config = require('../../megan/config');
const timeUtils = require('../../megan/lib/timeUtils');
const { downloadMediaMessage } = require('gifted-baileys');

const commands = [];

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';

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

// ============================================
// SECTION 1: CORE BOT SETTINGS
// ============================================

// 1. SET PREFIX
commands.push({
    name: 'setprefix',
    description: 'Change bot command prefix (Owner Only)',
    aliases: ['prefix'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('prefix', config.PREFIX);
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔧 *Set Prefix*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ \`${current}\`\n_Usage:_ ${config.PREFIX}setprefix <symbol>\n_Example:_ ${config.PREFIX}setprefix !\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const newPrefix = args[0];
        if (newPrefix.length !== 1) {
            await react('❌');
            return reply(`❌ *Prefix must be a single character!*\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('prefix', newPrefix);
        config.PREFIX = newPrefix;
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Prefix Updated*\n━━━━━━━━━━━━━━━━━━━\n_New prefix:_ \`${newPrefix}\`\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// 2. SET BOT NAME
commands.push({
    name: 'setbotname',
    description: 'Change bot display name (Owner Only)',
    aliases: ['botname'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('bot_name', config.BOT_NAME);
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📛 *Set Bot Name*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Usage:_ ${config.PREFIX}setbotname <new name>\n_Example:_ ${config.PREFIX}setbotname MEGAN-PRO\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const newName = args.join(' ');
        await react('🔄');
        await bot.db.setSetting('bot_name', newName);
        config.BOT_NAME = newName;
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Bot Name Updated*\n━━━━━━━━━━━━━━━━━━━\n_New name:_ *${newName}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// 3. SET MODE
commands.push({
    name: 'setmode',
    description: 'Set bot mode (public/private) - Owner Only',
    aliases: ['mode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('mode', 'public');
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚙️ *Set Mode*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current === 'public' ? '🌍 PUBLIC' : '🔒 PRIVATE'}\n_Options:_ public, private\n_Usage:_ ${config.PREFIX}setmode public/private\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const mode = args[0].toLowerCase();
        if (mode !== 'public' && mode !== 'private') {
            await react('❌');
            return reply(`❌ *Invalid mode!* Use: public or private\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('mode', mode);
        config.MODE = mode;
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Mode Updated*\n━━━━━━━━━━━━━━━━━━━\n_New mode:_ *${mode === 'public' ? '🌍 PUBLIC' : '🔒 PRIVATE'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// 4. SET DEFAULT DISAPPEARING MESSAGES
commands.push({
    name: 'setdefaultdisappear',
    description: 'Set default disappearing messages (24h/7d/90d/off) - Owner Only',
    aliases: ['defaultdisappear', 'setdisappear'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('default_disappear', 0);
            let display = 'off';
            if (current === 86400) display = '24 hours';
            else if (current === 604800) display = '7 days';
            else if (current === 7776000) display = '90 days';

            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⏳ *Default Disappearing Messages*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ *${display}*\n_Options:_ 24h, 7d, 90d, off\n_Usage:_ ${config.PREFIX}setdefaultdisappear <24h/7d/90d/off>\n_Example:_ ${config.PREFIX}setdefaultdisappear 7d\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const option = args[0].toLowerCase();
        let expiration = 0;
        let display = 'off';

        if (option === '24h') {
            expiration = 86400;
            display = '24 hours';
        } else if (option === '7d') {
            expiration = 604800;
            display = '7 days';
        } else if (option === '90d') {
            expiration = 7776000;
            display = '90 days';
        } else if (option !== 'off') {
            await react('❌');
            return reply(`❌ *Invalid option!* Use: 24h, 7d, 90d, or off\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('default_disappear', expiration);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Default Disappearing Messages Updated*\n━━━━━━━━━━━━━━━━━━━\n_New setting:_ *${display}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// 5. RESET CORE SETTINGS
commands.push({
    name: 'resetsettings',
    description: 'Reset core settings to default (Owner Only)',
    aliases: ['resetcore'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args[0]?.toLowerCase() !== '--force') {
            await react('⚠️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚠️ *Warning:* This will reset CORE settings to default!\n━━━━━━━━━━━━━━━━━━━\n_To confirm:_ ${config.PREFIX}resetsettings --force\n\n_Resets:_ prefix, bot name, mode, disappear settings\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');

        await bot.db.setSetting('prefix', '.');
        await bot.db.setSetting('bot_name', config.BOT_NAME);
        await bot.db.setSetting('mode', 'public');
        await bot.db.setSetting('default_disappear', 0);

        config.PREFIX = '.';
        config.MODE = 'public';

        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Core Settings Reset*\n━━━━━━━━━━━━━━━━━━━\n_Defaults restored:_\n• Prefix: .\n• Bot Name: ${config.BOT_NAME}\n• Mode: public\n• Disappear: off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// SECTION 2: PROFILE SETTINGS
// ============================================

// 6. SET OWNER NAME
commands.push({
    name: 'setownername',
    description: 'Set bot owner name (Owner Only)',
    aliases: ['setowner', 'ownername'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('owner_name', config.OWNER_NAME);
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `👤 *Set Owner Name*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Usage:_ ${config.PREFIX}setownername <new name>\n_Example:_ ${config.PREFIX}setownername Wanga\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const newName = args.join(' ');
        await react('🔄');
        await bot.db.setSetting('owner_name', newName);
        config.OWNER_NAME = newName;
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Owner Name Updated*\n━━━━━━━━━━━━━━━━━━━\n_New name:_ *${newName}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// 7. SET OWNER PHONE
commands.push({
    name: 'setownerphone',
    description: 'Change owner phone number (Owner Only)',
    aliases: ['ownerphone'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('owner_number', config.OWNER_NUMBER);
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📞 *Set Owner Phone*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Usage:_ ${config.PREFIX}setownerphone <number>\n_Example:_ ${config.PREFIX}setownerphone 254712345678\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const newPhone = args[0].replace(/\D/g, '');
        if (newPhone.length < 10) {
            await react('❌');
            return reply(`❌ *Invalid phone number!* Include country code (e.g., 254...)\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('owner_number', newPhone);
        config.OWNER_NUMBER = newPhone;
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Owner Phone Updated*\n━━━━━━━━━━━━━━━━━━━\n_New number:_ ${newPhone}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// 8. SET BIO
commands.push({
    name: 'setbio',
    description: 'Set bot about/bio (Owner Only)',
    aliases: ['setabout', 'setstatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📝 *Set Bio*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}setbio <your bio>\n_Example:_ ${config.PREFIX}setbio Megan Bot - Your friendly assistant\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const bio = args.join(' ');
        await react('📝');

        try {
            await sock.updateProfileStatus(bio);
            await bot.db.setSetting('bio', bio);
            await react('✅');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Bio Updated*\n━━━━━━━━━━━━━━━━━━━\n_New bio:_\n${bio}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } catch (error) {
            await react('❌');
            await reply(`❌ *Failed to update bio:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 9. AUTO BIO
let autoBioInterval = null;
const AUTO_BIO_MESSAGES = {
    earlyMorning: ["🌅 Rise and shine!", "☕ Good morning!", "✨ Early bird gets the worm!"],
    morning: ["☀️ Good morning!", "📚 Time to learn!", "🎯 Stay focused!"],
    afternoon: ["🌤️ Good afternoon!", "⚡ Keep pushing!", "💡 Stay productive!"],
    evening: ["🌆 Good evening!", "🌟 Great job today!", "🌙 Time to unwind!"],
    night: ["🌙 Good night!", "⭐ Sweet dreams!", "💤 Rest well!"],
    midnight: ["🕛 Midnight thoughts!", "🌌 Dream big!", "✨ You're amazing!"]
};

commands.push({
    name: 'autobio',
    description: 'Auto-update bio based on time (Owner Only)',
    aliases: ['autobio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const action = args[0]?.toLowerCase();

        if (action === 'stop' || action === 'off') {
            if (autoBioInterval) {
                clearInterval(autoBioInterval);
                autoBioInterval = null;
                await bot.db.setSetting('autobio', 'off');
                await react('⏹️');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `⏹️ *Auto-bio stopped*\n━━━━━━━━━━━━━━━━━━━\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚠️ *Auto-bio is not running*\n━━━━━━━━━━━━━━━━━━━\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (action === 'start' || action === 'on' || !action) {
            const isRunning = await bot.db.getSetting('autobio', 'off');

            if (autoBioInterval || isRunning === 'on') {
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `⚠️ *Auto-bio is already running*\n━━━━━━━━━━━━━━━━━━━\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }

            await react('🔄');

            const updateBio = async () => {
                try {
                    const hour = new Date().getHours();
                    let messages = AUTO_BIO_MESSAGES.midnight;
                    if (hour >= 4 && hour < 6) messages = AUTO_BIO_MESSAGES.earlyMorning;
                    else if (hour >= 6 && hour < 12) messages = AUTO_BIO_MESSAGES.morning;
                    else if (hour >= 12 && hour < 17) messages = AUTO_BIO_MESSAGES.afternoon;
                    else if (hour >= 17 && hour < 20) messages = AUTO_BIO_MESSAGES.evening;
                    else if (hour >= 20 || hour < 4) messages = AUTO_BIO_MESSAGES.night;

                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    await sock.updateProfileStatus(randomMessage);
                } catch (error) {
                    console.error('Auto-bio update error:', error);
                }
            };

            await updateBio();
            autoBioInterval = setInterval(updateBio, 60 * 60 * 1000);
            await bot.db.setSetting('autobio', 'on');
            await react('✅');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔄 *Auto-Bio Started*\n━━━━━━━━━━━━━━━━━━━\n_⏰ Updates every hour_\n\n_To stop:_ ${config.PREFIX}autobio stop\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// 10. SET BOT PROFILE PICTURE
commands.push({
    name: 'setbotpic',
    description: 'Set bot profile picture (Owner Only)',
    aliases: ['setpp', 'setprofilepic'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🖼️');

        try {
            let imageBuffer = null;
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (quoted?.imageMessage) {
                imageBuffer = await downloadMediaMessage(
                    { key: msg.key, message: quoted },
                    'buffer',
                    {},
                    { logger: console }
                );
            } else if (args.length > 0 && args[0].startsWith('http')) {
                const axios = require('axios');
                const response = await axios.get(args[0], {
                    responseType: 'arraybuffer',
                    timeout: 30000
                });
                imageBuffer = Buffer.from(response.data);
            } else if (msg.message?.imageMessage) {
                imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console });
            }

            if (!imageBuffer) {
                await react('❌');
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `🖼️ *Set Profile Picture*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_\n• Reply to an image with ${config.PREFIX}setbotpic\n• ${config.PREFIX}setbotpic <image url>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }

            await sock.updateProfilePicture(sock.user.id, imageBuffer);
            await react('✅');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Profile Picture Updated*\n━━━━━━━━━━━━━━━━━━━\n_🖼️ Bot profile picture changed successfully_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } catch (error) {
            await react('❌');
            await reply(`❌ *Failed to update profile picture:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 11. REMOVE PROFILE PICTURE
commands.push({
    name: 'removepp',
    description: 'Remove bot profile picture (Owner Only)',
    aliases: ['removepic', 'delpp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🗑️');

        try {
            await sock.removeProfilePicture(sock.user.id);
            await react('✅');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Profile Picture Removed*\n━━━━━━━━━━━━━━━━━━━\n_🗑️ Bot profile picture has been removed_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } catch (error) {
            await react('❌');
            await reply(`❌ *Failed to remove profile picture:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 12. MY PROFILE PICTURE (Public)
commands.push({
    name: 'mypic',
    description: 'Get your own profile picture',
    aliases: ['mypp', 'getmypp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('🖼️');

        try {
            const ppUrl = await sock.profilePictureUrl(sender, 'image');
            await sock.sendMessage(from, {
                image: { url: ppUrl },
                caption: `🖼️ *Your Profile Picture*\n\n_👤 @${sender.split('@')[0]}_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                mentions: [sender]
            }, { quoted: msg });
            await react('✅');
        } catch (error) {
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚠️ *No profile picture found* for @${sender.split('@')[0]}\n━━━━━━━━━━━━━━━━━━━\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        }
    }
});

// 13. MY ABOUT (Public)
commands.push({
    name: 'myabout',
    description: 'Get your own about/bio',
    aliases: ['mybio', 'getmyabout'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('📝');

        try {
            const { status, setAt } = await sock.fetchStatus(sender);
            const date = new Date(setAt).toLocaleString('en-KE', {
                dateStyle: 'full',
                timeStyle: 'short'
            });

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📝 *Your About Info*\n━━━━━━━━━━━━━━━━━━━\n_👤 User:_ @${sender.split('@')[0]}\n_💬 About:_ ${status}\n_🕒 Set at:_ ${date}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Could not fetch about info.* You may have privacy settings enabled.\n━━━━━━━━━━━━━━━━━━━\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ============================================
// SECTION 3: BLOCKING
// ============================================

// 14. BLOCK USER
commands.push({
    name: 'block',
    description: 'Block a user (Owner Only)',
    aliases: ['blockuser'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let target = null;
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args.length > 0) {
            const phone = args[0].replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!target) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔨 *Block User*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}block <@user/phone>\n_Or reply to their message with ${config.PREFIX}block\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔨');

        try {
            await sock.updateBlockStatus(target, 'block');
            await react('✅');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔨 *User Blocked*\n━━━━━━━━━━━━━━━━━━━\n_👤 User:_ @${target.split('@')[0]}\n_🚫 Status:_ Blocked\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } catch (error) {
            await react('❌');
            await reply(`❌ *Failed to block user:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 15. UNBLOCK USER
commands.push({
    name: 'unblock',
    description: 'Unblock a user (Owner Only)',
    aliases: ['unblockuser'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        let target = null;
        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
            target = msg.message.extendedTextMessage.contextInfo.participant;
        } else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args.length > 0) {
            const phone = args[0].replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!target) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔓 *Unblock User*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}unblock <@user/phone>\n_Or reply to their message with ${config.PREFIX}unblock\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔓');

        try {
            await sock.updateBlockStatus(target, 'unblock');
            await react('✅');

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔓 *User Unblocked*\n━━━━━━━━━━━━━━━━━━━\n_👤 User:_ @${target.split('@')[0]}\n_✅ Status:_ Unblocked\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        } catch (error) {
            await react('❌');
            await reply(`❌ *Failed to unblock user:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// 16. LIST BLOCKED USERS (Public)
commands.push({
    name: 'listblocked',
    description: 'List all blocked users',
    aliases: ['blocklist', 'blocked'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('📋');

        try {
            const blocklist = await sock.fetchBlocklist();

            if (!blocklist || blocklist.length === 0) {
                return sendButtonMenu(sock, from, {
                    title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                    text: `📋 *No blocked users found.*\n━━━━━━━━━━━━━━━━━━━\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                    image: BOT_LOGO,
                    buttons: [
                        { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                        { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                        { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                    ]
                }, msg);
            }

            let listText = `📋 *Blocked Users (${blocklist.length})*\n━━━━━━━━━━━━━━━━━━━\n\n`;
            blocklist.forEach((jid, index) => {
                listText += `${index + 1}. @${jid.split('@')[0]}\n`;
            });
            listText += `\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: listText,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');
        } catch (error) {
            await react('❌');
            await reply(`❌ *Failed to fetch blocklist:* ${error.message}\n\n> created by wanga`);
        }
    }
});

// ============================================
// SECTION 4: VIEW SETTINGS
// ============================================

// 17. VIEW ALL CORE SETTINGS (Public)
commands.push({
    name: 'settings',
    description: 'View all core bot settings',
    aliases: ['coresettings'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('⚙️');

        const prefix = await bot.db.getSetting('prefix', config.PREFIX);
        const botname = await bot.db.getSetting('bot_name', config.BOT_NAME);
        const mode = await bot.db.getSetting('mode', config.MODE);
        const disappear = await bot.db.getSetting('default_disappear', 0);

        let disappearText = 'off';
        if (disappear === 86400) disappearText = '24 hours';
        else if (disappear === 604800) disappearText = '7 days';
        else if (disappear === 7776000) disappearText = '90 days';

        const currentTime = await timeUtils.getCurrentTimeString(bot.db);

        const settingsText = `⚙️ *Core Bot Settings*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `_🕐 Time:_ ${currentTime}\n` +
            `_🔧 Prefix:_ \`${prefix}\`\n` +
            `_📛 Bot Name:_ ${botname}\n` +
            `_⚡ Mode:_ ${mode === 'public' ? '🌍 PUBLIC' : '🔒 PRIVATE'}\n` +
            `_⏳ Default Disappear:_ ${disappearText}\n\n` +
            `*For more:*\n` +
            `• ${prefix}features - Feature toggles\n` +
            `• ${prefix}statuscheck - Status settings\n` +
            `• ${prefix}privacysettings - Privacy settings\n` +
            `• ${prefix}settingshelp - All settings commands\n\n` +
            `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: settingsText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settingshelp`, text: '⚙️ Settings Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 18. PRIVACY SETTINGS (Public)
commands.push({
    name: 'privacysettings',
    description: 'View privacy settings',
    aliases: ['privacy', 'privacystatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('🔍');

        const lastseen = await bot.db.getSetting('lastseen', 'all');
        const profilepic = await bot.db.getSetting('profilepic', 'all');
        const statusprivacy = await bot.db.getSetting('statusprivacy', 'all');
        const readreceipts = await bot.db.getSetting('readreceipts', 'all');
        const onlineprivacy = await bot.db.getSetting('onlineprivacy', 'all');

        const privacyText = `🔐 *Privacy Settings*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `_👁️ Last Seen:_ ${lastseen}\n` +
            `_🖼️ Profile Picture:_ ${profilepic}\n` +
            `_📱 Status:_ ${statusprivacy}\n` +
            `_✅ Read Receipts:_ ${readreceipts}\n` +
            `_🟢 Online Status:_ ${onlineprivacy}\n\n` +
            `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: privacyText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}settings`, text: '⚙️ Settings' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 19. SETTINGS HELP (Public)
commands.push({
    name: 'settingshelp',
    description: 'Show available core settings commands',
    aliases: ['helpsettings'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;

        const helpText = `⚙️ *Settings Commands*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*CORE (Owner)*\n` +
            `_${prefix}setprefix <symbol>_\n` +
            `_${prefix}setbotname <name>_\n` +
            `_${prefix}setmode <public/private>_\n` +
            `_${prefix}setdefaultdisappear <24h/7d/90d/off>_\n` +
            `_${prefix}resetsettings --force_\n\n` +

            `*PROFILE (Owner)*\n` +
            `_${prefix}setownername <name>_\n` +
            `_${prefix}setownerphone <number>_\n` +
            `_${prefix}setbio <text>_\n` +
            `_${prefix}autobio start/stop_\n` +
            `_${prefix}setbotpic [image/url]_\n` +
            `_${prefix}removepp_\n\n` +

            `*BLOCKING (Owner)*\n` +
            `_${prefix}block <@user>_\n` +
            `_${prefix}unblock <@user>_\n` +
            `_${prefix}listblocked_\n\n` +

            `*PUBLIC*\n` +
            `_${prefix}settings_ - View core\n` +
            `_${prefix}privacysettings_ - View privacy\n` +
            `_${prefix}mypic_ - Your profile pic\n` +
            `_${prefix}myabout_ - Your bio\n` +
            `_${prefix}settingshelp_ - This menu\n\n` +

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
