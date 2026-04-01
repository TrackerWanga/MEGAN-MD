// MEGAN-MD Features Commands - Consistent styling with buttons

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

// ============================================
// AUTO-REACT - Owner Only
// ============================================
commands.push({
    name: 'autoreact',
    description: 'Toggle auto-react (on/off) - Owner Only',
    aliases: ['autoreact'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreact', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎭 *Auto-React*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_Usage:_ ${config.PREFIX}autoreact on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreact', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto-react ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// AUTO-READ - Owner Only
// ============================================
commands.push({
    name: 'autoread',
    description: 'Toggle auto-read (on/off) - Owner Only',
    aliases: ['autoread'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoread', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `👁️ *Auto-Read*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_Usage:_ ${config.PREFIX}autoread on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoread', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto-read ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// AUTO-BIO - Owner Only
// ============================================
commands.push({
    name: 'autobio',
    description: 'Toggle auto-bio (on/off) - Owner Only',
    aliases: ['autobio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('auto_bio', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📝 *Auto-Bio*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_Usage:_ ${config.PREFIX}autobio on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('auto_bio', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto-bio ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// VIEW-ONCE CAPTURE - Owner Only
// ============================================
commands.push({
    name: 'autoviewonce',
    description: 'Toggle view-once capture (on/off) - Owner Only',
    aliases: ['avo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('auto_view_once', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔐 *View-Once Capture*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_When ON, view-once media is saved and forwarded to owner._\n\n_Usage:_ ${config.PREFIX}autoviewonce on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('auto_view_once', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *View-once capture ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// ANTI-LINK - Public
// ============================================
commands.push({
    name: 'antilink',
    description: 'Toggle anti-link (on/off)',
    aliases: ['al'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('antilink', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🔗 *Anti-Link*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_Usage:_ ${config.PREFIX}antilink on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antilink', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Anti-link ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// ANTI-LINK ACTION - Public
// ============================================
commands.push({
    name: 'antilinkaction',
    description: 'Set anti-link action (delete/warn/kick)',
    aliases: ['ala'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('antilinkaction', 'delete');
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⚙️ *Anti-Link Action*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Options:_ delete, warn, kick\n\n_Usage:_ ${config.PREFIX}antilinkaction delete/warn/kick\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const action = args[0].toLowerCase();
        if (!['delete', 'warn', 'kick'].includes(action)) {
            return reply('❌ Action must be delete, warn, or kick');
        }

        await bot.db.setSetting('antilinkaction', action);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Anti-link action set to:* ${action}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// ANTI-CALL - Owner Only
// ============================================
commands.push({
    name: 'anticall',
    description: 'Toggle anti-call (on/off) - Owner Only',
    aliases: ['ac'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('anticall', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📞 *Anti-Call*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_Usage:_ ${config.PREFIX}anticall on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('anticall', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Anti-call ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// ANTI-DELETE - Owner Only
// ============================================
commands.push({
    name: 'antidelete',
    description: 'Toggle anti-delete (on/off) - Owner Only',
    aliases: ['ad'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antidelete', 'on');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🗑️ *Anti-Delete*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_Usage:_ ${config.PREFIX}antidelete on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antidelete', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Anti-delete ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// ANTI-EDIT - Owner Only
// ============================================
commands.push({
    name: 'antiedit',
    description: 'Toggle edited message detection (on/off) - Owner Only',
    aliases: ['ae'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antiedit', 'on');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📝 *Anti-Edit*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_When ON, edited messages are detected and forwarded to owner._\n\n_Usage:_ ${config.PREFIX}antiedit on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antiedit', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Anti-edit ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// ANTI-DELETE STATUS - Owner Only
// ============================================
commands.push({
    name: 'antideletestatus',
    description: 'Toggle status delete detection (on/off) - Owner Only',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antidelete_status', 'on');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📱 *Anti-Delete Status*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_When ON, deleted statuses are detected and recovered._\n\n_Usage:_ ${config.PREFIX}antideletestatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antidelete_status', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Status delete detection ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// STATUS AUTO-VIEW - Owner Only
// ============================================
commands.push({
    name: 'autoviewstatus',
    description: 'Toggle auto-view status (on/off) - Owner Only',
    aliases: ['avs'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_view', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `👁️ *Auto-View Status*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_When ON, bot automatically views all statuses._\n\n_Usage:_ ${config.PREFIX}autoviewstatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('status_auto_view', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto-view status ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// STATUS AUTO-REACT - Owner Only
// ============================================
commands.push({
    name: 'autoreactstatus',
    description: 'Toggle auto-react status (on/off) - Owner Only',
    aliases: ['ars'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_react', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❤️ *Auto-React Status*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_When ON, bot reacts to statuses with random emojis._\n\n_Usage:_ ${config.PREFIX}autoreactstatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('status_auto_react', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto-react status ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// STATUS AUTO-DOWNLOAD - Owner Only
// ============================================
commands.push({
    name: 'autodownloadstatus',
    description: 'Toggle auto-download status (on/off) - Owner Only',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_auto_download', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⬇️ *Auto-Download Status*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${status}\n_When ON, status media is downloaded and forwarded to owner._\n\n_Usage:_ ${config.PREFIX}autodownloadstatus on/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('status_auto_download', setting);
        await react(setting === 'on' ? '✅' : '❌');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto-download status ${setting === 'on' ? 'enabled' : 'disabled'}*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// SET STATUS EMOJIS - Owner Only
// ============================================
commands.push({
    name: 'setstatusemoji',
    description: 'Set emojis for status reactions',
    aliases: ['ssemoji'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('status_react_emojis', '💛,❤️,💜,💙,👍,🔥');
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎯 *Status Reaction Emojis*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n\n_Usage:_ ${config.PREFIX}setstatusemoji ❤️,👍,🔥,✨\n_Separate emojis with commas._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const emojis = args.join(' ');
        await bot.db.setSetting('status_react_emojis', emojis);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Status reaction emojis updated to:* ${emojis}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// PRESENCE PM - Owner Only
// ============================================
commands.push({
    name: 'presencepm',
    description: 'Set presence in private messages - Owner Only',
    aliases: ['ppm'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('presence_pm', 'typing');
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `💬 *Presence PM*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Options:_ online, typing, recording, offline\n\n_Usage:_ ${config.PREFIX}presencepm online/typing/recording/offline\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const presence = args[0].toLowerCase();
        if (!['online', 'typing', 'recording', 'offline'].includes(presence)) {
            return reply('❌ Presence must be online, typing, recording, or offline');
        }

        await bot.db.setSetting('presence_pm', presence);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Presence in PMs set to:* ${presence}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// PRESENCE GROUP - Owner Only
// ============================================
commands.push({
    name: 'presencegroup',
    description: 'Set presence in groups - Owner Only',
    aliases: ['pg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('presence_group', 'typing');
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `👥 *Presence Group*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Options:_ online, typing, recording, offline\n\n_Usage:_ ${config.PREFIX}presencegroup online/typing/recording/offline\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const presence = args[0].toLowerCase();
        if (!['online', 'typing', 'recording', 'offline'].includes(presence)) {
            return reply('❌ Presence must be online, typing, recording, or offline');
        }

        await bot.db.setSetting('presence_group', presence);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Presence in groups set to:* ${presence}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// AUTO TYPING - Owner Only
// ============================================
commands.push({
    name: 'autotyping',
    description: 'Show typing indicator (dm/group/both/off) - Owner Only',
    aliases: ['atyping'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autotyping', 'off');
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⌨️ *Auto Typing*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Options:_ dm, group, both, off\n\n_Usage:_ ${config.PREFIX}autotyping dm/group/both/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (!['dm', 'group', 'both', 'off'].includes(setting)) {
            return reply('❌ Option must be dm, group, both, or off');
        }

        await bot.db.setSetting('autotyping', setting);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto typing set to:* ${setting}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// AUTO RECORDING - Owner Only
// ============================================
commands.push({
    name: 'autorecording',
    description: 'Show recording indicator (dm/group/both/off) - Owner Only',
    aliases: ['arec'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, buttons }) {
        if (!isOwner) {
            await react('❌');
            return reply('❌ Only the owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autorecording', 'off');
            
            return await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎤 *Auto Recording*\n━━━━━━━━━━━━━━━━━━━\n_Current:_ ${current}\n_Options:_ dm, group, both, off\n\n_Usage:_ ${config.PREFIX}autorecording dm/group/both/off\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const setting = args[0].toLowerCase();
        if (!['dm', 'group', 'both', 'off'].includes(setting)) {
            return reply('❌ Option must be dm, group, both, or off');
        }

        await bot.db.setSetting('autorecording', setting);
        await react('✅');

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Auto recording set to:* ${setting}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}features`, text: '⚙️ Features' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
    }
});

// ============================================
// FEATURES HELP - Public
// ============================================
commands.push({
    name: 'features',
    description: 'Show all feature toggle commands',
    aliases: ['featurehelp', 'toggles'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;
        
        const helpText = `⚙️ *𝐅𝐄𝐀𝐓𝐔𝐑𝐄 𝐓𝐎𝐆𝐆𝐋𝐄𝐒*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*𝐀𝐔𝐓𝐎 (Owner)*\n` +
            `_${prefix}autoreact on/off_ - Auto reaction\n` +
            `_${prefix}autoread on/off_ - Auto mark as read\n` +
            `_${prefix}autobio on/off_ - Auto update bio\n` +
            `_${prefix}autoviewonce on/off_ - View-once capture\n\n` +
            
            `*𝐀𝐍𝐓𝐈 (Owner)*\n` +
            `_${prefix}antidelete on/off_ - Catch deleted messages\n` +
            `_${prefix}antiedit on/off_ - Catch edited messages\n` +
            `_${prefix}anticall on/off_ - Block calls\n` +
            `_${prefix}antideletestatus on/off_ - Status delete detection\n\n` +
            
            `*𝐀𝐍𝐓𝐈-𝐋𝐈𝐍𝐊 (Public)*\n` +
            `_${prefix}antilink on/off_ - Block links\n` +
            `_${prefix}antilinkaction delete/warn/kick_ - Action for links\n\n` +
            
            `*𝐒𝐓𝐀𝐓𝐔𝐒 (Owner)*\n` +
            `_${prefix}autoviewstatus on/off_ - Auto view status\n` +
            `_${prefix}autoreactstatus on/off_ - Auto react status\n` +
            `_${prefix}autodownloadstatus on/off_ - Auto download status\n` +
            `_${prefix}setstatusemoji ❤️,👍,🔥_ - Reaction emojis\n\n` +
            
            `*𝐏𝐑𝐄𝐒𝐄𝐍𝐂𝐄 (Owner)*\n` +
            `_${prefix}presencepm online/typing/recording/offline_\n` +
            `_${prefix}presencegroup online/typing/recording/offline_\n` +
            `_${prefix}autotyping dm/group/both/off_\n` +
            `_${prefix}autorecording dm/group/both/off_\n\n` +
            
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
