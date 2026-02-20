const config = require('../../megan/config');
const moment = require('moment-timezone');

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
        
        const uptimeText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                          `┃ *${config.BOT_NAME}*\n` +
                          `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                          `⏱️ *UPTIME*\n\n` +
                          `📅 Days: ${days}\n` +
                          `⏰ Hours: ${hours}\n` +
                          `⏱️ Minutes: ${minutes}\n` +
                          `⏲️ Seconds: ${seconds}\n\n` +
                          `> created by wanga`;
        
        await sock.sendMessage(from, {
            text: uptimeText
        }, { quoted: msg });
    }
});

// ==================== INFO COMMAND ====================
commands.push({
    name: 'info',
    description: 'Show bot information',
    aliases: ['bot'],
    async execute({ msg, from, sender, bot, sock }) {
        const now = moment().tz(config.TIMEZONE || 'Africa/Nairobi');
        const timeStr = now.format('h:mm A');
        const dateStr = now.format('ddd, MMM D, YYYY');
        
        const hour = now.hour();
        let greeting = 'Good Evening';
        if (hour < 12) greeting = 'Good Morning';
        else if (hour < 17) greeting = 'Good Afternoon';
        
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const info = `╔═══════════════════════╗\n` +
                    `║    𝕸𝕰𝕲𝕬𝕹-𝕸𝕯     ║\n` +
                    `╚═══════════════════════╝\n\n` +
                    `✨ ${greeting}! ✨\n\n` +
                    `╭─────────────────────╮\n` +
                    `│ 📋 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎       │\n` +
                    `├─────────────────────┤\n` +
                    `│ 👤 Owner: ${config.OWNER_NAME}\n` +
                    `│ 📞 Phone: ${config.OWNER_NUMBER}\n` +
                    `│ 👑 Gender: Male\n` +
                    `│ 🎂 Age: 19\n` +
                    `│ 🤖 Bot: ${config.BOT_NAME}\n` +
                    `│ ⏰ Time: ${timeStr}\n` +
                    `│ 📅 Date: ${dateStr}\n` +
                    `│ ⚙️ Prefix: ${config.PREFIX}\n` +
                    `│ 📊 Commands: ${bot.commands.size}\n` +
                    `│ ⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                    `╰─────────────────────╯\n\n` +
                    `> created by wanga`;
        
        await sock.sendMessage(from, {
            text: info
        }, { quoted: msg });
    }
});

// ==================== BEAUTIFUL MENU COMMAND ====================
commands.push({
    name: 'menu',
    description: 'Show all commands',
    aliases: ['help', 'cmds'],
    async execute({ msg, from, sender, bot, sock }) {
        
        // Build menu with the exact style you want
        let menu = `╔═══════════════════════╗\n`;
        menu += `║    𝕸𝕰𝕲𝕬𝕹-𝕸𝕯     ║\n`;
        menu += `╚═══════════════════════╝\n\n`;
        menu += `📝 *Prefix:* ${config.PREFIX}\n`;
        menu += `📚 *Total Commands:* ${bot.commands.size}\n\n`;

        // ==================== AI CHAT ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🤖 ᴀɪ ᴄʜᴀᴛ         ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴍᴇɢᴀɴ\n.ᴄʜᴀᴛɢᴘᴛ\n.ʟʟᴀᴍᴀ\n.ɢᴇᴍɪɴɪ\n.ɢᴇᴍɪɴɪғᴀsᴛ\n.ɢᴘᴛғᴀsᴛ\n.ᴄᴏᴘɪʟᴏᴛ\n.sᴛᴏʀʏɢᴇɴ\n.ᴀɪᴍᴇɴᴜ\n.ᴀɪsᴛᴀᴛᴜs\n.ᴄʟᴇᴀʀᴍᴇɢᴀɴ\n.ᴛᴇsᴛᴀɪ\n.ᴄʜᴀᴛʙᴏᴛ\n.ᴄʜᴀᴛsᴛᴀᴛᴜs\n.ᴀɪᴍᴏᴅᴇ\n\n";

        // ==================== DOWNLOADER ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ ⬇️ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ       ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴘʟᴀʏ\n.ᴍᴜsɪᴄ\n.ᴍᴘ𝟹\n.ʏᴛᴍᴘ𝟹\n.ʏᴛᴍᴘ𝟺\n.ʏᴛs\n.ʏᴛᴠ\n.sᴘᴏᴛɪғʏ\n.ᴛɪᴋᴛᴏᴋ\n.ᴅʟ\n.ᴄʟᴇᴀɴᴜᴘ\n\n`;

        // ==================== AI IMAGE ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🎨 ᴀɪ ɪᴍᴀɢᴇ         ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ғʟᴜx\n.ᴅʀᴇᴀᴍ\n.ɢᴇɴᴇʀᴀᴛᴇ\n.ᴄʀᴇᴀᴛᴇ\n.ᴀɪᴍᴀɢᴇ\n.𝟺ᴋᴡᴀʟʟᴘᴀᴘᴇʀ\n.ᴡᴀʟʟᴘᴀᴘᴇʀ\n\n`;

        // ==================== MEDIA TOOLS ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🎨 ᴍᴇᴅɪᴀ ᴛᴏᴏʟs      ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.sᴛɪᴄᴋᴇʀ\n.ᴛᴏɪᴍᴀɢᴇ\n.ᴄɪʀᴄʟᴇ\n.ʀᴇᴍᴏᴠᴇʙɢ\n.ғɪʟᴛᴇʀ\n.sᴀʏ\n.ᴠᴏɪᴄᴇ\n.ᴛᴏᴀᴜᴅɪᴏ\n.sᴘᴇᴇᴅ\n.ᴠᴏʟ\n\n`;

        // ==================== SOCIAL MEDIA ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🌐 sᴏᴄɪᴀʟ          ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ɪɢ\n.ғʙ\n.x\n.sᴏᴄɪᴀʟ\n\n`;

        // ==================== GROUP ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 👥 ɢʀᴏᴜᴘ            ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴛᴀɢᴀʟʟ\n.ᴛᴀɢ\n.ᴀɴɴᴏᴜɴᴄᴇ\n.ᴛᴀɢᴀᴅᴍɪɴs\n.ɢʀᴏᴜᴘɪɴғᴏ\n.ɢʀᴏᴜᴘsᴇᴛᴛɪɴɢs\n.sᴇᴛsᴜʙᴊᴇᴄᴛ\n.sᴇᴛᴅᴇsᴄʀɪᴘᴛɪᴏɴ\n.ᴀᴅᴅ\n.ʀᴇᴍᴏᴠᴇ\n.ᴘʀᴏᴍᴏᴛᴇ\n.ᴅᴇᴍᴏᴛᴇ\n.ɪɴᴠɪᴛᴇ\n.ʀᴇᴠᴏᴋᴇ\n.ᴄʀᴇᴀᴛᴇɢʀᴏᴜᴘ\n.ᴘᴏʟʟ\n.ᴍᴜʟᴛɪᴘᴏʟʟ\n.ʟᴇᴀᴠᴇ\n\n`;

        // ==================== STATUS ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 📱 sᴛᴀᴛᴜs           ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴀᴜᴛᴏᴠɪᴇᴡsᴛᴀᴛᴜs\n.ᴀᴜᴛᴏᴅᴏᴡɴʟᴏᴀᴅsᴛᴀᴛᴜs\n.ᴀᴜᴛᴏʀᴇᴀᴄᴛsᴛᴀᴛᴜs\n.ᴀᴜᴛᴏʀᴇᴘʟʏsᴛᴀᴛᴜs\n.ᴀɴᴛɪᴅᴇʟᴇᴛᴇsᴛᴀᴛᴜs\n.ᴀᴜᴛᴏᴠɪᴇᴡᴏɴᴄᴇ\n.sᴀᴠᴇ\n.sᴇᴛsᴛᴀᴛᴜsᴇᴍᴏᴊɪ\n.sᴇᴛsᴛᴀᴛᴜsʀᴇᴘʟʏ\n\n`;

        // ==================== TOOLS ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🛠️ ᴛᴏᴏʟs            ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ʙɪɴᴀʀʏ\n.ᴅᴇʙɪɴᴀʀʏ\n.ᴇɴᴄʀʏᴘᴛ\n.ᴅᴇᴄʀʏᴘᴛ\n.ᴍᴏʀsᴇ\n.ᴛʀᴀɴsʟᴀᴛᴇ\n.ʙᴀsᴇ𝟼𝟺\n.ʜᴀsʜ\n.ᴜᴜɪᴅ\n.ᴘᴀssᴡᴏʀᴅ\n.ᴇᴍᴀɪʟ\n.ǫʀᴄᴏᴅᴇ\n.ssᴡᴇʙ\n.ᴛɪɴʏᴜʀʟ\n.ᴛᴏᴜʀʟ\n\n`;

        // ==================== SEARCH ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🔍 sᴇᴀʀᴄʜ          ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ɢᴏᴏɢʟᴇ\n.ᴡɪᴋɪᴘᴇᴅɪᴀ\n.ʙʀᴀᴠᴇ\n.ғɪʀᴇғᴏx\n.sᴇᴀʀᴄʜᴀʟʟ\n.ɢsᴍᴀʀᴇɴᴀ\n.ᴍᴏᴠɪᴇ\n.ᴛᴠ\n.ᴀɴɪᴍᴇ\n.ᴋᴇɴʏᴀɴᴇᴡs\n.ɴᴇᴡs\n\n`;

        // ==================== FUN ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🎭 ғᴜɴ             ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴊᴏᴋᴇ\n.ǫᴜᴏᴛᴇ\n.ᴡᴀɪғᴜ\n.ɴᴇᴋᴏ\n.ᴀɴɪᴍᴇǫᴜᴏᴛᴇ\n.ғᴀᴄᴛ\n.ᴇᴍᴏᴊɪᴍɪx\n.ғʟɪᴘᴛᴇxᴛ\n\n`;

        // ==================== ROMANCE ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 💝 ʀᴏᴍᴀɴᴄᴇ         ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ғʟɪʀᴛ\n.ᴘɪᴄᴋᴜᴘʟɪɴᴇ\n.ʀɪᴢᴢ\n.ʟᴏᴠᴇǫᴜᴏᴛᴇ\n.sᴡᴇᴇᴛᴍᴇssᴀɢᴇ\n.ʀᴏᴍᴀɴᴄᴇɪᴍɢ\n.ғʟᴏᴡᴇʀ\n.ʜᴇᴀʀᴛ\n.ʀᴏᴍᴀɴᴄᴇ\n\n`;

        // ==================== RELIGION ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 📖 ʀᴇʟɪɢɪᴏɴ        ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ʙɪʙʟᴇ\n.ǫᴜʀᴀɴ\n.ᴅᴀɪʟʏᴠᴇʀsᴇ\n\n`;

        // ==================== GENERAL ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🛠️ ɢᴇɴᴇʀᴀʟ         ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴘɪɴɢ\n.ᴜᴘᴛɪᴍᴇ\n.ɪɴғᴏ\n.ᴍᴇɴᴜ\n.ᴏᴡɴᴇʀ\n.sᴛᴀᴛᴜs\n.ᴅᴇʙᴜɢ\n.ᴄʜᴀɴɴᴇʟ\n.ᴛʀᴀᴄᴋᴇʀ\n\n`;

        // ==================== FEATURES ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ ⚙️ ғᴇᴀᴛᴜʀᴇs         ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴀɴᴛɪᴅᴇʟᴇᴛᴇ\n.ᴀɴᴛɪᴄᴀʟʟ\n.ᴀɴᴛɪʟɪɴᴋ\n.ᴀᴜᴛᴏʀᴇᴀᴄᴛ\n.ᴀᴜᴛᴏʀᴇᴀᴅ\n.ᴀᴜᴛᴏʙɪᴏ\n.ᴘʀᴇsᴇɴᴄᴇ\n.sᴇᴛᴍsɢ\n\n`;

        // ==================== VIEW ONCE ====================
        menu += `▗▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▖\n`;
        menu += `▐ 🔐 ᴠɪᴇᴡ ᴏɴᴄᴇ       ▌\n`;
        menu += `▝▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▘\n`;
        menu += `.ᴠᴠ\n.ᴠᴠ𝟸\n\n`;

        // Footer
        menu += `╔═══════════════════════╗\n`;
        menu += `║  𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐌𝐄𝐆𝐀𝐍  ║\n`;
        menu += `╚═══════════════════════╝\n`;
        menu += `      ✨ created by wanga ✨`;

        await sock.sendMessage(from, {
            text: menu
        }, { quoted: msg });
    }
});

// ==================== OWNER COMMAND ====================
commands.push({
    name: 'owner',
    description: 'Show owner information',
    aliases: ['creator'],
    async execute({ msg, from, sender, bot, sock }) {
        const ownerInfo = `👑 *Owner Information*\n\n` +
                         `📛 Name: ${config.OWNER_NAME}\n` +
                         `📞 Phone: ${config.OWNER_NUMBER}\n` +
                         `🌍 Country: Kenya\n\n` +
                         `> created by wanga`;

        await sock.sendMessage(from, {
            text: ownerInfo
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
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const memory = process.memoryUsage();
        const usedMB = Math.round(memory.heapUsed / 1024 / 1024);
        
        const status = `📊 *Bot Status*\n\n` +
                      `⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                      `💾 Memory: ${usedMB}MB\n` +
                      `📚 Commands: ${bot.commands.size}\n` +
                      `📡 Connection: Connected ✅\n` +
                      `⚡ Node: ${process.version}\n\n` +
                      `> created by wanga`;

        await sock.sendMessage(from, {
            text: status
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
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const debugInfo = `🔧 *Debug Info*\n\n` +
                         `Bot: ${config.BOT_NAME}\n` +
                         `Owner: ${config.OWNER_NAME}\n` +
                         `Prefix: ${config.PREFIX}\n` +
                         `Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                         `Node: ${process.version}\n` +
                         `Platform: ${process.platform}\n` +
                         `Commands: ${bot.commands.size}\n\n` +
                         `> created by wanga`;

        await sock.sendMessage(from, {
            text: debugInfo
        }, { quoted: msg });
    }
});

// ==================== CHANNEL COMMAND ====================
commands.push({
    name: 'channel',
    description: 'Get official WhatsApp channel link',
    aliases: ['newsletter', 'updates'],
    async execute({ msg, from, sender, bot, sock }) {
        const channelText = `📢 *Official Channel*\n\n` +
                           `Join our WhatsApp Channel for updates:\n\n` +
                           `🔗 https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b\n\n` +
                           `> created by wanga`;

        await sock.sendMessage(from, {
            text: channelText
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
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            let statText = `📊 *Database Statistics*\n\n` +
                          `📨 Commands Run: ${stats.totalCommands}\n` +
                          `👥 Users: ${stats.totalUsers}\n` +
                          `👥 Groups: ${stats.totalGroups}\n` +
                          `⏱️ Uptime: ${hours}h ${minutes}m\n\n` +
                          `> created by wanga`;

            await sock.sendMessage(from, {
                text: statText
            }, { quoted: msg });
        } catch (error) {
            console.error('Tracker error:', error);
            await sock.sendMessage(from, { 
                text: '❌ Error getting tracker stats.' 
            }, { quoted: msg });
        }
    }
});

module.exports = { commands };