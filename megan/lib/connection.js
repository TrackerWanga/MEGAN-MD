const { DisconnectReason } = require('gifted-baileys');
const { Boom } = require('@hapi/boom');
const config = require('../config');

class ConnectionManager {
    constructor(bot, logger) {
        this.bot = bot;
        this.logger = logger;
        this.reconnectAttempts = 0;
        this.isConnected = false;
        this.startTime = Date.now();
    }

    // Handle connection updates
    handleUpdate(update, sock) {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            this.logger.status('QR Code received:');
            console.log(qr);
        }

        if (connection === 'connecting') {
            this.logger.connection('Connecting to WhatsApp...', '🔄');
        }

        if (connection === 'open') {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.logger.success('Connected successfully!', '✅');
            this.logger.info(`Phone: ${sock.user?.id?.split(':')[0] || 'Unknown'}`, '📱');
            this.logger.info(`Name: ${sock.user?.name || 'Unknown'}`, '👤');
            this.logger.info(`Prefix: ${config.PREFIX}`, '📝');
        }

        if (connection === 'close') {
            this.isConnected = false;
            const statusCode = lastDisconnect?.error instanceof Boom
                ? lastDisconnect.error.output?.statusCode
                : 500;

            this.logger.connection(`Connection closed with code: ${statusCode}`, '🔌');

            if (statusCode === DisconnectReason.loggedOut) {
                this.logger.error('Logged out. Please delete session and scan again.', '🚫');
                process.exit(1);
            }

            if (statusCode === DisconnectReason.connectionClosed) {
                this.logger.warn('Connection closed, reconnecting...', '🔄');
            }

            const shouldReconnect = statusCode !== 401;
            if (shouldReconnect) {
                this.scheduleReconnect();
            }
        }
    }

    // Schedule reconnect with exponential backoff
    scheduleReconnect() {
        let delay = config.CONNECTION.RECONNECT_INTERVAL;
        
        if (config.CONNECTION.RECONNECT_BACKOFF) {
            delay = Math.min(
                config.CONNECTION.RECONNECT_INTERVAL * Math.pow(2, this.reconnectAttempts),
                30000
            );
        }

        if (this.reconnectAttempts >= config.CONNECTION.MAX_RECONNECT_ATTEMPTS) {
            this.logger.error('Max reconnection attempts reached. Exiting...', '💥');
            process.exit(1);
        }

        this.reconnectAttempts++;
        this.logger.connection(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})...`, '🔄');
        
        setTimeout(() => this.bot.connect(), delay);
    }

    // Get uptime
    getUptime() {
        const uptime = (Date.now() - this.startTime) / 1000;
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    // Check if connected
    isConnected() {
        return this.isConnected;
    }
}

module.exports = ConnectionManager;
