const config = require('../../megan/config');
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

        await sock.sendMessage(from, {
            text: `🏓 *PONG!*\n\n📡 Response: ${ping}ms`,
            edit: sentMsg.key
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

        const uptimeText = `◤━━━━━━━━━━━━━━━━━━◥\n` +
                          `       ⏱️ *UPTIME*       \n` +
                          `◣━━━━━━━━━━━━━━━━━━◢\n\n` +
                          `➤ Days: ${days}\n` +
                          `➤ Hours: ${hours}\n` +
                          `➤ Minutes: ${minutes}\n` +
                          `➤ Seconds: ${seconds}\n\n` +
                          `✦ ─────────────── ✦\n` +
                          `> created by wanga`;

        await sock.sendMessage(from, { text: uptimeText }, { quoted: msg });
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

        const hour = now.hour();
        let greeting = 'Good Evening';
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 17) greeting = 'Good Afternoon';

        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const totalMem = os.totalmem() / (1024 * 1024 * 1024);
        const freeMem = os.freemem() / (1024 * 1024 * 1024);
        const usedMem = (totalMem - freeMem).toFixed(2);
        const totalMemFixed = totalMem.toFixed(2);

        const info = `◤══════════════════════◥\n` +
                    `    *${config.BOT_NAME}*    \n` +
                    `◣══════════════════════◢\n\n` +
                    `🌟 *${greeting}!*\n\n` +
                    `┌────────────────────────┐\n` +
                    `│ 📋 *BOT INFORMATION*    │\n` +
                    `├────────────────────────┤\n` +
                    `│ 👤 Owner: ${config.OWNER_NAME}\n` +
                    `│ 📞 Phone: ${config.OWNER_NUMBER}\n` +
                    `│ 🤖 Bot: ${config.BOT_NAME}\n` +
                    `│ 🔧 Prefix: ${config.PREFIX}\n` +
                    `│ ⚙️ Mode: ${config.MODE}\n` +
                    `│ 📚 Commands: ${bot.commands.size}\n` +
                    `│ ⏱️ Uptime: ${days}d ${hours}h ${minutes}m\n` +
                    `│ 🕒 Time: ${timeStr}\n` +
                    `│ 📅 Date: ${dateStr}\n` +
                    `│ 🌍 Timezone: ${config.TIMEZONE}\n` +
                    `│ 💾 RAM: ${usedMem}GB/${totalMemFixed}GB\n` +
                    `└────────────────────────┘\n\n` +
                    `✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦\n` +
                    `> created by wanga`;

        await sock.sendMessage(from, { text: info }, { quoted: msg });
        await react('✅');
    }
});

// ==================== UNIQUE MENU COMMAND ====================
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

        // Header with unique design
        let menu = `▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n`;
        menu += `      *${config.BOT_NAME}*      \n`;
        menu += `▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀\n\n`;
        menu += `⚡ *System Status*\n`;
        menu += `━━━━━━━━━━━━━━━━━━━━━\n`;
        menu += `👤 Owner: ${config.OWNER_NAME}\n`;
        menu += `🔧 Prefix: \`${config.PREFIX}\`\n`;
        menu += `📚 Commands: ${bot.commands.size}\n`;
        menu += `⏱️ Uptime: ${days}d ${hours}h ${minutes}m\n`;
        menu += `🕒 Time: ${timeStr}\n`;
        menu += `📅 Date: ${dateStr}\n`;
        menu += `💾 RAM: ${usedMem}GB/${totalMemFixed}GB\n`;
        menu += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

        // ========== AI CHAT ==========
        menu += `📱 *AI CHAT*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}megan\n`;
        menu += `│ ${config.PREFIX}chatgpt\n`;
        menu += `│ ${config.PREFIX}llama\n`;
        menu += `│ ${config.PREFIX}gemini\n`;
        menu += `│ ${config.PREFIX}copilot\n`;
        menu += `│ ${config.PREFIX}storygen\n`;
        menu += `│ ${config.PREFIX}chatbot\n`;
        menu += `│ ${config.PREFIX}aimode\n`;
        menu += `│ ${config.PREFIX}testai\n`;
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
        menu += `│ ${config.PREFIX}dl\n`;
        menu += `│ ${config.PREFIX}cleanup\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== AI IMAGE ==========
        menu += `🎨 *AI IMAGE*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}flux\n`;
        menu += `│ ${config.PREFIX}dream\n`;
        menu += `│ ${config.PREFIX}generate\n`;
        menu += `│ ${config.PREFIX}create\n`;
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
        menu += `│ ${config.PREFIX}creategroup\n`;
        menu += `│ ${config.PREFIX}groupinfo\n`;
        menu += `│ ${config.PREFIX}groups\n`;
        menu += `│ ${config.PREFIX}participants\n`;
        menu += `│ ${config.PREFIX}add\n`;
        menu += `│ ${config.PREFIX}remove\n`;
        menu += `│ ${config.PREFIX}promote\n`;
        menu += `│ ${config.PREFIX}demote\n`;
        menu += `│ ${config.PREFIX}tagall\n`;
        menu += `│ ${config.PREFIX}tag\n`;
        menu += `│ ${config.PREFIX}announce\n`;
        menu += `│ ${config.PREFIX}tagadmins\n`;
        menu += `│ ${config.PREFIX}setgcname\n`;
        menu += `│ ${config.PREFIX}setdesc\n`;
        menu += `│ ${config.PREFIX}invite\n`;
        menu += `│ ${config.PREFIX}revokeinvite\n`;
        menu += `│ ${config.PREFIX}join\n`;
        menu += `│ ${config.PREFIX}leave\n`;
        menu += `│ ${config.PREFIX}lockgc\n`;
        menu += `│ ${config.PREFIX}unlockgc\n`;
        menu += `│ ${config.PREFIX}poll\n`;
        menu += `│ ${config.PREFIX}multipoll\n`;
        menu += `│ ${config.PREFIX}gstatus\n`;
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

        // ========== TOOLS ==========
        menu += `🛠️ *TOOLS*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}binary\n`;
        menu += `│ ${config.PREFIX}debinary\n`;
        menu += `│ ${config.PREFIX}encrypt\n`;
        menu += `│ ${config.PREFIX}decrypt\n`;
        menu += `│ ${config.PREFIX}morse\n`;
        menu += `│ ${config.PREFIX}translate\n`;
        menu += `│ ${config.PREFIX}base64\n`;
        menu += `│ ${config.PREFIX}hash\n`;
        menu += `│ ${config.PREFIX}uuid\n`;
        menu += `│ ${config.PREFIX}password\n`;
        menu += `│ ${config.PREFIX}email\n`;
        menu += `│ ${config.PREFIX}qrcode\n`;
        menu += `│ ${config.PREFIX}ssweb\n`;
        menu += `│ ${config.PREFIX}tinyurl\n`;
        menu += `│ ${config.PREFIX}calculate\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== SEARCH ==========
        menu += `🔍 *SEARCH*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}google\n`;
        menu += `│ ${config.PREFIX}wikipedia\n`;
        menu += `│ ${config.PREFIX}brave\n`;
        menu += `│ ${config.PREFIX}firefox\n`;
        menu += `│ ${config.PREFIX}searchall\n`;
        menu += `│ ${config.PREFIX}gsmarena\n`;
        menu += `│ ${config.PREFIX}movie\n`;
        menu += `│ ${config.PREFIX}tv\n`;
        menu += `│ ${config.PREFIX}anime\n`;
        menu += `│ ${config.PREFIX}kenyanews\n`;
        menu += `│ ${config.PREFIX}news\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== FUN ==========
        menu += `🎭 *FUN*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}joke\n`;
        menu += `│ ${config.PREFIX}quote\n`;
        menu += `│ ${config.PREFIX}waifu\n`;
        menu += `│ ${config.PREFIX}fact\n`;
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
        menu += `│ ${config.PREFIX}romanceimg\n`;
        menu += `│ ${config.PREFIX}flower\n`;
        menu += `│ ${config.PREFIX}heart\n`;
        menu += `│ ${config.PREFIX}valentine\n`;
        menu += `│ ${config.PREFIX}compliment\n`;
        menu += `│ ${config.PREFIX}propose\n`;
        menu += `│ ${config.PREFIX}romance\n`;
        menu += `└─────────────────────┘\n\n`;

        // ========== RELIGION ==========
        menu += `📖 *RELIGION*\n`;
        menu += `┌─────────────────────┐\n`;
        menu += `│ ${config.PREFIX}bible\n`;
        menu += `│ ${config.PREFIX}quran\n`;
        menu += `│ ${config.PREFIX}dailyverse\n`;
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
        menu += `│ ${config.PREFIX}check\n`;
        menu += `│ ${config.PREFIX}jidinfo\n`;
        menu += `│ ${config.PREFIX}trackpresence\n`;
        menu += `│ ${config.PREFIX}tracklastseen\n`;
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
        menu += `│ ${config.PREFIX}setmsg\n`;
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
        menu += `│ ${config.PREFIX}welcomemessage\n`;
        menu += `│ ${config.PREFIX}welcomeaudio\n`;
        menu += `│ ${config.PREFIX}goodbye\n`;
        menu += `│ ${config.PREFIX}setbyemessage\n`;
        menu += `│ ${config.PREFIX}goodbyeaudio\n`;
        menu += `│ ${config.PREFIX}testwelcome\n`;
        menu += `│ ${config.PREFIX}testgoodbye\n`;
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

        // Footer
        menu += `▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n`;
        menu += `   *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.BOT_NAME}*   \n`;
        menu += `▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀\n`;
        menu += `✨ created by wanga ✨`;

        await sock.sendMessage(from, { text: menu }, { quoted: msg });
    }
});

// ==================== OWNER COMMAND ====================
commands.push({
    name: 'owner',
    description: 'Show owner information',
    aliases: ['creator'],
    async execute({ msg, from, sender, bot, sock }) {
        const ownerInfo = `◤══════════════════◥\n` +
                         `    👑 *OWNER INFO*    \n` +
                         `◣══════════════════◢\n\n` +
                         `📛 *Name:* ${config.OWNER_NAME}\n` +
                         `📞 *Phone:* ${config.OWNER_NUMBER}\n` +
                         `🌍 *Country:* Kenya\n\n` +
                         `✦ ─────────────── ✦\n` +
                         `> created by wanga`;

        await sock.sendMessage(from, { text: ownerInfo }, { quoted: msg });
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

        const status = `◤══════════════════◥\n` +
                      `    📊 *BOT STATUS*    \n` +
                      `◣══════════════════◢\n\n` +
                      `⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s\n` +
                      `💾 *Memory:* ${usedMB}MB\n` +
                      `📚 *Commands:* ${bot.commands.size}\n` +
                      `⚡ *Node:* ${process.version}\n\n` +
                      `✦ ─────────────── ✦\n` +
                      `> created by wanga`;

        await sock.sendMessage(from, { text: status }, { quoted: msg });
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

        const debugInfo = `◤══════════════════◥\n` +
                         `    🔧 *DEBUG INFO*    \n` +
                         `◣══════════════════◢\n\n` +
                         `🤖 *Bot:* ${config.BOT_NAME}\n` +
                         `👤 *Owner:* ${config.OWNER_NAME}\n` +
                         `🔧 *Prefix:* ${config.PREFIX}\n` +
                         `⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m ${seconds}s\n` +
                         `⚡ *Node:* ${process.version}\n` +
                         `💻 *Platform:* ${process.platform}\n` +
                         `📚 *Commands:* ${bot.commands.size}\n\n` +
                         `✦ ─────────────── ✦\n` +
                         `> created by wanga`;

        await sock.sendMessage(from, { text: debugInfo }, { quoted: msg });
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

            let statText = `◤══════════════════◥\n` +
                          `    📊 *DATABASE STATS*  \n` +
                          `◣══════════════════◢\n\n` +
                          `📨 *Commands Run:* ${stats.totalCommands}\n` +
                          `👥 *Users:* ${stats.totalUsers}\n` +
                          `👥 *Groups:* ${stats.totalGroups}\n` +
                          `⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m\n\n` +
                          `✦ ─────────────── ✦\n` +
                          `> created by wanga`;

            await sock.sendMessage(from, { text: statText }, { quoted: msg });
        } catch (error) {
            console.error('Tracker error:', error);
            await sock.sendMessage(from, { text: '❌ Error getting tracker stats.' });
        }
    }
});

module.exports = { commands };