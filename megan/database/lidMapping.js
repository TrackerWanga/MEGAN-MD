// MEGAN-MD LID Mapping Database - Uses DatabaseManager

const DatabaseManager = require('../lib/database');

// In-memory cache for fast access
const memoryCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

let dbInstance = null;

async function getDb() {
    if (!dbInstance) {
        dbInstance = new DatabaseManager();
        await dbInstance.initialize();
    }
    return dbInstance;
}

async function syncLidMappingTable() {
    const db = await getDb();
    await db.sequelize.sync();
    console.log('✅ LID Mapping table synchronized');
}

async function loadPersistedLidMappings() {
    try {
        const db = await getDb();
        await syncLidMappingTable();
        const rows = await db.models.LidMapping.findAll();
        let count = 0;
        
        for (const row of rows) {
            memoryCache.set(row.lid, {
                jid: row.jid,
                timestamp: Date.now(),
                source: row.source
            });
            count++;
        }
        
        if (count > 0) {
            console.log(`✅ Loaded ${count} persisted LID mappings into cache`);
        }
        
        return count;
    } catch (err) {
        console.error('Failed to load persisted LID mappings:', err.message);
        return 0;
    }
}

async function persistLidMapping(lid, jid, source = 'group') {
    try {
        if (!lid || !jid) return false;
        if (!lid.endsWith('@lid')) return false;
        if (!jid.endsWith('@s.whatsapp.net')) return false;
        
        // Update memory cache
        memoryCache.set(lid, {
            jid: jid,
            timestamp: Date.now(),
            source: source
        });
        
        // Update database
        const db = await getDb();
        await db.models.LidMapping.upsert({ 
            lid, 
            jid, 
            source,
            lastSeen: new Date()
        });
        
        return true;
    } catch (err) {
        console.error('Failed to persist LID mapping:', err.message);
        return false;
    }
}

async function getLidMappingFromDb(lid) {
    try {
        if (!lid || !lid.endsWith('@lid')) return null;
        
        // Check memory cache first (fast)
        const cached = memoryCache.get(lid);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
            return cached.jid;
        }
        
        // Check database
        const db = await getDb();
        const row = await db.models.LidMapping.findOne({ where: { lid } });
        
        if (row) {
            // Update cache
            memoryCache.set(lid, {
                jid: row.jid,
                timestamp: Date.now(),
                source: row.source
            });
            return row.jid;
        }
        
        return null;
    } catch (err) {
        return null;
    }
}

async function getLidByJid(jid) {
    try {
        if (!jid || !jid.endsWith('@s.whatsapp.net')) return null;
        
        const db = await getDb();
        const row = await db.models.LidMapping.findOne({ where: { jid } });
        return row ? row.lid : null;
    } catch (err) {
        return null;
    }
}

async function cleanupOldMappings(daysOld = 30) {
    try {
        const db = await getDb();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        
        const deleted = await db.models.LidMapping.destroy({
            where: {
                lastSeen: { [db.sequelize.Op.lt]: cutoffDate },
                source: 'group' // Don't delete manual mappings
            }
        });
        
        if (deleted > 0) {
            console.log(`🧹 Cleaned up ${deleted} old LID mappings`);
        }
        
        // Clean up expired cache entries
        for (const [lid, data] of memoryCache.entries()) {
            if (Date.now() - data.timestamp > CACHE_TTL) {
                memoryCache.delete(lid);
            }
        }
        
        return deleted;
    } catch (err) {
        console.error('Failed to cleanup old mappings:', err.message);
        return 0;
    }
}

async function getAllLidMappings() {
    const mappings = [];
    for (const [lid, data] of memoryCache.entries()) {
        mappings.push({ lid, jid: data.jid, source: data.source });
    }
    return mappings;
}

module.exports = {
    syncLidMappingTable,
    loadPersistedLidMappings,
    persistLidMapping,
    getLidMappingFromDb,
    getLidByJid,
    cleanupOldMappings,
    getAllLidMappings
};
