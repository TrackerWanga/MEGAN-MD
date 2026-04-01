// MEGAN-MD Cache Manager

const config = require('../config');

class CacheManager {
    constructor(logger) {
        this.cache = new Map();
        this.logger = logger;
        this.stats = { total: 0, status: 0, group: 0, pvt: 0 };
    }
    
    set(key, data, type) {
        if (!config.CACHE.MESSAGES) return;
        
        const isViewOnce = data.message?.message?.imageMessage?.viewOnce === true ||
                          data.message?.message?.videoMessage?.viewOnce === true;
        
        const cacheData = {
            ...data,
            timestamp: Date.now(),
            type,
            isViewOnce
        };
        
        this.cache.set(key, cacheData);
        this.stats.total++;
        this.stats[type.toLowerCase()] = (this.stats[type.toLowerCase()] || 0) + 1;
    }
    
    get(key) {
        return this.cache.get(key);
    }
    
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
    
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, data] of this.cache.entries()) {
            const duration = data.isViewOnce ? 10 * 60 * 1000 : 2 * 60 * 1000;
            if (now - data.timestamp > duration) {
                this.cache.delete(key);
                cleaned++;
                this.stats.total--;
                this.stats[data.type.toLowerCase()]--;
            }
        }
        
        return cleaned;
    }
    
    getStats() {
        return { ...this.stats, size: this.cache.size };
    }
    
    clear() {
        this.cache.clear();
        this.stats = { total: 0, status: 0, group: 0, pvt: 0 };
    }
}

module.exports = CacheManager;
