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

            renderLargerThumbnail: false

        }

    }

});

const commands = [];

// Helper for Unsplash images (free, no key)

function getUnsplashImage(query) {

    return `https://source.unsplash.com/featured/?${encodeURIComponent(query)}`;

}

// Helper for romantic images

function getRomanticImage() {

    const queries = ['romantic,couple', 'love,heart', 'rose,flower', 'sunset,romantic', 'candlelight,dinner', 'kiss,romance'];

    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    return getUnsplashImage(randomQuery);

}

// ==================== FLIRT COMMAND ====================

commands.push({

    name: 'flirt',

    description: 'Get a random pickup line',

    aliases: ['pickup', 'flirtline'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('💕');

            

            const fallbacks = [

                "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",

                "Do you have a map? I keep getting lost in your eyes. 🗺️",

                "Is your name Google? Because you have everything I've been searching for. 🔍",

                "Are you made of copper and tellurium? Because you're Cu-Te! 💕",

                "Do you believe in love at first sight, or should I walk by again? 👀",

                "If you were a vegetable, you'd be a 'cute-cumber'! 🥒",

                "Are you a time traveler? Because I see you in my future! ⏰",

                "Your hand looks heavy—can I hold it for you? 🤝",

                "Do you have a Band-Aid? Because I just scraped my knee falling for you! 🩹",

                "Is it hot in here or is it just you? 🔥"

            ];

            const line = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `💕 *FLIRT LINE*\n\n${line}\n\n> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "💕 Flirt Line",

                    body: "Try this one! 😉"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Flirt error:', error);

            await react('❌');

            await reply(`❌ Failed to get flirt line.\n\nTry: ${config.PREFIX}flirt`);

        }

    }

});

// ==================== PICKUP LINE COMMAND ====================

commands.push({

    name: 'pickupline',

    description: 'Get a pickup line',

    aliases: ['pick', 'pline'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('🎯');

            

            const fallbacks = [

                "Are you a campfire? Because you're hot and I want you near me. 🔥",

                "Do you have a pencil? Because I want to erase your past and write our future. ✏️",

                "If you were a fruit, you'd be a 'fine-apple'! 🍍",

                "Are you a bank loan? Because you have my interest! 💰",

                "Do you have a name, or can I call you mine? 💕",

                "Is your dad a boxer? Because you're a knockout! 👊",

                "Are you made of gold? Because you're precious! 🏆",

                "Do you believe in fate? Because I think we're meant to be. ✨"

            ];

            const line = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🎯 *PICKUP LINE*\n\n${line}\n\n> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🎯 Pickup Line",

                    body: "Smooth talker! 😎"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Pickup line error:', error);

            await react('❌');

            await reply(`❌ Failed to get pickup line.\n\nTry: ${config.PREFIX}pickupline`);

        }

    }

});

// ==================== RIZZ COMMAND ====================

commands.push({

    name: 'rizz',

    description: 'Get some "rizz" pickup lines',

    aliases: ['rizzline', 'charisma'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('✨');

            

            const rizzLines = [

                "You must be a parking ticket, because you've got FINE written all over you! 🎫",

                "Are you French? Because Eiffel for you! 🇫🇷",

                "If you were a burger at McDonald's, you'd be the McGorgeous! 🍔",

                "Are you a Wi-Fi signal? Because I'm feeling a connection! 📶",

                "Do you have a mirror in your pocket? Because I can see myself in your pants! 😏",

                "Are you a camera? Every time I look at you, I smile! 📸",

                "If beauty were time, you'd be eternity. ⏳",

                "Are you a dream? Because I never want to wake up. 💭"

            ];

            

            const line = rizzLines[Math.floor(Math.random() * rizzLines.length)];

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `✨ *RIZZ LINE*\n\n${line}\n\n> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "✨ Rizz Line",

                    body: "Game strong! 💪"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Rizz error:', error);

            await react('❌');

            await reply(`❌ Failed to get rizz line.\n\nTry: ${config.PREFIX}rizz`);

        }

    }

});

// ==================== LOVE QUOTE COMMAND ====================

commands.push({

    name: 'lovequote',

    description: 'Get a romantic love quote',

    aliases: ['lquote', 'romancequote'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('❤️');

            

            const fallbacks = [

                { quote: "I love you not because of who you are, but because of who I am when I am with you.", author: "Roy Croft" },

                { quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", author: "Dr. Seuss" },

                { quote: "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.", author: "Angelita Lim" },

                { quote: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },

                { quote: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },

                { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },

                { quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", author: "Dr. Seuss" }

            ];

            

            const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];

            const quote = random.quote;

            const author = random.author;

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `❤️ *LOVE QUOTE*\n\n"${quote}"\n\n- ${author}\n\n> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "❤️ Love Quote",

                    body: author

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Love quote error:', error);

            await react('❌');

            await reply(`❌ Failed to get love quote.\n\nTry: ${config.PREFIX}lovequote`);

        }

    }

});

// ==================== SWEET MESSAGE COMMAND ====================

commands.push({

    name: 'sweetmessage',

    description: 'Get a sweet message for your loved one',

    aliases: ['sweet', 'sweettext'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('🍯');

            

            const sweetMessages = [

                "You're the peanut butter to my jelly! 🥜",

                "You're the reason I look forward to waking up every morning. ☀️",

                "I didn't believe in love at first sight until I met you. 👀",

                "You make my heart skip a beat every time I see you. 💓",

                "Being with you makes every day feel like Valentine's Day. 💝",

                "You're the sweetest thing in my life! 🍯",

                "Every love story is beautiful, but ours is my favorite. 📖",

                "You're the missing piece I've been searching for. 🧩",

                "You're the sugar to my coffee, the honey to my tea! ☕",

                "My love for you grows stronger every single day. 🌱"

            ];

            

            const message = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🍯 *SWEET MESSAGE*\n\n${message}\n\n> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🍯 Sweet Message",

                    body: "Spread the sweetness!"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Sweet message error:', error);

            await react('❌');

            await reply(`❌ Failed to get sweet message.\n\nTry: ${config.PREFIX}sweetmessage`);

        }

    }

});

// ==================== ROMANCE IMAGE COMMAND ====================

commands.push({

    name: 'romanceimg',

    description: 'Get a romantic image',

    aliases: ['rimg', 'loveimg'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('🌹');

            

            const imageUrl = getRomanticImage();

            await sock.sendMessage(from, {

                image: { url: imageUrl },

                caption: `🌹 *Romantic Image*\n\n> created by wanga`,

                ...createNewsletterContext(sender, {

                    title: "🌹 Romantic Image",

                    body: "Love is beautiful"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Romance image error:', error);

            await react('❌');

            await reply(`❌ Failed to get romantic image.\n\nTry: ${config.PREFIX}romanceimg`);

        }

    }

});

// ==================== FLOWER COMMAND ====================

commands.push({

    name: 'flower',

    description: 'Get a beautiful flower image',

    aliases: ['flowers', 'bloom'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('🌸');

            

            const queries = ['rose', 'tulip', 'sunflower', 'lavender', 'cherry blossom', 'orchid'];

            const query = queries[Math.floor(Math.random() * queries.length)];

            const imageUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(query)}`;

            await sock.sendMessage(from, {

                image: { url: imageUrl },

                caption: `🌸 *${query.toUpperCase()} Flower*\n\n> created by wanga`,

                ...createNewsletterContext(sender, {

                    title: "🌸 Flower",

                    body: `Beautiful ${query}`

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Flower error:', error);

            await react('❌');

            await reply(`❌ Failed to get flower image.\n\nTry: ${config.PREFIX}flower`);

        }

    }

});

// ==================== HEART COMMAND ====================

commands.push({

    name: 'heart',

    description: 'Get heart-themed content',

    aliases: ['heartimg', 'heartlove'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        try {

            await react('💖');

            

            const imageUrl = `https://source.unsplash.com/featured/?heart,love,romantic`;

            await sock.sendMessage(from, {

                image: { url: imageUrl },

                caption: `💖 *Heart Image*\n\n> created by wanga`,

                ...createNewsletterContext(sender, {

                    title: "💖 Heart",

                    body: "Spread the love"

                })

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Heart error:', error);

            await react('❌');

            await reply(`❌ Failed to get heart image.\n\nTry: ${config.PREFIX}heart`);

        }

    }

});

// ==================== ROMANCE MENU ====================

commands.push({

    name: 'romance',

    description: 'Show all romance commands',

    aliases: ['lovehelp', 'romancehelp'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('💕');

        

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `*💕 ROMANCE COMMANDS*\n\n` +

                        `*Pickup Lines:*\n` +

                        `• ${config.PREFIX}flirt - Random flirt line\n` +

                        `• ${config.PREFIX}pickupline - Pickup line\n` +

                        `• ${config.PREFIX}rizz - "Rizz" line\n\n` +

                        `*Quotes & Messages:*\n` +

                        `• ${config.PREFIX}lovequote - Romantic love quote\n` +

                        `• ${config.PREFIX}sweetmessage - Sweet message\n\n` +

                        `*Images:*\n` +

                        `• ${config.PREFIX}romanceimg - Romantic image\n` +

                        `• ${config.PREFIX}flower - Flower image\n` +

                        `• ${config.PREFIX}heart - Heart image\n\n` +

                        `> created by wanga`;

        

        await sock.sendMessage(from, {

            text: helpText,

            ...createNewsletterContext(sender, {

                title: "💕 Romance Commands",

                body: "Love & romance features"

            })

        }, { quoted: msg });

        await react('✅');

    }

});

module.exports = { commands };

