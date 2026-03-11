const config = require('../../megan/config');
const Designs = require('../../megan/helpers/designs');
const { createNewsletterContext } = require('../../megan/helpers/newsletter');
const moment = require('moment-timezone');
const os = require('os');

const commands = [];

// ==================== PING COMMAND ====================
commands.push({
    name: 'ping',
    description: 'Check bot response time',
    aliases: ['p'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const start = Date.now();
        const sentMsg = await sock.sendMessage(from, {
            text: '🏓 Pong!'
        }, { quoted: msg });
        
        const end = Date.now();
        const ping = end - start;
        
        const resultText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🏓 *PONG!*      ┃
╰━━━━━━━━━━━━━━━━━━━╯

📡 *Response:* ${ping}ms

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: resultText,
            edit: sentMsg.key,
            ...createNewsletterContext(sender, {
                title: "Ping",
                body: `${ping}ms`
            })
        });
    }
});

// ==================== UPTIME COMMAND ====================
commands.push({
    name: 'uptime',
    description: 'Show bot uptime',
    aliases: ['runtime'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const resultText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   ⏱️ *UPTIME*     ┃
╰━━━━━━━━━━━━━━━━━━━╯

📅 *Days:* ${days}
⏰ *Hours:* ${hours}
⏱️ *Minutes:* ${minutes}
⏲️ *Seconds:* ${seconds}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: resultText,
            ...createNewsletterContext(sender, {
                title: "Uptime",
                body: `${days}d ${hours}h`
            })
        }, { quoted: msg });
    }
});

// ==================== INFO COMMAND ====================
commands.push({
    name: 'info',
    description: 'Show bot information',
    aliases: ['bot'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const now = moment().tz(config.TIMEZONE || 'Africa/Nairobi');
        const timeStr = now.format('h:mm A');
        const dateStr = now.format('DD/MM/YYYY');
        
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        
        const totalMem = os.totalmem() / (1024 * 1024 * 1024);
        const freeMem = os.freemem() / (1024 * 1024 * 1024);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const totalMemFixed = totalMem.toFixed(2);

        const infoText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   📱 *BOT INFO*   ┃
╰━━━━━━━━━━━━━━━━━━━╯

👤 *Owner:* ${config.OWNER_NAME}
📞 *Phone:* ${config.OWNER_NUMBER}
🤖 *Bot:* ${config.BOT_NAME}
🔧 *Prefix:* ${config.PREFIX}
⚙️ *Mode:* ${config.MODE}
📚 *Commands:* ${bot.commands.size}
⏱️ *Uptime:* ${days}d ${hours}h
🕒 *Time:* ${timeStr}
📅 *Date:* ${dateStr}
💾 *RAM:* ${usedMem}GB/${totalMemFixed}GB

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: infoText,
            ...createNewsletterContext(sender, {
                title: "Bot Info",
                body: config.BOT_NAME
            })
        }, { quoted: msg });
        
        await react('✅');
    }
});

// ==================== MAIN MENU COMMAND ====================
commands.push({
    name: 'menu',
    description: 'Show all commands',
    aliases: ['help', 'cmds'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        
        const now = moment().tz(config.TIMEZONE || 'Africa/Nairobi');
        const timeStr = now.format('h:mm A');
        const dateStr = now.format('DD/MM/YYYY');
        
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const totalMem = os.totalmem() / (1024 * 1024 * 1024);
        const freeMem = os.freemem() / (1024 * 1024 * 1024);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const totalMemFixed = totalMem.toFixed(2);

        let menu = `╭━━━━━━━━━━━━━━━━━━━╮
┃   📱 *MEGAN-MD*   ┃
╰━━━━━━━━━━━━━━━━━━━╯

⚡ *System Status*
━━━━━━━━━━━━━━━━━━━━━
👤 Owner: ${config.OWNER_NAME}
🔧 Prefix: \`${config.PREFIX}\`
📚 Commands: ${bot.commands.size}
⏱️ Uptime: ${days}d ${hours}h ${minutes}m
🕒 Time: ${timeStr}
📅 Date: ${dateStr}
💾 RAM: ${usedMem}GB/${totalMemFixed}GB
━━━━━━━━━━━━━━━━━━━━━\n\n`;

        // ========== AI CHAT ==========
        menu += `📱 *AI CHAT*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}megan\n`;
        menu += `│ ${config.PREFIX}chatgpt\n`;
        menu += `│ ${config.PREFIX}gptfast\n`;
        menu += `│ ${config.PREFIX}gemini\n`;
        menu += `│ ${config.PREFIX}geminifast\n`;
        menu += `│ ${config.PREFIX}copilot\n`;
        menu += `│ ${config.PREFIX}llama\n`;
        menu += `│ ${config.PREFIX}storygen\n`;
        menu += `│ ${config.PREFIX}aistatus\n`;
        menu += `│ ${config.PREFIX}clearmegan\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== DOWNLOADER ==========
        menu += `⬇️ *DOWNLOADER*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}play\n`;
        menu += `│ ${config.PREFIX}music\n`;
        menu += `│ ${config.PREFIX}mp3\n`;
        menu += `│ ${config.PREFIX}ytmp3\n`;
        menu += `│ ${config.PREFIX}ytmp4\n`;
        menu += `│ ${config.PREFIX}yts\n`;
        menu += `│ ${config.PREFIX}ytv\n`;
        menu += `│ ${config.PREFIX}spotify\n`;
        menu += `│ ${config.PREFIX}tiktok\n`;
        menu += `│ ${config.PREFIX}instagram\n`;
        menu += `│ ${config.PREFIX}facebook\n`;
        menu += `│ ${config.PREFIX}twitter\n`;
        menu += `│ ${config.PREFIX}pinterest\n`;
        menu += `│ ${config.PREFIX}mediafire\n`;
        menu += `│ ${config.PREFIX}gdrive\n`;
        menu += `│ ${config.PREFIX}mega\n`;
        menu += `│ ${config.PREFIX}apk\n`;
        menu += `│ ${config.PREFIX}github\n`;
        menu += `│ ${config.PREFIX}dl\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== AI IMAGE ==========
        menu += `🎨 *AI IMAGE*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}flux\n`;
        menu += `│ ${config.PREFIX}dream\n`;
        menu += `│ ${config.PREFIX}generate\n`;
        menu += `│ ${config.PREFIX}create\n`;
        menu += `│ ${config.PREFIX}sketch\n`;
        menu += `│ ${config.PREFIX}cartoon\n`;
        menu += `│ ${config.PREFIX}filter\n`;
        menu += `│ ${config.PREFIX}removebg\n`;
        menu += `│ ${config.PREFIX}restore\n`;
        menu += `│ ${config.PREFIX}upscale\n`;
        menu += `│ ${config.PREFIX}enhance\n`;
        menu += `│ ${config.PREFIX}repair\n`;
        menu += `│ ${config.PREFIX}colorize\n`;
        menu += `│ ${config.PREFIX}animagine\n`;
        menu += `│ ${config.PREFIX}aigen\n`;
        menu += `│ ${config.PREFIX}aimage\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== MEDIA TOOLS ==========
        menu += `🎬 *MEDIA TOOLS*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}sticker\n`;
        menu += `│ ${config.PREFIX}toimage\n`;
        menu += `│ ${config.PREFIX}circle\n`;
        menu += `│ ${config.PREFIX}removebg\n`;
        menu += `│ ${config.PREFIX}filter\n`;
        menu += `│ ${config.PREFIX}say\n`;
        menu += `│ ${config.PREFIX}voice\n`;
        menu += `│ ${config.PREFIX}toaudio\n`;
        menu += `│ ${config.PREFIX}speed\n`;
        menu += `│ ${config.PREFIX}vol\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== GROUP ==========
        menu += `👥 *GROUP*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}groupinfo\n`;
        menu += `│ ${config.PREFIX}groups\n`;
        menu += `│ ${config.PREFIX}participants\n`;
        menu += `│ ${config.PREFIX}add\n`;
        menu += `│ ${config.PREFIX}remove\n`;
        menu += `│ ${config.PREFIX}promote\n`;
        menu += `│ ${config.PREFIX}demote\n`;
        menu += `│ ${config.PREFIX}tagall\n`;
        menu += `│ ${config.PREFIX}tag\n`;
        menu += `│ ${config.PREFIX}tagadmins\n`;
        menu += `│ ${config.PREFIX}setgcname\n`;
        menu += `│ ${config.PREFIX}setdesc\n`;
        menu += `│ ${config.PREFIX}invite\n`;
        menu += `│ ${config.PREFIX}revokeinvite\n`;
        menu += `│ ${config.PREFIX}join\n`;
        menu += `│ ${config.PREFIX}leave\n`;
        menu += `│ ${config.PREFIX}lockgc\n`;
        menu += `│ ${config.PREFIX}unlockgc\n`;
        menu += `│ ${config.PREFIX}locked\n`;
        menu += `│ ${config.PREFIX}unlocked\n`;
        menu += `│ ${config.PREFIX}poll\n`;
        menu += `│ ${config.PREFIX}multipoll\n`;
        menu += `│ ${config.PREFIX}gstatus\n`;
        menu += `│ ${config.PREFIX}grouphelp\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== STATUS ==========
        menu += `📱 *STATUS*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}autoviewstatus\n`;
        menu += `│ ${config.PREFIX}autodownloadstatus\n`;
        menu += `│ ${config.PREFIX}autoreactstatus\n`;
        menu += `│ ${config.PREFIX}autoreplystatus\n`;
        menu += `│ ${config.PREFIX}antideletestatus\n`;
        menu += `│ ${config.PREFIX}autoviewonce\n`;
        menu += `│ ${config.PREFIX}save\n`;
        menu += `│ ${config.PREFIX}setstatusemoji\n`;
        menu += `│ ${config.PREFIX}setstatusreply\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== SEARCH & NEWS ==========
        menu += `🔍 *SEARCH & NEWS*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}google\n`;
        menu += `│ ${config.PREFIX}wikipedia\n`;
        menu += `│ ${config.PREFIX}kenyanews\n`;
        menu += `│ ${config.PREFIX}k24\n`;
        menu += `│ ${config.PREFIX}citizen\n`;
        menu += `│ ${config.PREFIX}standard\n`;
        menu += `│ ${config.PREFIX}nation\n`;
        menu += `│ ${config.PREFIX}thestar\n`;
        menu += `│ ${config.PREFIX}worldnews\n`;
        menu += `│ ${config.PREFIX}aljazeera\n`;
        menu += `│ ${config.PREFIX}france24\n`;
        menu += `│ ${config.PREFIX}bbc\n`;
        menu += `│ ${config.PREFIX}reuters\n`;
        menu += `│ ${config.PREFIX}apnews\n`;
        menu += `│ ${config.PREFIX}cnn\n`;
        menu += `│ ${config.PREFIX}nytimes\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== DICTIONARY ==========
        menu += `📚 *DICTIONARY*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}define\n`;
        menu += `│ ${config.PREFIX}synonym\n`;
        menu += `│ ${config.PREFIX}antonym\n`;
        menu += `│ ${config.PREFIX}translate\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== FUN ==========
        menu += `🎭 *FUN*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}joke\n`;
        menu += `│ ${config.PREFIX}dadjoke\n`;
        menu += `│ ${config.PREFIX}quote\n`;
        menu += `│ ${config.PREFIX}inspire\n`;
        menu += `│ ${config.PREFIX}fact\n`;
        menu += `│ ${config.PREFIX}motivate\n`;
        menu += `│ ${config.PREFIX}emojimix\n`;
        menu += `│ ${config.PREFIX}fliptext\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== ROMANCE ==========
        menu += `💝 *ROMANCE*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}flirt\n`;
        menu += `│ ${config.PREFIX}pickupline\n`;
        menu += `│ ${config.PREFIX}rizz\n`;
        menu += `│ ${config.PREFIX}lovequote\n`;
        menu += `│ ${config.PREFIX}sweetmessage\n`;
        menu += `│ ${config.PREFIX}compliment\n`;
        menu += `│ ${config.PREFIX}propose\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== RELIGION ==========
        menu += `📖 *RELIGION*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}bible\n`;
        menu += `│ ${config.PREFIX}quran\n`;
        menu += `│ ${config.PREFIX}dailyverse\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== TOOLS ==========
        menu += `🛠️ *TOOLS*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}binary\n`;
        menu += `│ ${config.PREFIX}debinary\n`;
        menu += `│ ${config.PREFIX}base64\n`;
        menu += `│ ${config.PREFIX}hash\n`;
        menu += `│ ${config.PREFIX}morse\n`;
        menu += `│ ${config.PREFIX}encrypt\n`;
        menu += `│ ${config.PREFIX}decrypt\n`;
        menu += `│ ${config.PREFIX}password\n`;
        menu += `│ ${config.PREFIX}email\n`;
        menu += `│ ${config.PREFIX}uuid\n`;
        menu += `│ ${config.PREFIX}ssweb\n`;
        menu += `│ ${config.PREFIX}tinyurl\n`;
        menu += `│ ${config.PREFIX}calculate\n`;
        menu += `│ ${config.PREFIX}device\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== TRACKING ==========
        menu += `📍 *TRACKING*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}trackpresence\n`;
        menu += `│ ${config.PREFIX}tracklastseen\n`;
        menu += `│ ${config.PREFIX}check\n`;
        menu += `│ ${config.PREFIX}jidinfo\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== GENERAL ==========
        menu += `⚙️ *GENERAL*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}ping\n`;
        menu += `│ ${config.PREFIX}uptime\n`;
        menu += `│ ${config.PREFIX}info\n`;
        menu += `│ ${config.PREFIX}menu\n`;
        menu += `│ ${config.PREFIX}owner\n`;
        menu += `│ ${config.PREFIX}status\n`;
        menu += `│ ${config.PREFIX}debug\n`;
        menu += `│ ${config.PREFIX}tracker\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== FEATURES ==========
        menu += `⚡ *FEATURES*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}antidelete\n`;
        menu += `│ ${config.PREFIX}anticall\n`;
        menu += `│ ${config.PREFIX}antilink\n`;
        menu += `│ ${config.PREFIX}autoreact\n`;
        menu += `│ ${config.PREFIX}autoread\n`;
        menu += `│ ${config.PREFIX}autobio\n`;
        menu += `│ ${config.PREFIX}presencepm\n`;
        menu += `│ ${config.PREFIX}presencegroup\n`;
        menu += `│ ${config.PREFIX}autotyping\n`;
        menu += `│ ${config.PREFIX}autorecording\n`;
        menu += `│ ${config.PREFIX}features\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== SETTINGS ==========
        menu += `🔧 *SETTINGS*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}setprefix\n`;
        menu += `│ ${config.PREFIX}setbotname\n`;
        menu += `│ ${config.PREFIX}setmode\n`;
        menu += `│ ${config.PREFIX}setownername\n`;
        menu += `│ ${config.PREFIX}setownerphone\n`;
        menu += `│ ${config.PREFIX}setbio\n`;
        menu += `│ ${config.PREFIX}setbotpic\n`;
        menu += `│ ${config.PREFIX}removepp\n`;
        menu += `│ ${config.PREFIX}mypic\n`;
        menu += `│ ${config.PREFIX}myabout\n`;
        menu += `│ ${config.PREFIX}settings\n`;
        menu += `│ ${config.PREFIX}resetsettings\n`;
        menu += `│ ${config.PREFIX}settingshelp\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== WELCOME/GOODBYE ==========
        menu += `👋 *WELCOME/GOODBYE*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}welcome\n`;
        menu += `│ ${config.PREFIX}setwelcome\n`;
        menu += `│ ${config.PREFIX}goodbye\n`;
        menu += `│ ${config.PREFIX}setgoodbye\n`;
        menu += `│ ${config.PREFIX}testwelcome\n`;
        menu += `│ ${config.PREFIX}testgoodbye\n`;
        menu += `│ ${config.PREFIX}firstwelcome\n`;
        menu += `│ ${config.PREFIX}welcomehelp\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== USER MANAGEMENT ==========
        menu += `👤 *USER MANAGEMENT*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}blacklist\n`;
        menu += `│ ${config.PREFIX}whitelist\n`;
        menu += `│ ${config.PREFIX}listblacklist\n`;
        menu += `│ ${config.PREFIX}listwhitelist\n`;
        menu += `│ ${config.PREFIX}muteuser\n`;
        menu += `│ ${config.PREFIX}unmuteuser\n`;
        menu += `│ ${config.PREFIX}listmuted\n`;
        menu += `│ ${config.PREFIX}warnuser\n`;
        menu += `│ ${config.PREFIX}resetwarns\n`;
        menu += `│ ${config.PREFIX}userinfo\n`;
        menu += `│ ${config.PREFIX}usermgmt\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== PRIVACY ==========
        menu += `🔐 *PRIVACY*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}block\n`;
        menu += `│ ${config.PREFIX}unblock\n`;
        menu += `│ ${config.PREFIX}listblocked\n`;
        menu += `│ ${config.PREFIX}setlastseen\n`;
        menu += `│ ${config.PREFIX}setprofilepic\n`;
        menu += `│ ${config.PREFIX}setstatusprivacy\n`;
        menu += `│ ${config.PREFIX}setprivacyread\n`;
        menu += `│ ${config.PREFIX}setonlineprivacy\n`;
        menu += `│ ${config.PREFIX}privacysettings\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== CHAT ==========
        menu += `💬 *CHAT*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}archive\n`;
        menu += `│ ${config.PREFIX}unarchive\n`;
        menu += `│ ${config.PREFIX}mute\n`;
        menu += `│ ${config.PREFIX}unmute\n`;
        menu += `│ ${config.PREFIX}pin\n`;
        menu += `│ ${config.PREFIX}unpin\n`;
        menu += `│ ${config.PREFIX}markread\n`;
        menu += `│ ${config.PREFIX}markunread\n`;
        menu += `│ ${config.PREFIX}deletechat\n`;
        menu += `│ ${config.PREFIX}clearchat\n`;
        menu += `│ ${config.PREFIX}chathelp\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== VIEW ONCE ==========
        menu += `🔐 *VIEW ONCE*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}vv\n`;
        menu += `│ ${config.PREFIX}vv2\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== UTILITIES ==========
        menu += `🛡️ *UTILITIES*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}cleanup\n`;
        menu += `│ ${config.PREFIX}sessclean\n`;
        menu += `│ ${config.PREFIX}restart\n`;
        menu += `│ ${config.PREFIX}shutdown\n`;
        menu += `│ ${config.PREFIX}stats\n`;
        menu += `└─────────────────────┘\n\n`;

        // Footer
        menu += `✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥\n`;
        menu += `   *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME}*   \n`;
        menu += `✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥\n`;
        menu += `✨ created by wanga ✨`;

        await sock.sendMessage(from, {
            text: menu,
            ...createNewsletterContext(sender, {
                title: "Main Menu",
                body: `${bot.commands.size} Commands`
            })
        }, { quoted: msg });
    }
});

// ==================== OWNER COMMAND ====================
commands.push({
    name: 'owner',
    description: 'Show owner information',
    aliases: ['creator'],
    async execute({ msg, from, sender, bot, sock }) {
        const ownerInfo = `╭━━━━━━━━━━━━━━━━━━━╮
┃   👑 *OWNER INFO* ┃
╰━━━━━━━━━━━━━━━━━━━╯

📛 *Name:* ${config.OWNER_NAME}
📞 *Phone:* ${config.OWNER_NUMBER}
🌍 *Country:* Kenya

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: ownerInfo,
            ...createNewsletterContext(sender, {
                title: "Owner Info",
                body: config.OWNER_NAME
            })
        }, { quoted: msg });
    }
});

// ==================== STATUS COMMAND ====================
commands.push({
    name: 'status',
    description: 'Show bot status',
    aliases: ['stats'],
    async execute({ msg, from, sender, bot, sock }) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const memory = process.memoryUsage();
        const usedMB = Math.round(memory.heapUsed / 1024 / 1024);

        const statusText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   📊 *BOT STATUS* ┃
╰━━━━━━━━━━━━━━━━━━━╯

⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s
💾 *Memory:* ${usedMB}MB
📚 *Commands:* ${bot.commands.size}
⚡ *Node:* ${process.version}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: statusText,
            ...createNewsletterContext(sender, {
                title: "Bot Status",
                body: "System Info"
            })
        }, { quoted: msg });
    }
});

// ==================== DEBUG COMMAND ====================
commands.push({
    name: 'debug',
    description: 'Show debug information',
    aliases: [],
    async execute({ msg, from, sender, bot, sock }) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const debugInfo = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🔧 *DEBUG INFO* ┃
╰━━━━━━━━━━━━━━━━━━━╯

🤖 *Bot:* ${config.BOT_NAME}
👤 *Owner:* ${config.OWNER_NAME}
🔧 *Prefix:* ${config.PREFIX}
⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s
⚡ *Node:* ${process.version}
💻 *Platform:* ${process.platform}
📚 *Commands:* ${bot.commands.size}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: debugInfo,
            ...createNewsletterContext(sender, {
                title: "Debug Info",
                body: "System Details"
            })
        }, { quoted: msg });
    }
});

// ==================== TRACKER COMMAND ====================
commands.push({
    name: 'tracker',
    description: 'Show database tracker statistics',
    aliases: ['dbstats'],
    async execute({ msg, from, sender, bot, sock }) {
        try {
            const stats = bot.db?.getStats ? bot.db.getStats() : { 
                totalCommands: 0, 
                totalUsers: 0, 
                totalGroups: 0 
            };

            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);

            const statText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   📊 *DATABASE*   ┃
╰━━━━━━━━━━━━━━━━━━━╯

📨 *Commands Run:* ${stats.totalCommands}
👥 *Users:* ${stats.totalUsers}
👥 *Groups:* ${stats.totalGroups}
⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

            await sock.sendMessage(from, {
                text: statText,
                ...createNewsletterContext(sender, {
                    title: "Database Stats",
                    body: "Bot Statistics"
                })
            }, { quoted: msg });

        } catch (error) {
            console.error('Tracker error:', error);
            await sock.sendMessage(from, { 
                text: '❌ Error getting tracker stats.',
                ...createNewsletterContext(sender, {
                    title: "Error",
                    body: "Tracker Failed"
                })
            }, { quoted: msg });
        }
    }
});

module.exports = { commands };