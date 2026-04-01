// MEGAN-MD Connection Manager

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
        this.maxReconnectAttempts = 10;
        this.reconnectInterval = 1000;
        this.reconnectBackoff = true;
    }
    
    handleUpdate(update, sock) {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'connecting') {
            this.logger.connection('Connecting to WhatsApp...');
        }
        
        if (connection === 'open') {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.logger.success('Connected successfully!');
        }
        
        if (connection === 'close') {
            this.isConnected = false;
            
            let statusCode = 500;
            if (lastDisconnect?.error instanceof Boom) {
                statusCode = lastDisconnect.error.output?.statusCode;
            }
            
            if (statusCode === DisconnectReason.loggedOut) {
                this.logger.error('Session expired! Please get a new session.');
                process.exit(1);
            }
            
            this.scheduleReconnect();
        }
    }
    
    scheduleReconnect() {
        let delay = this.reconnectInterval;
        
        if (this.reconnectBackoff) {
            delay = Math.min(
                this.reconnectInterval * Math.pow(2, this.reconnectAttempts),
                30000
            );
        }
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.logger.error('Max reconnection attempts reached. Exiting...');
            process.exit(1);
        }
        
        this.reconnectAttempts++;
        setTimeout(() => this.bot.connect(), delay);
    }
    
    getStatus() {
        return {
            connected: this.isConnected,
            uptime: this.getUptime(),
            reconnectAttempts: this.reconnectAttempts
        };
    }
    
    getUptime() {
        const uptime = (Date.now() - this.startTime) / 1000;
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    }
}

module.exports = ConnectionManager;
