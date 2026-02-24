const config = require('../../megan/config');

const commands = [];

// ============================================
// ANTI-DELETE - Fixed to use on/off
// ============================================
commands.push({
    name: 'antidelete',
    description: 'Toggle anti-delete feature (on/off)',
    aliases: ['antidel'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('antidelete', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`🗑️ *Anti-Delete Settings*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('antidelete', option);
        await react('✅');
        await reply(`✅ Anti-delete turned ${option}`);
    }
});

// ============================================
// ANTI-CALL
// ============================================
commands.push({
    name: 'anticall',
    description: 'Toggle anti-call feature (false/reject/block)',
    aliases: ['antical'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('anticall', 'false');
            await react('ℹ️');
            return reply(`📞 *Anti-Call Settings*\n\nCurrent: ${current}\n\nOptions: false, reject, block`);
        }

        const option = args[0].toLowerCase();
        if (!['false', 'reject', 'block'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: false, reject, block');
        }

        await react('🔄');
        await bot.db.setSetting('anticall', option);
        await react('✅');
        await reply(`✅ Anti-call set to: ${option}`);
    }
});

// ============================================
// ANTI-LINK - Keep as is (group-specific)
// ============================================
commands.push({
    name: 'antilink',
    description: 'Toggle anti-link feature (false/delete/warn/kick)',
    aliases: ['antilink'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!msg.key.remoteJid.endsWith('@g.us')) {
            await react('❌');
            return reply('❌ This command can only be used in groups!');
        }

        // Optional: Add admin check back
        try {
            const metadata = await sock.groupMetadata(from);
            const isAdmin = metadata.participants.some(p => 
                p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            if (!isAdmin) {
                await react('❌');
                return reply('❌ Only group admins can change anti-link settings!');
            }
        } catch (e) {
            // Skip if metadata fetch fails
        }

        if (args.length === 0) {
            const group = await bot.db.getGroup(from);
            const current = group ? group.antilink : 'false';
            await react('ℹ️');
            return reply(`🔗 *Anti-Link Settings*\n\nCurrent: ${current}\n\nOptions: false, delete, warn, kick`);
        }

        const option = args[0].toLowerCase();
        if (!['false', 'delete', 'warn', 'kick'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: false, delete, warn, kick');
        }

        await react('🔄');
        await bot.db.updateGroup(from, { antilink: option });
        await react('✅');
        await reply(`✅ Anti-link set to: ${option} for this group`);
    }
});

// ============================================
// AUTO-REACT
// ============================================
commands.push({
    name: 'autoreact',
    description: 'Toggle auto-react feature (on/off)',
    aliases: ['autoreact'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreact', 'false');
            const status = current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`🎯 *Auto-React Settings*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('autoreact', option === 'on' ? 'true' : 'false');
        await react('✅');
        await reply(`✅ Auto-react turned ${option}`);
    }
});

// ============================================
// AUTO-READ
// ============================================
commands.push({
    name: 'autoread',
    description: 'Toggle auto-read feature (on/off)',
    aliases: ['autoread'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('auto_read', 'false');
            const status = current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`👁️ *Auto-Read Settings*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('auto_read', option === 'on' ? 'true' : 'false');
        await react('✅');
        await reply(`✅ Auto-read turned ${option}`);
    }
});

// ============================================
// AUTO-BIO
// ============================================
commands.push({
    name: 'autobio',
    description: 'Toggle auto-bio feature (on/off)',
    aliases: ['autobio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('auto_bio', 'false');
            const status = current === 'true' ? 'ON' : 'OFF';
            await react('ℹ️');
            return reply(`📝 *Auto-Bio Settings*\n\nCurrent: ${status}\n\nOptions: on, off`);
        }

        const option = args[0].toLowerCase();
        if (!['on', 'off'].includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: on, off');
        }

        await react('🔄');
        await bot.db.setSetting('auto_bio', option === 'on' ? 'true' : 'false');
        await react('✅');
        await reply(`✅ Auto-bio turned ${option}`);
    }
});

// ============================================
// PRESENCE - Keep as is
// ============================================
commands.push({
    name: 'presence',
    description: 'Set presence type (online/typing/recording/offline)',
    aliases: ['presence'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length < 2) {
            await react('ℹ️');
            return reply(`👤 *Presence Settings*\n\nUsage: ${config.PREFIX}presence [inbox/group] [online/typing/recording/offline]\n\nExample: ${config.PREFIX}presence inbox typing`);
        }

        const type = args[0].toLowerCase();
        const presence = args[1].toLowerCase();

        if (!['inbox', 'group'].includes(type)) {
            await react('❌');
            return reply('❌ Type must be: inbox or group');
        }

        if (!['online', 'typing', 'recording', 'offline'].includes(presence)) {
            await react('❌');
            return reply('❌ Presence must be: online, typing, recording, offline');
        }

        await react('🔄');
        await bot.db.setSetting(type === 'inbox' ? 'presence_inbox' : 'presence_group', presence);
        await react('✅');
        await reply(`✅ ${type} presence set to: ${presence}`);
    }
});

// ============================================
// SET MESSAGE - Keep as is
// ============================================
commands.push({
    name: 'setmsg',
    description: 'Set custom messages',
    aliases: ['setmessage'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length < 2) {
            await react('ℹ️');
            return reply(`📝 *Set Messages*\n\nUsage: ${config.PREFIX}setmsg [type] [message]\n\nTypes: anticall, antilink, welcome, goodbye\n\nExample: ${config.PREFIX}setmsg anticall Calls are not allowed!`);
        }

        const type = args[0].toLowerCase();
        const message = args.slice(1).join(' ');
        const validTypes = ['anticall', 'antilink', 'welcome', 'goodbye'];

        if (!validTypes.includes(type)) {
            await react('❌');
            return reply(`❌ Type must be: ${validTypes.join(', ')}`);
        }

        await react('🔄');
        await bot.db.setSetting(`${type}_msg`, message);
        await react('✅');
        await reply(`✅ ${type} message updated!`);
    }
});

// ============================================
// STATS - Keep as is
// ============================================
commands.push({
    name: 'stats',
    description: 'Show bot statistics',
    aliases: ['statistics', 'botstats'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        await react('🔄');

        try {
            const stats = await bot.db.getStats();

            if (!stats) {
                return reply('❌ Database not enabled or no stats available');
            }

            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);

            const memory = process.memoryUsage();
            const usedMB = Math.round(memory.heapUsed / 1024 / 1024);

            let statsText = `┏━━━━━━━━━━━━━━━━━━━┓\n`;
            statsText += `┃ *${config.BOT_NAME} STATS*\n`;
            statsText += `┗━━━━━━━━━━━━━━━━━━━┛\n\n`;
            statsText += `📊 *Database Stats*\n`;
            statsText += `▸ Commands Run: ${stats.totalCommands}\n`;
            statsText += `▸ Users: ${stats.totalUsers}\n`;
            statsText += `▸ Groups: ${stats.totalGroups}\n`;
            statsText += `▸ Banned: ${stats.bannedUsers}\n`;
            statsText += `▸ Premium: ${stats.premiumUsers}\n\n`;
            statsText += `📈 *Top Commands*\n`;

            stats.topCommands.forEach((cmd, i) => {
                statsText += `▸ ${i+1}. ${cmd.name}: ${cmd.used} times\n`;
            });

            statsText += `\n⚙️ *System*\n`;
            statsText += `▸ Uptime: ${hours}h ${minutes}m\n`;
            statsText += `▸ Memory: ${usedMB}MB\n`;
            statsText += `▸ Node: ${process.version}\n\n`;
            statsText += `> ${config.FOOTER}`;

            await reply(statsText);
            await react('✅');

        } catch (error) {
            console.error('Stats error:', error);
            await react('❌');
            await reply(`❌ Error: ${error.message}`);
        }
    }
});

module.exports = { commands };