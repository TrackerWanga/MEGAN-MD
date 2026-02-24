const axios = require('axios');
const config = require('../../megan/config');

const commands = [];

// ==================== SCREENSHOT WEBSITE ====================
commands.push({
    name: 'ssweb',
    description: 'Take screenshot of website',
    aliases: ['ss', 'screenshot', 'webss'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            if (!args.length) {
                await react('📸');
                return reply(`📸 *WEBSITE SCREENSHOT*\n\n*Usage:* ${config.PREFIX}ssweb <URL>\n*Example:* ${config.PREFIX}ssweb https://youtube.com\n*Example:* ${config.PREFIX}ssweb https://google.com\n\n*Returns:* Direct screenshot image`);
            }

            let url = args[0];
            
            // Add https:// if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            await react('📸');
            
            await reply(`📸 *Taking screenshot of:*\n${url}\n\nPlease wait...`);

            const response = await axios.get(`${config.API.ELITE_PROTECH}/ssweb`, {
                params: { url: encodeURIComponent(url) },
                timeout: 30000,
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            const imageBuffer = Buffer.from(response.data);

            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `📸 *Screenshot of:* ${url}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('SSWeb error:', error);
            await react('❌');
            await reply(`❌ Failed to take screenshot.\n\nMake sure the URL is valid and accessible.\n\nTry: ${config.PREFIX}ssweb https://google.com`);
        }
    }
});

module.exports = { commands };