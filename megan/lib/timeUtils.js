// MEGAN-MD Time Utilities - Nairobi Time

const moment = require('moment-timezone');

class TimeUtils {
    constructor() {
        this.defaultTimezone = 'Africa/Nairobi';
    }
    
    async getTimezone(db) {
        if (db) {
            const tz = await db.getSetting('timezone', this.defaultTimezone);
            return tz;
        }
        return this.defaultTimezone;
    }
    
    async formatTime(timestamp, db) {
        const tz = await this.getTimezone(db);
        return moment(timestamp).tz(tz).format('HH:mm:ss');
    }
    
    async formatTime12h(timestamp, db) {
        const tz = await this.getTimezone(db);
        return moment(timestamp).tz(tz).format('h:mm:ss A');
    }
    
    async formatDateTime(timestamp, db) {
        const tz = await this.getTimezone(db);
        return moment(timestamp).tz(tz).format('DD/MM/YYYY HH:mm:ss');
    }
    
    async formatDate(timestamp, db) {
        const tz = await this.getTimezone(db);
        return moment(timestamp).tz(tz).format('DD/MM/YYYY');
    }
    
    async formatTimeShort(timestamp, db) {
        const tz = await this.getTimezone(db);
        return moment(timestamp).tz(tz).format('HH:mm');
    }
    
    async getCurrentTime(db) {
        const tz = await this.getTimezone(db);
        return moment().tz(tz);
    }
    
    async getCurrentTimeString(db) {
        const tz = await this.getTimezone(db);
        return moment().tz(tz).format('HH:mm:ss - DD/MM/YYYY');
    }
    
    async getCurrentTime12h(db) {
        const tz = await this.getTimezone(db);
        return moment().tz(tz).format('h:mm:ss A - DD/MM/YYYY');
    }
    
    // For terminal logging
    async getLogTimestamp(db) {
        const tz = await this.getTimezone(db);
        return moment().tz(tz).format('HH:mm:ss');
    }
    
    // For WhatsApp messages
    async getMessageTimestamp(db) {
        const tz = await this.getTimezone(db);
        return moment().tz(tz).format('h:mm A');
    }
    
    async getMessageDate(db) {
        const tz = await this.getTimezone(db);
        return moment().tz(tz).format('DD/MM/YYYY');
    }
}

module.exports = new TimeUtils();
