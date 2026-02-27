const config = require('../../megan/config');

const commands = [];

// ============================================
// 1. SET PREFIX
// ============================================
commands.push({
    name: 'setprefix',
    description: 'Change bot command prefix',
    aliases: ['prefix'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('prefix', config.PREFIX);
            return reply(`🔧 *Current prefix:* \`${current}\`\n\nUsage: ${config.PREFIX}setprefix <symbol>`);
        }

        const newPrefix = args[0];
        await bot.db.setSetting('prefix', newPrefix);
        config.PREFIX = newPrefix;

        await react('✅');
        await reply(`✅ Prefix changed to \`${newPrefix}\``);
    }
});

// ============================================
// 2. SET BOT NAME
// ============================================
commands.push({
    name: 'setbotname',
    description: 'Change bot display name',
    aliases: ['botname'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            return reply(`📛 *Current bot name:* ${config.BOT_NAME}\n\nUsage: ${config.PREFIX}setbotname <new name>`);
        }

        const newName = args.join(' ');
        await bot.db.setSetting('botname', newName);
        config.BOT_NAME = newName;

        await react('✅');
        await reply(`✅ Bot name changed to: *${newName}*`);
    }
});

// ============================================
// 3. SET MODE
// ============================================
commands.push({
    name: 'setmode',
    description: 'Set bot mode (public/private)',
    aliases: ['mode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('mode', config.MODE);
            return reply(`⚙️ *Current mode:* ${current}\n\nUsage: ${config.PREFIX}setmode <public/private>`);
        }

        const mode = args[0].toLowerCase();
        if (mode !== 'public' && mode !== 'private') {
            return reply('❌ Mode must be "public" or "private"');
        }

        await bot.db.setSetting('mode', mode);
        config.MODE = mode;

        await react('✅');
        await reply(`✅ Mode changed to: *${mode}*`);
    }
});

// ============================================
// 4. VIEW ALL CORE SETTINGS
// ============================================
commands.push({
    name: 'settings',
    description: 'View all core bot settings',
    aliases: ['coresettings'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('⚙️');

        try {
            const prefix = await bot.db.getSetting('prefix', config.PREFIX);
            const botname = await bot.db.getSetting('botname', config.BOT_NAME);
            const mode = await bot.db.getSetting('mode', config.MODE);

            const settingsText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                               `┃ *${config.BOT_NAME}*\n` +
                               `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                               `⚙️ *CORE BOT SETTINGS*\n\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `🔧 *Prefix:* ${prefix}\n` +
                               `📛 *Bot Name:* ${botname}\n` +
                               `⚡ *Mode:* ${mode}\n\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `> created by wanga\n\n` +
                               `*For feature toggles, use:*\n` +
                               `• ${prefix}features - Feature settings\n` +
                               `• ${prefix}status - Status settings\n` +
                               `• ${prefix}privacy - Privacy settings\n` +
                               `• ${prefix}chatbot - AI chatbot settings`;

            await sock.sendMessage(from, { text: settingsText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            bot.logger.error('Settings error:', error);
            await react('❌');
            await reply(`❌ Failed to get settings: ${error.message}`);
        }
    }
});

// ============================================
// 5. RESET CORE SETTINGS
// ============================================
commands.push({
    name: 'resetsettings',
    description: 'Reset core settings to default',
    aliases: ['resetcore'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        // Confirm with user
        if (args[0]?.toLowerCase() !== '--force') {
            return reply(`⚠️ *WARNING:* This will reset CORE settings to default!\n\nTo confirm: ${config.PREFIX}resetsettings --force\n\nResets: prefix, bot name, mode`);
        }

        await react('🔄');

        try {
            // Reset core settings to defaults
            await bot.db.setSetting('prefix', '.');
            await bot.db.setSetting('botname', '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃');
            await bot.db.setSetting('mode', 'public');

            // Update config
            config.PREFIX = '.';
            config.BOT_NAME = '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃';
            config.MODE = 'public';

            await react('✅');
            await reply('✅ Core settings have been reset to defaults!');

        } catch (error) {
            bot.logger.error('Reset settings error:', error);
            await react('❌');
            await reply(`❌ Failed to reset settings: ${error.message}`);
        }
    }
});

// ============================================
// 6. SETTINGS HELP
// ============================================
commands.push({
    name: 'settingshelp',
    description: 'Show available core settings commands',
    aliases: ['helpsettings'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `⚙️ *CORE SETTINGS COMMANDS*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}setprefix <symbol> - Change command prefix\n` +
                        `• ${config.PREFIX}setbotname <name> - Change bot name\n` +
                        `• ${config.PREFIX}setmode <public/private> - Set bot mode\n` +
                        `• ${config.PREFIX}settings - View core settings\n` +
                        `• ${config.PREFIX}resetsettings --force - Reset to defaults\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*OTHER SETTINGS CATEGORIES*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}features - Feature toggles\n` +
                        `• ${config.PREFIX}status - Status settings\n` +
                        `• ${config.PREFIX}privacy - Privacy settings\n` +
                        `• ${config.PREFIX}chatbot - AI chatbot settings\n` +
                        `• ${config.PREFIX}welcome - Welcome/goodbye settings\n` +
                        `• ${config.PREFIX}usermgmt - User management\n\n` +

                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };