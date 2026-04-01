// MEGAN-MD Owner Manager - FIXED for LIDs with colons

const config = require('../config');

class OwnerManager {
    constructor() {
        this.ownerSet = new Set();
        this.mode = 'public';
        this.initialized = false;
        this.db = null;
    }

    // Standardize ANY JID format - handles LIDs properly
    normalizeJid(jid) {
        if (!jid) return { full: '', numeric: null, type: 'unknown' };

        let jidStr = String(jid);

        // Handle LIDs - extract the numeric part BEFORE the colon
        if (jidStr.includes('@lid')) {
            // Remove everything after the colon (like :13)
            let lidNumber = jidStr.split(':')[0];
            // Remove @lid
            lidNumber = lidNumber.replace('@lid', '');
            // Extract only digits
            const digits = lidNumber.match(/\d+/g);
            const numeric = digits ? digits.join('') : lidNumber;
            return {
                full: jidStr.toLowerCase(),
                numeric: numeric,
                type: 'lid'
            };
        }

        // Handle regular JIDs with possible device IDs
        jidStr = jidStr.split(':')[0];
        const phoneMatch = jidStr.match(/(\d+)/);
        if (!phoneMatch) {
            return {
                full: jidStr.toLowerCase(),
                numeric: null,
                type: 'unknown'
            };
        }

        return {
            full: phoneMatch[1] + '@s.whatsapp.net',
            numeric: phoneMatch[1],
            type: 'normal'
        };
    }

    async initialize(db, ownerJid = null, ownerLid = null) {
        this.db = db;

        // LAYER 1: Hardcoded master owner from config (YOUR PHONE NUMBER)
        const ownerNumber = config.OWNER_NUMBER;
        if (ownerNumber) {
            const cleanNumber = String(ownerNumber).replace(/\D/g, '');
            this.ownerSet.add(cleanNumber);
            console.log(`👑 Added owner number: ${cleanNumber}`);
            
            // Also add the JID format
            const jidFormat = `${cleanNumber}@s.whatsapp.net`;
            this.ownerSet.add(jidFormat);
            console.log(`👑 Added owner JID: ${jidFormat}`);
        }

        // LAYER 2: Add the LID from connection (THIS IS YOUR LID)
        if (ownerLid) {
            const normalized = this.normalizeJid(ownerLid);
            this.ownerSet.add(ownerLid);  // Add full LID
            if (normalized.numeric) {
                this.ownerSet.add(normalized.numeric);  // Add LID numeric
                console.log(`👑 Added owner LID numeric: ${normalized.numeric} (from ${ownerLid})`);
            }
            console.log(`👑 Added owner LID: ${ownerLid}`);
        }

        // LAYER 3: Add the JID from connection
        if (ownerJid) {
            const normalized = this.normalizeJid(ownerJid);
            this.ownerSet.add(ownerJid);  // Add full JID
            if (normalized.numeric) {
                this.ownerSet.add(normalized.numeric);  // Add JID numeric
                console.log(`👑 Added owner JID numeric: ${normalized.numeric} (from ${ownerJid})`);
            }
            console.log(`👑 Added owner JID: ${ownerJid}`);
        }

        // LAYER 4: Also add the raw LID number (without the :13 part)
        if (ownerLid) {
            // Extract just the numeric part before the colon
            const rawLidNumber = ownerLid.split(':')[0].replace('@lid', '');
            this.ownerSet.add(rawLidNumber);
            console.log(`👑 Added raw LID number: ${rawLidNumber}`);
        }

        // LAYER 5: Database owners
        if (db) {
            try {
                const dbOwners = await db.getSetting('owners', []);
                if (Array.isArray(dbOwners)) {
                    dbOwners.forEach(jid => {
                        if (jid) {
                            const normalized = this.normalizeJid(jid);
                            if (normalized.numeric) this.ownerSet.add(normalized.numeric);
                            if (normalized.full) this.ownerSet.add(normalized.full);
                            this.ownerSet.add(jid);
                        }
                    });
                    console.log(`👑 Added ${dbOwners.length} DB owners`);
                }
                this.mode = await db.getSetting('mode', config.MODE || 'public');
            } catch (error) {
                console.error('Failed to load owners from DB:', error.message);
            }
        }

        this.initialized = true;
        console.log(`👑 Owner system initialized with ${this.ownerSet.size} identifier(s)`);
        console.log(`👑 Owner identifiers: ${Array.from(this.ownerSet).join(', ')}`);
        
        return this;
    }

    // SYNC check - handles LIDs and numbers
    isOwner(jid) {
        if (!jid || !this.initialized) return false;

        // Try direct match first
        if (this.ownerSet.has(jid)) {
            console.log(`✅ Owner match (direct): ${jid}`);
            return true;
        }

        // Normalize and check all possibilities
        const normalized = this.normalizeJid(jid);
        
        // Debug output
        console.log(`🔍 Owner check: JID=${jid}, Numeric=${normalized.numeric}, Type=${normalized.type}`);

        // Check full JID
        if (normalized.full && this.ownerSet.has(normalized.full)) {
            console.log(`✅ Owner match (full JID): ${normalized.full}`);
            return true;
        }

        // Check numeric part
        if (normalized.numeric && this.ownerSet.has(normalized.numeric)) {
            console.log(`✅ Owner match (numeric): ${normalized.numeric}`);
            return true;
        }

        // For LIDs, also check if any owner number matches the raw LID
        if (normalized.type === 'lid' && normalized.numeric) {
            for (const ownerId of this.ownerSet) {
                const ownerNum = String(ownerId).replace(/\D/g, '');
                if (ownerNum === normalized.numeric) {
                    console.log(`✅ Owner match (LID numeric): ${normalized.numeric}`);
                    return true;
                }
            }
        }

        return false;
    }

    getOwnerOnlyMessage(commandName = 'this command') {
        const ownerNumbers = Array.from(this.ownerSet).filter(id => /^\d+$/.test(id) && id.length > 9).join(', ');
        return {
            text: `┏━━━━━━━━━━━━━━━━━━━┓\n` +
                  `┃ *${config.BOT_NAME}*\n` +
                  `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +
                  `👑 *Owner Only Command*\n\n` +
                  `You must be an owner to use ${commandName}.\n\n` +
                  `• Current mode: ${this.mode}\n` +
                  `• Owners: ${ownerNumbers || 'Not set'}\n\n` +
                  `> created by wanga`
        };
    }

    async addOwner(jid, db) {
        const normalized = this.normalizeJid(jid);
        
        if (normalized.numeric) this.ownerSet.add(normalized.numeric);
        if (normalized.full) this.ownerSet.add(normalized.full);
        this.ownerSet.add(jid);

        if (db) {
            const owners = Array.from(this.ownerSet).filter(id => id.includes('@') || /^\d+$/.test(id));
            await db.setSetting('owners', owners);
        }

        return true;
    }

    async removeOwner(jid, db) {
        const normalized = this.normalizeJid(jid);
        const ownerNumber = String(config.OWNER_NUMBER).replace(/\D/g, '');

        // Don't remove the main owner
        if (normalized.numeric === ownerNumber) {
            return false;
        }

        if (normalized.numeric) this.ownerSet.delete(normalized.numeric);
        if (normalized.full) this.ownerSet.delete(normalized.full);
        this.ownerSet.delete(jid);

        if (db) {
            const owners = Array.from(this.ownerSet).filter(id => id.includes('@') || /^\d+$/.test(id));
            await db.setSetting('owners', owners);
        }

        return true;
    }

    getMode() {
        return this.mode;
    }

    async setMode(mode, db) {
        if (!['public', 'private'].includes(mode)) return false;
        this.mode = mode;
        if (db) {
            await db.setSetting('mode', mode);
        }
        return true;
    }

    getPrimaryOwner() {
        const ownerNumber = String(config.OWNER_NUMBER).replace(/\D/g, '');
        return `${ownerNumber}@s.whatsapp.net`;
    }

    getAllOwners() {
        return Array.from(this.ownerSet).filter(id => id.includes('@'));
    }

    getOwnerCount() {
        return this.getAllOwners().length;
    }
}

module.exports = OwnerManager;
