// MEGAN-MD Anti-Link - Clean version (silent terminal)

const { isJidGroup } = require('gifted-baileys');

const isAnyLink = (text) => {
    if (!text || typeof text !== 'string') return false;
    const linkPattern = /https?:\/\/[^\s]+|www\.[^\s]+|bit\.ly\/[^\s]+/gi;
    return linkPattern.test(text);
};

async function handleAntiLink(sock, message, db) {
    try {
        if (!sock || !message?.message || message.key.fromMe) return false;
        
        const from = message.key.remoteJid;
        const isGroup = isJidGroup(from);
        if (!isGroup) return false;

        // Check if anti-link is enabled
        const isEnabled = await db.isGroupAntiLinkEnabled(from);
        if (!isEnabled) return false;

        // Extract message text
        const messageType = Object.keys(message.message)[0];
        let body = '';
        if (messageType === 'conversation') {
            body = message.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = message.message.extendedTextMessage?.text || '';
        } else if (messageType === 'imageMessage') {
            body = message.message.imageMessage?.caption || '';
        } else if (messageType === 'videoMessage') {
            body = message.message.videoMessage?.caption || '';
        } else {
            body = message.message[messageType]?.text || message.message[messageType]?.caption || '';
        }
        
        if (!body || !isAnyLink(body)) return false;

        // Get sender
        let sender = message.key.participantPn || message.key.participant || message.participant;
        if (!sender || sender.endsWith('@g.us')) return false;
        
        const senderNum = sender.split('@')[0];

        // Get group metadata to check admin status
        let isBotAdmin = false;
        let isSenderAdmin = false;
        
        try {
            const groupMetadata = await sock.groupMetadata(from);
            if (groupMetadata && groupMetadata.participants) {
                const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
                const botNum = botJid.split('@')[0];
                
                // Check if bot is admin
                isBotAdmin = groupMetadata.participants.some(p => {
                    const pNum = (p.pn || p.phoneNumber || p.id || '').split('@')[0];
                    return pNum === botNum && p.admin;
                });
                
                // Check if sender is admin
                isSenderAdmin = groupMetadata.participants.some(p => {
                    const pNum = (p.pn || p.phoneNumber || p.id || '').split('@')[0];
                    return pNum === senderNum && p.admin;
                });
            }
        } catch (e) {}

        // Always send a warning message
        await sock.sendMessage(from, {
            text: `⚠️ *Anti-Link Active!*\n\n@${senderNum}, links are not allowed in this group!\n\n${isBotAdmin ? 'Message deleted.' : '(Bot is not admin, cannot delete message)'}`,
            mentions: [sender],
        });

        // Try to delete the message (only if bot is admin and sender is not admin)
        if (isBotAdmin && !isSenderAdmin) {
            try {
                await sock.sendMessage(from, { delete: message.key });
            } catch (delErr) {}
        }
        
        return true;
        
    } catch (err) {
        return false;
    }
}

module.exports = { handleAntiLink };
