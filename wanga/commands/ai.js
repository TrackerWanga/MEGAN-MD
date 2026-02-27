const config = require('../../megan/config');
const AIHandler = require('../../megan/lib/aiHandler');

const commands = [];
let aiHandler = null;

const initializeAI = (bot) => {
    if (!aiHandler) {
        aiHandler = new AIHandler(bot);
    }
    return aiHandler;
};

// ==================== MEGAN AI (with memory) ====================
commands.push({
    name: 'megan',
    description: 'Chat with Megan AI (has memory, auto-clears after 10min)',
    aliases: ['ai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`🤖 *Megan AI*\n\nUsage: ${config.PREFIX}megan <message>\n\nExample: ${config.PREFIX}megan Hello\n\nℹ️ Has conversation memory (auto-clears after 10 minutes)`);
        }

        const message = args.join(' ');

        await react('🤔');

        try {
            ai.addToMeganHistory(sender, 'user', message);
            const response = await ai.meganAI(message, sender);

            await sock.sendMessage(from, {
                text: `*🤖 Megan AI:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('Megan error:', error);
            await react('❌');
            await reply('❌ Megan AI error. Please try again.');
        }
    }
});

// ==================== COPILOT (Fast responses) ====================
commands.push({
    name: 'copilot',
    description: 'Fast AI responses',
    aliases: ['cp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`🤖 *Copilot AI*\n\nUsage: ${config.PREFIX}copilot <message>\n\nExample: ${config.PREFIX}copilot How are you?`);
        }

        const message = args.join(' ');
        await react('💭');

        try {
            const response = await ai.copilotAI(message);

            await sock.sendMessage(from, {
                text: `*🤖 Copilot:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('Copilot error:', error);
            await react('❌');
            await reply('❌ Copilot error. Please try again.');
        }
    }
});

// ==================== CHATGPT ====================
commands.push({
    name: 'chatgpt',
    description: 'Chat with ChatGPT',
    aliases: ['gpt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`💬 *ChatGPT*\n\nUsage: ${config.PREFIX}chatgpt <message>\n\nExample: ${config.PREFIX}chatgpt Tell me a joke`);
        }

        const message = args.join(' ');
        await react('💬');

        try {
            const response = await ai.chatgptAI(message);

            await sock.sendMessage(from, {
                text: `*💬 ChatGPT:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('ChatGPT error:', error);
            await react('❌');
            await reply('❌ ChatGPT error. Please try again.');
        }
    }
});

// ==================== GPT FAST ====================
commands.push({
    name: 'gptfast',
    description: 'Fast GPT responses',
    aliases: ['fastgpt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`⚡ *GPT Fast*\n\nUsage: ${config.PREFIX}gptfast <message>\n\nExample: ${config.PREFIX}gptfast Hello`);
        }

        const message = args.join(' ');
        await react('⚡');

        try {
            const response = await ai.gptfastAI(message);

            await sock.sendMessage(from, {
                text: `*⚡ GPT Fast:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('GPT Fast error:', error);
            await react('❌');
            await reply('❌ GPT Fast error. Please try again.');
        }
    }
});

// ==================== GEMINI ====================
commands.push({
    name: 'gemini',
    description: 'Google Gemini AI',
    aliases: ['gem'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`✨ *Gemini AI*\n\nUsage: ${config.PREFIX}gemini <message>\n\nExample: ${config.PREFIX}gemini Explain AI`);
        }

        const message = args.join(' ');
        await react('✨');

        try {
            const response = await ai.geminiAI(message);

            await sock.sendMessage(from, {
                text: `*✨ Gemini:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('Gemini error:', error);
            await react('❌');
            await reply('❌ Gemini error. Please try again.');
        }
    }
});

// ==================== GEMINI FAST ====================
commands.push({
    name: 'geminifast',
    description: 'Fast Google Gemini responses',
    aliases: ['gemfast'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`⚡ *Gemini Fast*\n\nUsage: ${config.PREFIX}geminifast <message>\n\nExample: ${config.PREFIX}geminifast Hello`);
        }

        const message = args.join(' ');
        await react('⚡');

        try {
            const response = await ai.geminifastAI(message);

            await sock.sendMessage(from, {
                text: `*⚡ Gemini Fast:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('Gemini Fast error:', error);
            await react('❌');
            await reply('❌ Gemini Fast error. Please try again.');
        }
    }
});

// ==================== STORY GENERATOR ====================
commands.push({
    name: 'storygen',
    description: 'Generate a story from prompt',
    aliases: ['story'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`📖 *Story Generator*\n\nUsage: ${config.PREFIX}storygen <prompt>\n\nExample: ${config.PREFIX}storygen A brave knight`);
        }

        const prompt = args.join(' ');
        await react('📖');

        try {
            const response = await ai.storygenAI(prompt);

            await sock.sendMessage(from, {
                text: `*📖 Story:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('StoryGen error:', error);
            await react('❌');
            await reply('❌ Story generator error. Please try again.');
        }
    }
});

// ==================== LLAMA ====================
commands.push({
    name: 'llama',
    description: 'Chat with Llama AI',
    aliases: ['llamaai'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        if (!args.length) {
            await react('ℹ️');
            return reply(`🦙 *Llama AI*\n\nUsage: ${config.PREFIX}llama <message>\n\nExample: ${config.PREFIX}llama Tell me a fact`);
        }

        const message = args.join(' ');
        await react('🦙');

        try {
            const response = await ai.llamaAI(message);

            await sock.sendMessage(from, {
                text: `*🦙 Llama:*\n${response}\n\n> created by wanga`
            }, { quoted: msg });

            await react('✅');
        } catch (error) {
            console.error('Llama error:', error);
            await react('❌');
            await reply('❌ Llama error. Please try again.');
        }
    }
});

// ==================== CLEAR MEGAN HISTORY ====================
commands.push({
    name: 'clearmegan',
    description: 'Clear your Megan AI chat history',
    aliases: ['clearmemory'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const ai = initializeAI(bot);
        ai.clearMeganHistory(sender);
        await react('🧹');
        await reply(`🧹 *Megan History Cleared!*\n\nYour conversation with Megan has been reset.`);
    }
});

// ==================== AI MENU ====================
commands.push({
    name: 'aimenu',
    description: 'Show all AI commands',
    aliases: ['aihelp'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const ai = initializeAI(bot);

        const menu = `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                    `┃ *${config.BOT_NAME} AI*\n` +
                    `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                    `*🤖 AI COMMANDS*\n\n` +
                    `• ${config.PREFIX}megan - Megan AI (has memory)\n` +
                    `• ${config.PREFIX}copilot - Fast AI responses\n` +
                    `• ${config.PREFIX}chatgpt - ChatGPT\n` +
                    `• ${config.PREFIX}gptfast - Fast GPT\n` +
                    `• ${config.PREFIX}gemini - Google Gemini\n` +
                    `• ${config.PREFIX}geminifast - Fast Gemini\n` +
                    `• ${config.PREFIX}llama - Llama AI\n` +
                    `• ${config.PREFIX}storygen - Story Generator\n` +
                    `• ${config.PREFIX}clearmegan - Clear Megan history\n\n` +
                    `*📝 Examples:*\n` +
                    `• ${config.PREFIX}megan Hello\n` +
                    `• ${config.PREFIX}copilot How are you?\n` +
                    `• ${config.PREFIX}storygen A dragon\n\n` +
                    `> created by wanga`;

        await sock.sendMessage(from, { text: menu }, { quoted: msg });
    }
});

// ==================== AI STATUS ====================
commands.push({
    name: 'aistatus',
    description: 'Check AI service status',
    aliases: ['aicheck'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        const ai = initializeAI(bot);
        await react('🔍');

        try {
            const statuses = [];

            // Quick check each AI
            try { await ai.copilotAI('hi'); statuses.push('✅ Copilot'); } 
            catch { statuses.push('❌ Copilot'); }

            try { await ai.chatgptAI('hi'); statuses.push('✅ ChatGPT'); } 
            catch { statuses.push('❌ ChatGPT'); }

            try { await ai.gptfastAI('hi'); statuses.push('✅ GPT Fast'); } 
            catch { statuses.push('❌ GPT Fast'); }

            try { await ai.geminiAI('hi'); statuses.push('✅ Gemini'); } 
            catch { statuses.push('❌ Gemini'); }

            try { await ai.llamaAI('hi'); statuses.push('✅ Llama'); } 
            catch { statuses.push('❌ Llama'); }

            const statusText = `*🤖 AI SERVICES*\n\n${statuses.join('\n')}`;

            await sock.sendMessage(from, { text: statusText }, { quoted: msg });

            await react('✅');
        } catch (error) {
            await react('❌');
            await reply('❌ Could not check AI status.');
        }
    }
});

module.exports = { commands };