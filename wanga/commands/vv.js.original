// MEGAN-MD View Once Reveal Command - Using quoted from context

const fs = require('fs-extra');
const path = require('path');
const { downloadMediaMessage } = require('gifted-baileys');
const { uploadAuto } = require('../../megan/lib/upload');

const commands = [];

commands.push({
    name: 'vv',
    description: 'Reveal view once media from replied message',
    aliases: ['reveal', 'extract'],
    async execute({ msg, from, sender, args, bot, sock, react, reply, isOwner, quoted }) {
        
        // Check if replying to a message
        if (!quoted) {
            return reply(`📌 *VIEW ONCE REVEALER*\n\n*Usage:* Reply to any media (image, video, audio) with .vv\n\n> created by wanga`);
        }

        if (!isOwner) {
            return reply('❌ Owner only command!');
        }

        await react('🔄');

        // Debug: Log quoted message structure
        console.log('\n🔍 VV COMMAND - QUOTED MESSAGE STRUCTURE:');
        console.log('   Has imageMessage:', !!quoted.message?.imageMessage);
        console.log('   Has videoMessage:', !!quoted.message?.videoMessage);
        console.log('   Has audioMessage:', !!quoted.message?.audioMessage);
        console.log('   Has viewOnceMessage:', !!quoted.message?.viewOnceMessage);
        console.log('   Has viewOnceMessageV2:', !!quoted.message?.viewOnceMessageV2);
        console.log('   Has viewOnceMessageV2Extension:', !!quoted.message?.viewOnceMessageV2Extension);
        
        let viewOnceContent = null;
        let mediaType = null;
        let originalCaption = '';
        
        // Check if quoted.message exists
        const qMsg = quoted.message || quoted;
        
        // Format 1: Direct view once
        if (qMsg.imageMessage?.viewOnce || qMsg.videoMessage?.viewOnce || qMsg.audioMessage?.viewOnce) {
            mediaType = Object.keys(qMsg).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t)));
            if (mediaType) {
                viewOnceContent = { [mediaType]: qMsg[mediaType] };
                originalCaption = qMsg[mediaType]?.caption || '';
                console.log(`✅ Detected direct view-once: ${mediaType}`);
            }
        }
        // Format 2: viewOnceMessage wrapper
        else if (qMsg.viewOnceMessage) {
            const innerMsg = qMsg.viewOnceMessage.message;
            mediaType = Object.keys(innerMsg).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t)));
            if (mediaType) {
                viewOnceContent = { [mediaType]: innerMsg[mediaType] };
                originalCaption = innerMsg[mediaType]?.caption || '';
                console.log(`✅ Detected viewOnceMessage wrapper: ${mediaType}`);
            }
        }
        // Format 3: viewOnceMessageV2
        else if (qMsg.viewOnceMessageV2) {
            const innerMsg = qMsg.viewOnceMessageV2.message;
            mediaType = Object.keys(innerMsg).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t)));
            if (mediaType) {
                viewOnceContent = { [mediaType]: innerMsg[mediaType] };
                originalCaption = innerMsg[mediaType]?.caption || '';
                console.log(`✅ Detected viewOnceMessageV2: ${mediaType}`);
            }
        }
        // Format 4: viewOnceMessageV2Extension
        else if (qMsg.viewOnceMessageV2Extension) {
            const innerMsg = qMsg.viewOnceMessageV2Extension.message;
            mediaType = Object.keys(innerMsg).find(key => key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t)));
            if (mediaType) {
                viewOnceContent = { [mediaType]: innerMsg[mediaType] };
                originalCaption = innerMsg[mediaType]?.caption || '';
                console.log(`✅ Detected viewOnceMessageV2Extension: ${mediaType}`);
            }
        }
        // Format 5: Regular media
        else if (qMsg.imageMessage) {
            mediaType = 'imageMessage';
            viewOnceContent = { imageMessage: qMsg.imageMessage };
            originalCaption = qMsg.imageMessage.caption || '';
            console.log(`✅ Detected regular image`);
        }
        else if (qMsg.videoMessage) {
            mediaType = 'videoMessage';
            viewOnceContent = { videoMessage: qMsg.videoMessage };
            originalCaption = qMsg.videoMessage.caption || '';
            console.log(`✅ Detected regular video`);
        }
        else if (qMsg.audioMessage) {
            mediaType = 'audioMessage';
            viewOnceContent = { audioMessage: qMsg.audioMessage };
            originalCaption = qMsg.audioMessage.caption || '';
            console.log(`✅ Detected regular audio`);
        }
        else {
            console.log('❌ No media found in quoted message');
            await react('❌');
            return reply('❌ Please reply to an image, video, or audio message!');
        }

        if (!mediaType || !viewOnceContent) {
            console.log('❌ Could not extract media');
            await react('❌');
            return reply('❌ Could not extract media from replied message.');
        }

        let tempFilePath = null;

        try {
            const mediaMessage = { ...viewOnceContent[mediaType], viewOnce: false };
            
            let messageToDownload = qMsg;
            if (qMsg.viewOnceMessage) messageToDownload = qMsg.viewOnceMessage;
            else if (qMsg.viewOnceMessageV2) messageToDownload = qMsg.viewOnceMessageV2;
            else if (qMsg.viewOnceMessageV2Extension) messageToDownload = qMsg.viewOnceMessageV2Extension;

            console.log(`📥 Downloading media...`);
            const buffer = await downloadMediaMessage(
                { message: messageToDownload },
                'buffer',
                {},
                { logger: console, reuploadRequest: true }
            );

            if (!buffer) {
                console.log('❌ Download failed');
                await react('❌');
                return reply('❌ Failed to download media!');
            }

            let ext = 'bin';
            const type = mediaType.toLowerCase();
            if (type.includes('image')) ext = 'jpg';
            else if (type.includes('video')) ext = 'mp4';
            else if (type.includes('audio')) ext = 'mp3';

            const tempDir = path.join(process.cwd(), 'temp');
            await fs.ensureDir(tempDir);
            const tempFileName = `reveal_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
            tempFilePath = path.join(tempDir, tempFileName);
            await fs.writeFile(tempFilePath, buffer);

            const uploadFileName = `revealed_${Date.now()}.${ext}`;
            const { url, success } = await uploadAuto(buffer, uploadFileName);

            if (!success || !url) {
                console.log('❌ Upload failed');
                await react('❌');
                return reply('❌ Failed to upload media!');
            }

            const botName = await bot.db.getSetting('bot_name', 'MEGAN-MD');
            const currentTime = new Date().toLocaleTimeString();
            const senderShort = sender.split('@')[0];

            const isViewOnce = qMsg.imageMessage?.viewOnce || 
                               qMsg.videoMessage?.viewOnce || 
                               qMsg.audioMessage?.viewOnce ||
                               qMsg.viewOnceMessage ||
                               qMsg.viewOnceMessageV2 ||
                               qMsg.viewOnceMessageV2Extension;
            
            const viewOnceTag = isViewOnce ? '🔐 *VIEW ONCE REVEALED*' : '📥 *MEDIA EXTRACTED*';
            
            const caption = `${viewOnceTag}\n\n` +
                          `👤 *From:* @${senderShort}\n` +
                          `${originalCaption ? `📝 *Caption:* ${originalCaption}\n` : ''}` +
                          `🔗 *Link:* ${url}\n` +
                          `⏰ *Time:* ${currentTime}\n\n` +
                          `> *REVEALED BY ${botName}*`;

            console.log(`📤 Sending ${mediaType} to ${senderShort}...`);

            if (type.includes('image')) {
                await sock.sendMessage(sender, { image: buffer, caption: caption, mentions: [sender] }, { quoted: msg });
            } else if (type.includes('video')) {
                await sock.sendMessage(sender, { video: buffer, caption: caption, mentions: [sender] }, { quoted: msg });
            } else if (type.includes('audio')) {
                await sock.sendMessage(sender, { audio: buffer, mimetype: 'audio/mpeg', ptt: false, caption: caption, mentions: [sender] }, { quoted: msg });
            }

            await react('✅');
            console.log('✅ Media revealed successfully!\n');

        } catch (error) {
            console.error('VV command error:', error);
            await react('❌');
            await reply(`❌ Error: ${error.message}`);
        } finally {
            if (tempFilePath) {
                try { await fs.unlink(tempFilePath); } catch (e) {}
            }
        }
    }
});

module.exports = { commands };
