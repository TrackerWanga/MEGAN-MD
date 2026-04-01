// MEGAN-MD Auto React Handler - FIXED

class AutoReactHandler {
    constructor(bot) {
        this.bot = bot;
        this.recentlyReacted = new Set();

        this.emojis = [
            '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💕', '💞',
            '😊', '😍', '🥰', '😘', '😎', '🥳', '🤔', '🤗', '🥺', '😭',
            '👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '🤝', '🙏', '💪',
            '🔥', '✨', '⭐', '🌟', '💯', '✅', '❌', '⚡', '💫', '🎉'
        ];

        this.ownerEmojis = ['👑', '💎', '🔥', '⚡', '💯', '🏆', '🌟', '✨'];
    }

    getRandomEmoji(isOwner = false) {
        if (isOwner) {
            const combined = [...this.emojis, ...this.ownerEmojis];
            return combined[Math.floor(Math.random() * combined.length)];
        }
        return this.emojis[Math.floor(Math.random() * this.emojis.length)];
    }

    async isOwner(jid) {
        if (!jid) return false;
        const ownerNumber = this.bot.config.OWNER_NUMBER.replace(/\D/g, '');
        const jidNumber = jid.split('@')[0].replace(/\D/g, '');
        return jidNumber === ownerNumber;
    }

    async autoReact(message) {
        try {
            const setting = await this.bot.db.getSetting('autoreact', 'off');
            if (setting !== 'on') return;

            if (message.key?.remoteJid === 'status@broadcast') return;
            if (message.key?.fromMe) return;

            const sender = message.key?.participant || message.key?.remoteJid;
            const isOwner = await this.isOwner(sender);
            const chatId = message.key.remoteJid;
            const messageId = message.key.id;

            if (this.recentlyReacted.has(messageId)) return;

            this.recentlyReacted.add(messageId);
            setTimeout(() => this.recentlyReacted.delete(messageId), 60000);

            setTimeout(async () => {
                try {
                    const emoji = this.getRandomEmoji(isOwner);
                    // Use bot.sock which is updated after connection
                    const sock = this.bot.sock;
                    if (sock) {
                        await sock.sendMessage(chatId, {
                            react: { key: message.key, text: emoji }
                        });
                        console.log(`❤️ Auto-react: Sent ${emoji} to ${chatId}`);
                    } else {
                        console.log(`❌ Auto-react: No sock available`);
                    }
                } catch (e) {
                    console.log(`❌ Auto-react failed: ${e.message}`);
                }
            }, 500);

        } catch (error) {
            console.log(`❌ Auto-react error: ${error.message}`);
        }
    }

    clearCooldowns() {
        this.recentlyReacted.clear();
    }
}

module.exports = AutoReactHandler;
