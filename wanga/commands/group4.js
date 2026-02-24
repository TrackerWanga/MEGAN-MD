const GroupHelper = require('../../megan/helpers/group');

const config = require('../../megan/config');

const commands = [];

// ============================================

// 1. LOCK GROUP (Only admins can message)

// ============================================

commands.push({

    name: 'lockgc',

    description: 'Lock group (only admins can send messages)',

    aliases: ['lock', 'closegroup', 'announcement'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔒');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can lock the group!');

            }

            await sock.groupSettingUpdate(from, 'announcement');

            const resultText = `🔒 *Group Locked*\n\n` +

                             `📛 *Group:* ${metadata.subject}\n` +

                             `👮 *Only admins can send messages now.*\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Lock group error:', error);

            await react('❌');

            await reply(`❌ Failed to lock group: ${error.message}`);

        }

    }

});

// ============================================

// 2. UNLOCK GROUP

// ============================================

commands.push({

    name: 'unlockgc',

    description: 'Unlock group (everyone can send messages)',

    aliases: ['unlock', 'opengroup', 'notannouncement'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔓');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can unlock the group!');

            }

            await sock.groupSettingUpdate(from, 'not_announcement');

            const resultText = `🔓 *Group Unlocked*\n\n` +

                             `📛 *Group:* ${metadata.subject}\n` +

                             `👥 *Everyone can send messages now.*\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Unlock group error:', error);

            await react('❌');

            await reply(`❌ Failed to unlock group: ${error.message}`);

        }

    }

});

// ============================================

// 3. LOCK GROUP INFO

// ============================================

commands.push({

    name: 'locked',

    description: 'Lock group info (only admins can edit)',

    aliases: ['lockinfo', 'lockedit'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔒');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can lock group info!');

            }

            await sock.groupSettingUpdate(from, 'locked');

            const resultText = `🔒 *Group Info Locked*\n\n` +

                             `📛 *Group:* ${metadata.subject}\n` +

                             `👮 *Only admins can edit group info now.*\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Lock info error:', error);

            await react('❌');

            await reply(`❌ Failed to lock group info: ${error.message}`);

        }

    }

});

// ============================================

// 4. UNLOCK GROUP INFO

// ============================================

commands.push({

    name: 'unlocked',

    description: 'Unlock group info (everyone can edit)',

    aliases: ['unlockinfo', 'unlockedit'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        await react('🔓');

        try {

            const metadata = await sock.groupMetadata(from);

            

            const isAdmin = GroupHelper.isAdmin(metadata.participants, sender);

            if (!isAdmin && !GroupHelper.isOwner(sender, config.OWNER_NUMBER)) {

                await react('⚠️');

                return reply('❌ Only admins can unlock group info!');

            }

            await sock.groupSettingUpdate(from, 'unlocked');

            const resultText = `🔓 *Group Info Unlocked*\n\n` +

                             `📛 *Group:* ${metadata.subject}\n` +

                             `👥 *Everyone can edit group info now.*\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Unlock info error:', error);

            await react('❌');

            await reply(`❌ Failed to unlock group info: ${error.message}`);

        }

    }

});

// ============================================

// 5. GROUP STATUS

// ============================================

commands.push({

    name: 'gstatus',

    description: 'Send a status/story in the group',

    aliases: ['groupstatus', 'gcstatus'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        const hasImage = msg.message?.imageMessage || quoted?.imageMessage;

        const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;

        const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;

        if (args.length === 0 && !hasImage && !hasVideo && !hasAudio) {

            await react('❌');

            return reply(`📝 *GROUP STATUS*\n\nUsage:\n• ${config.PREFIX}gstatus <text> - Text status\n• Reply to image with ${config.PREFIX}gstatus - Image status\n• Reply to video with ${config.PREFIX}gstatus - Video status\n• Reply to audio with ${config.PREFIX}gstatus - Audio status\n\n*Examples:*\n${config.PREFIX}gstatus Hello group!\n${config.PREFIX}gstatus #FF5733 (colored text)`);

        }

        await react('🔄');

        try {

            if (args.length > 0) {

                const text = args.join(' ');

                let backgroundColor = '#128C7E';

                let font = 1;

                const colorMatch = text.match(/#[A-Fa-f0-9]{6}/);

                if (colorMatch) {

                    backgroundColor = colorMatch[0];

                }

                const fontMatch = text.match(/--font (\d)/);

                if (fontMatch) {

                    font = parseInt(fontMatch[1]);

                }

                await sock.sendMessage(from, {

                    groupStatusMessage: {

                        text: text,

                        backgroundColor: backgroundColor,

                        font: font

                    }

                });

            }

            else if (hasImage) {

                const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };

                const { downloadMediaMessage } = require('gifted-baileys');

                const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, { logger: console });

                await sock.sendMessage(from, {

                    groupStatusMessage: {

                        image: buffer,

                        caption: args.join(' ') || 'Group status'

                    }

                });

            }

            else if (hasVideo) {

                const targetMsg = msg.message?.videoMessage ? msg : { ...msg, message: quoted };

                const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, { logger: console });

                await sock.sendMessage(from, {

                    groupStatusMessage: {

                        video: buffer,

                        caption: args.join(' ') || 'Group status'

                    }

                });

            }

            else if (hasAudio) {

                const targetMsg = msg.message?.audioMessage ? msg : { ...msg, message: quoted };

                const buffer = await downloadMediaMessage(targetMsg, 'buffer', {}, { logger: console });

                await sock.sendMessage(from, {

                    groupStatusMessage: {

                        audio: buffer,

                        mimetype: 'audio/mp4',

                        ptt: true

                    }

                });

            }

            await react('✅');

        } catch (error) {

            bot.logger.error('Group status error:', error);

            await react('❌');

            await reply(`❌ Failed to send group status: ${error.message}`);

        }

    }

});

// ============================================

// 6. POLL COMMAND

// ============================================

commands.push({

    name: 'poll',

    description: 'Create a poll',

    aliases: ['createpoll', 'vote'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length < 3) {

            await react('❌');

            return reply(`📊 *CREATE POLL*\n\nUsage: ${config.PREFIX}poll "Question" "Option1" "Option2" "Option3"...\n\n*Examples:*\n• ${config.PREFIX}poll "Best color?" "Red" "Blue" "Green"\n• ${config.PREFIX}poll "Meeting time?" "2pm" "3pm" "4pm"`);

        }

        await react('📊');

        try {

            const parsedArgs = [];

            let currentArg = '';

            let inQuotes = false;

            

            for (let i = 0; i < args.join(' ').length; i++) {

                const char = args.join(' ')[i];

                

                if (char === '"' && (i === 0 || args.join(' ')[i-1] !== '\\')) {

                    inQuotes = !inQuotes;

                    if (!inQuotes && currentArg) {

                        parsedArgs.push(currentArg);

                        currentArg = '';

                    }

                } else if (char === ' ' && !inQuotes) {

                    if (currentArg) {

                        parsedArgs.push(currentArg);

                        currentArg = '';

                    }

                } else {

                    currentArg += char;

                }

            }

            

            if (currentArg) {

                parsedArgs.push(currentArg);

            }

            if (parsedArgs.length < 3) {

                return reply('❌ Please provide at least 2 options!');

            }

            const question = parsedArgs[0];

            const options = parsedArgs.slice(1);

            await sock.sendMessage(from, {

                poll: {

                    name: question,

                    values: options,

                    selectableCount: 1

                }

            });

            await react('✅');

        } catch (error) {

            bot.logger.error('Poll error:', error);

            await react('❌');

            await reply(`❌ Failed to create poll: ${error.message}`);

        }

    }

});

// ============================================

// 7. MULTI-POLL

// ============================================

commands.push({

    name: 'multipoll',

    description: 'Create a poll with multiple selections allowed',

    aliases: ['mpoll', 'multivote'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (!from.endsWith('@g.us')) {

            await react('❌');

            return reply('❌ This command can only be used in groups!');

        }

        if (args.length < 4) {

            await react('❌');

            return reply(`📊 *MULTI-POLL*\n\nUsage: ${config.PREFIX}multipoll "Question" "Option1" "Option2" "Option3" [count]\n\n*Examples:*\n• ${config.PREFIX}multipoll "Favorite colors?" "Red" "Blue" "Green" 2\n• ${config.PREFIX}multipoll "Choose toppings" "Cheese" "Pepperoni" "Mushrooms" 3`);

        }

        await react('📊');

        try {

            const parsedArgs = [];

            let currentArg = '';

            let inQuotes = false;

            

            for (let i = 0; i < args.join(' ').length; i++) {

                const char = args.join(' ')[i];

                

                if (char === '"' && (i === 0 || args.join(' ')[i-1] !== '\\')) {

                    inQuotes = !inQuotes;

                    if (!inQuotes && currentArg) {

                        parsedArgs.push(currentArg);

                        currentArg = '';

                    }

                } else if (char === ' ' && !inQuotes) {

                    if (currentArg) {

                        parsedArgs.push(currentArg);

                        currentArg = '';

                    }

                } else {

                    currentArg += char;

                }

            }

            

            if (currentArg) {

                parsedArgs.push(currentArg);

            }

            if (parsedArgs.length < 3) {

                return reply('❌ Please provide at least 2 options!');

            }

            let selectableCount = 1;

            const lastArg = parsedArgs[parsedArgs.length - 1];

            if (!isNaN(lastArg) && !lastArg.startsWith('"')) {

                selectableCount = parseInt(lastArg);

                parsedArgs.pop();

            }

            const question = parsedArgs[0];

            const options = parsedArgs.slice(1);

            await sock.sendMessage(from, {

                poll: {

                    name: question,

                    values: options,

                    selectableCount: selectableCount

                }

            });

            await react('✅');

        } catch (error) {

            bot.logger.error('Multi-poll error:', error);

            await react('❌');

            await reply(`❌ Failed to create poll: ${error.message}`);

        }

    }

});

// ============================================

// 8. GROUP HELP 1

// ============================================

commands.push({

    name: 'grouphelp1',

    description: 'Show group commands part 1 (Creation & Info)',

    aliases: ['ghelp1'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                        `┃ *${config.BOT_NAME}*\n` +

                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `👥 *GROUP COMMANDS (Part 1/4)*\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `*CREATION & INFO*\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `• ${config.PREFIX}creategroup <name> [phones]\n` +

                        `• ${config.PREFIX}creategcadd <name> <phones>\n` +

                        `• ${config.PREFIX}groupinfo [link]\n` +

                        `• ${config.PREFIX}groups\n` +

                        `• ${config.PREFIX}metadata <link>\n` +

                        `• ${config.PREFIX}participants\n\n` +

                        `> Use ${config.PREFIX}grouphelp2 for Member Mgmt`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });

        await react('✅');

    }

});

// ============================================

// 9. GROUP HELP 2

// ============================================

commands.push({

    name: 'grouphelp2',

    description: 'Show group commands part 2 (Member Management)',

    aliases: ['ghelp2'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                        `┃ *${config.BOT_NAME}*\n` +

                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `👥 *GROUP COMMANDS (Part 2/4)*\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `*MEMBER MANAGEMENT*\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `• ${config.PREFIX}leave\n` +

                        `• ${config.PREFIX}add <phone/@user>\n` +

                        `• ${config.PREFIX}remove <phone/@user>\n` +

                        `• ${config.PREFIX}kick <phone/@user>\n` +

                        `• ${config.PREFIX}promote <@user>\n` +

                        `• ${config.PREFIX}demote <@user>\n\n` +

                        `> Use ${config.PREFIX}grouphelp3 for Tagging`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });

        await react('✅');

    }

});

// ============================================

// 10. GROUP HELP 3

// ============================================

commands.push({

    name: 'grouphelp3',

    description: 'Show group commands part 3 (Tagging & Settings)',

    aliases: ['ghelp3'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                        `┃ *${config.BOT_NAME}*\n` +

                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `👥 *GROUP COMMANDS (Part 3/4)*\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `*TAGGING*\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `• ${config.PREFIX}tagall [message]\n` +

                        `• ${config.PREFIX}tag <message>\n` +

                        `• ${config.PREFIX}announce <message>\n` +

                        `• ${config.PREFIX}tagadmins [message]\n\n` +

                        `*SETTINGS*\n` +

                        `• ${config.PREFIX}setgcname <name>\n` +

                        `• ${config.PREFIX}setdesc <desc>\n` +

                        `• ${config.PREFIX}invite\n` +

                        `• ${config.PREFIX}revokeinvite\n` +

                        `• ${config.PREFIX}join <link>\n\n` +

                        `> Use ${config.PREFIX}grouphelp4 for Moderation`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });

        await react('✅');

    }

});

// ============================================

// 11. GROUP HELP 4

// ============================================

commands.push({

    name: 'grouphelp4',

    description: 'Show group commands part 4 (Moderation & Interactive)',

    aliases: ['ghelp4'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const helpText = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                        `┃ *${config.BOT_NAME}*\n` +

                        `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                        `👥 *GROUP COMMANDS (Part 4/4)*\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `*MODERATION*\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `• ${config.PREFIX}lockgc\n` +

                        `• ${config.PREFIX}unlockgc\n` +

                        `• ${config.PREFIX}locked\n` +

                        `• ${config.PREFIX}unlocked\n\n` +

                        `*INTERACTIVE*\n` +

                        `• ${config.PREFIX}gstatus [text/media]\n` +

                        `• ${config.PREFIX}poll "Q" "A" "B"\n` +

                        `• ${config.PREFIX}multipoll "Q" "A" "B" [count]\n\n` +

                        `━━━━━━━━━━━━━━━━━━━\n` +

                        `> created by wanga`;

        await sock.sendMessage(from, { text: helpText }, { quoted: msg });

        await react('✅');

    }

});

module.exports = { commands };