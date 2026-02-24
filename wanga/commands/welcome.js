const config = require('../../megan/config');

const commands = [];

// ============================================
// WELCOME MASTER SWITCH
// ============================================
commands.push({
    name: 'welcome',
    description: 'Toggle welcome messages (on/off)',
    aliases: ['wlc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('welcome', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`👋 *Welcome Messages*\n\nCurrent: ${status}\n\nOptions: on, off\n\nWhen ON, welcomes new members when they join.\n\nUsage: ${config.PREFIX}welcome <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('welcome', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Welcome messages ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// WELCOME MESSAGE TEXT
// ============================================
commands.push({
    name: 'welcomemessage',
    description: 'Set welcome message text',
    aliases: ['wmsg', 'setwelcome'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('welcomemessage', 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.');
            return reply(`📝 *Welcome Message*\n\nCurrent:\n${current}\n\nUsage: ${config.PREFIX}welcomemessage <text>\nUse @user to mention new member\n\nExample: ${config.PREFIX}welcomemessage Welcome @user! 🎉`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('welcomemessage', message);
        await react('✅');
        await reply(`✅ Welcome message set to:\n${message}`);
    }
});

// ============================================
// WELCOME AUDIO TOGGLE
// ============================================
commands.push({
    name: 'welcomeaudio',
    description: 'Toggle welcome audio (TTS) (on/off)',
    aliases: ['waudio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('welcomeaudio', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`🔊 *Welcome Audio*\n\nCurrent: ${status}\n\nOptions: on, off\n\nWhen ON, welcome messages are sent as audio (TTS).\n\nUsage: ${config.PREFIX}welcomeaudio <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('welcomeaudio', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Welcome audio ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// GOODBYE MASTER SWITCH
// ============================================
commands.push({
    name: 'goodbye',
    description: 'Toggle goodbye messages (on/off)',
    aliases: ['gb'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('goodbye', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`👋 *Goodbye Messages*\n\nCurrent: ${status}\n\nOptions: on, off\n\nWhen ON, says goodbye when members leave.\n\nUsage: ${config.PREFIX}goodbye <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('goodbye', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Goodbye messages ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// GOODBYE MESSAGE TEXT
// ============================================
commands.push({
    name: 'setbyemessage',
    description: 'Set goodbye message text',
    aliases: ['gbmsg', 'setgoodbye'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('goodbyemessage', 'Goodbye @user! 👋');
            return reply(`📝 *Goodbye Message*\n\nCurrent:\n${current}\n\nUsage: ${config.PREFIX}setbyemessage <text>\nUse @user to mention leaving member\n\nExample: ${config.PREFIX}setbyemessage See you later @user! 👋`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('goodbyemessage', message);
        await react('✅');
        await reply(`✅ Goodbye message set to:\n${message}`);
    }
});

// ============================================
// GOODBYE AUDIO TOGGLE
// ============================================
commands.push({
    name: 'goodbyeaudio',
    description: 'Toggle goodbye audio (TTS) (on/off)',
    aliases: ['gbaudio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (args.length === 0) {
            const current = await bot.db.getSetting('goodbyeaudio', 'off');
            const status = current === 'on' ? 'ON' : 'OFF';
            return reply(`🔊 *Goodbye Audio*\n\nCurrent: ${status}\n\nOptions: on, off\n\nWhen ON, goodbye messages are sent as audio (TTS).\n\nUsage: ${config.PREFIX}goodbyeaudio <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('goodbyeaudio', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Goodbye audio ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// TEST WELCOME (for debugging)
// ============================================
commands.push({
    name: 'testwelcome',
    description: 'Test welcome message (debug)',
    aliases: ['testwlc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!from.endsWith('@g.us')) {
            await react('❌');
            return reply('❌ This command can only be used in groups!');
        }

        const welcomeEnabled = await bot.db.getSetting('welcome', 'off');
        const welcomeMsg = await bot.db.getSetting('welcomemessage', 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.');
        const welcomeAudio = await bot.db.getSetting('welcomeaudio', 'off');

        const testText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `🧪 *WELCOME TEST*\n\n` +
                        `📊 *Settings:*\n` +
                        `• Welcome: ${welcomeEnabled === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                        `• Audio: ${welcomeAudio === 'on' ? '✅ ON' : '❌ OFF'}\n\n` +
                        `📝 *Message:*\n${welcomeMsg.replace('@user', '@' + sender.split('@')[0])}\n\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, { text: testText }, { quoted: msg });
        await react('✅');
    }
});

// ============================================
// TEST GOODBYE (for debugging)
// ============================================
commands.push({
    name: 'testgoodbye',
    description: 'Test goodbye message (debug)',
    aliases: ['testgb'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!from.endsWith('@g.us')) {
            await react('❌');
            return reply('❌ This command can only be used in groups!');
        }

        const goodbyeEnabled = await bot.db.getSetting('goodbye', 'off');
        const goodbyeMsg = await bot.db.getSetting('goodbyemessage', 'Goodbye @user! 👋');
        const goodbyeAudio = await bot.db.getSetting('goodbyeaudio', 'off');

        const testText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `🧪 *GOODBYE TEST*\n\n` +
                        `📊 *Settings:*\n` +
                        `• Goodbye: ${goodbyeEnabled === 'on' ? '✅ ON' : '❌ OFF'}\n` +
                        `• Audio: ${goodbyeAudio === 'on' ? '✅ ON' : '❌ OFF'}\n\n` +
                        `📝 *Message:*\n${goodbyeMsg.replace('@user', '@' + sender.split('@')[0])}\n\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, { text: testText }, { quoted: msg });
        await react('✅');
    }
});

// ============================================
// WELCOME HELP
// ============================================
commands.push({
    name: 'welcomehelp',
    description: 'Show all welcome/goodbye commands',
    aliases: ['whelp', 'greetings'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `👋 *WELCOME/GOODBYE COMMANDS*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*WELCOME SETTINGS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}welcome <on/off> - Enable/disable welcomes\n` +
                        `• ${config.PREFIX}welcomemessage <text> - Set welcome text\n` +
                        `• ${config.PREFIX}welcomeaudio <on/off> - Toggle welcome audio\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*GOODBYE SETTINGS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}goodbye <on/off> - Enable/disable goodbyes\n` +
                        `• ${config.PREFIX}setbyemessage <text> - Set goodbye text\n` +
                        `• ${config.PREFIX}goodbyeaudio <on/off> - Toggle goodbye audio\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*TEST COMMANDS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}testwelcome - Test welcome message\n` +
                        `• ${config.PREFIX}testgoodbye - Test goodbye message\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*PLACEHOLDERS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• @user - Mentions the member\n` +
                        `• {name} - Member's name\n` +
                        `• {group} - Group name\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };