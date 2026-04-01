// MEGAN-MD Logger - With Nairobi time

const pino = require('pino');
const config = require('./config');
const timeUtils = require('./lib/timeUtils');

const pinoLogger = pino({ level: config.LOG_LEVEL, transport: null });

class MeganLogger {
    constructor(botName = config.BOT_NAME) {
        this.botName = botName;
        this.db = null;
    }
    
    setDatabase(db) {
        this.db = db;
    }
    
    async getTimestamp() {
        if (this.db) {
            return await timeUtils.getLogTimestamp(this.db);
        }
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    
    async log(message, level = 'info', emoji = '') {
        const timestamp = await this.getTimestamp();
        const prefix = `[${timestamp}] [${this.botName}]`;
        
        if (level === 'error') {
            console.log(`${prefix} ${this.getColor('red', '❌')} ${message}`);
        } else if (level === 'status') {
            console.log(`${prefix} ${this.getColor('cyan', '📱 STATUS')} ${message}`);
        } else if (level === 'react') {
            console.log(`${prefix} ${this.getColor('magenta', '❤️ REACT')} ${message}`);
        } else if (level === 'view') {
            console.log(`${prefix} ${this.getColor('green', '👁️ VIEW')} ${message}`);
        } else if (level === 'download') {
            console.log(`${prefix} ${this.getColor('blue', '📥 DOWNLOAD')} ${message}`);
        } else if (level === 'delete') {
            console.log(`${prefix} ${this.getColor('yellow', '🗑️ DELETE')} ${message}`);
        } else if (level === 'edit') {
            console.log(`${prefix} ${this.getColor('yellow', '✏️ EDIT')} ${message}`);
        } else if (level === 'warning') {
            console.log(`${prefix} ${this.getColor('yellow', '⚠️')} ${message}`);
        } else if (level === 'success') {
            console.log(`${prefix} ${this.getColor('green', '✅')} ${message}`);
        } else if (level === 'info') {
            console.log(`${prefix} ${this.getColor('cyan', 'ℹ️')} ${message}`);
        } else {
            console.log(`${prefix} ${emoji} ${message}`);
        }
    }
    
    getColor(color, text) {
        const colors = {
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            reset: '\x1b[0m'
        };
        return `${colors[color] || colors.white}${text}${colors.reset}`;
    }
    
    async status(message) { await this.log(message, 'status'); }
    async react(message) { await this.log(message, 'react'); }
    async view(message) { await this.log(message, 'view'); }
    async download(message) { await this.log(message, 'download'); }
    async delete(message) { await this.log(message, 'delete'); }
    async edit(message) { await this.log(message, 'edit'); }
    async success(message) { await this.log(message, 'success'); }
    async error(message) { await this.log(message, 'error'); }
    async warn(message) { await this.log(message, 'warning'); }
    async info(message) { await this.log(message, 'info'); }
    
    // Sync versions for compatibility
    debug(message) {}
    cache(message) {}
    connection(message) {}
    message(message) {}
    command(message) {}
    group(message) {}
}

module.exports = pinoLogger;
module.exports.createLogger = (botName) => new MeganLogger(botName);
