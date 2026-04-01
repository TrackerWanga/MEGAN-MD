// MEGAN-MD LID Resolver - 3-Layer LID to JID Resolution

const { getLidMapping, getLidMappingWithFallback, storeLidMapping } = require('./groupCache');
const { persistLidMapping, getLidMappingFromDb } = require('../database/lidMapping');

class LidResolver {
    constructor(bot) {
        this.bot = bot;
        this.sock = bot?.sock;
        this.cache = new Map();
        this.cacheTTL = 24 * 60 * 60 * 1000; // 24 hours
    }
    
    /**
     * 3-Layer LID Resolution:
     * Layer 1: In-memory cache (fastest)
     * Layer 2: Database persistence (across restarts)
     * Layer 3: WhatsApp API call (slowest but most accurate)
     */
    async resolveRealJid(jid) {
        if (!jid) return null;
        
        // If it's not a LID, return as is
        if (!jid.endsWith('@lid')) {
            // Still normalize to ensure proper format
            return this.normalizeJid(jid);
        }
        
        // ========== LAYER 1: Memory Cache ==========
        const cached = getLidMapping(jid);
        if (cached) {
            // console.log(`✅ LID resolved from cache: ${jid} → ${cached}`);
            return cached;
        }
        
        // Also check local cache
        const localCached = this.cache.get(jid);
        if (localCached && (Date.now() - localCached.timestamp) < this.cacheTTL) {
            // console.log(`✅ LID resolved from local cache: ${jid} → ${localCached.jid}`);
            return localCached.jid;
        }
        
        // ========== LAYER 2: Database ==========
        try {
            const fromDb = await getLidMappingFromDb(jid);
            if (fromDb) {
                // console.log(`✅ LID resolved from database: ${jid} → ${fromDb}`);
                // Update caches
                storeLidMapping(jid, fromDb);
                this.cache.set(jid, { jid: fromDb, timestamp: Date.now() });
                return fromDb;
            }
        } catch (err) {
            // console.log(`⚠️ Database lookup failed: ${err.message}`);
        }
        
        // ========== LAYER 3: WhatsApp API ==========
        try {
            if (this.sock && typeof this.sock.getJidFromLid === 'function') {
                const resolved = await this.sock.getJidFromLid(jid);
                if (resolved && resolved.endsWith('@s.whatsapp.net')) {
                    // console.log(`✅ LID resolved from API: ${jid} → ${resolved}`);
                    // Store in all caches
                    storeLidMapping(jid, resolved);
                    persistLidMapping(jid, resolved, 'api').catch(() => {});
                    this.cache.set(jid, { jid: resolved, timestamp: Date.now() });
                    return resolved;
                }
            }
        } catch (err) {
            // console.log(`⚠️ API lookup failed: ${err.message}`);
        }
        
        // If all layers fail, return the original LID
        // console.log(`⚠️ Could not resolve LID: ${jid}, returning original`);
        return jid;
    }
    
    /**
     * Resolve participant JID with group metadata assistance
     */
    async resolveParticipantJid(participant, groupMetadata = null) {
        if (!participant) return null;
        
        // Try to resolve from group metadata first
        if (groupMetadata && groupMetadata.participants && participant.endsWith('@lid')) {
            const found = groupMetadata.participants.find(p => 
                p.lid === participant || p.id === participant
            );
            if (found) {
                const jid = found.pn || found.jid || found.phoneNumber;
                if (jid && jid.endsWith('@s.whatsapp.net')) {
                    // Store in cache
                    storeLidMapping(participant, jid);
                    return jid;
                }
            }
        }
        
        // Fallback to standard resolution
        return await this.resolveRealJid(participant);
    }
    
    /**
     * Normalize JID to consistent format
     */
    normalizeJid(jid) {
        if (!jid) return null;
        
        let jidStr = String(jid);
        
        // Remove device ID (everything after colon)
        jidStr = jidStr.split(':')[0];
        
        // Remove any paths
        jidStr = jidStr.split('/')[0];
        
        // Handle LIDs
        if (jidStr.endsWith('@lid')) {
            return jidStr.toLowerCase();
        }
        
        // Add @s.whatsapp.net if missing
        if (!jidStr.includes('@')) {
            jidStr = jidStr + '@s.whatsapp.net';
        }
        
        // Ensure proper domain
        if (!jidStr.endsWith('@s.whatsapp.net') && !jidStr.endsWith('@g.us')) {
            const phoneMatch = jidStr.match(/(\d+)/);
            if (phoneMatch) {
                jidStr = phoneMatch[1] + '@s.whatsapp.net';
            }
        }
        
        return jidStr.toLowerCase();
    }
    
    /**
     * Extract clean phone number from JID
     */
    extractPhoneNumber(jid) {
        if (!jid) return null;
        
        const normalized = this.normalizeJid(jid);
        const phoneMatch = normalized.match(/(\d+)/);
        return phoneMatch ? phoneMatch[1] : null;
    }
    
    /**
     * Check if a JID is a LID
     */
    isLid(jid) {
        return jid && jid.endsWith('@lid');
    }
    
    /**
     * Get cached JID for LID
     */
    getCachedJid(lid) {
        return getLidMapping(lid) || this.cache.get(lid)?.jid;
    }
    
    /**
     * Set owner JIDs for reference
     */
    setOwnerJids(ownerJid, ownerLid) {
        this.ownerJid = ownerJid;
        this.ownerLid = ownerLid;
        if (ownerLid) {
            storeLidMapping(ownerLid, ownerJid);
        }
    }
    
    /**
     * Clear local cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 LID resolver cache cleared');
    }
    
    /**
     * Get cache stats
     */
    getStats() {
        return {
            localCacheSize: this.cache.size,
            globalCacheSize: require('./groupCache').lidToJidStore?.keys()?.length || 0
        };
    }
}

// Singleton instance
let instance = null;

function getLidResolver(bot) {
    if (!instance) {
        instance = new LidResolver(bot);
    }
    return instance;
}

// Helper function for quick resolution (for non-class usage)
async function resolveRealJid(sock, jid) {
    const resolver = new LidResolver({ sock });
    return await resolver.resolveRealJid(jid);
}

module.exports = {
    LidResolver,
    getLidResolver,
    resolveRealJid
};
