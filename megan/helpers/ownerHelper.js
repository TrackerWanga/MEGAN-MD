/**

 * Owner Helper - With proper JID standardization

 * Converts all JIDs to consistent format for reliable comparison

 */

const {

    jidDecode,

    areJidsSameUser

} = require('gifted-baileys');

class OwnerHelper {

    constructor(config, db) {

        this.config = config;

        this.db = db;

        this.ownerNumber = null;

        this.ownerJid = null;

        this.mode = 'public';

        

        // Initialize owner

        this._initializeOwner();

    }

    /**

     * Initialize owner from ENV or DB

     */

    async _initializeOwner() {

        // PRIORITY 1: Check .env first

        if (this.config && this.config.OWNER_NUMBER) {

            const envOwner = this.config.OWNER_NUMBER.replace(/\D/g, '');

            if (envOwner && envOwner.length >= 10 && envOwner.length <= 15) {

                this.ownerNumber = envOwner;

                // Store owner JID in standardized format

                this.ownerJid = this.standardizeJid(`${envOwner}@s.whatsapp.net`);

                console.log(`👑 OWNER SET FROM .ENV: ${this.ownerNumber}`);

                console.log(`👑 OWNER JID: ${this.ownerJid}`);

                

                // Save to DB for backup

                if (this.db) {

                    await this.db.setSetting('owner_number', envOwner);

                }

                return;

            }

        }

        

        // PRIORITY 2: Check database for saved owner

        if (this.db) {

            const dbOwner = await this.db.getSetting('owner_number');

            if (dbOwner) {

                this.ownerNumber = dbOwner;

                this.ownerJid = this.standardizeJid(`${dbOwner}@s.whatsapp.net`);

                console.log(`👑 OWNER LOADED FROM DATABASE: ${this.ownerNumber}`);

                return;

            }

        }

        

        // No owner found anywhere

        console.log('⚠️ NO OWNER CONFIGURED - First user will become owner');

        this.ownerNumber = null;

        this.ownerJid = null;

    }

    /**

     * CRITICAL: Standardize JID to consistent format

     * Handles:

     * - 254758476795@s.whatsapp.net → 254758476795@s.whatsapp.net

     * - 254758476795:10@s.whatsapp.net → 254758476795@s.whatsapp.net

     * - 254758476795 → 254758476795@s.whatsapp.net

     * - Objects with decodeJid method

     */

    standardizeJid(jid) {

        if (!jid) return '';

        

        try {

            // If it's an object with decodeJid method (like from Gifted-Baileys)

            if (typeof jid === 'object' && jid.decodeJid) {

                jid = jid.decodeJid();

            }

            

            // Convert to string

            jid = String(jid);

            

            // Remove device ID (everything after colon)

            // Example: 254758476795:10@s.whatsapp.net → 254758476795@s.whatsapp.net

            jid = jid.split(':')[0];

            

            // Remove any paths

            jid = jid.split('/')[0];

            

            // Handle LIDs (keep as is but lowercase)

            if (jid.includes('@lid')) {

                return jid.toLowerCase();

            }

            

            // Add @s.whatsapp.net if missing

            if (!jid.includes('@')) {

                jid = jid + '@s.whatsapp.net';

            }

            

            // Ensure it ends with correct domain

            if (!jid.endsWith('@s.whatsapp.net') && !jid.endsWith('@g.us') && !jid.endsWith('@lid')) {

                jid = jid.split('@')[0] + '@s.whatsapp.net';

            }

            

            return jid.toLowerCase();

            

        } catch (e) {

            console.error("JID standardization error:", e);

            return '';

        }

    }

    /**

     * Extract clean phone number from any JID format

     */

    extractPhoneFromJid(jid) {

        if (!jid) return null;

        

        try {

            // Standardize first to get consistent format

            const standardized = this.standardizeJid(jid);

            

            // Extract phone (part before @)

            let phone = standardized.split('@')[0];

            

            // Remove any remaining non-digits

            phone = phone.replace(/\D/g, '');

            

            // Validate length

            if (phone && phone.length >= 10 && phone.length <= 15) {

                return phone;

            }

            

            return null;

            

        } catch (e) {

            console.error("Phone extraction error:", e);

            return null;

        }

    }

    /**

     * Set first user as owner

     */

    async setFirstUserAsOwner(senderJid) {

        // Standardize the JID first

        const standardizedJid = this.standardizeJid(senderJid);

        

        // Extract clean phone number

        const phone = this.extractPhoneFromJid(standardizedJid);

        

        if (!phone || phone.length < 10 || phone.length > 15) {

            console.log('❌ Could not extract valid phone from first user:', senderJid);

            return false;

        }

        

        // Set in memory (store standardized JID)

        this.ownerNumber = phone;

        this.ownerJid = this.standardizeJid(`${phone}@s.whatsapp.net`);

        

        // Save to database

        if (this.db) {

            await this.db.setSetting('owner_number', phone);

        }

        

        console.log(`👑 FIRST USER SET AS OWNER: ${phone}`);

        console.log(`👑 OWNER JID: ${this.ownerJid}`);

        return true;

    }

    /**

     * Check if user is owner - USING STANDARDIZED JIDs

     * This ensures reliable comparison regardless of input format

     */

    isOwner(userJid) {

        if (!userJid || !this.ownerJid) {

            console.log('❌ Owner check failed: missing JIDs');

            return false;

        }

        

        // Standardize the user JID

        const standardizedUser = this.standardizeJid(userJid);

        

        // Compare standardized JIDs

        const result = standardizedUser === this.ownerJid;

        

        // Debug info

        const userPhone = this.extractPhoneFromJid(standardizedUser);

        console.log(`🔍 Owner check:

  User Raw: ${userJid}

  User Std: ${standardizedUser}

  User Phone: ${userPhone}

  Owner JID: ${this.ownerJid}

  Owner Phone: ${this.ownerNumber}

  Match: ${result}`);

        

        return result;

    }

    /**

     * Check if owner is set

     */

    hasOwner() {

        return this.ownerNumber !== null;

    }

    /**

     * Get current mode

     */

    async getMode() {

        if (this.db) {

            const dbMode = await this.db.getSetting('mode', 'public');

            this.mode = dbMode;

        }

        return this.mode;

    }

    /**

     * Set mode

     */

    async setMode(mode) {

        if (mode !== 'public' && mode !== 'private') return false;

        

        if (this.db) {

            await this.db.setSetting('mode', mode);

        }

        

        this.mode = mode;

        console.log(`⚙️ Mode set to: ${mode}`);

        return true;

    }

    /**

     * Get owner number (clean digits only)

     */

    getOwnerNumber() {

        return this.ownerNumber;

    }

    /**

     * Get owner JID (standardized format)

     */

    getOwnerJid() {

        return this.ownerJid;

    }

    /**

     * Get debug info

     */

    getDebugInfo(userJid) {

        const standardizedUser = userJid ? this.standardizeJid(userJid) : null;

        const userPhone = standardizedUser ? this.extractPhoneFromJid(standardizedUser) : null;

        

        return {

            rawJid: userJid,

            standardizedJid: standardizedUser,

            userPhone: userPhone,

            ownerNumber: this.ownerNumber,

            ownerJid: this.ownerJid,

            mode: this.mode,

            isOwner: userJid ? this.isOwner(userJid) : false,

            hasOwner: this.hasOwner()

        };

    }

    /**

     * Format debug info for display

     */

    formatDebugInfo(userJid) {

        const info = this.getDebugInfo(userJid);

        

        let output = `┏━━━━━━━━━━━━━━━━━━━┓\n`;

        output += `┃ *OWNER DEBUG*\n`;

        output += `┗━━━━━━━━━━━━━━━━━━━┛\n\n`;

        

        output += `*RAW JID:*\n`;

        output += `\`${info.rawJid || 'None'}\`\n\n`;

        

        output += `*STANDARDIZED:*\n`;

        output += `\`${info.standardizedJid || 'None'}\`\n\n`;

        

        output += `*EXTRACTED:*\n`;

        output += `📱 Your Phone: ${info.userPhone || '❌ INVALID'}\n`;

        output += `👑 Owner Phone: ${info.ownerNumber || 'NOT SET'}\n\n`;

        

        output += `*STATUS:*\n`;

        output += `⚙️ Mode: ${info.mode}\n`;

        output += `✅ Has Owner: ${info.hasOwner ? 'YES' : 'NO'}\n`;

        output += `👑 You are Owner: ${info.isOwner ? 'YES' : 'NO'}\n\n`;

        

        if (!info.userPhone && info.rawJid) {

            output += `⚠️ *CRITICAL:* Could not extract phone from your JID!\n`;

            output += `This means the bot can't identify you.\n\n`;

        }

        

        if (info.ownerNumber && info.userPhone && info.ownerNumber !== info.userPhone) {

            output += `🔍 *MISMATCH:*\n`;

            output += `Owner: ${info.ownerNumber}\n`;

            output += `You: ${info.userPhone}\n`;

            output += `They don't match!\n\n`;

        }

        

        output += `> created by wanga`;

        

        return output;

    }

}

module.exports = OwnerHelper;