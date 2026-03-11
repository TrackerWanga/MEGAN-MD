// megan/helpers/OwnerManager.js

const config = require('../config');

class OwnerManager {

    constructor() {

        this.ownerSet = new Set();

        this.mode = 'public';

        this.initialized = false;

    }

    // Standardize ANY JID format - now with LID support!

    normalizeJid(jid) {

        if (!jid) return '';

        

        jid = String(jid);

        

        // Handle LIDs - extract the numeric part

        if (jid.includes('@lid')) {

            const lidNumber = jid.split('@')[0];

            return { 

                full: jid,

                numeric: lidNumber,

                type: 'lid'

            };

        }

        

        // Handle regular JIDs with possible device IDs

        jid = jid.split(':')[0];

        const phoneMatch = jid.match(/(\d+)/);

        if (!phoneMatch) return { full: jid.toLowerCase(), numeric: null, type: 'unknown' };

        

        return { 

            full: phoneMatch[1] + '@s.whatsapp.net',

            numeric: phoneMatch[1],

            type: 'normal'

        };

    }

    async initialize(db) {

        // LAYER 1: Hardcoded master owner (YOU - never changes)

        if (config.OWNER_NUMBER) {

            const normalized = this.normalizeJid(config.OWNER_NUMBER);

            this.ownerSet.add(normalized.full || normalized);

            

            // Also store the numeric for matching

            if (normalized.numeric) {

                this.ownerSet.add(normalized.numeric);

            }

        }

        // LAYER 2: Sudo numbers from config

        if (config.SUDO_NUMBERS) {

            config.SUDO_NUMBERS.split(',').forEach(num => {

                if (num.trim()) {

                    const normalized = this.normalizeJid(num.trim());

                    this.ownerSet.add(normalized.full || normalized);

                    if (normalized.numeric) {

                        this.ownerSet.add(normalized.numeric);

                    }

                }

            });

        }

        // LAYER 3: Database owners

        if (db) {

            try {

                const dbOwners = await db.getSetting('owners', []);

                if (Array.isArray(dbOwners)) {

                    dbOwners.forEach(jid => {

                        if (jid) {

                            const normalized = this.normalizeJid(jid);

                            this.ownerSet.add(normalized.full || normalized);

                            if (normalized.numeric) {

                                this.ownerSet.add(normalized.numeric);

                            }

                        }

                    });

                }

                

                this.mode = await db.getSetting('mode', config.MODE || 'public');

            } catch (error) {

                console.error('Failed to load owners from DB:', error.message);

            }

        }

        // Add LID owner from env if configured

        if (process.env.LID_OWNER) {

            const normalized = this.normalizeJid(process.env.LID_OWNER);

            this.ownerSet.add(normalized.full || normalized);

            if (normalized.numeric) {

                this.ownerSet.add(normalized.numeric);

            }

        }

        this.initialized = true;

        console.log(`👑 Owner system initialized with ${this.ownerSet.size} identifier(s)`);

        return this;

    }

    // SYNC check - FAST, handles LIDs and numbers

    isOwner(jid) {

        if (!jid || !this.initialized) return false;

        

        // Try direct match first

        if (this.ownerSet.has(jid)) return true;

        

        // Normalize and check all possibilities

        const normalized = this.normalizeJid(jid);

        

        // Check full JID

        if (normalized.full && this.ownerSet.has(normalized.full)) return true;

        

        // Check numeric part

        if (normalized.numeric && this.ownerSet.has(normalized.numeric)) return true;

        

        // For LIDs, also check if any owner starts with this number

        if (normalized.type === 'lid' && normalized.numeric) {

            for (const ownerId of this.ownerSet) {

                if (ownerId.includes(normalized.numeric)) return true;

            }

        }

        

        return false;

    }

    // Get owner-only message for commands

    getOwnerOnlyMessage(commandName = 'this command') {

        return {

            text: `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                  `┃ *${config.BOT_NAME}*\n` +

                  `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                  `👑 *Owner Only Command*\n\n` +

                  `You must be an owner to use ${commandName}.\n\n` +

                  `• Current mode: ${this.mode}\n` +

                  `• Owners: ${this.getOwnerCount()}\n\n` +

                  `> created by wanga`

        };

    }

    async addOwner(jid, db) {

        const normalized = this.normalizeJid(jid);

        

        // Add both full JID and numeric

        if (normalized.full) this.ownerSet.add(normalized.full);

        if (normalized.numeric) this.ownerSet.add(normalized.numeric);

        

        if (db) {

            // Save to database (store the original format)

            const owners = Array.from(this.ownerSet).filter(id => id.includes('@'));

            await db.setSetting('owners', owners);

        }

        return true;

    }

    async removeOwner(jid, db) {

        const normalized = this.normalizeJid(jid);

        

        // Don't allow removing the main owner from config

        const mainOwner = this.normalizeJid(config.OWNER_NUMBER);

        if (mainOwner.full === normalized.full || mainOwner.numeric === normalized.numeric) {

            return false; // Cannot remove main owner

        }

        

        // Remove both full JID and numeric

        if (normalized.full) this.ownerSet.delete(normalized.full);

        if (normalized.numeric) this.ownerSet.delete(normalized.numeric);

        

        if (db) {

            const owners = Array.from(this.ownerSet).filter(id => id.includes('@'));

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

        // Return first owner that has @ (prioritize config owner)

        const mainOwner = this.normalizeJid(config.OWNER_NUMBER);

        if (mainOwner.full && this.ownerSet.has(mainOwner.full)) {

            return mainOwner.full;

        }

        

        // Return any owner with @

        for (const id of this.ownerSet) {

            if (id.includes('@')) return id;

        }

        

        return null;

    }

    getAllOwners() {

        return Array.from(this.ownerSet).filter(id => id.includes('@'));

    }

    getOwnerCount() {

        return this.getAllOwners().length;

    }

}

module.exports = OwnerManager;