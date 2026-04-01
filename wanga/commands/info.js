// Info Command

const config = require('../../megan/config');
const os = require('os');

const commands = [];

commands.push({
    name: 'info',
    description: 'Show bot information',
    aliases: ['bot', 'status'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const dateStr = now.toLocaleDateString();
        
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const totalMem = os.totalmem() / (1024 * 1024 * 1024);
        const freeMem = os.freemem() / (1024 * 1024 * 1024);
        const usedMem = (totalMem - freeMem).toFixed(2);
        
        const infoText = `*📱 BOT INFO*\n\n` +
            `👤 *Owner:* ${config.OWNER_NAME}\n` +
            `📞 *Phone:* ${config.OWNER_NUMBER}\n` +
            `🤖 *Bot:* ${config.BOT_NAME}\n` +
            `🔧 *Prefix:* ${config.PREFIX}\n` +
            `⚙️ *Mode:* ${config.MODE}\n` +
            `📚 *Commands:* ${bot.commands.size}\n` +
            `⏱️ *Uptime:* ${days}d ${hours}h ${minutes}m\n` +
            `🕒 *Time:* ${timeStr}\n` +
            `📅 *Date:* ${dateStr}\n` +
            `💾 *RAM:* ${usedMem}GB/${totalMem.toFixed(2)}GB\n\n` +
            `> created by wanga`;
        
        await sock.sendMessage(from, { text: infoText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };
