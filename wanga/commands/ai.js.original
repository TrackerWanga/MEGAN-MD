// MEGAN-MD AI Commands - Clean with typing effect

const config = require('../../megan/config');
const AIHandler = require('../../megan/lib/aiHandler');
const { downloadMediaMessage } = require('gifted-baileys');
const uploader = require('../../megan/lib/upload');

const commands = [];
let aiHandler = null;

const initializeAI = (bot) => {
    if (!aiHandler) {
        aiHandler = new AIHandler(bot);
        console.log('✅ AI Handler initialized');
    }
    return aiHandler;
};

// Helper to extract image from quoted message
const getQuotedImage = async (msg, sock) => {
    try {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return null;

        if (quoted.imageMessage) {
            const buffer = await downloadMediaMessage(
                { key: { id: msg.message.extendedTextMessage.contextInfo.stanzaId }, message: quoted },
                'buffer',
                {},
                { logger: console }
            );
            
            const filename = `gemini_img_${Date.now()}.jpg`;
            const { url } = await uploader.uploadAuto(buffer, filename);
            return url;
        }
        return null;
    } catch (error) {
        console.error('Error extracting quoted image:', error);
        return null;
    }
};

// Helper to show typing effect
const showTyping = async (sock, jid) => {
    try {
        await sock.sendPresenceUpdate('composing', jid);
    } catch (error) {
        // Silent fail
    }
};

// ==================== MEGAN AI ====================
commands.push({
    name: 'megan',
    description: 'Chat with Megan AI',
    aliases: ['meganai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`*🤖 MEGAN AI*\n\n*Usage:*\n${config.PREFIX}megan <message>\n\n*Example:*\n${config.PREFIX}megan Hello, how are you?\n\n> created by wanga`);
        }

        const message = args.join(' ');
        await react('🤔');
        await showTyping(sock, from);

        try {
            const response = await ai.meganAI(message);
            await reply(`*🤖 Megan:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Megan error:', error);
            await react('❌');
            await reply(`*🤖 Megan AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== DUCKAI ====================
commands.push({
    name: 'duckai',
    description: 'Chat with DuckAI (multiple models available)',
    aliases: ['duck'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('🦆');
            return reply(`*🦆 DUCKAI*\n\n*Usage:*\n${config.PREFIX}duckai <message>\n\n*Example:*\n${config.PREFIX}duckai Tell me a joke\n\n> created by wanga`);
        }

        const message = args.join(' ');
        await react('🦆');
        await showTyping(sock, from);

        try {
            const response = await ai.duckAI(message);
            await reply(`*🦆 DuckAI:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('DuckAI error:', error);
            await react('❌');
            await reply(`*🦆 DuckAI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== GEMINI ====================
commands.push({
    name: 'gemini',
    description: 'Chat with Google Gemini AI (supports image analysis)',
    aliases: ['gem'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        const imageUrl = await getQuotedImage(msg, sock);
        
        if (!args.length && !imageUrl) {
            await react('ℹ️');
            return reply(`*✨ GOOGLE GEMINI*\n\n*Usage:*\n• ${config.PREFIX}gemini <message>\n• Reply to an image with ${config.PREFIX}gemini <question>\n\n*Examples:*\n• ${config.PREFIX}gemini Explain quantum physics\n• Reply to image: ${config.PREFIX}gemini What's in this image?\n\n> created by wanga`);
        }

        const message = args.length ? args.join(' ') : 'What\'s in this image?';
        await react('✨');
        await showTyping(sock, from);

        try {
            let response;
            if (imageUrl) {
                response = await ai.geminiAI(message, 'You are a helpful assistant.', imageUrl);
            } else {
                response = await ai.geminiAI(message);
            }

            await reply(`*✨ Gemini:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Gemini error:', error);
            await react('❌');
            await reply(`*✨ Google Gemini*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== GEMINI LITE ====================
commands.push({
    name: 'gemini-lite',
    description: 'Fast Google Gemini responses',
    aliases: ['gemlite', 'gfast'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        const imageUrl = await getQuotedImage(msg, sock);
        
        if (!args.length && !imageUrl) {
            await react('⚡');
            return reply(`*⚡ GEMINI LITE*\n\n*Usage:*\n• ${config.PREFIX}gemini-lite <message>\n• Reply to an image with ${config.PREFIX}gemini-lite <question>\n\n*Examples:*\n• ${config.PREFIX}gemini-lite Hello\n• Reply to image: ${config.PREFIX}gemini-lite What's in this photo?\n\n> created by wanga`);
        }

        const message = args.length ? args.join(' ') : 'What\'s in this image?';
        await react('⚡');
        await showTyping(sock, from);

        try {
            let response;
            if (imageUrl) {
                response = await ai.geminiLiteAI(`${message} (Image: ${imageUrl})`);
            } else {
                response = await ai.geminiLiteAI(message);
            }

            await reply(`*⚡ Gemini Lite:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Gemini Lite error:', error);
            await react('❌');
            await reply(`*⚡ Gemini Lite*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== GPT ====================
commands.push({
    name: 'gpt',
    description: 'Chat with GPT OSS 120B',
    aliases: ['gptai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('💬');
            return reply(`*💬 GPT AI*\n\n*Usage:*\n${config.PREFIX}gpt <message>\n\n*Example:*\n${config.PREFIX}gpt Tell me a fact\n\n> created by wanga`);
        }

        const message = args.join(' ');
        await react('💬');
        await showTyping(sock, from);

        try {
            const response = await ai.gptAI(message);
            await reply(`*💬 GPT:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('GPT error:', error);
            await react('❌');
            await reply(`*💬 GPT AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== DEEPSEEK ====================
commands.push({
    name: 'deepseek',
    description: 'Chat with DeepSeek R1 AI',
    aliases: ['deep'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('🔍');
            return reply(`*🔍 DEEPSEEK AI*\n\n*Usage:*\n${config.PREFIX}deepseek <message>\n\n*Example:*\n${config.PREFIX}deepseek Explain reasoning\n\n> created by wanga`);
        }

        const message = args.join(' ');
        await react('🔍');
        await showTyping(sock, from);

        try {
            const response = await ai.deepseekAI(message);
            await reply(`*🔍 DeepSeek:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('DeepSeek error:', error);
            await react('❌');
            await reply(`*🔍 DeepSeek AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== MISTRAL ====================
commands.push({
    name: 'mistral',
    description: 'Chat with Mistral AI',
    aliases: ['mistralai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('🌪️');
            return reply(`*🌪️ MISTRAL AI*\n\n*Usage:*\n${config.PREFIX}mistral <message>\n\n*Example:*\n${config.PREFIX}mistral Hello\n\n> created by wanga`);
        }

        const message = args.join(' ');
        await react('🌪️');
        await showTyping(sock, from);

        try {
            const response = await ai.mistralAI(message);
            await reply(`*🌪️ Mistral:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Mistral error:', error);
            await react('❌');
            await reply(`*🌪️ Mistral AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== CODLLAMA ====================
commands.push({
    name: 'codellama',
    description: 'Get coding help from CodeLlama',
    aliases: ['code', 'coding'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('💻');
            return reply(`*💻 CODELlAMA*\n\n*Usage:*\n${config.PREFIX}codellama <your coding question>\n\n*Examples:*\n• ${config.PREFIX}codellama Write a function to reverse a string in Python\n• ${config.PREFIX}codellama Explain async/await in JavaScript\n\n> created by wanga`);
        }

        const message = args.join(' ');
        await react('💻');
        await showTyping(sock, from);

        try {
            const response = await ai.codeLlamaAI(message);
            await reply(`*💻 CodeLlama:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('CodeLlama error:', error);
            
            try {
                const fallback = await ai.mistralAI(message, "You are a coding expert.");
                await reply(`*💻 Coding Assistant (Fallback):*\n${fallback}\n\n> created by wanga`);
                await react('⚠️');
            } catch {
                await react('❌');
                await reply(`❌ *CodeLlama Error*\n\nPlease try again later.\n\n> created by wanga`);
            }
        }
    }
});

// ==================== BIBLE AI ====================
commands.push({
    name: 'bibleai',
    description: 'Ask questions about the Bible',
    aliases: ['bible', 'bibleq'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('📖');
            const versions = ai.getBibleVersions();
            return reply(`*📖 BIBLE AI*\n\n*Usage:*\n${config.PREFIX}bibleai <question>\n\n*Available translations:*\n${versions.join(', ')}\n\n*Set default:*\n${config.PREFIX}setbibleversion <code>\n\n*Examples:*\n• ${config.PREFIX}bibleai What is faith?\n• ${config.PREFIX}bibleai Who was Moses?\n\n> created by wanga`);
        }

        const question = args.join(' ');
        await react('📖');
        await showTyping(sock, from);

        try {
            const result = await ai.bibleAI(question);
            const answer = result?.answer || result || "I couldn't find an answer to that question.";
            const version = result?.version || 'ESV';

            await reply(`*📖 BIBLE (${version})*\n\n${answer}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Bible AI error:', error);
            await react('❌');
            await reply(`*📖 Bible AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== SET BIBLE VERSION ====================
commands.push({
    name: 'setbibleversion',
    description: 'Set default Bible translation',
    aliases: ['bibleversion'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner }) {
        const ai = initializeAI(bot);
        
        if (!isOwner) {
            await react('❌');
            return reply(`❌ *Owner Only Command*\n\nThis command can only be used by the bot owner.\n\n> created by wanga`);
        }

        if (!args.length) {
            const versions = ai.getBibleVersions();
            const current = ai.defaultBibleVersion || 'ESV';
            return reply(`*📖 BIBLE VERSIONS*\n\n*Current default:* ${current}\n\n*Available:*\n${versions.join(', ')}\n\n*Usage:*\n${config.PREFIX}setbibleversion <code>\n\n> created by wanga`);
        }

        const version = args[0].toUpperCase();
        const success = ai.setBibleVersion(version);

        if (!success) {
            await react('❌');
            const versions = ai.getBibleVersions();
            return reply(`❌ *Invalid Version*\n\nAvailable: ${versions.join(', ')}\n\n> created by wanga`);
        }

        await react('✅');
        await reply(`✅ *BIBLE VERSION UPDATED*\n\nDefault Bible version set to: *${version}*\n\n> created by wanga`);
    }
});

// ==================== TEACHER AI ====================
commands.push({
    name: 'teacher',
    description: 'Ask the AI teacher for help',
    aliases: ['teach', 'learn'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('👨‍🏫');
            return reply(`*👨‍🏫 TEACHER AI*\n\n*Usage:*\n${config.PREFIX}teacher <your question>\n\n*Examples:*\n• ${config.PREFIX}teacher Explain photosynthesis\n• ${config.PREFIX}teacher math What is calculus?\n\n> created by wanga`);
        }

        let subject = null;
        let question = args.join(' ');
        
        const subjects = ['math', 'science', 'history', 'english', 'physics', 'chemistry', 'biology'];
        const firstWord = args[0].toLowerCase();
        
        if (subjects.includes(firstWord)) {
            subject = firstWord;
            question = args.slice(1).join(' ');
        }

        await react('👨‍🏫');
        await showTyping(sock, from);

        try {
            const response = await ai.teacherAI(question, subject);
            await reply(`*👨‍🏫 Teacher:*\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Teacher AI error:', error);
            await react('❌');
            await reply(`*👨‍🏫 Teacher AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== GITA AI ====================
commands.push({
    name: 'gita',
    description: 'Ask questions about Bhagavad Gita',
    aliases: ['gitaai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('🕉️');
            return reply(`*🕉️ GITA AI*\n\n*Usage:*\n${config.PREFIX}gita <question>\n\n*Example:*\n${config.PREFIX}gita What is karma?\n\n> created by wanga`);
        }

        const question = args.join(' ');
        await react('🕉️');
        await showTyping(sock, from);

        try {
            const response = await ai.gitaAI(question);
            await reply(`*🕉️ Gita:*\n\n${response}\n\n> created by wanga`);
            await react('✅');
        } catch (error) {
            console.error('Gita AI error:', error);
            await react('❌');
            await reply(`*🕉️ Gita AI*\n\nI'm having trouble connecting right now. Please try again in a moment.\n\n> created by wanga`);
        }
    }
});

// ==================== AI MENU ====================
commands.push({
    name: 'aimenu',
    description: 'Show all AI commands',
    aliases: ['aihelp', 'ais'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const menu = `*🤖 AI COMMANDS*\n\n` +
            
            `*MEGAN AI*\n` +
            `• ${config.PREFIX}megan - Cloudflare AI\n\n` +
            
            `*GOOGLE AI*\n` +
            `• ${config.PREFIX}gemini - Full Gemini + images\n` +
            `• ${config.PREFIX}gemini-lite - Fast version\n\n` +
            
            `*POPULAR MODELS*\n` +
            `• ${config.PREFIX}gpt - GPT OSS 120B\n` +
            `• ${config.PREFIX}deepseek - DeepSeek R1\n` +
            `• ${config.PREFIX}mistral - Mistral AI\n` +
            `• ${config.PREFIX}duckai - Multi-model AI\n\n` +
            
            `*SPECIALIZED AI*\n` +
            `• ${config.PREFIX}codellama - Coding help\n` +
            `• ${config.PREFIX}teacher - Educational AI\n\n` +
            
            `*RELIGIOUS AI*\n` +
            `• ${config.PREFIX}bibleai - Bible Q&A\n` +
            `• ${config.PREFIX}setbibleversion - Change translation\n` +
            `• ${config.PREFIX}gita - Bhagavad Gita\n\n` +
            
            `*EXAMPLES*\n` +
            `• ${config.PREFIX}megan Hello\n` +
            `• ${config.PREFIX}teacher Explain gravity\n` +
            `• ${config.PREFIX}codellama Write Python function\n` +
            `• Reply to image: ${config.PREFIX}gemini What's this?\n` +
            `• ${config.PREFIX}bibleai What is love?\n\n` +
            
            `> created by wanga`;

        await reply(menu);
        await react('✅');
    }
});

module.exports = { commands };
