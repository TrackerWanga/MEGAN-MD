// MEGAN-MD Chatbot Commands - With Separate AI Memory Database

const config = require('../../megan/config');

const commands = [];

// ==================== CHATBOT TOGGLE ====================
commands.push({
    name: 'chatbot',
    description: 'Set chatbot mode (dm/group/both/off)',
    aliases: ['bot', 'aibot'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        
        if (args.length === 0) {
            const current = await bot.db.getSetting('chatbot', 'off');
            
            const helpText = `🤖 *CHATBOT SETTINGS*\n\n` +
                `Current: *${current}*\n\n` +
                `*Options:*\n` +
                `• ${config.PREFIX}chatbot dm - Reply in DMs only\n` +
                `• ${config.PREFIX}chatbot group - Reply in groups only\n` +
                `• ${config.PREFIX}chatbot both - Reply everywhere\n` +
                `• ${config.PREFIX}chatbot off - Disable\n\n` +
                `✨ *AI Features:*\n` +
                `• 🧠 *Memory* - Remembers last 15 messages\n` +
                `• 🔄 *Auto-cleanup* - Forgets after 24 hours\n` +
                `• 🎯 *Response Styles* - Short/Normal/Detailed\n` +
                `• 🌐 *Multi-API* - Llama → Gemini → DuckAI\n\n` +
                `> created by wanga`;

            return await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        }

        const option = args[0].toLowerCase();
        const validOptions = ['dm', 'group', 'both', 'off'];

        if (!validOptions.includes(option)) {
            await react('❌');
            return reply(`❌ Invalid option! Use: dm, group, both, or off\n\n> created by wanga`);
        }

        await bot.db.setSetting('chatbot', option);
        await react('✅');

        let responseMsg = '';
        if (option === 'dm') {
            responseMsg = `✅ *Chatbot set to DM mode*\n\nI will only reply in private messages.`;
        } else if (option === 'group') {
            responseMsg = `✅ *Chatbot set to Group mode*\n\nI will only reply in groups.`;
        } else if (option === 'both') {
            responseMsg = `✅ *Chatbot set to Both mode*\n\nI will reply everywhere.`;
        } else {
            responseMsg = `❌ *Chatbot disabled*\n\nI will no longer reply automatically.`;
        }

        const resultText = `🤖 *CHATBOT UPDATED*\n\n${responseMsg}\n\n> created by wanga`;

        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
    }
});

// ==================== CHATBOT STATUS ====================
commands.push({
    name: 'chatstatus',
    description: 'Check chatbot status with memory stats',
    aliases: ['botstatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        
        const current = await bot.db.getSetting('chatbot', 'off');
        const aiMode = await bot.db.getSetting('ai_mode', 'normal');
        
        // Get memory stats for this chat
        const stats = await bot.aiMemory.getStats(from);
        const globalStats = await bot.aiMemory.getGlobalStats();

        let statusEmoji = '❌';
        let statusDesc = '';

        if (current === 'dm') {
            statusEmoji = '💬';
            statusDesc = 'Active in DMs only';
        } else if (current === 'group') {
            statusEmoji = '👥';
            statusDesc = 'Active in groups only';
        } else if (current === 'both') {
            statusEmoji = '🌐';
            statusDesc = 'Active everywhere';
        } else {
            statusEmoji = '❌';
            statusDesc = 'Disabled';
        }

        const statusText = `🤖 *CHATBOT STATUS*\n\n` +
            `📊 *Mode:* ${current}\n` +
            `${statusEmoji} *Status:* ${statusDesc}\n` +
            `🎯 *AI Mode:* ${aiMode}\n\n` +
            `🧠 *YOUR MEMORY*\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `• Messages: ${stats.messageCount}\n` +
            `• Storage: ${(stats.storageBytes / 1024).toFixed(2)} KB\n\n` +
            `💾 *GLOBAL MEMORY*\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `• Active Chats: ${globalStats.activeChats}\n` +
            `• Total Messages: ${globalStats.totalMessages}\n` +
            `• Total Storage: ${globalStats.totalMB} MB\n` +
            `• Retention: 24 hours\n\n` +
            `✨ *Memory Rules:*\n` +
            `• Remembers last 15 messages\n` +
            `• Auto-cleans after 24 hours\n\n` +
            `> created by wanga`;

        await sock.sendMessage(from, { text: statusText }, { quoted: msg });
        await react('✅');
    }
});

// ==================== AI MODE SELECTOR ====================
commands.push({
    name: 'aimode',
    description: 'Set AI response mode (short/normal/detailed)',
    aliases: ['aimode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        
        if (args.length === 0) {
            const current = await bot.db.getSetting('ai_mode', 'normal');
            
            const helpText = `🎯 *AI MODE*\n\n` +
                `Current: *${current}*\n\n` +
                `*Options:*\n` +
                `• ${config.PREFIX}aimode short - Brief, concise responses\n` +
                `• ${config.PREFIX}aimode normal - Balanced responses\n` +
                `• ${config.PREFIX}aimode detailed - Long, detailed responses\n\n` +
                `> created by wanga`;

            await sock.sendMessage(from, { text: helpText }, { quoted: msg });
            await react('ℹ️');
            return;
        }

        const mode = args[0].toLowerCase();
        if (!['short', 'normal', 'detailed'].includes(mode)) {
            await react('❌');
            return reply(`❌ Invalid mode! Use: short, normal, or detailed\n\n> created by wanga`);
        }

        await bot.db.setSetting('ai_mode', mode);
        await react('✅');
        
        const successText = `✅ *AI MODE SET*\n\nAI mode changed to: *${mode}*\n\n` +
            `*${mode === 'short' ? 'Brief, to-the-point responses' : mode === 'detailed' ? 'Comprehensive, detailed responses' : 'Balanced, natural responses'}*\n\n` +
            `> created by wanga`;

        await sock.sendMessage(from, { text: successText }, { quoted: msg });
    }
});

// ==================== CLEAR CHAT MEMORY ====================
commands.push({
    name: 'clearchat',
    description: 'Clear your conversation memory',
    aliases: ['clearmemory', 'forget', 'resetchat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        
        const stats = await bot.aiMemory.getStats(from);
        
        if (stats.messageCount === 0) {
            return reply(`🧹 *No memory to clear*\n\nYou don't have any conversation history with me!\n\n> created by wanga`);
        }
        
        await react('🧹');
        
        await bot.aiMemory.clearMemorySync(from);
        
        const resultText = `🧹 *MEMORY CLEARED*\n\n` +
            `I've forgotten *${stats.messageCount}* messages from this conversation.\n\n` +
            `Let's start fresh! 👋\n\n` +
            `> created by wanga`;

        await sock.sendMessage(from, { text: resultText }, { quoted: msg });
        await react('✅');
    }
});

// ==================== TEST AI ====================
commands.push({
    name: 'testai',
    description: 'Test the AI with memory',
    aliases: ['testbot'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        
        const query = args.join(' ') || 'Hello, how are you?';
        
        await react('🤔');

        try {
            const aiResponse = await bot.getAIResponse(from, sender, query);
            
            const resultText = `🤖 *AI TEST*\n\n` +
                `📝 *Query:* ${query}\n\n` +
                `💬 *Response:*\n${aiResponse}\n\n` +
                `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });
            await react('✅');

        } catch (error) {
            console.error('Test AI error:', error);
            await react('❌');
            await reply(`❌ AI Test Failed: ${error.message}\n\n> created by wanga`);
        }
    }
});

// ==================== CHATBOT HELP ====================
commands.push({
    name: 'chathelp',
    description: 'Show all chatbot commands',
    aliases: ['bothelp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        
        const helpText = `🤖 *CHATBOT COMMANDS*\n\n` +
            
            `*SETTINGS*\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `• ${config.PREFIX}chatbot dm/group/both/off - Set mode\n` +
            `• ${config.PREFIX}chatstatus - Check status + memory stats\n` +
            `• ${config.PREFIX}aimode short/normal/detailed - Response style\n` +
            `• ${config.PREFIX}clearchat - Clear your conversation memory\n` +
            `• ${config.PREFIX}testai [question] - Test AI response\n\n` +
            
            `*MEMORY SYSTEM*\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `• 🧠 Remembers last 15 messages per chat\n` +
            `• 🔄 Auto-cleans after 24 hours inactivity\n` +
            `• 👤 Separate memory per user/group\n` +
            `• 🗑️ Use ${config.PREFIX}clearchat to clear yours\n` +
            `• 💾 Separate database file: ai_memory.db\n\n` +
            
            `*AI FEATURES*\n` +
            `━━━━━━━━━━━━━━━━━━━\n` +
            `• Multi-API fallback (Llama → Gemini → DuckAI)\n` +
            `• System: "You are MEGAN-MD, created by TrackerWanga"\n` +
            `• Auto-retry on failure\n\n` +
            
            `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        await react('✅');
    }
});

module.exports = { commands };
