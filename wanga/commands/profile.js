const config = require('../../megan/config');

const fs = require('fs-extra');

const path = require('path');

const axios = require('axios');

const commands = [];

// Auto-bio messages for different times

const AUTO_BIO_MESSAGES = {

    earlyMorning: [

        "🌅 Rise and shine! Another beautiful day begins!",

        "☕ Good morning! Time to brew some success!",

        "✨ Early bird gets the worm. Let's conquer today!",

        "🌄 Wake up with determination, go to bed with satisfaction.",

        "💪 The sun is up and so are we! Let's do this!",

        "⭐ Today is a gift. That's why it's called the present.",

        "🌈 Morning motivation: Make today so awesome that yesterday gets jealous!"

    ],

    morning: [

        "☀️ Good morning! Make today count!",

        "📚 Time to learn, grow, and become better.",

        "🎯 Stay focused and never give up!",

        "💫 Every day is a second chance.",

        "🌟 Your attitude determines your direction.",

        "⚡ Wake up, kick ass, repeat!",

        "🌸 Good morning! Let's make today productive!"

    ],

    afternoon: [

        "🌤️ Good afternoon! Halfway through!",

        "⚡ Afternoon energy! Keep pushing forward!",

        "💡 The best ideas come in the afternoon.",

        "🎵 Afternoon vibes: Stay positive!",

        "💪 Don't stop until you're proud!",

        "📈 Progress, not perfection!",

        "✨ You're doing great! Keep going!"

    ],

    evening: [

        "🌆 Good evening! Time to unwind.",

        "📖 Reflect on today, plan for tomorrow.",

        "🌟 You made it through another day!",

        "🎭 Evening is the time to be yourself.",

        "💫 Great job today! Now rest up.",

        "🌙 The evening is a time for peace.",

        "✨ Success is peace of mind. You earned it!"

    ],

    night: [

        "🌙 Good night! Sweet dreams!",

        "⭐ Rest your mind, rejuvenate your soul.",

        "💤 Tomorrow is a new opportunity.",

        "🌌 Sleep is the best meditation.",

        "✨ End the day with gratitude.",

        "🛌 Time to recharge for tomorrow!",

        "💫 Let go of today and embrace tomorrow."

    ],

    midnight: [

        "🕛 Midnight thoughts: You're doing amazing!",

        "🌙 The quiet hours are for dreamers.",

        "✨ Midnight motivation: Never give up!",

        "⭐ While the world sleeps, dream big!",

        "💫 The best ideas come at midnight.",

        "🌌 Silence speaks when words can't.",

        "🕛 Another day begins in silence."

    ]

};

// Store auto-bio interval

let autoBioInterval = null;

// ============================================

// SET OWNER NAME - NO OWNER CHECK

// ============================================

commands.push({

    name: 'setownername',

    description: 'Set bot owner name',

    aliases: ['setowner', 'ownername'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length === 0) {

            await react('❌');

            return reply(`👤 *SET OWNER NAME*\n\nUsage: ${config.PREFIX}setownername <new name>\n\n*Example:* ${config.PREFIX}setownername Wanga`);

        }

        await react('👤');

        try {

            const newName = args.join(' ');

            

            // Save to database

            await bot.db.setSetting('ownername', newName);

            

            // Update config

            config.OWNER_NAME = newName;

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `👤 *OWNER NAME UPDATED*\n\n` +

                             `📛 *New Name:* ${newName}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set owner name error:', error);

            await react('❌');

            await reply(`❌ Failed to update owner name: ${error.message}`);

        }

    }

});

// ============================================

// SET BIO - NO OWNER CHECK

// ============================================

commands.push({

    name: 'setbio',

    description: 'Set bot about/bio',

    aliases: ['setabout', 'setstatus'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length === 0) {

            await react('❌');

            return reply(`📝 *SET BIO*\n\nUsage: ${config.PREFIX}setbio <your bio>\n\n*Example:* ${config.PREFIX}setbio Megan Bot - Your friendly assistant`);

        }

        await react('📝');

        try {

            const bio = args.join(' ');

            await sock.updateProfileStatus(bio);

            

            // Save to database

            await bot.db.setSetting('bio', bio);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📝 *BIO UPDATED*\n\n` +

                             `💬 *New Bio:*\n${bio}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set bio error:', error);

            await react('❌');

            await reply(`❌ Failed to update bio: ${error.message}`);

        }

    }

});

// ============================================

// AUTO BIO - NO OWNER CHECK

// ============================================

commands.push({

    name: 'autobio',

    description: 'Auto-update bio based on time',

    aliases: ['autobio'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const action = args[0]?.toLowerCase();

        if (action === 'stop' || action === 'off') {

            if (autoBioInterval) {

                clearInterval(autoBioInterval);

                autoBioInterval = null;

                await bot.db.setSetting('autobio', 'off');

                await react('⏹️');

                return reply('⏹️ *Auto-bio stopped*');

            }

            return reply('⚠️ Auto-bio is not running');

        }

        if (action === 'start' || action === 'on' || !action) {

            // Check if already running

            const isRunning = await bot.db.getSetting('autobio', 'off');

            if (autoBioInterval || isRunning === 'on') {

                return reply('⚠️ Auto-bio is already running');

            }

            await react('🔄');

            // Function to update bio based on time

            const updateBio = async () => {

                try {

                    const hour = new Date().getHours();

                    let messages = [];

                    if (hour >= 0 && hour < 4) {

                        messages = AUTO_BIO_MESSAGES.midnight;

                    } else if (hour >= 4 && hour < 6) {

                        messages = AUTO_BIO_MESSAGES.earlyMorning;

                    } else if (hour >= 6 && hour < 12) {

                        messages = AUTO_BIO_MESSAGES.morning;

                    } else if (hour >= 12 && hour < 17) {

                        messages = AUTO_BIO_MESSAGES.afternoon;

                    } else if (hour >= 17 && hour < 20) {

                        messages = AUTO_BIO_MESSAGES.evening;

                    } else {

                        messages = AUTO_BIO_MESSAGES.night;

                    }

                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

                    await sock.updateProfileStatus(randomMessage);

                    

                } catch (error) {

                    bot.logger.error('Auto-bio update error:', error);

                }

            };

            // Update immediately

            await updateBio();

            // Then every hour

            autoBioInterval = setInterval(updateBio, 60 * 60 * 1000);

            

            // Save to database

            await bot.db.setSetting('autobio', 'on');

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🔄 *AUTO-BIO STARTED*\n\n` +

                             `⏰ *Updates:* Every hour\n` +

                             `📝 *Messages:* 42+ motivational quotes\n\n` +

                             `*Times:*\n` +

                             `🌅 Early Morning (4-6am)\n` +

                             `☀️ Morning (6am-12pm)\n` +

                             `🌤️ Afternoon (12-5pm)\n` +

                             `🌆 Evening (5-8pm)\n` +

                             `🌙 Night (8pm-12am)\n` +

                             `🕛 Midnight (12-4am)\n\n` +

                             `*To stop:* ${config.PREFIX}autobio stop\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        }

    }

});

// ============================================

// SET BOT PROFILE PICTURE - NO OWNER CHECK

// ============================================

commands.push({

    name: 'setbotpic',

    description: 'Set bot profile picture',

    aliases: ['setpp', 'setprofilepic'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('🖼️');

        try {

            let imageBuffer = null;

            // Check if replying to an image

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (quoted?.imageMessage) {

                const { downloadMediaMessage } = require('gifted-baileys');

                imageBuffer = await downloadMediaMessage(

                    { key: msg.key, message: quoted },

                    'buffer',

                    {},

                    { logger: console }

                );

            }

            // Check if image URL provided

            else if (args.length > 0 && args[0].startsWith('http')) {

                const response = await axios.get(args[0], {

                    responseType: 'arraybuffer',

                    timeout: 30000

                });

                imageBuffer = Buffer.from(response.data);

            }

            // Check if current message has image

            else if (msg.message?.imageMessage) {

                const { downloadMediaMessage } = require('gifted-baileys');

                imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: console });

            }

            if (!imageBuffer) {

                return reply(`🖼️ *SET PROFILE PICTURE*\n\nUsage:\n• Reply to an image with ${config.PREFIX}setbotpic\n• ${config.PREFIX}setbotpic <image url>\n\n*Example:* ${config.PREFIX}setbotpic https://files.catbox.moe/image.jpg`);

            }

            await sock.updateProfilePicture(sock.user.id, imageBuffer);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🖼️ *PROFILE PICTURE UPDATED*\n\n` +

                             `✅ Bot profile picture changed successfully\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Set bot pic error:', error);

            await react('❌');

            await reply(`❌ Failed to update profile picture: ${error.message}`);

        }

    }

});

// ============================================

// REMOVE PROFILE PICTURE - NO OWNER CHECK

// ============================================

commands.push({

    name: 'removepp',

    description: 'Remove bot profile picture',

    aliases: ['removepic', 'delpp'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('🗑️');

        try {

            await sock.removeProfilePicture(sock.user.id);

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🗑️ *PROFILE PICTURE REMOVED*\n\n` +

                             `✅ Bot profile picture has been removed\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Remove pp error:', error);

            await react('❌');

            await reply(`❌ Failed to remove profile picture: ${error.message}`);

        }

    }

});

// ============================================

// MY PROFILE PICTURE

// ============================================

commands.push({

    name: 'mypic',

    description: 'Get your own profile picture',

    aliases: ['mypp', 'getmypp'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('🖼️');

        try {

            const ppUrl = await sock.profilePictureUrl(sender, 'image');

            await sock.sendMessage(from, {

                image: { url: ppUrl },

                caption: `🖼️ *Your Profile Picture*\n\n👤 @${sender.split('@')[0]}\n\n> created by wanga`,

                mentions: [sender]

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            // Send default image if no profile pic

            await sock.sendMessage(from, {

                image: { url: config.BOT_PIC || 'https://files.catbox.moe/u29yah.jpg' },

                caption: `⚠️ No profile picture found for @${sender.split('@')[0]}\n\n> created by wanga`,

                mentions: [sender]

            }, { quoted: msg });

            await react('✅');

        }

    }

});

// ============================================

// MY ABOUT

// ============================================

commands.push({

    name: 'myabout',

    description: 'Get your own about/bio',

    aliases: ['mybio', 'getmyabout'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        await react('📝');

        try {

            const { status, setAt } = await sock.fetchStatus(sender);

            const date = new Date(setAt).toLocaleString('en-KE', {

                dateStyle: 'full',

                timeStyle: 'short'

            });

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📝 *YOUR ABOUT INFO*\n\n` +

                             `👤 *User:* @${sender.split('@')[0]}\n` +

                             `💬 *About:* ${status}\n` +

                             `🕒 *Set at:* ${date}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: [sender]

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            await react('❌');

            await reply('❌ Could not fetch about info. You may have privacy settings enabled.');

        }

    }

});

// ============================================

// PROFILE HELP - Show all profile commands

// ============================================

commands.push({

    name: 'profilehelp',

    description: 'Show all profile commands',

    aliases: ['profilecmds', 'helpme'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `👤 *PROFILE COMMANDS*\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `• ${config.PREFIX}setownername <name> - Change owner name\n` +

                        `• ${config.PREFIX}setbio <text> - Change bot bio\n` +

                        `• ${config.PREFIX}autobio [start/stop] - Auto bio updater\n` +

                        `• ${config.PREFIX}setbotpic [image] - Set bot profile pic\n` +

                        `• ${config.PREFIX}removepp - Remove bot profile pic\n` +

                        `• ${config.PREFIX}mypic - Get your profile picture\n` +

                        `• ${config.PREFIX}myabout - Get your about info\n\n` +

                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });

        await react('✅');

    }

});

module.exports = { commands };