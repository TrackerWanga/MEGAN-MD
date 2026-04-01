// MEGAN-MD Media Commands - Consistent styling with buttons

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../megan/config');
const MediaProcessor = require('../../megan/lib/mediaProcessor');
const { downloadMediaMessage } = require('gifted-baileys');

const commands = [];
const mediaProcessor = new MediaProcessor();
const TEMP_DIR = path.join(__dirname, '../../temp');
fs.ensureDirSync(TEMP_DIR);

const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b';
const BOT_LOGO = 'https://files.catbox.moe/0v8bkv.png';

// Static meme images
const MEME_IMAGES = [
    'https://files.catbox.moe/xnqfhk.jpg',
    'https://files.catbox.moe/99jcbd.jpg',
    'https://files.catbox.moe/a8yflv.jpg',
    'https://files.catbox.moe/xn7fef.jpg',
    'https://files.catbox.moe/fzo3sg.jpg',
    'https://files.catbox.moe/ypi5fw.jpg',
    'https://files.catbox.moe/f9eqxi.jpg',
    'https://files.catbox.moe/eswum9.jpg',
    'https://files.catbox.moe/1w2z1i.jpg',
    'https://files.catbox.moe/5qkf90.jpg',
    'https://files.catbox.moe/hp4nki.jpg',
    'https://files.catbox.moe/hq6hhu.jpg',
    'https://files.catbox.moe/ggwzc9.jpg',
    'https://files.catbox.moe/evpzeb.jpg',
    'https://files.catbox.moe/xdtch8.jpg',
    'https://files.catbox.moe/u8itde.jpg',
    'https://files.catbox.moe/qzmfuo.jpg',
    'https://files.catbox.moe/lgqabr.jpg',
    'https://files.catbox.moe/rxoajf.jpg',
    'https://files.catbox.moe/k1qck3.jpg',
    'https://files.catbox.moe/al7u80.jpg'
];

// Helper function using same pattern as basic.js
async function sendButtonMenu(sock, from, options, quotedMsg) {
    const { sendButtons } = require('gifted-btns');
    
    try {
        return await sendButtons(sock, from, {
            title: options.title || '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: options.text,
            footer: options.footer || '> created by wanga',
            image: options.image ? { url: options.image } : null,
            buttons: options.buttons || []
        }, { quoted: quotedMsg });
    } catch (error) {
        console.error('Button error:', error);
        await sock.sendMessage(from, { text: options.text }, { quoted: quotedMsg });
    }
}

async function downloadMedia(msg) {
    return await downloadMediaMessage(msg, 'buffer', {}, { logger: console });
}

async function uploadToCatbox(buffer, filename) {
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', buffer, { filename });

    const response = await axios.post('https://catbox.moe/user/api.php', formData, {
        headers: formData.getHeaders()
    });
    return response.data.trim();
}

function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024 * 1024) return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
}

// ==================== STICKER COMMANDS ====================

// 1. STICKER MAKER
commands.push({
    name: 'sticker',
    description: 'Create sticker from image/video',
    aliases: ['s', 'stick'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasImage = msg.message?.imageMessage || quoted?.imageMessage;
        const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;

        if (!hasImage && !hasVideo) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎨 *STICKER MAKER*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ Reply to image/video with ${config.PREFIX}sticker\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🎨');
        const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage ? msg : { ...msg, message: quoted };
        const buffer = await downloadMedia(targetMsg);
        const stickerBuffer = await mediaProcessor.createSticker(buffer);

        await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Sticker Created*\n━━━━━━━━━━━━━━━━━━━\n_🎨 Sticker created successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 2. STICKER TO IMAGE
commands.push({
    name: 'toimage',
    description: 'Convert sticker to image',
    aliases: ['img', 'toimg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasSticker = msg.message?.stickerMessage || quoted?.stickerMessage;

        if (!hasSticker) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🖼️ *STICKER TO IMAGE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ Reply to sticker with ${config.PREFIX}toimage\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');
        const targetMsg = msg.message?.stickerMessage ? msg : { ...msg, message: quoted };
        const buffer = await downloadMedia(targetMsg);
        const imageBuffer = await mediaProcessor.stickerToImage(buffer);

        await sock.sendMessage(from, {
            image: imageBuffer,
            caption: `✅ *Converted to image*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Image Created*\n━━━━━━━━━━━━━━━━━━━\n_🖼️ Sticker converted to image successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ==================== AUDIO COMMANDS ====================

// 3. TEXT TO SPEECH (audio)
commands.push({
    name: 'say',
    description: 'Convert text to audio',
    aliases: ['tts'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🗣️');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🗣️ *TEXT TO SPEECH*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}say <text>\n_Example:_ ${config.PREFIX}say Hello world\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const text = args.join(' ').substring(0, 200);
        await react('🗣️');

        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
        const response = await axios({ method: 'GET', url: ttsUrl, responseType: 'arraybuffer', timeout: 30000 });
        const audioBuffer = Buffer.from(response.data);
        const formattedAudio = await mediaProcessor.toAudio(audioBuffer);

        await sock.sendMessage(from, {
            audio: formattedAudio,
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Audio Created*\n━━━━━━━━━━━━━━━━━━━\n_🗣️ Text converted to audio successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 4. VOICE NOTE (PTT)
commands.push({
    name: 'voice',
    description: 'Convert text to voice note',
    aliases: ['vn', 'voicenote'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (!args.length) {
            await react('🎤');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎤 *VOICE NOTE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}voice <text>\n_Example:_ ${config.PREFIX}voice Hello world\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const text = args.join(' ').substring(0, 200);
        await react('🎤');

        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
        const response = await axios({ method: 'GET', url: ttsUrl, responseType: 'arraybuffer', timeout: 30000 });
        const audioBuffer = Buffer.from(response.data);
        const pttBuffer = await mediaProcessor.toPTT(audioBuffer);

        await sock.sendMessage(from, {
            audio: pttBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Voice Note Created*\n━━━━━━━━━━━━━━━━━━━\n_🎤 Voice note created successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 5. EXTRACT AUDIO FROM VIDEO
commands.push({
    name: 'toaudio',
    description: 'Extract audio from video',
    aliases: ['mp3', 'extract'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasVideo = msg.message?.videoMessage || quoted?.videoMessage;

        if (!hasVideo) {
            await react('❌');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎵 *AUDIO EXTRACTOR*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ Reply to video with ${config.PREFIX}toaudio\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🎵');
        const targetMsg = msg.message?.videoMessage ? msg : { ...msg, message: quoted };
        const buffer = await downloadMedia(targetMsg);
        const audioBuffer = await mediaProcessor.extractAudio(buffer);

        await sock.sendMessage(from, {
            audio: audioBuffer,
            mimetype: 'audio/mpeg',
            ptt: false
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Audio Extracted*\n━━━━━━━━━━━━━━━━━━━\n_🎵 Audio extracted from video successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ==================== IMAGE COMMANDS ====================

// 6. CIRCLE IMAGE
commands.push({
    name: 'circle',
    description: 'Make circular image',
    aliases: ['round'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasImage = msg.message?.imageMessage || quoted?.imageMessage;

        if (!hasImage) {
            await react('⭕');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `⭕ *CIRCLE IMAGE*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ Reply to image with ${config.PREFIX}circle\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('🔄');
        const targetMsg = msg.message?.imageMessage ? msg : { ...msg, message: quoted };
        const buffer = await downloadMedia(targetMsg);
        const circleBuffer = await mediaProcessor.createCircle(buffer);

        await sock.sendMessage(from, {
            image: circleBuffer,
            caption: `✅ *Circular image created*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Circle Image Created*\n━━━━━━━━━━━━━━━━━━━\n_⭕ Image converted to circle successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 7. TEXT PRO EFFECT
commands.push({
    name: 'textpro',
    description: 'Create text effects',
    aliases: ['texteffect'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        if (args.length < 2) {
            await react('🎨');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `🎨 *TEXTPRO EFFECTS*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ ${config.PREFIX}textpro <effect> <text>\n\n_Effects:_ 3d, neon, gold, fire, matrix\n\n_Example:_ ${config.PREFIX}textpro 3d MEGAN\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        const effect = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        const effectUrls = {
            '3d': 'https://textpro.me/create-3d-text-effects-1046.html',
            'neon': 'https://textpro.me/neon-text-effect-1019.html',
            'gold': 'https://textpro.me/gold-text-effect-1060.html',
            'fire': 'https://textpro.me/fire-text-effect-1073.html',
            'matrix': 'https://textpro.me/matrix-style-text-effect-1107.html'
        };

        const url = effectUrls[effect];
        if (!url) {
            await react('❌');
            return reply(`❌ *Invalid effect!* Available: 3d, neon, gold, fire, matrix\n\n> created by wanga`);
        }

        await react('🎨');

        const response = await axios.get(`https://api.siputzx.my.id/api/m/textpro`, {
            params: { url: url, text1: text },
            responseType: 'arraybuffer',
            timeout: 30000
        });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: `🎨 *TextPro Effect*\n\n_Effect:_ ${effect}\n_Text:_ ${text}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Text Effect Created*\n━━━━━━━━━━━━━━━━━━━\n_🎨 Text effect created successfully!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ==================== UPLOAD COMMANDS ====================

// 8. CATBOX UPLOAD
commands.push({
    name: 'catbox',
    description: 'Upload media to Catbox.moe',
    aliases: ['cat'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const hasMedia = msg.message?.imageMessage || msg.message?.videoMessage ||
                       msg.message?.audioMessage || quoted?.imageMessage ||
                       quoted?.videoMessage || quoted?.audioMessage;

        if (!hasMedia && args.length === 0) {
            await react('📤');
            return sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `📤 *CATBOX UPLOAD*\n━━━━━━━━━━━━━━━━━━━\n_Usage:_ Reply to media with ${config.PREFIX}catbox\n_Or:_ ${config.PREFIX}catbox <image url>\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }

        await react('📤');

        let buffer, filename;

        if (args.length > 0 && args[0].startsWith('http')) {
            const response = await axios.get(args[0], { responseType: 'arraybuffer', timeout: 30000 });
            buffer = Buffer.from(response.data);
            filename = `upload_${Date.now()}.jpg`;
        } else {
            const targetMsg = msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage
                ? msg : { ...msg, message: quoted };
            buffer = await downloadMedia(targetMsg);
            filename = `upload_${Date.now()}.jpg`;
        }

        const url = await uploadToCatbox(buffer, filename);
        const fileSize = formatFileSize(buffer.length);

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `✅ *Uploaded*\n━━━━━━━━━━━━━━━━━━━\n_📁 File:_ ${filename}\n_📦 Size:_ ${fileSize}\n_🔗 URL:_ ${url}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: '📋 Copy URL', copy_code: url }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '🔗 Open Link', url: url }) },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ==================== RANDOM IMAGE COMMANDS ====================

// 9. RANDOM WAIFU
commands.push({
    name: 'waifu',
    description: 'Get random waifu image',
    aliases: ['waifuimg'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('🌸');
        const response = await axios.get('https://api.siputzx.my.id/api/r/waifu', {
            responseType: 'arraybuffer',
            timeout: 10000
        });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: `🌸 *Random Waifu*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🌸 *Random Waifu*\n━━━━━━━━━━━━━━━━━━━\n_Enjoy your waifu image!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}waifu`, text: '🔄 Another' },
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 10. RANDOM NEKO
commands.push({
    name: 'neko',
    description: 'Get random neko girl image',
    aliases: ['nekogirl'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('🐱');
        const response = await axios.get('https://api.siputzx.my.id/api/r/neko', {
            responseType: 'arraybuffer',
            timeout: 10000
        });

        await sock.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: `🐱 *Random Neko*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
        }, { quoted: msg });

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🐱 *Random Neko*\n━━━━━━━━━━━━━━━━━━━\n_Enjoy your neko image!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}neko`, text: '🔄 Another' },
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// 11. RANDOM MEME
commands.push({
    name: 'meme',
    description: 'Get random meme from collection',
    aliases: ['randommeme', 'memes'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('😂');

        const randomUrl = MEME_IMAGES[Math.floor(Math.random() * MEME_IMAGES.length)];

        try {
            const response = await axios.get(randomUrl, {
                responseType: 'arraybuffer',
                timeout: 15000
            });

            const imageBuffer = Buffer.from(response.data);

            await sock.sendMessage(from, {
                image: imageBuffer,
                caption: `😂 *Random Meme*\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`
            }, { quoted: msg });

            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `😂 *Random Meme*\n━━━━━━━━━━━━━━━━━━━\n_Enjoy your meme!_\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}meme`, text: '🔄 Another' },
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
            await react('✅');

        } catch (error) {
            console.error('Meme error:', error);
            await react('❌');
            await sendButtonMenu(sock, from, {
                title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
                text: `❌ *Failed to get meme*\n━━━━━━━━━━━━━━━━━━━\n_Try again later._\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
                image: BOT_LOGO,
                buttons: [
                    { id: `${config.PREFIX}media`, text: '🎵 Media' },
                    { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
                ]
            }, msg);
        }
    }
});

// ==================== CLEANUP ====================

// 12. CLEAN TEMP FILES
commands.push({
    name: 'cleantemp',
    description: 'Clean temporary files',
    aliases: ['cleantemp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        await react('🧹');
        const result = await mediaProcessor.cleanup();

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: `🧹 *Cleanup Complete*\n━━━━━━━━━━━━━━━━━━━\n_🗑️ Deleted:_ ${result.deleted} temp files\n_💾 Freed:_ ${formatFileSize(result.freed || 0)}\n\n_ᴄʀᴇᴀᴛᴇᴅ ʙʏ:_ Wanga`,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}media`, text: '🎵 Media' },
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

// ==================== MEDIA HELP ====================

// 13. MEDIA HELP
commands.push({
    name: 'media',
    description: 'Show all media commands',
    aliases: ['mediahelp'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, buttons }) {
        const prefix = config.PREFIX;

        const helpText = `🛠️ *MEDIA COMMANDS*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `*🎨 STICKERS*\n` +
            `_${prefix}sticker_ - Make sticker\n` +
            `_${prefix}toimage_ - Sticker to image\n\n` +

            `*🎵 AUDIO*\n` +
            `_${prefix}say_ - Text to speech\n` +
            `_${prefix}voice_ - Voice note\n` +
            `_${prefix}toaudio_ - Extract audio\n\n` +

            `*🖼️ IMAGE*\n` +
            `_${prefix}circle_ - Circular image\n` +
            `_${prefix}textpro_ - Text effects\n` +
            `_${prefix}waifu_ - Random waifu\n` +
            `_${prefix}neko_ - Random neko\n` +
            `_${prefix}meme_ - Random meme\n\n` +

            `*📤 UPLOAD*\n` +
            `_${prefix}catbox_ - Upload to Catbox\n` +
            `_${prefix}cleantemp_ - Clean temp files\n\n` +

            `> created by wanga`;

        await sendButtonMenu(sock, from, {
            title: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
            text: helpText,
            image: BOT_LOGO,
            buttons: [
                { id: `${config.PREFIX}menu`, text: '📋 Menu' },
                { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: '📢 Channel', url: CHANNEL_LINK }) }
            ]
        }, msg);
        await react('✅');
    }
});

module.exports = { commands };
