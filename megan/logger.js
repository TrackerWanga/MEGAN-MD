const pino = require('pino');
const config = require('./config');

// Create Pino logger for Baileys
const pinoLogger = pino({
    level: config.LOG_LEVEL,
    transport: null
});

class MeganLogger {
    constructor(botName = config.BOT_NAME) {
        this.botName = botName;
        this.levels = {
            success: '✅',
            error: '❌',
            warn: '⚠️',
            info: 'ℹ️',
            debug: '🐛',
            cache: '💾',
            connection: '🔌',
            message: '📨',
            command: '⌨️',
            group: '👥',
            status: '📱'
        };}
    }

    getTimestamp() {
        return new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    log(message, level = 'info', emoji = '') {
        const timestamp = this.getTimestamp();
        const prefix = this.levels[level] || '📌';
        console.log(`[${timestamp}] [${this.botName}] ${prefix} ${emoji} ${message}`);
    

    // Special formatted message log
    messageLog(msgType, from, content, id, isGroup = false, groupName = null) {
        const timestamp = this.getTimestamp();
        const senderShort = from.split('@')[0];
        const contentPreview = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        
        console.log(`┌─────────────────────────────────`);
        console.log(`│ [${timestamp}] [${this.botName}]`);
        console.log(`│ 📍 Type: ${msgType}`);
        console.log(`│ 👤 From: ${senderShort}`);
        if (isGroup && groupName) {
            console.log(`│ 👥 Group: ${groupName}`);
        }
        console.log(`│ 💬 Content: ${contentPreview}`);
        console.log(`│ 🆔 ID: ${id.substring(0, 8)}...`);
        console.log(`└─────────────────────────────────`);
    }

    success(message, emoji = '') { this.log(message, 'success', emoji); }
    error(message, emoji = '') { this.log(message, 'error', emoji); }
    warn(message, emoji = '') { this.log(message, 'warn', emoji); }
    info(message, emoji = '') { this.log(message, 'info', emoji); }
    debug(message, emoji = '') { this.log(message, 'debug', emoji); }
    cache(message, emoji = '') { this.log(message, 'cache', emoji); }
    connection(message, emoji = '') { this.log(message, 'connection', emoji); }
    message(message, emoji = '') { this.log(message, 'message', emoji); }
    command(message, emoji = '') { this.log(message, 'command', emoji); }
    group(message, emoji = '') { this.log(message, 'group', emoji); }
    status(message, emoji = '') { this.log(message, 'status', emoji); }
}

// Export both
module.exports = pinoLogger;
module.exports.MeganLogger = MeganLogger;
module.exports.createLogger = (botName) => new MeganLogger(botName);
