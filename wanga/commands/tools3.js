// wanga/commands/tools3.js

const axios = require('axios');

const math = require('mathjs');

const googleTTS = require("google-tts-api");

const { exec } = require('child_process');

const fs = require('fs-extra');

const path = require('path');

const config = require('../../megan/config');

const CHANNEL_JID = "120363423423870584@newsletter";

const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b";

const BOT_IMAGE = "https://files.catbox.moe/u29yah.jpg";

const createNewsletterContext = (userJid, options = {}) => ({

    contextInfo: {

        mentionedJid: [userJid],

        forwardingScore: 999,

        isForwarded: true,

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

// Temp directory

const TEMP_DIR = path.join(__dirname, '../../temp');

fs.ensureDirSync(TEMP_DIR);

const commands = [];

// ==================== 1. BROWSE COMMAND ====================

commands.push({

    name: 'browse',

    description: 'Fetch and display webpage content',

    aliases: ['fetch', 'geturl'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('🌐');

            return reply(`🌐 *BROWSE WEB*\n\nUsage: ${config.PREFIX}browse <url>\nExample: ${config.PREFIX}browse https://example.com`);

        }

        const url = args[0];

        if (!url.startsWith('http')) {

            return reply('❌ Please include http:// or https://');

        }

        await react('🌐');

        try {

            const response = await axios.get(url, {

                timeout: 10000,

                headers: { 'User-Agent': 'Mozilla/5.0' }

            });

            const contentType = response.headers['content-type'] || '';

            

            if (contentType.includes('application/json')) {

                const jsonData = JSON.stringify(response.data, null, 2);

                const truncated = jsonData.length > 4000 

                    ? jsonData.substring(0, 4000) + '...\n\n(Content truncated)'

                    : jsonData;

                

                await sock.sendMessage(from, {

                    text: `🌐 *JSON Response:*\n\n\`\`\`${truncated}\`\`\``,

                    ...createNewsletterContext(sender, {

                        title: "🌐 JSON Data",

                        body: url.substring(0, 30)

                    })

                }, { quoted: msg });

            } else {

                const textData = typeof response.data === 'string' 

                    ? response.data 

                    : JSON.stringify(response.data);

                

                const truncated = textData.length > 4000 

                    ? textData.substring(0, 4000) + '...\n\n(Content truncated)'

                    : textData;

                

                await sock.sendMessage(from, {

                    text: `🌐 *Webpage Content:*\n\n${truncated}`,

                    ...createNewsletterContext(sender, {

                        title: "🌐 Web Content",

                        body: url.substring(0, 30)

                    })

                }, { quoted: msg });

            }

            await react('✅');

        } catch (error) {

            bot.logger.error('Browse error:', error);

            await react('❌');

            await reply(`❌ Error fetching URL: ${error.message}`);

        }

    }

});

// ==================== 2. CALCULATE COMMAND ====================

commands.push({

    name: 'calculate',

    description: 'Solve math equations',

    aliases: ['calc', 'math', 'solve'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('🧮');

            return reply(`🧮 *CALCULATOR*\n\nUsage: ${config.PREFIX}calc <equation>\nExamples:\n• ${config.PREFIX}calc 2 + 2\n• ${config.PREFIX}calc sqrt(16)\n• ${config.PREFIX}calc sin(30deg)\n• ${config.PREFIX}calc 5^3`);

        }

        const equation = args.join(' ').replace(/×/g, '*').replace(/÷/g, '/');

        await react('🧮');

        try {

            const result = math.evaluate(equation);

            

            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            resultText += `🧮 *CALCULATION*\n\n`;

            resultText += `📝 *Equation:* ${equation}\n`;

            resultText += `✅ *Result:* ${result}\n\n`;

            resultText += `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🧮 Calculation Result",

                    body: `${equation} = ${result}`

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            await react('❌');

            await reply(`❌ Invalid equation: ${error.message}`);

        }

    }

});

// ==================== 3. GET PROFILE PIC ====================

commands.push({

    name: 'getpp',

    description: 'Get user profile picture',

    aliases: ['profilepic', 'pp'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let target = sender;

        

        // Check if replying to someone

        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

            target = msg.message.extendedTextMessage.contextInfo.participant;

        } else if (args[0]) {

            // Check if mentioned

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

                target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

            } else {

                // Try to parse as phone number

                let phone = args[0].replace(/\D/g, '');

                if (phone) {

                    target = phone + '@s.whatsapp.net';

                }

            }

        }

        await react('🖼️');

        try {

            const ppUrl = await sock.profilePictureUrl(target, 'image');

            

            await sock.sendMessage(from, {

                image: { url: ppUrl },

                caption: `🖼️ *Profile Picture*\n👤 @${target.split('@')[0]}`,

                mentions: [target],

                ...createNewsletterContext(sender, {

                    title: "🖼️ Profile Picture",

                    body: `@${target.split('@')[0]}`

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            // Send default image if no profile pic

            await sock.sendMessage(from, {

                image: { url: 'https://files.catbox.moe/u29yah.jpg' },

                caption: `⚠️ No profile picture found for @${target.split('@')[0]}`,

                mentions: [target],

                ...createNewsletterContext(sender, {

                    title: "🖼️ No Profile Pic",

                    body: "Using default image"

                })

            }, { quoted: msg });

            

            await react('✅');

        }

    }

});

// ==================== 4. GET ABOUT/BIO ====================

commands.push({

    name: 'getabout',

    description: 'Get user about/bio',

    aliases: ['bio', 'about'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let target = sender;

        

        if (msg.message?.extendedTextMessage?.contextInfo?.participant) {

            target = msg.message.extendedTextMessage.contextInfo.participant;

        } else if (args[0]) {

            if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

                target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

            } else {

                let phone = args[0].replace(/\D/g, '');

                if (phone) {

                    target = phone + '@s.whatsapp.net';

                }

            }

        }

        await react('📝');

        try {

            const { status, setAt } = await sock.fetchStatus(target);

            const date = new Date(setAt).toLocaleString('en-KE', {

                dateStyle: 'full',

                timeStyle: 'short'

            });

            const aboutText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📝 *ABOUT INFO*\n\n` +

                             `👤 *User:* @${target.split('@')[0]}\n` +

                             `💬 *About:* ${status}\n` +

                             `🕒 *Set at:* ${date}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: aboutText,

                mentions: [target],

                ...createNewsletterContext(sender, {

                    title: "📝 User About",

                    body: status.substring(0, 30)

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            await react('❌');

            await reply(`❌ Could not fetch about info. User may have privacy settings.`);

        }

    }

});

// ==================== 5. EMOJI MIX ====================

commands.push({

    name: 'emojimix',

    description: 'Mix two emojis together',

    aliases: ['emix', 'emojimix'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length < 1 || !args[0].includes('+')) {

            await react('😊');

            return reply(`😊 *EMOJI MIX*\n\nUsage: ${config.PREFIX}emojimix 😅+🤔\nExample: ${config.PREFIX}emojimix 🐱+🐶`);

        }

        const [emoji1, emoji2] = args[0].split('+').map(e => e.trim());

        

        if (!emoji1 || !emoji2) {

            return reply('❌ Please provide two emojis separated by +');

        }

        await react('🎨');

        try {

            const response = await axios.get(

                `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`,

                { timeout: 10000 }

            );

            if (!response.data.results || !response.data.results.length) {

                return reply('❌ Could not mix these emojis. Try different ones.');

            }

            const result = response.data.results[0];

            

            await sock.sendMessage(from, {

                image: { url: result.url },

                caption: `🎨 *Emoji Mix*\n${emoji1} + ${emoji2}`,

                ...createNewsletterContext(sender, {

                    title: "🎨 Emoji Mix",

                    body: `${emoji1}+${emoji2}`

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Emoji mix error:', error);

            await react('❌');

            await reply('❌ Failed to mix emojis. Try again later.');

        }

    }

});

// ==================== 6. FLIP TEXT ====================

commands.push({

    name: 'fliptext',

    description: 'Flip text upside down',

    aliases: ['flip', 'upsidedown'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('🔄');

            return reply(`🔄 *FLIP TEXT*\n\nUsage: ${config.PREFIX}fliptext <text>\nExample: ${config.PREFIX}fliptext Hello World`);

        }

        const text = args.join(' ');

        const flipMap = {

            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',

            'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',

            'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',

            'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': '𐐒', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'Ⅎ',

            'G': '⅁', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '⅂', 'M': 'W', 'N': 'N',

            'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴚ', 'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ',

            'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ',

            '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '!': '¡', '?': '¿',

            '.': '˙', ',': '\'', '"': '„', '\'': ',', '(': ')', ')': '(', '[': ']', ']': '[',

            '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'

        };

        const flipped = text.split('').map(char => flipMap[char] || char).reverse().join('');

        const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                          `🔄 *FLIPPED TEXT*\n\n` +

                          `*Original:* ${text}\n\n` +

                          `*Flipped:* ${flipped}\n\n` +

                          `> created by wanga`;

        await sock.sendMessage(from, {

            text: resultText,

            ...createNewsletterContext(sender, {

                title: "🔄 Flipped Text",

                body: text.substring(0, 20)

            })

        }, { quoted: msg });

        await react('✅');

    }

});

// ==================== 7. GSM ARENA ====================

commands.push({

    name: 'gsmarena',

    description: 'Search smartphone specs',

    aliases: ['gsm', 'phonespec'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('📱');

            return reply(`📱 *GSM ARENA*\n\nUsage: ${config.PREFIX}gsmarena <phone name>\nExample: ${config.PREFIX}gsmarena Samsung S23`);

        }

        const query = args.join(' ');

        await react('📱');

        try {

            const response = await axios.get(`https://api.siputzx.my.id/api/s/gsmarena?query=${encodeURIComponent(query)}`, {

                timeout: 15000

            });

            if (!response.data?.status || !response.data.data || !response.data.data.length) {

                return reply('❌ No phones found. Try another model.');

            }

            const results = response.data.data.slice(0, 5);

            

            let resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

            resultText += `📱 *GSM ARENA RESULTS*\n\n`;

            resultText += `*Search:* ${query}\n`;

            resultText += `*Found:* ${response.data.data.length} phones\n`;

            resultText += `━━━━━━━━━━━━━━━━━━━\n\n`;

            results.forEach((phone, i) => {

                resultText += `*${i+1}. ${phone.name}*\n`;

                resultText += `📝 ${phone.description}\n`;

                if (phone.thumbnail) resultText += `🖼️ ${phone.thumbnail}\n`;

                resultText += `\n`;

            });

            resultText += `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "📱 GSM Arena",

                    body: `${results.length} results`

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('GSM Arena error:', error);

            await react('❌');

            await reply('❌ Failed to search phones. Try again later.');

        }

    }

});

// ==================== 8. DETECT DEVICE ====================

commands.push({

    name: 'device',

    description: 'Detect device of a message',

    aliases: ['getdevice'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        

        if (!quoted) {

            await react('📱');

            return reply(`📱 *DETECT DEVICE*\n\nUsage: Reply to any message with ${config.PREFIX}device`);

        }

        await react('📱');

        try {

            // Get message ID from quoted

            const messageId = msg.message.extendedTextMessage.contextInfo.stanzaId;

            

            // Common device signatures

            const deviceSignatures = [

                { pattern: '3A0', name: 'WhatsApp Web' },

                { pattern: '3A1', name: 'iPhone' },

                { pattern: '3A2', name: 'iPad' },

                { pattern: '3A3', name: 'Android' },

                { pattern: '3A4', name: 'Windows Phone' },

                { pattern: '3A5', name: 'BlackBerry' },

                { pattern: '3A6', name: 'Nokia' },

                { pattern: '3A7', name: 'Windows 10' },

                { pattern: '3A8', name: 'macOS' },

                { pattern: '3A9', name: 'Linux' },

                { pattern: '3AA', name: 'Samsung' },

                { pattern: '3AB', name: 'Huawei' },

                { pattern: '3AC', name: 'Xiaomi' },

                { pattern: '3AD', name: 'Oppo' },

                { pattern: '3AE', name: 'Vivo' },

                { pattern: '3AF', name: 'Google Pixel' }

            ];

            let device = 'Unknown';

            const idPrefix = messageId.substring(0, 3);

            

            for (const sig of deviceSignatures) {

                if (idPrefix === sig.pattern) {

                    device = sig.name;

                    break;

                }

            }

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                              `📱 *DEVICE DETECTION*\n\n` +

                              `🆔 *Message ID:* ${messageId}\n` +

                              `📱 *Device:* ${device}\n\n` +

                              `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "📱 Device Detected",

                    body: device

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Device detection error:', error);

            await react('❌');

            await reply('❌ Could not detect device.');

        }

    }

});

// ==================== 9. TINYURL SHORTENER ====================

commands.push({

    name: 'tinyurl',

    description: 'Shorten URLs',

    aliases: ['short', 'shortlink'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            await react('🔗');

            return reply(`🔗 *URL SHORTENER*\n\nUsage: ${config.PREFIX}tinyurl <url>\nExample: ${config.PREFIX}tinyurl https://example.com`);

        }

        const url = args[0];

        if (!url.startsWith('http')) {

            return reply('❌ Please include http:// or https://');

        }

        await react('🔗');

        try {

            const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`, {

                timeout: 10000

            });

            const shortUrl = response.data;

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                              `🔗 *URL SHORTENED*\n\n` +

                              `*Original:* ${url}\n\n` +

                              `*Short:* ${shortUrl}\n\n` +

                              `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🔗 Short URL",

                    body: shortUrl

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('TinyURL error:', error);

            await react('❌');

            await reply('❌ Failed to shorten URL.');

        }

    }

});

// ==================== 10. UPLOAD MEDIA ====================

commands.push({

    name: 'tourl',

    description: 'Upload media to Catbox',

    aliases: ['upload', 'url'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const hasImage = msg.message?.imageMessage || quoted?.imageMessage;

        const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;

        const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;

        const hasDocument = msg.message?.documentMessage || quoted?.documentMessage;

        

        if (!hasImage && !hasVideo && !hasAudio && !hasDocument) {

            await react('📤');

            return reply(`📤 *UPLOAD MEDIA*\n\nUsage: Reply to any media with ${config.PREFIX}upload\n\nUploads to Catbox.moe and returns URL.`);

        }

        await react('📤');

        try {

            const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage || 

                             msg.message?.audioMessage || msg.message?.documentMessage 

                             ? msg : { ...msg, message: quoted };

            

            const { downloadMediaMessage } = require('gifted-baileys');

            const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, { logger: console });

            

            const formData = new FormData();

            formData.append('reqtype', 'fileupload');

            formData.append('fileToUpload', buffer, { filename: 'media.jpg' });

            const uploadResponse = await axios.post('https://catbox.moe/user/api.php', formData, {

                headers: formData.getHeaders()

            });

            const url = uploadResponse.data.trim();

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                              `📤 *MEDIA UPLOADED*\n\n` +

                              `🔗 *URL:* ${url}\n\n` +

                              `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "📤 Media Uploaded",

                    body: "Link generated"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Upload error:', error);

            await react('❌');

            await reply(`❌ Upload failed: ${error.message}`);

        }

    }

});

module.exports = { commands };