const axios = require('axios');

const config = require('../../megan/config');

const CHANNEL_JID = "120363423423870584@newsletter";

const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b";

const BOT_IMAGE = "https://files.catbox.moe/u29yah.jpg";

const createNewsletterContext = (userJid, options = {}) => ({

    contextInfo: {

        mentionedJid: [userJid],

        forwardingScore: 999,

        isForwarded: false,

        forwardedNewsletterMessageInfo: {

            newsletterJid: CHANNEL_JID,

            newsletterName: options.newsletterName || config.BOT_NAME,

            serverMessageId: Math.floor(100000 + Math.random() * 900000)

        },

        externalAdReply: {

            title: options.title || config.BOT_NAME,

            body: options.body || "Join channel for updates",

            thumbnailUrl: options.thumbnail || BOT_IMAGE,

            mediaType: 1,

            mediaUrl: CHANNEL_LINK,

            sourceUrl: CHANNEL_LINK,

            showAdAttribution: true,

            renderLargerThumbnail: true

        }

    }

});

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

                caption: `📸 *Screenshot of:* ${url}\n\n> created by wanga`,

                ...createNewsletterContext(sender, {

                    title: "📸 Website Screenshot",

                    body: url.substring(0, 30)

                })

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

