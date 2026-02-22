// ============================================
// 59. USER INFO
// ============================================
commands.push({
    name: 'userinfo',
    description: 'Get user information',
    aliases: ['ui', 'info'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        let target = sender;

        // Check mentions
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (args[0]) {
            const phone = args[0].replace(/\D/g, '');
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
            
            // Check if muted
            const muted = await bot.db.getSetting('muted', {});
            const isMuted = muted[target] ? new Date(muted[target]) > new Date() : false;
            const mutedUntil = isMuted ? new Date(muted[target]).toLocaleString() : 'Not muted';

            // Check blacklist/whitelist
            const blacklist = await bot.db.getSetting('blacklist', []);
            const whitelist = await bot.db.getSetting('whitelist', []);
            const isBlacklisted = blacklist.includes(target);
            const isWhitelisted = whitelist.includes(target);

            const infoText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                           `┃ *${config.BOT_NAME}*\n` +
                           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                           `👤 *USER INFORMATION*\n\n` +
                           `📱 *Phone:* ${userShort}\n` +
                           `🆔 *JID:* ${target}\n` +
                           `📝 *About:* ${about}\n` +
                           `🕒 *About set:* ${aboutTime}\n` +
                           `🖼️ *Profile pic:* ${ppUrl.substring(0, 50)}...\n\n` +
                           `⚠️ *Warnings:* ${userWarns}/3\n` +
                           `🔇 *Muted:* ${isMuted ? 'Yes (until ' + mutedUntil + ')' : 'No'}\n` +
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
// 60. SETTINGS STATUS - VIEW ALL SETTINGS
// ============================================
commands.push({
    name: 'settings',
    description: 'View all current bot settings',
    aliases: ['config', 'allsettings'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        await react('⚙️');

        try {
            // Get all settings from database with defaults
            const settings = {
                // Core
                prefix: await bot.db.getSetting('prefix', config.PREFIX),
                botname: await bot.db.getSetting('botname', config.BOT_NAME),
                ownername: await bot.db.getSetting('ownername', config.OWNER_NAME),
                ownerphone: await bot.db.getSetting('ownerphone', config.OWNER_NUMBER),
                mode: await bot.db.getSetting('mode', config.MODE),
                
                // Auto React
                autoreact: await bot.db.getSetting('autoreact', 'off'),
                autoreactstatus: await bot.db.getSetting('autoreactstatus', 'off'),
                autoreactpm: await bot.db.getSetting('autoreactpm', 'off'),
                autoreactgroup: await bot.db.getSetting('autoreactgroup', 'off'),
                
                // Anti Features
                antidelete: await bot.db.getSetting('antidelete', 'off'),
                antideletestatus: await bot.db.getSetting('antideletestatus', 'off'),
                antilink: await bot.db.getSetting('antilink', 'off'),
                antilinkaction: await bot.db.getSetting('antilinkaction', 'delete'),
                antilinkwarning: await bot.db.getSetting('antilinkwarning', '3'),
                anticall: await bot.db.getSetting('anticall', 'off'),
                
                // Auto Read
                autoread: await bot.db.getSetting('autoread', 'off'),
                autoreadstatus: await bot.db.getSetting('autoreadstatus', 'on'),
                autoreadpm: await bot.db.getSetting('autoreadpm', 'off'),
                autoreadgroup: await bot.db.getSetting('autoreadgroup', 'off'),
                
                // Status Features
                autobio: await bot.db.getSetting('autobio', 'off'),
                autoviewstatus: await bot.db.getSetting('autoviewstatus', 'on'),
                autodownloadstatus: await bot.db.getSetting('autodownloadstatus', 'off'),
                autoreplystatus: await bot.db.getSetting('autoreplystatus', 'off'),
                autosavestatus: await bot.db.getSetting('autosavestatus', 'off'),
                autoviewonce: await bot.db.getSetting('autoviewonce', 'off'),
                
                // Presence
                presence_pm: await bot.db.getSetting('presence_pm', 'typing'),
                presence_group: await bot.db.getSetting('presence_group', 'typing'),
                autotyping: await bot.db.getSetting('autotyping', 'off'),
                autorecording: await bot.db.getSetting('autorecording', 'off'),
                
                // Chatbot
                chatbot: await bot.db.getSetting('chatbot', 'off'),
                chatbotpm: await bot.db.getSetting('chatbotpm', 'off'),
                chatbotgroup: await bot.db.getSetting('chatbotgroup', 'off'),
                
                // Welcome/Goodbye
                welcome: await bot.db.getSetting('welcome', 'off'),
                welcomeaudio: await bot.db.getSetting('welcomeaudio', 'off'),
                goodbye: await bot.db.getSetting('goodbye', 'off'),
                goodbyeaudio: await bot.db.getSetting('goodbyeaudio', 'off'),
                
                // Privacy
                lastseen: await bot.db.getSetting('lastseen', 'all'),
                profilepic: await bot.db.getSetting('profilepic', 'all'),
                statusprivacy: await bot.db.getSetting('statusprivacy', 'all'),
                readreceipts: await bot.db.getSetting('readreceipts', 'all'),
                onlineprivacy: await bot.db.getSetting('onlineprivacy', 'all'),
                blockunknown: await bot.db.getSetting('blockunknown', 'off'),
                blockprivate: await bot.db.getSetting('blockprivate', 'off')
            };

            const settingsText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                               `┃ *${config.BOT_NAME}*\n` +
                               `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                               `⚙️ *BOT SETTINGS*\n\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*CORE*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `🔧 Prefix: ${settings.prefix}\n` +
                               `📛 Bot Name: ${settings.botname}\n` +
                               `👤 Owner: ${settings.ownername}\n` +
                               `📞 Owner Phone: ${settings.ownerphone}\n` +
                               `⚡ Mode: ${settings.mode}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*AUTO REACT*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `🎭 Master: ${settings.autoreact}\n` +
                               `📱 Status: ${settings.autoreactstatus}\n` +
                               `💬 PM: ${settings.autoreactpm}\n` +
                               `👥 Group: ${settings.autoreactgroup}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*ANTI FEATURES*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `🗑️ Anti-Delete: ${settings.antidelete}\n` +
                               `📱 Anti-Delete Status: ${settings.antideletestatus}\n` +
                               `🔗 Anti-Link: ${settings.antilink}\n` +
                               `⚙️ Anti-Link Action: ${settings.antilinkaction}\n` +
                               `⚠️ Anti-Link Warn: ${settings.antilinkwarning}\n` +
                               `📞 Anti-Call: ${settings.anticall}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*AUTO READ*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `👁️ Master: ${settings.autoread}\n` +
                               `📱 Status: ${settings.autoreadstatus}\n` +
                               `💬 PM: ${settings.autoreadpm}\n` +
                               `👥 Group: ${settings.autoreadgroup}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*STATUS FEATURES*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `📝 Auto-Bio: ${settings.autobio}\n` +
                               `👁️ Auto-View: ${settings.autoviewstatus}\n` +
                               `⬇️ Auto-Download: ${settings.autodownloadstatus}\n` +
                               `💬 Auto-Reply: ${settings.autoreplystatus}\n` +
                               `💾 Auto-Save: ${settings.autosavestatus}\n` +
                               `🔐 Auto-View Once: ${settings.autoviewonce}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*PRESENCE*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `💬 PM: ${settings.presence_pm}\n` +
                               `👥 Group: ${settings.presence_group}\n` +
                               `⌨️ Auto-Typing: ${settings.autotyping}\n` +
                               `🎤 Auto-Recording: ${settings.autorecording}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*CHATBOT*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `🤖 Master: ${settings.chatbot}\n` +
                               `💬 PM: ${settings.chatbotpm}\n` +
                               `👥 Group: ${settings.chatbotgroup}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*WELCOME/GOODBYE*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `👋 Welcome: ${settings.welcome}\n` +
                               `🔊 Welcome Audio: ${settings.welcomeaudio}\n` +
                               `👋 Goodbye: ${settings.goodbye}\n` +
                               `🔊 Goodbye Audio: ${settings.goodbyeaudio}\n\n` +

                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `*PRIVACY*\n` +
                               `━━━━━━━━━━━━━━━━━━━\n` +
                               `👁️ Last Seen: ${settings.lastseen}\n` +
                               `🖼️ Profile Pic: ${settings.profilepic}\n` +
                               `📱 Status: ${settings.statusprivacy}\n` +
                               `✅ Read Receipts: ${settings.readreceipts}\n` +
                               `🟢 Online: ${settings.onlineprivacy}\n` +
                               `🚫 Block Unknown: ${settings.blockunknown}\n` +
                               `🔒 Block Private: ${settings.blockprivate}\n\n` +

                               `> created by wanga`;

            // Send in chunks if too long
            if (settingsText.length > 4000) {
                const chunk1 = settingsText.substring(0, 4000);
                const chunk2 = settingsText.substring(4000);
                await sock.sendMessage(from, { text: chunk1 }, { quoted: msg });
                await sock.sendMessage(from, { text: chunk2 }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: settingsText }, { quoted: msg });
            }
            
            await react('✅');

        } catch (error) {
            bot.logger.error('Settings error:', error);
            await react('❌');
            await reply(`❌ Failed to get settings: ${error.message}`);
        }
    }
});

// ============================================
// 61. RESET SETTINGS
// ============================================
commands.push({
    name: 'resetsettings',
    description: 'Reset all settings to default',
    aliases: ['resetconfig', 'defaults'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        // Confirm with user
        if (args[0]?.toLowerCase() !== '--force') {
            return reply(`⚠️ *WARNING:* This will reset ALL settings to default!\n\nTo confirm: ${config.PREFIX}resetsettings --force`);
        }

        await react('🔄');

        try {
            // Reset all settings to defaults
            const defaults = {
                // Core
                'prefix': config.PREFIX,
                'botname': config.BOT_NAME,
                'ownername': config.OWNER_NAME,
                'ownerphone': config.OWNER_NUMBER,
                'mode': config.MODE,
                
                // Auto React
                'autoreact': 'off',
                'autoreactstatus': 'off',
                'autoreactpm': 'off',
                'autoreactgroup': 'off',
                
                // Anti Features
                'antidelete': 'off',
                'antideletestatus': 'off',
                'antilink': 'off',
                'antilinkaction': 'delete',
                'antilinkwarning': '3',
                'anticall': 'off',
                
                // Auto Read
                'autoread': 'off',
                'autoreadstatus': 'on',
                'autoreadpm': 'off',
                'autoreadgroup': 'off',
                
                // Status Features
                'autobio': 'off',
                'autoviewstatus': 'on',
                'autodownloadstatus': 'off',
                'autoreplystatus': 'off',
                'autoreplystatustext': '✅ Status viewed via Megan-MD',
                'statusreactemojis': '💛,❤️,💜,🤍,💙,👍,🔥',
                'autosavestatus': 'off',
                'autoviewonce': 'off',
                
                // Presence
                'presence_pm': 'typing',
                'presence_group': 'typing',
                'autotyping': 'off',
                'autorecording': 'off',
                
                // Chatbot
                'chatbot': 'off',
                'chatbotpm': 'off',
                'chatbotgroup': 'off',
                
                // Welcome/Goodbye
                'welcome': 'off',
                'welcomemessage': 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.',
                'welcomeaudio': 'off',
                'goodbye': 'off',
                'goodbyemessage': 'So long nigger! Hope you never come back you good for nothing idiot 😂😂',
                'goodbyeaudio': 'off',
                
                // Privacy
                'lastseen': 'all',
                'profilepic': 'all',
                'statusprivacy': 'all',
                'readreceipts': 'all',
                'onlineprivacy': 'all',
                'blockunknown': 'off',
                'blockprivate': 'off',
                
                // Lists
                'blacklist': [],
                'whitelist': [],
                'warns': {},
                'muted': {}
            };

            for (const [key, value] of Object.entries(defaults)) {
                await bot.db.setSetting(key, value);
            }

            // Update config object
            config.PREFIX = defaults.prefix;
            config.BOT_NAME = defaults.botname;
            config.OWNER_NAME = defaults.ownername;
            config.OWNER_NUMBER = defaults.ownerphone;
            config.MODE = defaults.mode;
            
            // Update owner helper
            bot.ownerHelper.updateOwner(defaults.ownerphone);

            await react('✅');
            await reply('✅ All settings have been reset to defaults!');

        } catch (error) {
            bot.logger.error('Reset settings error:', error);
            await react('❌');
            await reply(`❌ Failed to reset settings: ${error.message}`);
        }
    }
});

// ============================================
// 62. SETTINGS HELP
// ============================================
commands.push({
    name: 'settingshelp',
    description: 'Show all available settings commands',
    aliases: ['helpsettings', 'settingcmds'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!isOwner(bot, sender)) {
            await react('❌');
            return reply('❌ Only bot owner can use this command!');
        }

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `⚙️ *SETTINGS COMMANDS*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*CORE SETTINGS*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}setprefix <symbol>\n` +
                        `• ${config.PREFIX}setbotname <name>\n` +
                        `• ${config.PREFIX}setownername <name>\n` +
                        `• ${config.PREFIX}setownerphone <number>\n` +
                        `• ${config.PREFIX}setmode <public/private>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*AUTO REACT*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}autoreact <on/off>\n` +
                        `• ${config.PREFIX}autoreactstatus <on/off>\n` +
                        `• ${config.PREFIX}autoreactpm <on/off>\n` +
                        `• ${config.PREFIX}autoreactgroup <on/off>\n` +
                        `• ${config.PREFIX}setstatusemoji <emojis>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*ANTI FEATURES*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}antidelete <on/off>\n` +
                        `• ${config.PREFIX}antideletestatus <on/off>\n` +
                        `• ${config.PREFIX}antilink <on/off>\n` +
                        `• ${config.PREFIX}antilinkaction <delete/kick/warn>\n` +
                        `• ${config.PREFIX}antilinkwarning <count>\n` +
                        `• ${config.PREFIX}antilinkmessage <text>\n` +
                        `• ${config.PREFIX}anticall <on/off>\n` +
                        `• ${config.PREFIX}anticallmessage <text>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*AUTO READ*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}autoread <on/off>\n` +
                        `• ${config.PREFIX}autoreadstatus <on/off>\n` +
                        `• ${config.PREFIX}autoreadpm <on/off>\n` +
                        `• ${config.PREFIX}autoreadgroup <on/off>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*STATUS FEATURES*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}autobio <on/off>\n` +
                        `• ${config.PREFIX}autoviewstatus <on/off>\n` +
                        `• ${config.PREFIX}autodownloadstatus <on/off>\n` +
                        `• ${config.PREFIX}autoreplystatus <on/off>\n` +
                        `• ${config.PREFIX}autoreplystatustext <text>\n` +
                        `• ${config.PREFIX}autosavestatus <on/off>\n` +
                        `• ${config.PREFIX}autoviewonce <on/off>\n` +
                        `• ${config.PREFIX}save (reply to status)\n` +
                        `• ${config.PREFIX}vv (reply to view once)\n` +
                        `• ${config.PREFIX}vv2 (force open view once)\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*PRESENCE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}presencepm <online/typing/recording/offline>\n` +
                        `• ${config.PREFIX}presencegroup <online/typing/recording/offline>\n` +
                        `• ${config.PREFIX}autotyping <dm/group/off>\n` +
                        `• ${config.PREFIX}autorecording <dm/group/off>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*CHATBOT*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}chatbot <on/dm/group/off>\n` +
                        `• ${config.PREFIX}chatbotpm <on/off>\n` +
                        `• ${config.PREFIX}chatbotgroup <on/off>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*WELCOME/GOODBYE*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}welcome <on/off>\n` +
                        `• ${config.PREFIX}welcomemessage <text>\n` +
                        `• ${config.PREFIX}welcomeaudio <on/off>\n` +
                        `• ${config.PREFIX}goodbye <on/off>\n` +
                        `• ${config.PREFIX}setbyemessage <text>\n` +
                        `• ${config.PREFIX}goodbyeaudio <on/off>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*PRIVACY*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}lastseen <all/contacts/none>\n` +
                        `• ${config.PREFIX}profilepic <all/contacts/none>\n` +
                        `• ${config.PREFIX}statusprivacy <all/contacts/none>\n` +
                        `• ${config.PREFIX}readreceipts <all/none>\n` +
                        `• ${config.PREFIX}onlineprivacy <all/match_last_seen>\n` +
                        `• ${config.PREFIX}blockunknown <on/off>\n` +
                        `• ${config.PREFIX}blockprivate <on/off>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*USER MANAGEMENT*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}blacklist add/remove <@user>\n` +
                        `• ${config.PREFIX}whitelist add/remove <@user>\n` +
                        `• ${config.PREFIX}muteuser <@user> [minutes]\n` +
                        `• ${config.PREFIX}unmuteuser <@user>\n` +
                        `• ${config.PREFIX}warnuser <@user> [reason]\n` +
                        `• ${config.PREFIX}resetwarns <@user>\n` +
                        `• ${config.PREFIX}userinfo <@user>\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `*UTILITIES*\n` +
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `• ${config.PREFIX}settings - View all settings\n` +
                        `• ${config.PREFIX}settingshelp - This menu\n` +
                        `• ${config.PREFIX}resetsettings --force - Reset all\n\n` +

                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };