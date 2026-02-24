const axios = require('axios');
const config = require('../../megan/config');

const commands = [];

// Fixed romantic image URL
const ROMANCE_IMAGE = 'https://files.catbox.moe/o0gsoj.png';

// Love quotes collection
const LOVE_QUOTES = [
    { quote: "I love you not because of who you are, but because of who I am when I am with you.", author: "Roy Croft" },
    { quote: "You know you're in love when you can't fall asleep because reality is finally better than your dreams.", author: "Dr. Seuss" },
    { quote: "I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.", author: "Angelita Lim" },
    { quote: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
    { quote: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
    { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
    { quote: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.", author: "Maya Angelou" },
    { quote: "I have waited for this opportunity for more than half a century, to repeat to you once again my vow of eternal fidelity and everlasting love.", author: "Gabriel García Márquez" },
    { quote: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.", author: "Maya Angelou" },
    { quote: "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves.", author: "Victor Hugo" }
];

// Flirt lines collection
const FLIRT_LINES = [
    "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",
    "Do you have a map? I keep getting lost in your eyes. 🗺️",
    "Is your name Google? Because you have everything I've been searching for. 🔍",
    "Are you made of copper and tellurium? Because you're Cu-Te! 💕",
    "Do you believe in love at first sight, or should I walk by again? 👀",
    "If you were a vegetable, you'd be a 'cute-cumber'! 🥒",
    "Are you a time traveler? Because I see you in my future! ⏰",
    "Your hand looks heavy—can I hold it for you? 🤝",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you! 🩹",
    "Is it hot in here or is it just you? 🔥",
    "Are you a parking ticket? Because you've got FINE written all over you! 🎫",
    "If you were a fruit, you'd be a fine-apple! 🍍",
    "Are you a Wi-Fi signal? Because I'm feeling a strong connection! 📶",
    "Do you have a name, or can I call you mine? 💕"
];

// Pickup lines collection
const PICKUP_LINES = [
    "Are you a campfire? Because you're hot and I want you near me. 🔥",
    "Do you have a pencil? Because I want to erase your past and write our future. ✏️",
    "If you were a fruit, you'd be a 'fine-apple'! 🍍",
    "Are you a bank loan? Because you have my interest! 💰",
    "Do you have a name, or can I call you mine? 💕",
    "Is your dad a boxer? Because you're a knockout! 👊",
    "Are you made of gold? Because you're precious! 🏆",
    "Do you believe in fate? Because I think we're meant to be. ✨",
    "Are you French? Because Eiffel for you! 🇫🇷",
    "If you were a burger at McDonald's, you'd be the McGorgeous! 🍔",
    "Are you a camera? Every time I look at you, I smile! 📸",
    "If beauty were time, you'd be eternity. ⏳",
    "Are you a dream? Because I never want to wake up. 💭"
];

// Rizz lines collection
const RIZZ_LINES = [
    "You must be a parking ticket, because you've got FINE written all over you! 🎫",
    "Are you French? Because Eiffel for you! 🇫🇷",
    "If you were a burger at McDonald's, you'd be the McGorgeous! 🍔",
    "Are you a Wi-Fi signal? Because I'm feeling a connection! 📶",
    "Do you have a mirror in your pocket? Because I can see myself in your pants! 😏",
    "Are you a camera? Every time I look at you, I smile! 📸",
    "If beauty were time, you'd be eternity. ⏳",
    "Are you a dream? Because I never want to wake up. 💭",
    "Are you a magician? Because whenever I look at you, everyone else disappears! ✨",
    "Is your name Google? Because you have everything I've been searching for. 🔍"
];

// Sweet messages collection
const SWEET_MESSAGES = [
    "You're the peanut butter to my jelly! 🥜",
    "You're the reason I look forward to waking up every morning. ☀️",
    "I didn't believe in love at first sight until I met you. 👀",
    "You make my heart skip a beat every time I see you. 💓",
    "Being with you makes every day feel like Valentine's Day. 💝",
    "You're the sweetest thing in my life! 🍯",
    "Every love story is beautiful, but ours is my favorite. 📖",
    "You're the missing piece I've been searching for. 🧩",
    "You're the sugar to my coffee, the honey to my tea! ☕",
    "My love for you grows stronger every single day. 🌱",
    "You're the sunshine that brightens my darkest days. ☀️",
    "Being with you feels like coming home. 🏠",
    "You're the best thing that's ever happened to me. 💝",
    "Every moment with you is a treasure. 💎",
    "You're my favorite hello and hardest goodbye. 👋"
];

// Compliments collection
const COMPLIMENTS = [
    "You have an amazing smile! 😊",
    "You're incredibly thoughtful and kind. 💭",
    "Your energy is contagious in the best way! ⚡",
    "You're smarter than you give yourself credit for. 🧠",
    "You light up every room you walk into. ✨",
    "You have excellent taste! 👌",
    "You're a great listener. 👂",
    "Your creativity is inspiring! 🎨",
    "You're stronger than you know. 💪",
    "You make the world a better place. 🌍"
];

// Valentine messages collection
const VALENTINE_MESSAGES = [
    "Roses are red, violets are blue, sugar is sweet, and so are you! 🌹",
    "You're the Valentine I've always dreamed of. 💘",
    "Every day with you feels like Valentine's Day. 💝",
    "You stole my heart, but I'll let you keep it. 💕",
    "Be my Valentine and make my heart complete! 💖",
    "You're the candy to my heart! 🍬",
    "I love you more than chocolate! 🍫",
    "You're my favorite Valentine! 💗"
];

// Proposal ideas collection
const PROPOSALS = [
    "Will you be the reason I smile every day? 💑",
    "I want to spend the rest of my life with you. Will you marry me? 💍",
    "You're the missing piece I've been searching for. Let's complete the puzzle together? 🧩",
    "Every love story is special, but I want ours to be forever. Say you'll be mine? 💕",
    "I didn't believe in forever, but then I met you. Will you be my forever? ⏳",
    "You're my today and all of my tomorrows. Will you make me the happiest person? 💝",
    "I love you more than pizza, and that's saying something! 🍕",
    "Let's get married and annoy each other for the rest of our lives! 😂",
    "I want to grow old with you. Will you be my partner in crime? 👴👵",
    "You're the peanut butter to my jelly. Let's stick together forever! 🥜"
];

// Helper to create romantic text box
function createRomanticBox(title, content, footer = '> created by wanga') {
    return `┏━━━━━━━━━━━━━━━━━━━┓\n` +
           `┃ *${config.BOT_NAME}*\n` +
           `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
           `${title}\n\n` +
           `${content}\n\n` +
           `━━━━━━━━━━━━━━━━━━━\n` +
           `${footer}`;
}

// ==================== FLIRT COMMAND ====================
commands.push({
    name: 'flirt',
    description: 'Get a random flirt line',
    aliases: ['flirtline', 'flirtwith'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('💕');
            
            const name = args.length ? args.join(' ') : '';
            let line = FLIRT_LINES[Math.floor(Math.random() * FLIRT_LINES.length)];
            
            if (name) {
                line = line.replace('you', name).replace('You', name);
            }
            
            const resultText = createRomanticBox(
                `💕 *FLIRT LINE*`,
                line,
                `> created by wanga`
            );
            
            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: resultText
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
    aliases: ['pickup', 'pline'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('🎯');
            
            const name = args.length ? args.join(' ') : '';
            let line = PICKUP_LINES[Math.floor(Math.random() * PICKUP_LINES.length)];
            
            if (name) {
                line = line.replace('you', name).replace('You', name);
            }
            
            const resultText = createRomanticBox(
                `🎯 *PICKUP LINE*`,
                line,
                `> created by wanga`
            );
            
            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: resultText
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
            
            const name = args.length ? args.join(' ') : '';
            let line = RIZZ_LINES[Math.floor(Math.random() * RIZZ_LINES.length)];
            
            if (name) {
                line = line.replace('you', name).replace('You', name);
            }
            
            const resultText = createRomanticBox(
                `✨ *RIZZ LINE*`,
                line,
                `> created by wanga`
            );
            
            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: resultText
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
            
            const random = LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];
            
            const resultText = createRomanticBox(
                `❤️ *LOVE QUOTE*`,
                `"${random.quote}"\n\n- ${random.author}`,
                `> created by wanga`
            );
            
            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: resultText
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
            
            const name = args.length ? args.join(' ') : '';
            let message = SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];
            
            if (name) {
                message = message.replace("You're", `${name}, you're`).replace("you", name);
            }
            
            const resultText = createRomanticBox(
                `🍯 *SWEET MESSAGE*`,
                message,
                `> created by wanga`
            );
            
            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: resultText
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
            
            const caption = `🌹 *Romantic Image*\n\n> created by wanga`;

            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: caption
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
            
            const flowerTypes = ['Rose', 'Tulip', 'Sunflower', 'Lavender', 'Cherry Blossom', 'Orchid', 'Lily', 'Daisy', 'Lotus'];
            const flower = args.length ? args.join(' ') : flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
            
            const caption = `🌸 *${flower.toUpperCase()}*\n\n> created by wanga`;

            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: caption
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
    description: 'Get heart-themed images',
    aliases: ['heartimg', 'heartlove'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('💖');
            
            const caption = `💖 *Heart Image*\n\n> created by wanga`;

            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: caption
            }, { quoted: msg });
            
            await react('✅');
        } catch (error) {
            bot.logger.error('Heart error:', error);
            await react('❌');
            await reply(`❌ Failed to get heart image.\n\nTry: ${config.PREFIX}heart`);
        }
    }
});

// ==================== VALENTINE COMMAND ====================
commands.push({
    name: 'valentine',
    description: 'Get Valentine-themed content',
    aliases: ['valentines', 'vday'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('💝');
            
            const message = VALENTINE_MESSAGES[Math.floor(Math.random() * VALENTINE_MESSAGES.length)];
            
            const caption = `💝 *Valentine's Day*\n\n${message}\n\n> created by wanga`;

            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: caption
            }, { quoted: msg });
            
            await react('✅');
        } catch (error) {
            bot.logger.error('Valentine error:', error);
            await react('❌');
            await reply(`❌ Failed to get Valentine content.\n\nTry: ${config.PREFIX}valentine`);
        }
    }
});

// ==================== COMPLIMENT COMMAND ====================
commands.push({
    name: 'compliment',
    description: 'Get a random compliment',
    aliases: ['comp', 'complimentme'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('🌟');
            
            const name = args.length ? args.join(' ') : 'you';
            let compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
            
            if (name !== 'you') {
                compliment = `${name}, ` + compliment.toLowerCase();
            }
            
            const resultText = createRomanticBox(
                `🌟 *COMPLIMENT*`,
                compliment,
                `> created by wanga`
            );
            
            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: resultText
            }, { quoted: msg });
            
            await react('✅');
        } catch (error) {
            bot.logger.error('Compliment error:', error);
            await react('❌');
            await reply(`❌ Failed to get compliment.\n\nTry: ${config.PREFIX}compliment`);
        }
    }
});

// ==================== PROPOSE COMMAND ====================
commands.push({
    name: 'propose',
    description: 'Get creative proposal ideas',
    aliases: ['proposal', 'marry'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            await react('💍');
            
            const name = args.length ? args.join(' ') : '';
            let proposal = PROPOSALS[Math.floor(Math.random() * PROPOSALS.length)];
            
            if (name) {
                proposal = `${name}, ` + proposal.toLowerCase();
            }
            
            const caption = `💍 *Proposal Idea*\n\n${proposal}\n\n> created by wanga`;

            await sock.sendMessage(from, {
                image: { url: ROMANCE_IMAGE },
                caption: caption
            }, { quoted: msg });
            
            await react('✅');
        } catch (error) {
            bot.logger.error('Propose error:', error);
            await react('❌');
            await reply(`❌ Failed to get proposal idea.\n\nTry: ${config.PREFIX}propose`);
        }
    }
});

// ==================== ROMANCE HELP MENU ====================
commands.push({
    name: 'romance',
    description: 'Show all romance commands',
    aliases: ['lovehelp', 'romancehelp', 'love'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        await react('💕');
        
        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                        `┃ *${config.BOT_NAME}*\n` +
                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                        `*💕 ROMANCE COLLECTION*\n\n` +
                        `━━━━━━━━━━━━━━━━━━━\n\n` +
                        
                        `*💬 TEXT COMMANDS*\n` +
                        `• ${config.PREFIX}flirt [name] - Flirt lines\n` +
                        `• ${config.PREFIX}pickupline [name] - Pickup lines\n` +
                        `• ${config.PREFIX}rizz [name] - Rizz lines\n` +
                        `• ${config.PREFIX}lovequote - Love quotes\n` +
                        `• ${config.PREFIX}sweetmessage [name] - Sweet messages\n` +
                        `• ${config.PREFIX}compliment [name] - Compliments\n` +
                        `• ${config.PREFIX}propose [name] - Proposal ideas\n\n` +
                        
                        `*🖼️ IMAGE COMMANDS*\n` +
                        `• ${config.PREFIX}romanceimg - Romantic image\n` +
                        `• ${config.PREFIX}flower [name] - Flower image\n` +
                        `• ${config.PREFIX}heart - Heart image\n` +
                        `• ${config.PREFIX}valentine - Valentine content\n\n` +
                        
                        `━━━━━━━━━━━━━━━━━━━\n` +
                        `> created by wanga`;

        await sock.sendMessage(from, {
            image: { url: ROMANCE_IMAGE },
            caption: helpText
        }, { quoted: msg });
        
        await react('✅');
    }
});

module.exports = { commands };