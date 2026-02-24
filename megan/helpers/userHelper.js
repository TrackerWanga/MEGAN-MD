/**

 * User Helper - Manage user data (warns, mutes, blacklist, whitelist)

 */

class UserHelper {

    constructor(db, ownerHelper) {

        this.db = db;

        this.ownerHelper = ownerHelper;

    }

    // ==================== BLACKLIST ====================

    /**

     * Add user to blacklist

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} Success

     */

    async addToBlacklist(jid) {

        const blacklist = await this.db.getSetting('blacklist', []);

        if (!blacklist.includes(jid)) {

            blacklist.push(jid);

            await this.db.setSetting('blacklist', blacklist);

            return true;

        }

        return false;

    }

    /**

     * Remove user from blacklist

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} Success

     */

    async removeFromBlacklist(jid) {

        const blacklist = await this.db.getSetting('blacklist', []);

        const index = blacklist.indexOf(jid);

        if (index > -1) {

            blacklist.splice(index, 1);

            await this.db.setSetting('blacklist', blacklist);

            return true;

        }

        return false;

    }

    /**

     * Check if user is blacklisted

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} True if blacklisted

     */

    async isBlacklisted(jid) {

        const blacklist = await this.db.getSetting('blacklist', []);

        return blacklist.includes(jid);

    }

    /**

     * Get all blacklisted users

     * @returns {Promise<Array>} Blacklisted users

     */

    async getBlacklist() {

        return await this.db.getSetting('blacklist', []);

    }

    // ==================== WHITELIST ====================

    /**

     * Add user to whitelist

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} Success

     */

    async addToWhitelist(jid) {

        const whitelist = await this.db.getSetting('whitelist', []);

        if (!whitelist.includes(jid)) {

            whitelist.push(jid);

            await this.db.setSetting('whitelist', whitelist);

            return true;

        }

        return false;

    }

    /**

     * Remove user from whitelist

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} Success

     */

    async removeFromWhitelist(jid) {

        const whitelist = await this.db.getSetting('whitelist', []);

        const index = whitelist.indexOf(jid);

        if (index > -1) {

            whitelist.splice(index, 1);

            await this.db.setSetting('whitelist', whitelist);

            return true;

        }

        return false;

    }

    /**

     * Check if user is whitelisted

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} True if whitelisted

     */

    async isWhitelisted(jid) {

        // Owner is always whitelisted

        if (this.ownerHelper.isOwner(jid)) return true;

        

        const whitelist = await this.db.getSetting('whitelist', []);

        return whitelist.includes(jid);

    }

    /**

     * Get all whitelisted users

     * @returns {Promise<Array>} Whitelisted users

     */

    async getWhitelist() {

        return await this.db.getSetting('whitelist', []);

    }

    // ==================== WARNINGS ====================

    /**

     * Warn a user

     * @param {string} jid - User JID

     * @param {string} reason - Warning reason

     * @returns {Promise<Object>} Warning result

     */

    async warnUser(jid, reason = 'No reason provided') {

        const warns = await this.db.getSetting('warns', {});

        

        if (!warns[jid]) {

            warns[jid] = { count: 1, reasons: [reason] };

        } else {

            warns[jid].count += 1;

            warns[jid].reasons.push(reason);

        }

        

        await this.db.setSetting('warns', warns);

        

        return {

            count: warns[jid].count,

            reasons: warns[jid].reasons,

            shouldKick: warns[jid].count >= 3

        };

    }

    /**

     * Reset warnings for a user

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} Success

     */

    async resetWarnings(jid) {

        const warns = await this.db.getSetting('warns', {});

        

        if (warns[jid]) {

            delete warns[jid];

            await this.db.setSetting('warns', warns);

            return true;

        }

        return false;

    }

    /**

     * Get user warnings

     * @param {string} jid - User JID

     * @returns {Promise<Object>} Warning info

     */

    async getWarnings(jid) {

        const warns = await this.db.getSetting('warns', {});

        return warns[jid] || { count: 0, reasons: [] };

    }

    // ==================== MUTE ====================

    /**

     * Mute a user

     * @param {string} jid - User JID

     * @param {number} minutes - Mute duration in minutes

     * @returns {Promise<number>} Muted until timestamp

     */

    async muteUser(jid, minutes = 60) {

        const muted = await this.db.getSetting('muted', {});

        const mutedUntil = Date.now() + (minutes * 60 * 1000);

        

        muted[jid] = mutedUntil;

        await this.db.setSetting('muted', muted);

        

        return mutedUntil;

    }

    /**

     * Unmute a user

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} Success

     */

    async unmuteUser(jid) {

        const muted = await this.db.getSetting('muted', {});

        

        if (muted[jid]) {

            delete muted[jid];

            await this.db.setSetting('muted', muted);

            return true;

        }

        return false;

    }

    /**

     * Check if user is muted

     * @param {string} jid - User JID

     * @returns {Promise<boolean>} True if muted

     */

    async isMuted(jid) {

        const muted = await this.db.getSetting('muted', {});

        

        if (!muted[jid]) return false;

        

        // Check if mute has expired

        if (muted[jid] < Date.now()) {

            delete muted[jid];

            await this.db.setSetting('muted', muted);

            return false;

        }

        

        return true;

    }

    /**

     * Get mute info for user

     * @param {string} jid - User JID

     * @returns {Promise<Object>} Mute info

     */

    async getMuteInfo(jid) {

        const muted = await this.db.getSetting('muted', {});

        

        if (!muted[jid]) {

            return { isMuted: false };

        }

        

        if (muted[jid] < Date.now()) {

            delete muted[jid];

            await this.db.setSetting('muted', muted);

            return { isMuted: false };

        }

        

        return {

            isMuted: true,

            until: muted[jid],

            remaining: Math.round((muted[jid] - Date.now()) / 60000) // minutes remaining

        };

    }

    // ==================== USER INFO ====================

    /**

     * Get comprehensive user info

     * @param {string} jid - User JID

     * @param {Object} sock - Socket instance for fetching profile

     * @returns {Promise<Object>} User info

     */

    async getUserInfo(jid, sock) {

        const userShort = jid.split('@')[0];

        

        // Get about

        let about = 'Not available';

        let aboutTime = 'Unknown';

        try {

            if (sock) {

                const status = await sock.fetchStatus(jid);

                about = status.status || 'Not set';

                aboutTime = new Date(status.setAt).toLocaleString();

            }

        } catch (e) {

            // No about found

        }

        // Get profile picture

        let ppUrl = 'Not available';

        try {

            if (sock) {

                ppUrl = await sock.profilePictureUrl(jid, 'image');

            }

        } catch (e) {

            ppUrl = 'No profile picture';

        }

        // Get warnings

        const warnings = await this.getWarnings(jid);

        

        // Get mute info

        const muteInfo = await this.getMuteInfo(jid);

        

        // Check blacklist/whitelist

        const isBlacklisted = await this.isBlacklisted(jid);

        const isWhitelisted = await this.isWhitelisted(jid);

        const isOwner = this.ownerHelper.isOwner(jid);

        return {

            jid,

            phone: userShort,

            about,

            aboutTime,

            profilePic: ppUrl,

            warnings: warnings.count,

            warningReasons: warnings.reasons,

            isMuted: muteInfo.isMuted,

            mutedUntil: muteInfo.until,

            muteRemaining: muteInfo.remaining,

            isBlacklisted,

            isWhitelisted,

            isOwner

        };

    }

}

module.exports = UserHelper;