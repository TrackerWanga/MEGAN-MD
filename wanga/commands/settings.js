const config = require('../../megan/config');

const commands = [];

// Helper to check owner
const isOwner = (bot, sender) => bot.ownerHelper.isOwner(sender);

// ============================================
// 1. SET PREFIX
// ============================================
commands.push({
    name: 'setprefix',
    description: 'Change bot command prefix',
    aliases: ['prefix'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('prefix', config.PREFIX);
            return reply(`🔧 *Current prefix:* \`${current}\`\n\nUsage: ${config.PREFIX}setprefix <symbol>`);
        }

        const newPrefix = args[0];
        await bot.db.setSetting('prefix', newPrefix);
        config.PREFIX = newPrefix; // Update in memory
        
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
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

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
// 3. SET OWNER NAME
// ============================================
commands.push({
    name: 'setownername',
    description: 'Change owner name',
    aliases: ['ownername'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`👤 *Current owner name:* ${config.OWNER_NAME}\n\nUsage: ${config.PREFIX}setownername <new name>`);
        }

        const newName = args.join(' ');
        await bot.db.setSetting('ownername', newName);
        config.OWNER_NAME = newName;
        
        await react('✅');
        await reply(`✅ Owner name changed to: *${newName}*`);
    }
});

// ============================================
// 4. SET OWNER PHONE
// ============================================
commands.push({
    name: 'setownerphone',
    description: 'Change owner phone number',
    aliases: ['ownerphone'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`📞 *Current owner phone:* ${config.OWNER_NUMBER}\n\nUsage: ${config.PREFIX}setownerphone <number>`);
        }

        const newPhone = args[0].replace(/\D/g, '');
        if (newPhone.length < 10) {
            return reply('❌ Invalid phone number! Include country code (e.g., 254...)');
        }

        await bot.db.setSetting('ownerphone', newPhone);
        config.OWNER_NUMBER = newPhone;
        bot.ownerHelper.updateOwner(newPhone); // Update owner helper
        
        await react('✅');
        await reply(`✅ Owner phone changed to: ${newPhone}`);
    }
});

// ============================================
// 5. SET MODE
// ============================================
commands.push({
    name: 'setmode',
    description: 'Set bot mode (public/private)',
    aliases: ['mode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

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
// 6. AUTO REACT MASTER
// ============================================
commands.push({
    name: 'autoreact',
    description: 'Master switch for auto-react',
    aliases: ['ar'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreact', 'off');
            return reply(`🎭 *Auto-react:* ${current}\n\nUsage: ${config.PREFIX}autoreact <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreact', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-react ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 7. AUTO REACT STATUS
// ============================================
commands.push({
    name: 'autoreactstatus',
    description: 'Auto-react to statuses (random)',
    aliases: ['ars', 'statusreact'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreactstatus', 'off');
            return reply(`📱 *Auto-react status:* ${current}\n\nUsage: ${config.PREFIX}autoreactstatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreactstatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-react to statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 8. AUTO REACT PM
// ============================================
commands.push({
    name: 'autoreactpm',
    description: 'Auto-react in private messages',
    aliases: ['arp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreactpm', 'off');
            return reply(`💬 *Auto-react PM:* ${current}\n\nUsage: ${config.PREFIX}autoreactpm <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreactpm', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-react in PMs ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 9. AUTO REACT GROUP
// ============================================
commands.push({
    name: 'autoreactgroup',
    description: 'Auto-react in groups',
    aliases: ['arg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreactgroup', 'off');
            return reply(`👥 *Auto-react group:* ${current}\n\nUsage: ${config.PREFIX}autoreactgroup <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreactgroup', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-react in groups ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 10. SET STATUS EMOJIS
// ============================================
commands.push({
    name: 'setstatusemoji',
    description: 'Set emojis for status reactions',
    aliases: ['statusemoji'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('statusreactemojis', '💛,❤️,💜,🤍,💙,👍,🔥');
            return reply(`🎭 *Status reaction emojis:* ${current}\n\nUsage: ${config.PREFIX}setstatusemoji <emoji1,emoji2,...>`);
        }

        const emojis = args.join(' ');
        await bot.db.setSetting('statusreactemojis', emojis);
        
        await react('✅');
        await reply(`✅ Status reaction emojis set to: ${emojis}`);
    }
});

// ============================================
// 11. ANTI-DELETE MASTER
// ============================================
commands.push({
    name: 'antidelete',
    description: 'Master switch for anti-delete',
    aliases: ['ad'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antidelete', 'off');
            return reply(`🗑️ *Anti-delete:* ${current}\n\nUsage: ${config.PREFIX}antidelete <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antidelete', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Anti-delete ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 12. ANTI-DELETE STATUS
// ============================================
commands.push({
    name: 'antideletestatus',
    description: 'Save deleted statuses',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antideletestatus', 'off');
            return reply(`📱 *Anti-delete status:* ${current}\n\nUsage: ${config.PREFIX}antideletestatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antideletestatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Save deleted statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 13. ANTI-LINK MASTER
// ============================================
commands.push({
    name: 'antilink',
    description: 'Master switch for anti-link',
    aliases: ['al'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilink', 'off');
            return reply(`🔗 *Anti-link:* ${current}\n\nUsage: ${config.PREFIX}antilink <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('antilink', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Anti-link ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 14. ANTI-LINK ACTION
// ============================================
commands.push({
    name: 'antilinkaction',
    description: 'Set anti-link action (delete/kick/warn)',
    aliases: ['ala'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilinkaction', 'delete');
            return reply(`⚙️ *Anti-link action:* ${current}\n\nUsage: ${config.PREFIX}antilinkaction <delete/kick/warn>`);
        }

        const action = args[0].toLowerCase();
        if (!['delete', 'kick', 'warn'].includes(action)) {
            return reply('❌ Action must be delete, kick, or warn');
        }

        await bot.db.setSetting('antilinkaction', action);
        await react('✅');
        await reply(`✅ Anti-link action set to: *${action}*`);
    }
});

// ============================================
// 15. ANTI-LINK WARNING COUNT
// ============================================
commands.push({
    name: 'antilinkwarning',
    description: 'Set warnings before kick',
    aliases: ['alw'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('antilinkwarning', '3');
            return reply(`⚠️ *Anti-link warnings:* ${current}\n\nUsage: ${config.PREFIX}antilinkwarning <number>`);
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

// ============================================
// 16. ANTI-LINK MESSAGE
// ============================================
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
            return reply(`📝 *Anti-link message:*\n${current}\n\nUsage: ${config.PREFIX}antilinkmessage <text>`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('antilinkmessage', message);
        await react('✅');
        await reply(`✅ Anti-link message set to:\n${message}`);
    }
});

// ============================================
// 17. ANTI-CALL MASTER
// ============================================
commands.push({
    name: 'anticall',
    description: 'Master switch for anti-call',
    aliases: ['ac'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('anticall', 'off');
            return reply(`📞 *Anti-call:* ${current}\n\nUsage: ${config.PREFIX}anticall <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('anticall', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Anti-call ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 18. ANTI-CALL MESSAGE
// ============================================
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
            return reply(`📝 *Anti-call message:*\n${current}\n\nUsage: ${config.PREFIX}anticallmessage <text>`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('anticallmessage', message);
        await react('✅');
        await reply(`✅ Anti-call message set to:\n${message}`);
    }
});

// ============================================
// 19. AUTO-READ MASTER
// ============================================
commands.push({
    name: 'autoread',
    description: 'Master switch for auto-read',
    aliases: ['ar'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoread', 'off');
            return reply(`👁️ *Auto-read:* ${current}\n\nUsage: ${config.PREFIX}autoread <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoread', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-read ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 20. AUTO-READ STATUS
// ============================================
commands.push({
    name: 'autoreadstatus',
    description: 'Auto-read statuses',
    aliases: ['ars'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreadstatus', 'on');
            return reply(`📱 *Auto-read status:* ${current}\n\nUsage: ${config.PREFIX}autoreadstatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreadstatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-read statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 21. AUTO-READ PM
// ============================================
commands.push({
    name: 'autoreadpm',
    description: 'Auto-read private messages',
    aliases: ['arp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreadpm', 'off');
            return reply(`💬 *Auto-read PM:* ${current}\n\nUsage: ${config.PREFIX}autoreadpm <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreadpm', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-read PMs ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 22. AUTO-READ GROUP
// ============================================
commands.push({
    name: 'autoreadgroup',
    description: 'Auto-read group messages',
    aliases: ['arg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreadgroup', 'off');
            return reply(`👥 *Auto-read group:* ${current}\n\nUsage: ${config.PREFIX}autoreadgroup <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreadgroup', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-read groups ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 23. AUTO-BIO
// ============================================
commands.push({
    name: 'autobio',
    description: 'Auto-update bio',
    aliases: ['ab'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autobio', 'off');
            return reply(`📝 *Auto-bio:* ${current}\n\nUsage: ${config.PREFIX}autobio <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autobio', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-bio ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 24. AUTO-VIEW STATUS
// ============================================
commands.push({
    name: 'autoviewstatus',
    description: 'Auto-view statuses',
    aliases: ['avs'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoviewstatus', 'on');
            return reply(`👁️ *Auto-view status:* ${current}\n\nUsage: ${config.PREFIX}autoviewstatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoviewstatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-view statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 25. AUTO-DOWNLOAD STATUS
// ============================================
commands.push({
    name: 'autodownloadstatus',
    description: 'Auto-download statuses',
    aliases: ['ads'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autodownloadstatus', 'off');
            return reply(`⬇️ *Auto-download status:* ${current}\n\nUsage: ${config.PREFIX}autodownloadstatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autodownloadstatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-download statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 26. AUTO-REPLY STATUS
// ============================================
commands.push({
    name: 'autoreplystatus',
    description: 'Auto-reply to statuses',
    aliases: ['ars'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreplystatus', 'off');
            return reply(`💬 *Auto-reply status:* ${current}\n\nUsage: ${config.PREFIX}autoreplystatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoreplystatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-reply to statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 27. AUTO-REPLY STATUS TEXT
// ============================================
commands.push({
    name: 'autoreplystatustext',
    description: 'Set auto-reply text for statuses',
    aliases: ['arst'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoreplystatustext', '✅ Status viewed via Megan-MD');
            return reply(`📝 *Auto-reply status text:*\n${current}\n\nUsage: ${config.PREFIX}autoreplystatustext <text>`);
        }

        const text = args.join(' ');
        await bot.db.setSetting('autoreplystatustext', text);
        await react('✅');
        await reply(`✅ Auto-reply status text set to:\n${text}`);
    }
});

// ============================================
// 28. AUTO-SAVE STATUS
// ============================================
commands.push({
    name: 'autosavestatus',
    description: 'Auto-save statuses to DM',
    aliases: ['ass'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autosavestatus', 'off');
            return reply(`💾 *Auto-save status:* ${current}\n\nUsage: ${config.PREFIX}autosavestatus <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autosavestatus', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-save statuses ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 29. SAVE STATUS (Reply command)
// ============================================
commands.push({
    name: 'save',
    description: 'Save a status by replying to it',
    aliases: ['savestatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quoted || msg.key.remoteJid !== 'status@broadcast') {
            return reply('❌ Reply to a status message with .save');
        }

        await react('💾');
        
        if (bot.statusHandler) {
            await bot.statusHandler.saveStatusForUser(msg, from, { key: msg.key, message: quoted });
        } else {
            await reply('❌ Status handler not available');
        }
    }
});

// ============================================
// 30. AUTO-VIEW ONCE
// ============================================
commands.push({
    name: 'autoviewonce',
    description: 'Auto-save view once media',
    aliases: ['avo'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autoviewonce', 'off');
            return reply(`🔐 *Auto-view once:* ${current}\n\nUsage: ${config.PREFIX}autoviewonce <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('autoviewonce', setting);
        await react(setting === 'on' ? '✅' : '❌');
        await reply(`✅ Auto-save view once ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 31. VV - Send view once to owner
// ============================================
commands.push({
    name: 'vv',
    description: 'Send view once media to owner DM',
    aliases: ['viewonce'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isViewOnce = quoted?.imageMessage?.viewOnce || 
                          quoted?.videoMessage?.viewOnce || 
                          quoted?.audioMessage?.viewOnce;

        if (!quoted || !isViewOnce) {
            return reply('❌ Reply to a view once message with .vv');
        }

        await react('🔐');
        
        if (bot.statusHandler) {
            await bot.statusHandler.handleViewOnce(
                { key: msg.key, message: quoted }, 
                from, 
                sender
            );
            await reply('✅ View once media sent to owner DM');
        }
    }
});

// ============================================
// 32. VV2 - Open view once immediately
// ============================================
commands.push({
    name: 'vv2',
    description: 'Open and save view once immediately',
    aliases: ['viewonce2'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isViewOnce = quoted?.imageMessage?.viewOnce || 
                          quoted?.videoMessage?.viewOnce || 
                          quoted?.audioMessage?.viewOnce;

        if (!quoted || !isViewOnce) {
            return reply('❌ Reply to a view once message with .vv2');
        }

        await react('🔓');
        
        // Force save regardless of setting
        if (bot.statusHandler) {
            await bot.statusHandler.handleViewOnce(
                { key: msg.key, message: quoted }, 
                from, 
                sender
            );
            await reply('✅ View once opened and saved to owner DM');
        }
    }
});

// ============================================
// 33. PRESENCE PM
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
            return reply(`💬 *Presence PM:* ${current}\n\nOptions: online, typing, recording, offline\n\nUsage: ${config.PREFIX}presencepm <option>`);
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

// ============================================
// 34. PRESENCE GROUP
// ============================================
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
            return reply(`👥 *Presence group:* ${current}\n\nOptions: online, typing, recording, offline\n\nUsage: ${config.PREFIX}presencegroup <option>`);
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

// ============================================
// 35. AUTO TYPING
// ============================================
commands.push({
    name: 'autotyping',
    description: 'Show typing indicator',
    aliases: ['at'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autotyping', 'off');
            return reply(`⌨️ *Auto typing:* ${current}\n\nOptions: dm, group, off\n\nUsage: ${config.PREFIX}autotyping <dm/group/off>`);
        }

        const setting = args[0].toLowerCase();
        if (!['dm', 'group', 'off'].includes(setting)) {
            return reply('❌ Option must be dm, group, or off');
        }

        await bot.db.setSetting('autotyping', setting);
        await react('✅');
        await reply(`✅ Auto typing set to: *${setting}*`);
    }
});

// ============================================
// 36. AUTO RECORDING
// ============================================
commands.push({
    name: 'autorecording',
    description: 'Show recording indicator',
    aliases: ['ar'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('autorecording', 'off');
            return reply(`🎤 *Auto recording:* ${current}\n\nOptions: dm, group, off\n\nUsage: ${config.PREFIX}autorecording <dm/group/off>`);
        }

        const setting = args[0].toLowerCase();
        if (!['dm', 'group', 'off'].includes(setting)) {
            return reply('❌ Option must be dm, group, or off');
        }

        await bot.db.setSetting('autorecording', setting);
        await react('✅');
        await reply(`✅ Auto recording set to: *${setting}*`);
    }
});

// ============================================
// 37. CHATBOT MASTER
// ============================================
commands.push({
    name: 'chatbot',
    description: 'Master switch for chatbot',
    aliases: ['cb'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('chatbot', 'off');
            return reply(`🤖 *Chatbot:* ${current}\n\nOptions: on, dm, group, off\n\nUsage: ${config.PREFIX}chatbot <on/dm/group/off>`);
        }

        const setting = args[0].toLowerCase();
        if (!['on', 'dm', 'group', 'off'].includes(setting)) {
            return reply('❌ Option must be on, dm, group, or off');
        }

        await bot.db.setSetting('chatbot', setting);
        await react('✅');
        await reply(`✅ Chatbot set to: *${setting}*`);
    }
});

// ============================================
// 38. CHATBOT PM
// ============================================
commands.push({
    name: 'chatbotpm',
    description: 'Enable chatbot in private messages',
    aliases: ['cbpm'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('chatbotpm', 'off');
            return reply(`💬 *Chatbot PM:* ${current}\n\nUsage: ${config.PREFIX}chatbotpm <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('chatbotpm', setting);
        await react('✅');
        await reply(`✅ Chatbot in PMs ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 39. CHATBOT GROUP
// ============================================
commands.push({
    name: 'chatbotgroup',
    description: 'Enable chatbot in groups',
    aliases: ['cbg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('chatbotgroup', 'off');
            return reply(`👥 *Chatbot group:* ${current}\n\nUsage: ${config.PREFIX}chatbotgroup <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('chatbotgroup', setting);
        await react('✅');
        await reply(`✅ Chatbot in groups ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 40. WELCOME
// ============================================
commands.push({
    name: 'welcome',
    description: 'Enable welcome messages',
    aliases: ['wlc'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('welcome', 'off');
            return reply(`👋 *Welcome messages:* ${current}\n\nUsage: ${config.PREFIX}welcome <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('welcome', setting);
        await react('✅');
        await reply(`✅ Welcome messages ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 41. WELCOME MESSAGE
// ============================================
commands.push({
    name: 'welcomemessage',
    description: 'Set welcome message text',
    aliases: ['wmsg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('welcomemessage', 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.');
            return reply(`📝 *Welcome message:*\n${current}\n\nUsage: ${config.PREFIX}welcomemessage <text>\nUse @user to mention new member`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('welcomemessage', message);
        await react('✅');
        await reply(`✅ Welcome message set to:\n${message}`);
    }
});

// ============================================
// 42. WELCOME AUDIO
// ============================================
commands.push({
    name: 'welcomeaudio',
    description: 'Send welcome as audio (TTS)',
    aliases: ['waudio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('welcomeaudio', 'off');
            return reply(`🔊 *Welcome audio:* ${current}\n\nUsage: ${config.PREFIX}welcomeaudio <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('welcomeaudio', setting);
        await react('✅');
        await reply(`✅ Welcome audio ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 43. GOODBYE
// ============================================
commands.push({
    name: 'goodbye',
    description: 'Enable goodbye messages',
    aliases: ['gb'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('goodbye', 'off');
            return reply(`👋 *Goodbye messages:* ${current}\n\nUsage: ${config.PREFIX}goodbye <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('goodbye', setting);
        await react('✅');
        await reply(`✅ Goodbye messages ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 44. GOODBYE MESSAGE
// ============================================
commands.push({
    name: 'setbyemessage',
    description: 'Set goodbye message text',
    aliases: ['gbmsg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('goodbyemessage', 'So long nigger! Hope you never come back you good for nothing idiot 😂😂');
            return reply(`📝 *Goodbye message:*\n${current}\n\nUsage: ${config.PREFIX}setbyemessage <text>\nUse @user to mention leaving member`);
        }

        const message = args.join(' ');
        await bot.db.setSetting('goodbyemessage', message);
        await react('✅');
        await reply(`✅ Goodbye message set to:\n${message}`);
    }
});

// ============================================
// 45. GOODBYE AUDIO
// ============================================
commands.push({
    name: 'goodbyeaudio',
    description: 'Send goodbye as audio (TTS)',
    aliases: ['gbaudio'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('goodbyeaudio', 'off');
            return reply(`🔊 *Goodbye audio:* ${current}\n\nUsage: ${config.PREFIX}goodbyeaudio <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('goodbyeaudio', setting);
        await react('✅');
        await reply(`✅ Goodbye audio ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 46. LAST SEEN PRIVACY
// ============================================
commands.push({
    name: 'lastseen',
    description: 'Set last seen privacy',
    aliases: ['ls'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`👁️ *Last seen privacy*\n\nOptions: all, contacts, none\n\nUsage: ${config.PREFIX}lastseen <option>`);
        }

        const setting = args[0].toLowerCase();
        if (!['all', 'contacts', 'none'].includes(setting)) {
            return reply('❌ Option must be all, contacts, or none');
        }

        try {
            await sock.updateLastSeenPrivacy(setting);
            await bot.db.setSetting('lastseen', setting);
            await react('✅');
            await reply(`✅ Last seen privacy set to: *${setting}*`);
        } catch (error) {
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ============================================
// 47. PROFILE PIC PRIVACY
// ============================================
commands.push({
    name: 'profilepic',
    description: 'Set profile picture privacy',
    aliases: ['pprivacy'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`🖼️ *Profile pic privacy*\n\nOptions: all, contacts, none\n\nUsage: ${config.PREFIX}profilepic <option>`);
        }

        const setting = args[0].toLowerCase();
        if (!['all', 'contacts', 'none'].includes(setting)) {
            return reply('❌ Option must be all, contacts, or none');
        }

        try {
            await sock.updateProfilePicturePrivacy(setting);
            await bot.db.setSetting('profilepic', setting);
            await react('✅');
            await reply(`✅ Profile picture privacy set to: *${setting}*`);
        } catch (error) {
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ============================================
// 48. STATUS PRIVACY
// ============================================
commands.push({
    name: 'statusprivacy',
    description: 'Set status privacy',
    aliases: ['spriv'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`📱 *Status privacy*\n\nOptions: all, contacts, none\n\nUsage: ${config.PREFIX}statusprivacy <option>`);
        }

        const setting = args[0].toLowerCase();
        if (!['all', 'contacts', 'none'].includes(setting)) {
            return reply('❌ Option must be all, contacts, or none');
        }

        try {
            await sock.updateStatusPrivacy(setting);
            await bot.db.setSetting('statusprivacy', setting);
            await react('✅');
            await reply(`✅ Status privacy set to: *${setting}*`);
        } catch (error) {
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ============================================
// 49. READ RECEIPTS
// ============================================
commands.push({
    name: 'readreceipts',
    description: 'Set read receipts privacy',
    aliases: ['rr'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`✅ *Read receipts*\n\nOptions: all, none\n\nUsage: ${config.PREFIX}readreceipts <all/none>`);
        }

        const setting = args[0].toLowerCase();
        if (!['all', 'none'].includes(setting)) {
            return reply('❌ Option must be all or none');
        }

        try {
            await sock.updateReadReceiptsPrivacy(setting);
            await bot.db.setSetting('readreceipts', setting);
            await react('✅');
            await reply(`✅ Read receipts set to: *${setting}*`);
        } catch (error) {
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ============================================
// 50. ONLINE PRIVACY
// ============================================
commands.push({
    name: 'onlineprivacy',
    description: 'Set online status privacy',
    aliases: ['opriv'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            return reply(`🟢 *Online privacy*\n\nOptions: all, match_last_seen\n\nUsage: ${config.PREFIX}onlineprivacy <all/match_last_seen>`);
        }

        const setting = args[0].toLowerCase();
        if (!['all', 'match_last_seen'].includes(setting)) {
            return reply('❌ Option must be all or match_last_seen');
        }

        try {
            await sock.updateOnlinePrivacy(setting);
            await bot.db.setSetting('onlineprivacy', setting);
            await react('✅');
            await reply(`✅ Online privacy set to: *${setting}*`);
        } catch (error) {
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ============================================
// 51. BLOCK UNKNOWN
// ============================================
commands.push({
    name: 'blockunknown',
    description: 'Auto-block unknown numbers',
    aliases: ['blockunk'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('blockunknown', 'off');
            return reply(`🚫 *Block unknown:* ${current}\n\nUsage: ${config.PREFIX}blockunknown <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('blockunknown', setting);
        await react('✅');
        await reply(`✅ Block unknown numbers ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 52. BLOCK PRIVATE
// ============================================
commands.push({
    name: 'blockprivate',
    description: 'Auto-block private numbers (hidden)',
    aliases: ['blockpriv'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        if (args.length === 0) {
            const current = await bot.db.getSetting('blockprivate', 'off');
            return reply(`🔒 *Block private:* ${current}\n\nUsage: ${config.PREFIX}blockprivate <on/off>`);
        }

        const setting = args[0].toLowerCase();
        if (setting !== 'on' && setting !== 'off') {
            return reply('❌ Please specify on or off');
        }

        await bot.db.setSetting('blockprivate', setting);
        await react('✅');
        await reply(`✅ Block private numbers ${setting === 'on' ? 'enabled' : 'disabled'}`);
    }
});

// ============================================
// 53. BLACKLIST USER
// ============================================
commands.push({
    name: 'blacklist',
    description: 'Blacklist a user',
    aliases: ['bl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        const action = args[0]?.toLowerCase();
        let target = null;

        // Check mentions
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[1]) {
            const phone = args[1].replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!action || !['add', 'remove'].includes(action) || !target) {
            return reply(`🚫 *Blacklist*\n\nUsage: ${config.PREFIX}blacklist add <@user/phone>\n${config.PREFIX}blacklist remove <@user/phone>`);
        }

        const userShort = target.split('@')[0];
        
        if (action === 'add') {
            // Add to blacklist in database
            const blacklist = await bot.db.getSetting('blacklist', []);
            if (!blacklist.includes(target)) {
                blacklist.push(target);
                await bot.db.setSetting('blacklist', blacklist);
                await react('✅');
                await reply(`🚫 @${userShort} added to blacklist`, { mentions: [target] });
            } else {
                await reply(`⚠️ @${userShort} already in blacklist`, { mentions: [target] });
            }
        } else {
            // Remove from blacklist
            const blacklist = await bot.db.getSetting('blacklist', []);
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
// 54. WHITELIST USER
// ============================================
commands.push({
    name: 'whitelist',
    description: 'Whitelist a user (bypass blacklist)',
    aliases: ['wl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        const action = args[0]?.toLowerCase();
        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[1]) {
            const phone = args[1].replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!action || !['add', 'remove'].includes(action) || !target) {
            return reply(`✅ *Whitelist*\n\nUsage: ${config.PREFIX}whitelist add <@user/phone>\n${config.PREFIX}whitelist remove <@user/phone>`);
        }

        const userShort = target.split('@')[0];
        
        if (action === 'add') {
            const whitelist = await bot.db.getSetting('whitelist', []);
            if (!whitelist.includes(target)) {
                whitelist.push(target);
                await bot.db.setSetting('whitelist', whitelist);
                await react('✅');
                await reply(`✅ @${userShort} added to whitelist`, { mentions: [target] });
            } else {
                await reply(`⚠️ @${userShort} already in whitelist`, { mentions: [target] });
            }
        } else {
            const whitelist = await bot.db.getSetting('whitelist', []);
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
// 55. MUTE USER
// ============================================
commands.push({
    name: 'muteuser',
    description: 'Mute a user',
    aliases: ['mute'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        let target = null;
        let duration = 60; // Default 60 minutes

        // Check mentions
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }

        if (!target || args.length < 1) {
            return reply(`🔇 *Mute user*\n\nUsage: ${config.PREFIX}muteuser <@user> [minutes]\nExample: ${config.PREFIX}muteuser @user 30`);
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
// 56. UNMUTE USER
// ============================================
commands.push({
    name: 'unmuteuser',
    description: 'Unmute a user',
    aliases: ['unmute'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            const phone = args[0].replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!target) {
            return reply(`🔊 *Unmute user*\n\nUsage: ${config.PREFIX}unmuteuser <@user/phone>`);
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
// 57. WARN USER
// ============================================
commands.push({
    name: 'warnuser',
    description: 'Warn a user',
    aliases: ['warn'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
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
            return reply(`⚠️ *Warn user*\n\nUsage: ${config.PREFIX}warnuser <@user> [reason]`);
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

        // Auto-kick after 3 warnings
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
// 58. RESET WARNS
// ============================================
commands.push({
    name: 'resetwarns',
    description: 'Reset user warnings',
    aliases: ['rw'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            const phone = args[0].replace(/\D/g, '');
            if (phone && phone.length >= 10) {
                target = `${phone}@s.whatsapp.net`;
            }
        }

        if (!target) {
            return reply(`🔄 *Reset warnings*\n\nUsage: ${config.PREFIX}resetwarns <@user/phone>`);
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
// 59. USER INFO
// =====================================