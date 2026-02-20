// wanga/commands/chatbot.js

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

const commands = [];

// ==================== CHATBOT TOGGLE ====================

commands.push({

    name: 'chatbot',

    description: 'Toggle Cloudflare AI chatbot on/off',

    aliases: ['bot', 'aibot'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!args.length) {

            const current = await bot.db.getSetting('chatbot', 'off');

            const status = current === 'on' ? 'ON' : 'OFF';

            await react('🤖');

            

            const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                           `🤖 *CLOUDFLARE AI CHATBOT*\n\n` +

                           `Current: ${status}\n\n` +

                           `*Usage:*\n` +

                           `• ${config.PREFIX}chatbot on - Enable AI replies\n` +

                           `• ${config.PREFIX}chatbot off - Disable AI replies\n\n` +

                           `When ON, I'll reply to ALL messages using Cloudflare AI!\n\n` +

                           `> created by wanga`;

            

            return reply(helpText);

        }

        const option = args[0].toLowerCase();

        

        if (option === 'on') {

            await bot.db.setSetting('chatbot', 'on');

            await react('✅');

            await reply(`┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n✅ *Cloudflare AI Chatbot Enabled!*\n\nI'll now reply to ALL messages using AI.\n\n> created by wanga`);

        } 

        else if (option === 'off') {

            await bot.db.setSetting('chatbot', 'off');

            await react('✅');

            await reply(`┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n❌ *Cloudflare AI Chatbot Disabled.*\n\nI will no longer reply automatically.\n\n> created by wanga`);

        } 

        else {

            await react('❌');

            await reply(`❌ Use: ${config.PREFIX}chatbot on/off`);

        }

    }

});

// ==================== CHATBOT STATUS ====================

commands.push({

    name: 'chatstatus',

    description: 'Check chatbot status',

    aliases: ['botstatus'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const current = await bot.db.getSetting('chatbot', 'off');

        const status = current === 'on' ? 'ON' : 'OFF';

        

        const statusText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                          `🤖 *CHATBOT STATUS*\n\n` +

                          `📊 Status: ${status}\n\n` +

                          `${status === 'ON' ? '✅ I am active and replying with Cloudflare AI!' : '❌ I am currently disabled.'}\n\n` +

                          `> created by wanga`;

        

        await sock.sendMessage(from, {

            text: statusText,

            ...createNewsletterContext(sender, {

                title: "🤖 Chatbot Status",

                body: status === 'ON' ? 'Active' : 'Inactive'

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

            

            await sock.sendMessage(from, {

                text: resultText,

                ...createNewsletterContext(sender, {

                    title: "🤖 AI Test",

                    body: "Cloudflare AI response"

                })

            }, { quoted: msg });

            

            await react('✅');

        } catch (error) {

            await react('❌');

            await reply(`❌ AI Test Failed: ${error.message}`);

        }

    }

});

module.exports = { commands };