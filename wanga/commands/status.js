// MEGAN-MD Status Commands - Consistent styling with buttons

const config = require('../../megan/config');
const timeUtils = require('../../megan/lib/timeUtils');

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
// STATUSCHECK - Show current status settings
// ============================================
commands.push({
    name: 'statuscheck',
    description: 'Check current status feature settings',
    aliases: ['sc', 'statuscfg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        const statusView = await bot.db.getSetting('status_auto_view', 'on');
        const statusReact = await bot.db.getSetting('status_auto_react', 'off');
        const statusDownload = await bot.db.getSetting('status_auto_download', 'off');
        const statusEmojis = await bot.db.getSetting('status_react_emojis', '💛,❤️,💜,💙,👍,🔥');

        const ownerNumber = bot.config.OWNER_NUMBER;
        const yourNumber = sender.match(/(\d+)/)?.[1] || 'unknown';

        const message = `📱 *STATUS FEATURE SETTINGS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `_👑 Owner:_ ${ownerNumber}\n` +
            `_👤 Your Number:_ ${yourNumber}\n` +
            `_🔑 Is Owner:_ ${isActuallyOwner ? '✅ YES' : '❌ NO'}\n\n` +
            `_👁️ Auto-View Status:_ ${statusView === 'on' ? '✅ ON' : '❌ OFF'}\n` +
            `_❤️ Auto-React Status:_ ${statusReact === 'on' ? '✅ ON' : '❌ OFF'}\n` +
            `_📥 Auto-Download Status:_ ${statusDownload === 'on' ? '✅ ON' : '❌ OFF'}\n\n` +
            `_😊 Status React Emojis:_\n${statusEmojis}\n\n` +
            `*To change settings (Owner only):*\n` +
            `• Old style: .set statusview on/off\n` +
            `• New style: .autoviewstatus on/off\n` +
            `• .set statusreact on/off OR .autoreactstatus on/off\n` +
            `• .set statusdownload on/off OR .autodownloadstatus on/off\n` +
            `• .set statusemojis 💛,❤️,💜\n\n` +
            `_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: message,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        if (react) await react('✅');
    }
});

// ============================================
// OLD STYLE: SET COMMAND
// ============================================
commands.push({
    name: 'set',
    description: 'Change status settings (Owner only) - Old style',
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            const ownerNumber = bot.config.OWNER_NUMBER;
            const yourNumber = sender.match(/(\d+)/)?.[1] || 'unknown';
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner only command!*\n━━━━━━━━━━━━━━━━━━━\n_Your number:_ ${yourNumber}\n_Owner number:_ ${ownerNumber}\n\n_Use .statuscheck to see your status._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length < 2) {
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📝 *Usage:*\n━━━━━━━━━━━━━━━━━━━\n.set statusview on/off\n.set statusreact on/off\n.set statusdownload on/off\n.set statusemojis 💛,❤️,💜\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        const value = args.slice(1).join(' ');

        if (setting === 'statusview') {
            const newValue = value === 'on' ? 'on' : 'off';
            await bot.db.setSetting('status_auto_view', newValue);
            await react('✅');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Status auto-view set to:* ${newValue === 'on' ? 'ON' : 'OFF'}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (setting === 'statusreact') {
            const newValue = value === 'on' ? 'on' : 'off';
            await bot.db.setSetting('status_auto_react', newValue);
            await react('✅');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Status auto-react set to:* ${newValue === 'on' ? 'ON' : 'OFF'}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (setting === 'statusdownload') {
            const newValue = value === 'on' ? 'on' : 'off';
            await bot.db.setSetting('status_auto_download', newValue);
            await react('✅');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Status auto-download set to:* ${newValue === 'on' ? 'ON' : 'OFF'}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (setting === 'statusemojis') {
            await bot.db.setSetting('status_react_emojis', value);
            await react('✅');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `✅ *Status react emojis set to:* ${value}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `❌ *Unknown setting:* ${setting}\n_Available:_ statusview, statusreact, statusdownload, statusemojis\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// NEW STYLE: AUTO VIEW STATUS
// ============================================
commands.push({
    name: 'autoviewstatus',
    description: 'Toggle auto-view status (on/off) - Owner Only',
    aliases: ['avs'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_view', 'on');
            const status = current === 'on' ? 'ON' : 'OFF';
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `👁️ *AUTO VIEW STATUS*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ *${status}*\n_Options:_ on, off\n\n_Usage:_ ${config.PREFIX}autoviewstatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply(`❌ *Invalid Option*\n\nUse: on or off\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_view', option);
        await react('✅');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *AUTO VIEW UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_Auto-view status turned *${option}*_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// NEW STYLE: AUTO DOWNLOAD STATUS
// ============================================
commands.push({
    name: 'autodownloadstatus',
    description: 'Toggle auto-download status (on/off) - Owner Only',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_download', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📥 *AUTO DOWNLOAD STATUS*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ *${status}*\n_Options:_ on, off\n\n_Usage:_ ${config.PREFIX}autodownloadstatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply(`❌ *Invalid Option*\n\nUse: on or off\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_download', option);
        await react('✅');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *AUTO DOWNLOAD UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_Auto-download status turned *${option}*_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
        }, msg);
    }
});

// ============================================
// NEW STYLE: AUTO REACT STATUS
// ============================================
commands.push({
    name: 'autoreactstatus',
    description: 'Toggle auto-react status (on/off) - Owner Only',
    aliases: ['ars'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_react', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❤️ *AUTO REACT STATUS*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ *${status}*\n_Options:_ on, off\n\n_Usage:_ ${config.PREFIX}autoreactstatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply(`❌ *Invalid Option*\n\nUse: on or off\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('status_auto_react', option);
        await react('✅');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *AUTO REACT UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_Auto-react status turned *${option}*_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// NEW STYLE: SET STATUS EMOJI
// ============================================
commands.push({
    name: 'setstatusemoji',
    description: 'Set emojis for status reactions - Owner Only',
    aliases: ['sse'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_react_emojis', '💛,❤️,💜,💙,👍,🔥');
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎯 *STATUS REACTION EMOJIS*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Usage:_ ${config.PREFIX}setstatusemoji ❤️,👍,🔥,💯\n_Example:_ ${config.PREFIX}setstatusemoji ❤️,👍,🔥,✨\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const emojis = args.join(' ');
        await react('🔄');
        await bot.db.setSetting('status_react_emojis', emojis);
        await react('✅');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *EMOJIS UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_Status reaction emojis set to:_\n${emojis}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// NEW STYLE: ANTI DELETE STATUS
// ============================================
commands.push({
    name: 'antideletestatus',
    description: 'Toggle anti-delete for status (on/off) - Owner Only',
    aliases: ['ads2'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_anti_delete', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🚨 *ANTI-DELETE STATUS*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ *${status}*\n_When ON, deleted statuses will be sent to your DM_\n\n_Options:_ on, off\n_Usage:_ ${config.PREFIX}antideletestatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply(`❌ *Invalid Option*\n\nUse: on or off\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('status_anti_delete', option);
        await react('✅');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *ANTI-DELETE UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_Anti-delete status turned *${option}*_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// NEW STYLE: AUTO VIEW ONCE
// ============================================
commands.push({
    name: 'autoviewonce',
    description: 'Toggle auto-save view once media (on/off) - Owner Only',
    aliases: ['avo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, ownerManager, buttons }) {

        let isActuallyOwner = isOwner;
        if (ownerManager && !isActuallyOwner) {
            isActuallyOwner = ownerManager.isOwner(sender);
        }

        if (!isActuallyOwner) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Owner Only Command*\n━━━━━━━━━━━━━━━━━━━\n_This command can only be used by the bot owner._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoviewonce', 'on');
            const status = current === 'on' ? 'ON' : 'OFF';
            await react('ℹ️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔐 *AUTO VIEW ONCE*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ *${status}*\n_When ON, view once media will be saved to your DM_\n\n_Options:_ on, off\n_Usage:_ ${config.PREFIX}autoviewonce on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply(`❌ *Invalid Option*\n\nUse: on or off\n\n> created by wanga`);
        }

        await react('🔄');
        await bot.db.setSetting('autoviewonce', option);
        await react('✅');

        return sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *AUTO VIEW ONCE UPDATED*\n━━━━━━━━━━━━━━━━━━━\n_Auto view once turned *${option}*_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}statushelp`, text: '📱 Status Help' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// STATUS HELP - Show all commands
// ============================================
commands.push({
    name: 'statushelp',
    description: 'Show all status-related commands',
    aliases: ['helpstatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;

        const helpText = `📱 *STATUS COMMANDS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*👑 OWNER ONLY SETTINGS*\n` +
            `_${prefix}statuscheck_ - Show current settings\n` +
            `_${prefix}set statusview on/off_ - Old style\n` +
            `_${prefix}autoviewstatus on/off_ - New style\n` +
            `_${prefix}set statusreact on/off_ - Old style\n` +
            `_${prefix}autoreactstatus on/off_ - New style\n` +
            `_${prefix}set statusdownload on/off_ - Old style\n` +
            `_${prefix}autodownloadstatus on/off_ - New style\n` +
            `_${prefix}set statusemojis ❤️,👍,🔥_ - Set reaction emojis\n` +
            `_${prefix}setstatusemoji ❤️,👍,🔥_ - New style\n` +
            `_${prefix}antideletestatus on/off_ - Anti-delete for status\n` +
            `_${prefix}autoviewonce on/off_ - Auto-save view once\n\n` +

            `*📝 NOTE:*\n` +
            `_Both old and new style commands work!_\n` +
            `_They update the same database settings_\n\n` +

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
