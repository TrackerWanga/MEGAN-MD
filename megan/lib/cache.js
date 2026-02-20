const config = require('../config');

class CacheManager {
    constructor(logger) {
        this.cache = new Map();
        this.logger = logger;
        this.stats = {
            total: 0,
            status: 0,
            group: 0,
            pvt: 0
        };
    }

    // Add message to cache
    set(key, data, type) {
        if (!config.CACHE.MESSAGES) return;
        
        const cacheData = {
            ...data,
            timestamp: Date.now(),
            type
        };
        
        this.cache.set(key, cacheData);
        this.stats.total++;
        this.stats[type.toLowerCase()] = (this.stats[type.toLowerCase()] || 0) + 1;
        
        if (this.logger) {
            this.logger.cache(`Cached ${type} message: ${key.substring(0, 8)}...`);
        }
    }

    // Get message from cache
    get(key) {
        return this.cache.get(key);
    }

    // Delete message from cache
    delete(key) {
        const data = this.cache.get(key);
        if (data) {
            this.cache.delete(key);
            this.stats.total--;
            this.stats[data.type.toLowerCase()]--;
            return true;
        }
        return false;
    }

    // Cleanup old messages
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, data] of this.cache.entries()) {
            let duration = config.CACHE.STATUS_DURATION;
            
            // Different durations for different message types
            if (data.type === 'STATUS') {
                duration = config.CACHE.STATUS_DURATION;
            } else if (data.type === 'GROUP') {
                duration = config.CACHE.GROUP_DURATION;
            } else {
                duration = 2 * 60 * 1000; // 2 minutes for others
            }
            
            if (now - data.timestamp > duration) {
                this.cache.delete(key);
                cleaned++;
                this.stats.total--;
                this.stats[data.type.toLowerCase()]--;
            }
        }
        
        if (cleaned > 0 && this.logger) {
            this.logger.cache(`Cleaned ${cleaned} old messages from cache`);
        }
        
        return cleaned;
    }

    // Get cache stats
    getStats() {
        return {
            ...this.stats,
            size: this.cache.size
        };
    }

    // Clear all cache
    clear() {
        this.cache.clear();
        this.stats = {
            total: 0,
            status: 0,
            group: 0,
            pvt: 0
        };
        if (this.logger) {
            this.logger.cache('Cache cleared');
        }
    }

    // Get all cached messages of a type
    getByType(type) {
        const result = [];
        for (const [key, data] of this.cache.entries()) {
            if (data.type === type) {
                result.push({ key, ...data });
            }
        }
        return result;
    }
}

module.exports = CacheManager;
