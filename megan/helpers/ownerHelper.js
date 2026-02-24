/**

 * Owner Helper - Simple owner check using config

 */

class OwnerHelper {

    constructor(config) {

        this.config = config;

        this.ownerNumber = config.OWNER_NUMBER;

        this.ownerJid = this.ownerNumber.includes('@') ? 

            this.ownerNumber : `${this.ownerNumber}@s.whatsapp.net`;

        this.ownerName = config.OWNER_NAME;

    }

    /**

     * Extract phone number from JID

     */

    extractPhoneFromJid(jid) {

        if (!jid) return null;

        if (/^\d+$/.test(jid)) return jid;

        

        const parts = jid.split('@');

        let userPart = parts[0];

        

        if (userPart.includes(':')) {

            userPart = userPart.split(':')[0];

        }

        

        return userPart.replace(/\D/g, '');

    }

    /**

     * Check if user is owner

     */

    isOwner(userJid) {

        if (!userJid) return false;

        

        const userPhone = this.extractPhoneFromJid(userJid);

        const ownerPhone = this.extractPhoneFromJid(this.ownerNumber);

        

        return userPhone === ownerPhone;

    }

    /**

     * Get owner JID

     */

    getOwnerJid() {

        return this.ownerJid;

    }

    /**

     * Get owner number

     */

    getOwnerNumber() {

        return this.ownerNumber;

    }

    /**

     * Get owner name

     */

    getOwnerName() {

        return this.ownerName;

    }

}

module.exports = OwnerHelper;