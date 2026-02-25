const config = require('../../megan/config');

const commands = [];

// Helper to check owner
const isOwner = (bot, sender) => bot.ownerHelper.isOwner(sender);

// ============================================
// AUTO-REACT FEATURES
// ============================================

commands.push({
    name: 'autoreact',
    description: 'Master switch for auto-react (on/off)',
    aliases: ['ar'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreact', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`🎭 *Auto-React Master*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}autoreact <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreact', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-react master ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

commands.push({
    name: 'autoreactpm',
    description: 'Auto-react in private messages (on/off)',
    aliases: ['arp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreactpm', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`💬 *Auto-React PM*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}autoreactpm <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreactpm', setting);
        await react('✅');
        await reply(`✅ Auto-react in PMs ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

commands.push({
    name: 'autoreactgroup',
    description: 'Auto-react in groups (on/off)',
    aliases: ['arg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreactgroup', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`👥 *Auto-React Group*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}autoreactgroup <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreactgroup', setting);
        await react('✅');
        await reply(`✅ Auto-react in groups ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// AUTO-READ FEATURES
// ============================================

commands.push({
    name: 'autoread',
    description: 'Master switch for auto-read (on/off)',
    aliases: ['ar'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoread', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`👁️ *Auto-Read Master*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}autoread <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoread', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-read master ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

commands.push({
    name: 'autoreadpm',
    description: 'Auto-read private messages (on/off)',
    aliases: ['arp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreadpm', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`💬 *Auto-Read PM*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}autoreadpm <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreadpm', setting);
        await react('✅');
        await reply(`✅ Auto-read in PMs ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

commands.push({
    name: 'autoreadgroup',
    description: 'Auto-read groups (on/off)',
    aliases: ['arg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreadgroup', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`👥 *Auto-Read Group*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}autoreadgroup <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreadgroup', setting);
        await react('✅');
        await reply(`✅ Auto-read in groups ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// ANTI-LINK FEATURES
// ============================================

commands.push({
    name: 'antilink',
    description: 'Master switch for anti-link (on/off)',
    aliases: ['al'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilink', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`🔗 *Anti-Link Master*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}antilink <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antilink', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Anti-link master ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

commands.push({
    name: 'antilinkaction',
    description: 'Set anti-link action (delete/warn/kick)',
    aliases: ['ala'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilinkaction', 'delete');
            return reply(`⚙️ *Anti-Link Action*\n\nCurrent: ${current}\n\nOptions: delete, warn, kick\n\nUsage: ${config.PREFIX}antilinkaction <delete/warn/kick>`);
        }

        const action = args[0].toLowerCase();
        if (!['delete', 'warn', 'kick'].includes(action)) {
            return reply('❌ Action must be delete, warn, or kick');
        }

        await bot.db.setSetting('antilinkaction', action);
        await react('✅');
        await reply(`✅ Anti-link action set to: *${action}*`);
    }
});

commands.push({
    name: 'antilinkwarning',
    description: 'Set warnings before kick (1-10)',
    aliases: ['alw'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilinkwarning', '3');
            return reply(`⚠️ *Anti-Link Warnings*\n\nCurrent: ${current}\n\nUsage: ${config.PREFIX}antilinkwarning <number 1-10>`);
        }

        const count = parseInt(args[0]);
        if (isNaN(count) || count < 1 || count > 10) {
            return reply('❌ Warning count must be between 1-10');
        }

        await bot.db.setSetting('antilinkwarning', count.toString());
        await react('✅');
        await reply(`✅ Anti-link warnings set to: *${count}*`);
    }
});

commands.push({
    name: 'antilinkmessage',
    description: 'Set custom anti-link warning message',
    aliases: ['alm'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilinkmessage', '⚠️ Links are not allowed!');
            return reply(`📝 *Anti-Link Message*\n\nCurrent: ${current}\n\nUsage: ${config.PREFIX}antilinkmessage <text>`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('antilinkmessage', message);
        await react('✅');
        await reply(`✅ Anti-link message set to:\n${message}`);
    }
});

// ============================================
// ANTI-CALL FEATURES
// ============================================

commands.push({
    name: 'anticall',
    description: 'Master switch for anti-call (on/off)',
    aliases: ['ac'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('anticall', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`📞 *Anti-Call Master*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}anticall <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('anticall', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Anti-call master ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

commands.push({
    name: 'anticallmessage',
    description: 'Set anti-call auto-reply message',
    aliases: ['acm'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('anticallmessage', '📞 Calls are not allowed! I will reject your call.');
            return reply(`📝 *Anti-Call Message*\n\nCurrent: ${current}\n\nUsage: ${config.PREFIX}anticallmessage <text>`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('anticallmessage', message);
        await react('✅');
        await reply(`✅ Anti-call message set to:\n${message}`);
    }
});

// ============================================
// ANTI-DELETE FEATURES
// ============================================

commands.push({
    name: 'antidelete',
    description: 'Master switch for anti-delete (on/off)',
    aliases: ['ad'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antidelete', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`🗑️ *Anti-Delete Master*\n\nCurrent: ${status}\n\nUsage: ${config.PREFIX}antidelete <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antidelete', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Anti-delete master ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// PRESENCE FEATURES
// ============================================

commands.push({
    name: 'presencepm',
    description: 'Set presence in private messages',
    aliases: ['ppm'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('presence_pm', 'typing');
            return reply(`💬 *Presence PM*\n\nCurrent: ${current}\n\nOptions: online, typing, recording, offline\n\nUsage: ${config.PREFIX}presencepm <option>`);
        }

        const presence = args[0].toLowerCase();
        if (!['online', 'typing', 'recording', 'offline'].includes(presence)) {
            return reply('❌ Presence must be online, typing, recording, or offline');
        }

        await bot.db.setSetting('presence_pm', presence);
        await react('✅');
        await reply(`✅ Presence in PMs set to: *${presence}*`);
    }
});

commands.push({
    name: 'presencegroup',
    description: 'Set presence in groups',
    aliases: ['pg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('presence_group', 'typing');
            return reply(`👥 *Presence Group*\n\nCurrent: ${current}\n\nOptions: online, typing, recording, offline\n\nUsage: ${config.PREFIX}presencegroup <option>`);
        }

        const presence = args[0].toLowerCase();
        if (!['online', 'typing', 'recording', 'offline'].includes(presence)) {
            return reply('❌ Presence must be online, typing, recording, or offline');
        }

        await bot.db.setSetting('presence_group', presence);
        await react('✅');
        await reply(`✅ Presence in groups set to: *${presence}*`);
    }
});

commands.push({
    name: 'autotyping',
    description: 'Show typing indicator (dm/group/both/off)',
    aliases: ['at'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autotyping', 'off');
            return reply(`⌨️ *Auto Typing*\n\nCurrent: ${current}\n\nOptions: dm, group, both, off\n\nUsage: ${config.PREFIX}autotyping <dm/group/both/off>`);
        }

        const setting = args[0].toLowerCase();
        if (!['dm', 'group', 'both', 'off'].includes(setting)) {
            return reply('❌ Option must be dm, group, both, or off');
        }

        await bot.db.setSetting('autotyping', setting);
        await react('✅');
        await reply(`✅ Auto typing set to: *${setting}*`);
    }
});

commands.push({
    name: 'autorecording',
    description: 'Show recording indicator (dm/group/both/off)',
    aliases: ['ar'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autorecording', 'off');
            return reply(`🎤 *Auto Recording*\n\nCurrent: ${current}\n\nOptions: dm, group, both, off\n\nUsage: ${config.PREFIX}autorecording <dm/group/both/off>`);
        }

        const setting = args[0].toLowerCase();
        if (!['dm', 'group', 'both', 'off'].includes(setting)) {
            return reply('❌ Option must be dm, group, both, or off');
        }

        await bot.db.setSetting('autorecording', setting);
        await react('✅');
        await reply(`✅ Auto recording set to: *${setting}*`);
    }
});

// ============================================
// FEATURES HELP
// ============================================
commands.push({
    name: 'features',
    description: 'Show all feature toggle commands',
    aliases: ['featurehelp', 'toggles'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        const prefix = config.PREFIX;
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `⚙️ *FEATURE TOGGLES*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*AUTO-REACT*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${prefix}autoreact <on/off> - Master switch\n` +
                        `• ${prefix}autoreactpm <on/off> - In PMs\n` +
                        `• ${prefix}autoreactgroup <on/off> - In groups\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*AUTO-READ*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${prefix}autoread <on/off> - Master switch\n` +
                        `• ${prefix}autoreadpm <on/off> - In PMs\n` +
                        `• ${prefix}autoreadgroup <on/off> - In groups\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*ANTI-LINK*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${prefix}antilink <on/off> - Master switch\n` +
                        `• ${prefix}antilinkaction <delete/warn/kick> - Action\n` +
                        `• ${prefix}antilinkwarning <1-10> - Warnings before kick\n` +
                        `• ${prefix}antilinkmessage <text> - Custom message\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*ANTI-CALL*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${prefix}anticall <on/off> - Master switch\n` +
                        `• ${prefix}anticallmessage <text> - Reply message\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*ANTI-DELETE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${prefix}antidelete <on/off> - Master switch\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*PRESENCE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${prefix}presencepm <type> - Presence in PMs\n` +
                        `• ${prefix}presencegroup <type> - Presence in groups\n` +
                        `• ${prefix}autotyping <dm/group/both/off> - Auto typing\n` +
                        `• ${prefix}autorecording <dm/group/both/off> - Auto recording\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };