const config = require('../../megan/config');

const commands = [];

// ============================================

// TRACK PRESENCE - Track user online status

// ============================================

commands.push({

    name: 'trackpresence',

    description: 'Track user presence (online/offline) for 30 seconds',

    aliases: ['watchpresence', 'presence'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let target = null;

        // Get target from mention or phone

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        } else if (args.length > 0) {

            const phone = args[0].replace(/\D/g, '');

            if (phone && phone.length >= 10) {

                target = `${phone}@s.whatsapp.net`;

            }

        }

        if (!target) {

            await react('❌');

            return reply(`🟢 *TRACK PRESENCE*\n\nUsage: ${config.PREFIX}trackpresence <@user/phone>\n\n*Example:* ${config.PREFIX}trackpresence @user\n\nTracks user for 30 seconds.`);

        }

        await react('🟢');

        try {

            // Subscribe to presence updates

            await sock.presenceSubscribe(target);

            

            let lastStatus = 'unknown';

            const statusUpdates = [];

            // Presence handler

            const presenceHandler = (update) => {

                if (update.id === target) {

                    const presence = update.presences?.[target]?.lastKnownPresence || 'unknown';

                    const status = presence === 'available' ? '🟢 Online' :

                                  presence === 'composing' ? '✏️ Typing' :

                                  presence === 'recording' ? '🎤 Recording' : '⚫ Offline';

                    

                    // Only log if status changed

                    if (status !== lastStatus) {

                        lastStatus = status;

                        const timestamp = new Date().toLocaleTimeString();

                        statusUpdates.push(`[${timestamp}] ${status}`);

                        

                        // Send update

                        sock.sendMessage(from, {

                            text: `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                  `🟢 *PRESENCE UPDATE*\n\n` +

                                  `👤 *User:* @${target.split('@')[0]}\n` +

                                  `📊 *Status:* ${status}\n` +

                                  `⏱️ *Time:* ${timestamp}\n\n` +

                                  `> created by wanga`,

                            mentions: [target]

                        }).catch(() => {});

                    }

                }

            };

            sock.ev.on('presence.update', presenceHandler);

            // Send initial tracking message

            await reply(`🟢 *Now tracking @${target.split('@')[0]} for 30 seconds*\n\nI'll notify you of any presence changes.`);

            // Remove listener after 30 seconds and send summary

            setTimeout(() => {

                sock.ev.off('presence.update', presenceHandler);

                

                let summary = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `📊 *TRACKING SUMMARY*\n\n` +

                             `👤 *User:* @${target.split('@')[0]}\n` +

                             `⏱️ *Duration:* 30 seconds\n\n`;

                if (statusUpdates.length > 0) {

                    summary += `*Status Changes:*\n${statusUpdates.join('\n')}`;

                } else {

                    summary += `*No status changes detected.*\nUser may have privacy settings enabled.`;

                }

                summary += `\n\n> created by wanga`;

                sock.sendMessage(from, {

                    text: summary,

                    mentions: [target]

                }).catch(() => {});

                

            }, 30000);

        } catch (error) {

            bot.logger.error('Track presence error:', error);

            await react('❌');

            await reply(`❌ Failed to track presence: ${error.message}\n\nUser may have privacy settings enabled.`);

        }

    }

});

// ============================================

// TRACK LAST SEEN - Get user last seen

// ============================================

commands.push({

    name: 'tracklastseen',

    description: 'Get user last seen (limited by privacy)',

    aliases: ['lastseen', 'seen'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        let target = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

            target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        } else if (args.length > 0) {

            const phone = args[0].replace(/\D/g, '');

            if (phone && phone.length >= 10) {

                target = `${phone}@s.whatsapp.net`;

            }

        }

        if (!target) {

            await react('❌');

            return reply(`🕒 *LAST SEEN*\n\nUsage: ${config.PREFIX}lastseen <@user/phone>\n\n*Example:* ${config.PREFIX}lastseen @user`);

        }

        await react('🕒');

        try {

            // Try to get presence info

            await sock.presenceSubscribe(target);

            

            // Wait briefly for presence data

            await new Promise(resolve => setTimeout(resolve, 1500));

            

            // Try to get last seen from status

            let lastSeen = 'Unknown';

            let lastSeenTime = 'Unknown';

            

            try {

                const status = await sock.fetchStatus(target);

                if (status?.setAt) {

                    lastSeenTime = new Date(status.setAt).toLocaleString();

                }

            } catch (e) {

                // Status not available

            }

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🕒 *USER INFORMATION*\n\n` +

                             `👤 *User:* @${target.split('@')[0]}\n` +

                             `📱 *JID:* ${target}\n` +

                             `📝 *About Last Updated:* ${lastSeenTime}\n` +

                             `🔍 *Note:* Exact last seen is limited by WhatsApp privacy settings.\n` +

                             `Users can hide their last seen from non-contacts.\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, {

                text: resultText,

                mentions: [target]

            }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('Last seen error:', error);

            

            // Fallback message

            const fallbackText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                               `🕒 *LAST SEEN*\n\n` +

                               `👤 *User:* @${target.split('@')[0]}\n` +

                               `⚠️ Cannot fetch last seen.\n` +

                               `Possible reasons:\n` +

                               `• User has privacy settings enabled\n` +

                               `• User is not a contact\n` +

                               `• User has blocked the bot\n\n` +

                               `> created by wanga`;

            await sock.sendMessage(from, {

                text: fallbackText,

                mentions: [target]

            }, { quoted: msg });

            

            await react('✅');

        }

    }

});

// ============================================

// CHECK NUMBER - Verify WhatsApp registration

// ============================================

commands.push({

    name: 'check',

    description: 'Check if phone number is registered on WhatsApp',

    aliases: ['wa', 'whatsapp'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        if (args.length === 0) {

            await react('❌');

            return reply(`🔍 *CHECK NUMBER*\n\nUsage: ${config.PREFIX}check <phone number>\n\n*Example:* ${config.PREFIX}check 254700000000\n\nChecks if a phone number is registered on WhatsApp.`);

        }

        const phone = args[0].replace(/\D/g, '');

        if (phone.length < 10) {

            return reply('❌ Invalid phone number. Please include country code (e.g., 254 for Kenya)');

        }

        await react('🔍');

        try {

            const result = await sock.onWhatsApp(`${phone}@s.whatsapp.net`);

            

            if (result && result[0]?.exists) {

                const jid = result[0].jid;

                const isBusiness = jid.includes('@s.whatsapp.net') ? 'No' : 'Yes';

                

                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                 `✅ *NUMBER FOUND ON WHATSAPP*\n\n` +

                                 `📞 *Phone:* ${phone}\n` +

                                 `🆔 *JID:* ${jid}\n` +

                                 `🏢 *Business Account:* ${isBusiness}\n` +

                                 `📊 *Status:* ✅ Registered\n\n` +

                                 `> created by wanga`;

                await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            } else {

                const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                                 `❌ *NUMBER NOT FOUND*\n\n` +

                                 `📞 *Phone:* ${phone}\n` +

                                 `📊 *Status:* ❌ Not registered on WhatsApp\n\n` +

                                 `> created by wanga`;

                await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            }

            await react('✅');

        } catch (error) {

            bot.logger.error('Check number error:', error);

            await react('❌');

            await reply(`❌ Failed to check number: ${error.message}`);

        }

    }

});

// ============================================

// JID INFO - Parse and analyze JIDs

// ============================================

commands.push({

    name: 'jidinfo',

    description: 'Get detailed JID information',

    aliases: ['jid', 'parsejid'],

    async execute({ msg, from, sender, args, bot, sock, react, reply }) {

        const { jidDecode, isJidUser, isJidGroup, isJidBroadcast, isJidStatusBroadcast, isLidUser } = require('gifted-baileys');

        let jid = null;

        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {

            jid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];

        } else if (args.length > 0) {

            jid = args[0];

        } else {

            jid = from;

        }

        await react('🔍');

        try {

            const decoded = jidDecode(jid);

            

            // Determine JID type

            let type = '❓ Unknown';

            let emoji = '❓';

            

            if (isJidGroup(jid)) {

                type = 'Group';

                emoji = '👥';

            } else if (isJidUser(jid)) {

                type = 'User';

                emoji = '👤';

            } else if (isJidBroadcast(jid)) {

                type = 'Broadcast List';

                emoji = '📢';

            } else if (isJidStatusBroadcast(jid)) {

                type = 'Status Broadcast';

                emoji = '📱';

            } else if (isLidUser(jid)) {

                type = 'LID (Link ID)';

                emoji = '🔗';

            } else if (jid.endsWith('@newsletter')) {

                type = 'Newsletter';

                emoji = '📰';

            } else if (jid.endsWith('@lid')) {

                type = 'LID';

                emoji = '🔑';

            }

            // Extract components

            const userPart = decoded?.user || jid.split('@')[0] || 'N/A';

            const serverPart = decoded?.server || (jid.includes('@') ? jid.split('@')[1] : 'none') || 'N/A';

            

            // Check if it's a valid JID format

            const isValid = jid.includes('@') ? '✅ Valid' : '❌ Invalid (missing @)';

            const resultText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                             `🔍 *JID INFORMATION*\n\n` +

                             `━━━━━━━━━━━━━━━━━━━\n` +

                             `*Full JID:*\n\`${jid}\`\n\n` +

                             `━━━━━━━━━━━━━━━━━━━\n` +

                             `*DECODED INFO*\n` +

                             `━━━━━━━━━━━━━━━━━━━\n` +

                             `${emoji} *Type:* ${type}\n` +

                             `👤 *User:* ${userPart}\n` +

                             `🌐 *Server:* ${serverPart}\n` +

                             `✅ *Format:* ${isValid}\n\n` +

                             `━━━━━━━━━━━━━━━━━━━\n` +

                             `*QUICK CHECKS*\n` +

                             `━━━━━━━━━━━━━━━━━━━\n` +

                             `• isGroup: ${isJidGroup(jid) ? '✅ Yes' : '❌ No'}\n` +

                             `• isUser: ${isJidUser(jid) ? '✅ Yes' : '❌ No'}\n` +

                             `• isLID: ${isLidUser(jid) ? '✅ Yes' : '❌ No'}\n` +

                             `• isBroadcast: ${isJidBroadcast(jid) ? '✅ Yes' : '❌ No'}\n\n` +

                             `> created by wanga`;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

            await react('✅');

        } catch (error) {

            bot.logger.error('JID info error:', error);

            

            const errorText = `┏━━━━━━━━━━━━━━━━━━━┓\n┃ *${config.BOT_NAME}*\n┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                            `❌ *JID PARSE ERROR*\n\n` +

                            `*Input:* ${jid}\n` +

                            `*Error:* ${error.message}\n\n` +

                            `Make sure the JID is in the correct format.\n` +

                            `Example: 254700000000@s.whatsapp.net\n\n` +

                            `> created by wanga`;

            await sock.sendMessage(from, { text: errorText }, { quoted: msg });

            await react('❌');

        }

    }

});

module.exports = { commands };