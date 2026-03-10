const config = require('../../megan/config');
const Designs = require('../../megan/helpers/designs');
const { createNewsletterContext } = require('../../megan/helpers/newsletter');

const commands = [];

// ==================== CHATBOT TOGGLE ====================
commands.push({
    name: 'chatbot',
    description: 'Set chatbot mode (dm/group/both/off)',
    aliases: ['bot', 'aibot'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            const current = await bot.db.getSetting('chatbot', 'off');
            
            const helpText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🤖 *CHATBOT*     ┃
╰━━━━━━━━━━━━━━━━━━━╯

Current: ${current}

*Options:*
• ${config.PREFIX}chatbot dm - Reply in DMs only
• ${config.PREFIX}chatbot group - Reply in groups only
• ${config.PREFIX}chatbot both - Reply everywhere
• ${config.PREFIX}chatbot off - Disable

✨ *Memory:* Auto-clears after 5 min silence
✨ *Long chats:* Remembered for 30 min

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

            return await sock.sendMessage(from, {
                text: helpText,
                ...createNewsletterContext(sender, {
                    title: "Chatbot Settings",
                    body: `Mode: ${current}`
                })
            }, { quoted: msg });
        }

        const option = args[0].toLowerCase();
        const validOptions = ['dm', 'group', 'both', 'off'];

        if (!validOptions.includes(option)) {
            await react('❌');
            return reply('❌ Invalid option! Use: dm, group, both, or off');
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

        const resultText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🤖 *CHATBOT*     ┃
╰━━━━━━━━━━━━━━━━━━━╯

${responseMsg}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: resultText,
            ...createNewsletterContext(sender, {
                title: "Chatbot",
                body: `Mode: ${option}`
            })
        }, { quoted: msg });
    }
});

// ==================== CHATBOT STATUS ====================
commands.push({
    name: 'chatstatus',
    description: 'Check chatbot status',
    aliases: ['botstatus'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const current = await bot.db.getSetting('chatbot', 'off');
        
        // Get memory stats from AI handler
        const memoryStats = bot.ai?.getMemoryStats?.() || { activeChats: 0, totalMessages: 0 };

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

        const statusText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🤖 *CHATBOT STATUS* ┃
╰━━━━━━━━━━━━━━━━━━━╯

📊 *Mode:* ${current}
${statusEmoji} *Status:* ${statusDesc}

🧠 *Memory Stats:*
• Active chats: ${memoryStats.activeChats}
• Messages stored: ${memoryStats.totalMessages}

✨ *Memory Rules:*
• Auto-clears after 5 min silence
• Long chats: 30 min retention

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: statusText,
            ...createNewsletterContext(sender, {
                title: "Chatbot Status",
                body: current
            })
        }, { quoted: msg });
        
        await react('✅');
    }
});

// ==================== AI MODE SELECTOR ====================
commands.push({
    name: 'aimode',
    description: 'Set AI response mode (short/normal/detailed)',
    aliases: ['aimode'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        if (!args.length) {
            const current = await bot.db.getSetting('ai_mode', 'normal');
            
            const helpText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🎯 *AI MODE*     ┃
╰━━━━━━━━━━━━━━━━━━━╯

Current: ${current}

*Options:*
• ${config.PREFIX}aimode short - Brief responses
• ${config.PREFIX}aimode normal - Balanced
• ${config.PREFIX}aimode detailed - Detailed

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

            await sock.sendMessage(from, {
                text: helpText,
                ...createNewsletterContext(sender, {
                    title: "AI Mode",
                    body: `Current: ${current}`
                })
            }, { quoted: msg });
            
            await react('ℹ️');
            return;
        }

        const mode = args[0].toLowerCase();
        if (!['short', 'normal', 'detailed'].includes(mode)) {
            await react('❌');
            return reply('❌ Invalid mode! Use: short, normal, or detailed');
        }

        await bot.db.setSetting('ai_mode', mode);
        await react('✅');
        
        const successText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   ✅ *AI MODE SET* ┃
╰━━━━━━━━━━━━━━━━━━━╯

AI mode changed to: *${mode}*

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: successText,
            ...createNewsletterContext(sender, {
                title: "AI Mode",
                body: mode
            })
        }, { quoted: msg });
    }
});

// ==================== CLEAR CHAT MEMORY ====================
commands.push({
    name: 'clearchat',
    description: 'Clear your conversation memory',
    aliases: ['clearmemory', 'forget'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const chatId = from; // Current chat ID
        
        if (bot.ai) {
            bot.ai.clearMemory(chatId);
        }
        
        await react('🧹');
        
        const resultText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🧹 *MEMORY CLEARED* ┃
╰━━━━━━━━━━━━━━━━━━━╯

Your conversation history has been cleared.
I'll forget everything we talked about!

Let's start fresh! 👋

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

        await sock.sendMessage(from, {
            text: resultText,
            ...createNewsletterContext(sender, {
                title: "Memory Cleared",
                body: "Fresh Start"
            })
        }, { quoted: msg });
    }
});

// ==================== TEST AI ====================
commands.push({
    name: 'testai',
    description: 'Test the Cloudflare AI directly',
    aliases: ['testbot'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        const query = args.join(' ') || 'Hello, how are you?';
        
        await react('🤔');

        try {
            const axios = require('axios');
            const response = await axios({
                method: 'POST',
                url: 'https://late-salad-9d56.youngwanga254.workers.dev',
                headers: { 'Content-Type': 'application/json' },
                data: { 
                    prompt: query, 
                    model: '@cf/meta/llama-3.1-8b-instruct' 
                },
                timeout: 15000
            });

            const aiResponse = response.data?.data?.response || 
                              response.data?.response || 
                              "No response from AI";

            const resultText = `╭━━━━━━━━━━━━━━━━━━━╮
┃   🤖 *AI TEST*     ┃
╰━━━━━━━━━━━━━━━━━━━╯

📝 *Query:* ${query}

💬 *Response:*
${aiResponse}

✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥
> created by wanga
✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥✤✥`;

            await sock.sendMessage(from, {
                text: resultText,
                ...createNewsletterContext(sender, {
                    title: "AI Test",
                    body: "Result"
                })
            }, { quoted: msg });
            
            await react('✅');

        } catch (error) {
            bot.logger.error('Test AI error:', error);
            await react('❌');
            await reply(`❌ AI Test Failed: ${error.message}`);
        }
    }
});

module.exports = { commands };