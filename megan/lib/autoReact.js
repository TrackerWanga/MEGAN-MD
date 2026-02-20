const config = require('../config');

class AutoReactHandler {

    constructor(bot) {

        this.bot = bot;

        this.sock = bot.sock;

        this.logger = bot.logger;

        

        // 200+ emojis for reactions

        this.emojis = [

            // Hearts & Love

            '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟',

            

            // Faces

            '😊', '😇', '🙂', '😉', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥳',

            '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',

            '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦',

            

            // Gestures

            '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌',

            '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀',

            

            // Animals

            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐸', '🐙', '🐵', '🙈', '🙉', '🙊', '🐒', '🐧',

            '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗',

            

            // Food

            '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬',

            '🥒', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟',

            

            // Objects

            '💎', '🔮', '🎯', '🏆', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🥋',

            '🎮', '🎲', '🎰', '🎳', '🎯', '🎨', '🎭', '🎪', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎸', '🎺', '🎻', '🪕', '🎬', '🎥',

            

            // Nature

            '☀️', '☁️', '⛅', '🌈', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '⛈️', '🌪️', '🌫️', '🌬️', '❄️', '☃️', '⛄', '🔥', '💧', '🌊',

            

            // Symbols

            '✅', '❌', '❎', '➕', '➖', '➗', '✖️', '💯', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨',

            

            // Stars & Sparkles

            '⭐', '🌟', '✨', '⚡', '💫', '💥', '💢', '💦', '💨', '🕳️', '💤', '💬', '🗯️', '💭', '💮', '♨️', '💈', '🛎️', '🧿', '🎀',

            

            // Sports

            '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🏏', '🥍', '🏹', '🥊', '🥋', '⛳', '⛸️',

            

            // Music

            '🎵', '🎶', '🎼', '🎤', '🎧', '📻', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '🪘', '🎙️', '🎚️', '🎛️', '🎞️', '📽️', '🎥', '📹'

        ];

    }

    

    getRandomEmoji() {

        return this.emojis[Math.floor(Math.random() * this.emojis.length)];

    }

    

    async autoReact(message) {

        try {

            // Check if auto-react is enabled

            const setting = await this.bot.db.getSetting('autoreact', config.FEATURES.AUTOREACT);

            if (setting !== true && setting !== 'true') return;

            

            // Don't react to own messages

            if (message.key?.fromMe) return;

            

            // Don't react to status broadcasts

            if (message.key?.remoteJid === 'status@broadcast') return;

            

            // Random delay between 1-3 seconds for natural feel

            const delay = 1000 + Math.floor(Math.random() * 2000);

            setTimeout(async () => {

                try {

                    const emoji = this.getRandomEmoji();

                    await this.sock.sendMessage(message.key.remoteJid, {

                        react: { key: message.key, text: emoji }

                    });

                    this.logger.debug(`Auto-reacted with ${emoji}`);

                } catch (e) {

                    // Ignore reaction errors

                }

            }, delay);

            

        } catch (error) {

            this.logger.error('Auto-react error:', error);

        }

    }

}

module.exports = AutoReactHandler;

