const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');
const MediaProcessor = require('../../megan/lib/mediaProcessor');

// WhatsApp Channel Newsletter Context
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
            title: options.title || "📢 Official Channel",
            body: options.body || "Join for updates & announcements",
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
const mediaProcessor = new MediaProcessor();

// Helper to download media
async function downloadMedia(msg) {
    const { downloadMediaMessage } = require('gifted-baileys');
    return await downloadMediaMessage(msg, 'buffer', {}, { logger: console });
}

// ==================== STICKER COMMANDS ====================

commands.push({
    name: 'sticker',
    description: 'Create sticker from image/video',
    aliases: ['s', 'stick'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;
            
            if (!hasImage && !hasVideo) {
                await react('❌');
                return reply(`🎨 *STICKER MAKER*\n\nUsage: Reply to image/video with ${config.PREFIX}sticker`);
            }

            await react('🎨');
            
            const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const stickerBuffer = await mediaProcessor.createSticker(buffer);
            
            await sock.sendMessage(from, {
                sticker: stickerBuffer,
                ...createNewsletterContext(sender, {
                    title: "🎨 Sticker Created",
                    body: "Share with friends"
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('Sticker error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

commands.push({
    name: 'toimage',
    description: 'Convert sticker to image',
    aliases: ['img', 'toimg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasSticker = msg.message?.stickerMessage || quoted?.stickerMessage;
            
            if (!hasSticker) {
                await react('❌');
                return reply(`🖼️ *STICKER TO IMAGE*\n\nUsage: Reply to sticker with ${config.PREFIX}toimage`);
            }

            await react('🔄');
            
            const targetMsg = msg.message?.stickerMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const imageBuffer = await mediaProcessor.stickerToImage(buffer);
            
            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `✅ Converted to image\n\n> created by wanga`,
                ...createNewsletterContext(sender, {
                    title: "🖼️ Image Converted",
                    body: "Sticker to image"
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('ToImage error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== TTS COMMAND (FIXED) ====================

commands.push({
    name: 'say',
    description: 'Convert text to voice note',
    aliases: ['tts'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            if (!args.length) {
                await react('🗣️');
                return reply(`🗣️ *TEXT TO SPEECH*\n\nUsage: ${config.PREFIX}say <text>\nExample: ${config.PREFIX}say Hello world\nMax: 200 chars`);
            }

            const text = args.join(' ').substring(0, 200);
            
            await react('🗣️');
            
            // Use Google TTS API
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
            
            const response = await axios({
                method: 'GET',
                url: ttsUrl,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 30000
            });

            const audioBuffer = Buffer.from(response.data);
            
            // Convert to proper audio format for WhatsApp
            const formattedAudio = await mediaProcessor.toAudio(audioBuffer);
            
            // Send as audio message (like .play does)
            await sock.sendMessage(from, {
                audio: formattedAudio,
                mimetype: 'audio/mpeg',
                ptt: false, // false = music/audio, true = voice note
                ...createNewsletterContext(sender, {
                    title: "🗣️ Text to Speech",
                    body: text.substring(0, 30)
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('TTS error:', error);
            await react('❌');
            await reply(`❌ TTS failed: ${error.message}\n\nTry again later.`);
        }
    }
});

// ==================== VOICE NOTE COMMAND ====================

commands.push({
    name: 'voice',
    description: 'Convert text to voice note (PTT)',
    aliases: ['vn', 'voicenote'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            if (!args.length) {
                await react('🎤');
                return reply(`🎤 *VOICE NOTE*\n\nUsage: ${config.PREFIX}voice <text>\nExample: ${config.PREFIX}voice Hello world`);
            }

            const text = args.join(' ').substring(0, 200);
            
            await react('🎤');
            
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
            
            const response = await axios({
                method: 'GET',
                url: ttsUrl,
                responseType: 'arraybuffer',
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 30000
            });

            const audioBuffer = Buffer.from(response.data);
            
            // Convert to voice note format (PTT)
            const pttBuffer = await mediaProcessor.toPTT(audioBuffer);
            
            await sock.sendMessage(from, {
                audio: pttBuffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true, // true = voice note
                ...createNewsletterContext(sender, {
                    title: "🎤 Voice Note",
                    body: text.substring(0, 30)
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('Voice error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== AUDIO CONVERTER ====================

commands.push({
    name: 'toaudio',
    description: 'Extract audio from video',
    aliases: ['mp3', 'extract'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;
            
            if (!hasVideo) {
                await react('❌');
                return reply(`🎵 *AUDIO EXTRACTOR*\n\nUsage: Reply to video with ${config.PREFIX}toaudio`);
            }

            await react('🎵');
            
            const targetMsg = msg.message?.videoMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const audioBuffer = await mediaProcessor.extractAudio(buffer);
            
            await sock.sendMessage(from, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                ...createNewsletterContext(sender, {
                    title: "🎵 Audio Extracted",
                    body: "From video"
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('ToAudio error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== SPEED COMMAND ====================

commands.push({
    name: 'speed',
    description: 'Change audio speed (0.5x - 2.0x)',
    aliases: ['audiospeed'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const speed = parseFloat(args[0]) || 1.0;
            
            if (speed < 0.5 || speed > 2.0) {
                await react('❌');
                return reply(`⚡ *AUDIO SPEED*\n\nUsage: Reply to audio with ${config.PREFIX}speed <0.5-2.0>\nExample: ${config.PREFIX}speed 1.5`);
            }

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;
            
            if (!hasAudio) {
                await react('❌');
                return reply('❌ Reply to an audio message.');
            }

            await react('⚡');
            
            const targetMsg = msg.message?.audioMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const speedBuffer = await mediaProcessor.changeSpeed(buffer, speed);
            
            await sock.sendMessage(from, {
                audio: speedBuffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                ...createNewsletterContext(sender, {
                    title: "⚡ Speed Changed",
                    body: `${speed}x speed`
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('Speed error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== VOLUME COMMAND ====================

commands.push({
    name: 'vol',
    description: 'Change audio volume (0.5x - 2.0x)',
    aliases: ['volume'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const volume = parseFloat(args[0]) || 1.0;
            
            if (volume < 0.5 || volume > 2.0) {
                await react('❌');
                return reply(`🔊 *AUDIO VOLUME*\n\nUsage: Reply to audio with ${config.PREFIX}vol <0.5-2.0>\nExample: ${config.PREFIX}vol 1.5`);
            }

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasAudio = msg.message?.audioMessage || quoted?.audioMessage;
            
            if (!hasAudio) {
                await react('❌');
                return reply('❌ Reply to an audio message.');
            }

            await react('🔊');
            
            const targetMsg = msg.message?.audioMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const volumeBuffer = await mediaProcessor.changeVolume(buffer, volume);
            
            await sock.sendMessage(from, {
                audio: volumeBuffer,
                mimetype: 'audio/mpeg',
                ptt: false,
                ...createNewsletterContext(sender, {
                    title: "🔊 Volume Changed",
                    body: `${volume}x volume`
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('Volume error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== IMAGE FILTERS ====================

commands.push({
    name: 'filter',
    description: 'Apply filter to image',
    aliases: ['filt'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const filter = args[0]?.toLowerCase() || 'greyscale';
            const validFilters = ['greyscale', 'grayscale', 'invert', 'sepia', 'brighten', 'darken', 'contrast', 'blur', 'sharpen'];
            
            if (!validFilters.includes(filter)) {
                await react('🎨');
                return reply(`🎨 *FILTERS*\n\nUsage: ${config.PREFIX}filter <type>\nAvailable: ${validFilters.join(', ')}\nExample: ${config.PREFIX}filter sepia`);
            }

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            
            if (!hasImage) {
                await react('❌');
                return reply('❌ Reply to an image.');
            }

            await react('🔄');
            
            const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const filteredBuffer = await mediaProcessor.applyFilter(buffer, filter);

            await sock.sendMessage(from, {
                image: filteredBuffer,
                caption: `✅ ${filter} filter applied\n\n> created by wanga`,
                ...createNewsletterContext(sender, {
                    title: `🎨 ${filter}`,
                    body: "Filter applied"
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('Filter error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== CIRCLE IMAGE ====================

commands.push({
    name: 'circle',
    description: 'Make circular image',
    aliases: ['round'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            
            if (!hasImage) {
                await react('⭕');
                return reply(`⭕ *CIRCLE IMAGE*\n\nUsage: Reply to image with ${config.PREFIX}circle`);
            }

            await react('🔄');
            
            const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const circleBuffer = await mediaProcessor.createCircle(buffer);

            await sock.sendMessage(from, {
                image: circleBuffer,
                caption: `✅ Circular image created\n\n> created by wanga`,
                ...createNewsletterContext(sender, {
                    title: "⭕ Circle Complete",
                    body: "Image converted to circle"
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('Circle error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== REMOVE BACKGROUND ====================

commands.push({
    name: 'removebg',
    description: 'Remove white/light background',
    aliases: ['nobg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply }) {
        try {
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
            
            if (!hasImage) {
                await react('✨');
                return reply(`✨ *REMOVE BACKGROUND*\n\nUsage: Reply to image with ${config.PREFIX}removebg`);
            }

            await react('✨');
            
            const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
            const buffer = await downloadMedia(targetMsg);
            
            const resultBuffer = await mediaProcessor.removeBackground(buffer);

            await sock.sendMessage(from, {
                image: resultBuffer,
                caption: `✅ Background removed\n\n> created by wanga`,
                ...createNewsletterContext(sender, {
                    title: "✨ Background Removed",
                    body: "Transparent background"
                })
            }, { quoted: msg });

            await react('✅');

        } catch (error) {
            bot.logger.error('RemoveBG error:', error);
            await react('❌');
            await reply(`❌ Failed: ${error.message}`);
        }
    }
});

// ==================== CLEANUP ====================

commands.push({
    name: 'cleantemp',
    description: 'Clean temporary files',
    aliases: ['cleantemp'],
    async execute({ msg, from, sender, bot, sock, react, reply }) {
        await react('🧹');
        
        const result = await mediaProcessor.cleanup();
        
        await sock.sendMessage(from, {
            text: `🧹 *Cleanup Complete*\n\n🗑️ Deleted: ${result.deleted} temp files`,
            ...createNewsletterContext(sender, {
                title: "🧹 Cleanup",
                body: "Temporary files cleared"
            })
        }, { quoted: msg });
        
        await react('✅');
    }
});

module.exports = { commands };
