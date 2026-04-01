// MEGAN-MD View Once Handler - Automatic detection (like Gifted's GiftedAntiViewOnce)

const { downloadMediaMessage } = require('gifted-baileys');
const fs = require('fs-extra');
const path = require('path');
const Uploader = require('./upload');
const { resolveRealJid } = require('./lidResolver');

async function handleViewOnce(sock, message, db, ownerJid) {
    try {
        if (!message?.message) return;
        if (message.key.fromMe) return;
        
        // Check if auto-view-once is enabled
        const autoViewOnce = await db.getSetting('autoviewonce', 'on');
        if (autoViewOnce !== 'on') return;
        
        const msgContent = message.message;
        let viewOnceContent = null;
        let mediaType = null;
        
        // ========== DETECT VIEW ONCE IN ALL FORMATS (LIKE GIFTED) ==========
        
        // Format 1: Direct view once in image/video/audio message
        if (msgContent.imageMessage?.viewOnce || 
            msgContent.videoMessage?.viewOnce || 
            msgContent.audioMessage?.viewOnce) {
            
            mediaType = Object.keys(msgContent).find(key => 
                key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))
            );
            if (mediaType) {
                viewOnceContent = { [mediaType]: msgContent[mediaType] };
            }
        } 
        // Format 2: viewOnceMessage wrapper
        else if (msgContent.viewOnceMessage) {
            viewOnceContent = msgContent.viewOnceMessage.message;
            mediaType = viewOnceContent ? Object.keys(viewOnceContent).find(key => 
                key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))
            ) : null;
        } 
        // Format 3: viewOnceMessageV2
        else if (msgContent.viewOnceMessageV2) {
            viewOnceContent = msgContent.viewOnceMessageV2.message;
            mediaType = viewOnceContent ? Object.keys(viewOnceContent).find(key => 
                key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))
            ) : null;
        } 
        // Format 4: viewOnceMessageV2Extension
        else if (msgContent.viewOnceMessageV2Extension) {
            viewOnceContent = msgContent.viewOnceMessageV2Extension.message;
            mediaType = viewOnceContent ? Object.keys(viewOnceContent).find(key => 
                key.endsWith("Message") && ["image", "video", "audio"].some(t => key.includes(t))
            ) : null;
        }
        
        if (!viewOnceContent || !mediaType || !viewOnceContent[mediaType]) return;
        
        console.log(`🔐 View-once ${mediaType} detected automatically from ${message.key.participant || message.key.remoteJid}`);
        
        // Get sender info
        let sender = message.key.participant || message.key.remoteJid;
        const resolvedSender = await resolveRealJid(sock, sender);
        const senderNum = resolvedSender.split('@')[0].split(':')[0];
        const botName = await db.getSetting('bot_name', 'MEGAN-MD');
        
        // Create media message without view-once flag (like Gifted)
        const mediaMessage = {
            ...viewOnceContent[mediaType],
            viewOnce: false,
        };
        
        // Create temp directory
        const tempDir = path.join(process.cwd(), 'temp');
        await fs.ensureDir(tempDir);
        
        const tempFileName = `viewonce_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        let tempFilePath = null;
        
        try {
            // Download the media (like Gifted's downloadAndSaveMediaMessage)
            const buffer = await downloadMediaMessage(
                { message: viewOnceContent[mediaType] },
                'buffer',
                {},
                { logger: console, reuploadRequest: true }
            );
            
            if (!buffer) {
                console.log('❌ Failed to download view-once media');
                return;
            }
            
            // Determine file extension
            let ext = 'bin';
            if (mediaType.includes('image')) ext = 'jpg';
            else if (mediaType.includes('video')) ext = 'mp4';
            else if (mediaType.includes('audio')) ext = 'mp3';
            
            tempFilePath = path.join(tempDir, `${tempFileName}.${ext}`);
            await fs.writeFile(tempFilePath, buffer);
            
            // Upload to Catbox
            const filename = `viewonce_${Date.now()}.${ext}`;
            const { url, success } = await Uploader.uploadAuto(buffer, filename);
            
            if (!success || !url) {
                console.log('❌ Failed to upload view-once media');
                return;
            }
            
            // Get original caption
            const originalCaption = mediaMessage.caption || '';
            const currentTime = new Date().toLocaleTimeString();
            
            // Create caption like Gifted
            const caption = `👁️ *VIEW ONCE REVEALED*\n\n` +
                          `📤 *From:* @${senderNum}\n` +
                          `${originalCaption ? `📝 *Caption:* ${originalCaption}\n` : ''}` +
                          `🔗 *Link:* ${url}\n` +
                          `⏰ *Time:* ${currentTime}\n\n` +
                          `> _Revealed by ${botName}_`;
            
            // Send to owner DM (like Gifted's indm mode)
            if (ownerJid) {
                const mime = mediaMessage.mimetype || "";
                
                if (mediaType.includes('image')) {
                    await sock.sendMessage(ownerJid, {
                        image: buffer,
                        caption: caption,
                        mimetype: mime,
                        mentions: [`${senderNum}@s.whatsapp.net`]
                    });
                } else if (mediaType.includes('video')) {
                    await sock.sendMessage(ownerJid, {
                        video: buffer,
                        caption: caption,
                        mimetype: mime,
                        mentions: [`${senderNum}@s.whatsapp.net`]
                    });
                } else if (mediaType.includes('audio')) {
                    await sock.sendMessage(ownerJid, {
                        audio: buffer,
                        ptt: true,
                        mimetype: mime || "audio/mp4",
                        caption: caption,
                        mentions: [`${senderNum}@s.whatsapp.net`]
                    });
                }
                
                console.log(`✅ View-once ${mediaType} automatically captured and sent to owner`);
            }
            
            // Clean up temp file
            try {
                await fs.unlink(tempFilePath);
            } catch (e) {}
            
        } catch (e) {
            console.error('View-once download/send error:', e.message);
            if (tempFilePath) {
                try { await fs.unlink(tempFilePath); } catch (e) {}
            }
        }
        
    } catch (error) {
        console.error('View-once handler error:', error.message);
    }
}

module.exports = { handleViewOnce };
