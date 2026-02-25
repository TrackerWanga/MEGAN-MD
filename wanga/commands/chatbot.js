const config = require('../../megan/config');

const commands = [];

// ==================== CHATBOT TOGGLE ====================

commands.push({

    name: 'chatbot',

    description: 'Set chatbot mode (dm/group/both/off)',

    aliases: ['bot', 'aibot'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            const current = await bot.db.getSetting('chatbot', 'off');

            

            const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                           `🤖 *CLOUDFLARE AI CHATBOT*\n\n` +

                           `Current: ${current}\n\n` +

                           `*Options:*\n` +

                           `• ${config.PREFIX}chatbot dm - Reply in DMs only\n` +

                           `• ${config.PREFIX}chatbot group - Reply in groups only\n` +

                           `• ${config.PREFIX}chatbot both - Reply everywhere\n` +

                           `• ${config.PREFIX}chatbot off - Disable chatbot\n\n` +

                           `> created by wanga`;

            return reply(helpText);

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

        await reply(`┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n${responseMsg}\n\n> created by wanga`);

    }

});

// ==================== CHATBOT STATUS ====================

commands.push({

    name: 'chatstatus',

    description: 'Check chatbot status',

    aliases: ['botstatus'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const current = await bot.db.getSetting('chatbot', 'off');

        

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

        const statusText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                          `🤖 *CHATBOT STATUS*\n\n` +

                          `📊 Mode: ${current}\n` +

                          `${statusEmoji} Status: ${statusDesc}\n\n` +

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

        if (!args.length) {

            const current = await bot.db.getSetting('ai_mode', 'normal');

            await react('ℹ️');

            return reply(`┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `🎯 *AI MODE SETTINGS*\n\n` +

                        `Current: ${current}\n\n` +

                        `*Options:*\n` +

                        `• ${config.PREFIX}aimode short - Brief responses\n` +

                        `• ${config.PREFIX}aimode normal - Balanced responses\n` +

                        `• ${config.PREFIX}aimode detailed - Detailed explanations\n\n` +

                        `> created by wanga`);

        }

        const mode = args[0].toLowerCase();

        if (!['short', 'normal', 'detailed'].includes(mode)) {

            await react('❌');

            return reply('❌ Invalid mode! Use: short, normal, or detailed');

        }

        await bot.db.setSetting('ai_mode', mode);

        await react('✅');

        await reply(`✅ AI mode set to: ${mode}`);

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

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                              `🤖 *AI TEST RESULT*\n\n` +

                              `*Your query:* ${query}\n\n` +

                              `*AI response:*\n${aiResponse}\n\n` +

                              `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Test AI error:', error);

            await react('❌');

            await reply(`❌ AI Test Failed: ${error.message}`);

        }

    }

});

module.exports = { commands };