/**

 * Group Helper - Utility functions for group management

 * Provides helper methods for all group-related operations

 */

class GroupHelper {

    

    /**

     * Format participant list for display

     * @param {Array} participants - Array of participant objects

     * @returns {Object} Object containing adminList and memberList arrays

     */

    static formatParticipantList(participants) {

        let superAdmins = [];

        let admins = [];

        let members = [];

        

        participants.forEach(p => {

            const jid = p.id.split('@')[0];

            if (p.admin === 'superadmin') {

                superAdmins.push(`👑 @${jid}`);

            } else if (p.admin === 'admin') {

                admins.push(`👮 @${jid}`);

            } else {

                members.push(`👤 @${jid}`);

            }

        });

        

        return { superAdmins, admins, members };

    }

    /**

     * Format participant list with roles

     * @param {Array} participants - Array of participant objects

     * @returns {Object} Object containing categorized participants

     */

    static categorizeParticipants(participants) {

        const superAdmins = [];

        const admins = [];

        const members = [];

        participants.forEach(p => {

            const jid = p.id.split('@')[0];

            if (p.admin === 'superadmin') {

                superAdmins.push({

                    jid: p.id,

                    display: `@${jid}`,

                    role: 'superadmin'

                });

            } else if (p.admin === 'admin') {

                admins.push({

                    jid: p.id,

                    display: `@${jid}`,

                    role: 'admin'

                });

            } else {

                members.push({

                    jid: p.id,

                    display: `@${jid}`,

                    role: 'member'

                });

            }

        });

        return { superAdmins, admins, members };

    }

    /**

     * Get all participant JIDs for mentions

     * @param {Array} participants - Array of participant objects

     * @returns {Array} Array of JIDs

     */

    static getAllMentions(participants) {

        return participants.map(p => p.id);

    }

    /**

     * Get admin JIDs for mentions

     * @param {Array} participants - Array of participant objects

     * @returns {Array} Array of admin JIDs

     */

    static getAdminMentions(participants) {

        return participants

            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')

            .map(p => p.id);

    }

    /**

     * Format group info for display

     * @param {Object} metadata - Group metadata object

     * @returns {string} Formatted group info

     */

    static formatGroupInfo(metadata) {

        const { subject, desc, size, creation, owner, participants, id, restrict, announce } = metadata;

        const created = new Date(creation * 1000).toLocaleDateString('en-KE', {

            dateStyle: 'full',

            timeStyle: 'short'

        });

        

        const ownerJid = owner ? owner.split('@')[0] : 'Not available';

        const { superAdmins, admins, members } = this.categorizeParticipants(participants);

        

        // Group settings

        const messageSetting = announce === 'announcement' ? '🔒 Admins only' : '🔓 Everyone';

        const infoSetting = restrict === 'locked' ? '🔒 Admins only' : '🔓 Everyone';

        

        let info = `📌 *GROUP INFORMATION*\n\n`;

        info += `📛 *Name:* ${subject}\n`;

        info += `🆔 *ID:* ${id.split('@')[0]}\n`;

        info += `👥 *Total Members:* ${size}\n`;

        info += `👑 *Owner:* @${ownerJid}\n`;

        info += `📅 *Created:* ${created}\n\n`;

        

        info += `━━━━━━━━━━━━━━\n`;

        info += `*⚙️ GROUP SETTINGS*\n`;

        info += `━━━━━━━━━━━━━━\n`;

        info += `💬 *Message:* ${messageSetting}\n`;

        info += `✏️ *Edit Info:* ${infoSetting}\n\n`;

        

        info += `━━━━━━━━━━━━━━\n`;

        info += `*👑 SUPER ADMINS (${superAdmins.length})*\n`;

        info += superAdmins.map(a => a.display).join('\n') || 'None';

        info += `\n\n`;

        

        info += `*👮 ADMINS (${admins.length})*\n`;

        info += admins.map(a => a.display).join('\n') || 'None';

        info += `\n\n`;

        

        info += `*👤 MEMBERS (${members.length})*\n`;

        info += members.map(m => m.display).join('\n') || 'None';

        info += `\n\n`;

        

        info += `━━━━━━━━━━━━━━\n`;

        info += `📝 *Description:*\n${desc || 'No description'}`;

        

        return info;

    }

    /**

     * Format group list for display

     * @param {Array} groups - Array of group objects

     * @param {number} startIndex - Starting index for numbering

     * @returns {string} Formatted group list

     */

    static formatGroupList(groups, startIndex = 0) {

        let list = '';

        

        groups.forEach((group, index) => {

            const num = startIndex + index + 1;

            const size = group.participants.length;

            const admins = group.participants.filter(p => p.admin).length;

            const messageSetting = group.announce === 'announcement' ? '🔒' : '🔓';

            

            list += `${num}. ${messageSetting} *${group.subject}*\n`;

            list += `   👥 ${size} members | 👑 ${admins} admins\n`;

            list += `   🆔 ${group.id.split('@')[0]}\n\n`;

        });

        

        return list;

    }

    /**

     * Check if user is admin

     * @param {Array} participants - Array of participant objects

     * @param {string} jid - User JID to check

     * @returns {boolean} True if user is admin

     */

    static isAdmin(participants, jid) {

        const participant = participants.find(p => p.id === jid);

        return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');

    }

    /**

     * Check if user is super admin

     * @param {Array} participants - Array of participant objects

     * @param {string} jid - User JID to check

     * @returns {boolean} True if user is super admin

     */

    static isSuperAdmin(participants, jid) {

        const participant = participants.find(p => p.id === jid);

        return participant && participant.admin === 'superadmin';

    }

    /**

     * Check if user is group owner

     * @param {Object} metadata - Group metadata

     * @param {string} jid - User JID to check

     * @returns {boolean} True if user is owner

     */

    static isOwner(metadata, jid) {

        return metadata.owner === jid;

    }

    /**

     * Check if user is bot owner

     * @param {string} userJid - User JID to check

     * @param {string} ownerNumber - Bot owner's phone number

     * @returns {boolean} True if user is bot owner

     */

    static isBotOwner(userJid, ownerNumber) {

        return userJid.split('@')[0] === ownerNumber;

    }

    /**

     * Check if user can perform admin action

     * @param {Object} metadata - Group metadata

     * @param {string} userJid - User JID

     * @param {string} ownerNumber - Bot owner's number

     * @returns {boolean} True if user has admin rights

     */

    static canPerformAdminAction(metadata, userJid, ownerNumber) {

        return this.isAdmin(metadata.participants, userJid) || 

               this.isBotOwner(userJid, ownerNumber);

    }

    /**

     * Get group size category

     * @param {number} size - Number of members

     * @returns {string} Size category

     */

    static getGroupSizeCategory(size) {

        if (size < 50) return 'Small';

        if (size < 200) return 'Medium';

        if (size < 500) return 'Large';

        if (size < 1000) return 'Very Large';

        return 'Massive';

    }

    /**

     * Format group settings status

     * @param {Object} metadata - Group metadata

     * @returns {Object} Formatted settings

     */

    static getGroupSettings(metadata) {

        return {

            messageSetting: metadata.announce === 'announcement' ? '🔒 Admins only' : '🔓 Everyone',

            infoSetting: metadata.restrict === 'locked' ? '🔒 Admins only' : '🔓 Everyone',

            isLocked: metadata.announce === 'announcement',

            isInfoLocked: metadata.restrict === 'locked'

        };

    }

    /**

     * Validate phone number

     * @param {string} phone - Phone number to validate

     * @returns {boolean} True if valid

     */

    static isValidPhone(phone) {

        const cleanPhone = phone.replace(/\D/g, '');

        return cleanPhone.length >= 10 && cleanPhone.length <= 15;

    }

    /**

     * Extract phone from various formats

     * @param {string} input - Input string (phone, @mention, JID)

     * @returns {string|null} Extracted phone number or null

     */

    static extractPhone(input) {

        if (!input) return null;

        

        // Remove @s.whatsapp.net if present

        let phone = input.replace('@s.whatsapp.net', '');

        // Remove @ if present

        phone = phone.replace('@', '');

        // Remove any non-numeric characters

        phone = phone.replace(/\D/g, '');

        

        return phone || null;

    }

    /**

     * Format JID for display

     * @param {string} jid - JID to format

     * @returns {string} Formatted JID with @

     */

    static formatJid(jid) {

        if (!jid) return 'N/A';

        return `@${jid.split('@')[0]}`;

    }

    /**

     * Create tag all message

     * @param {string} message - Custom message

     * @param {Array} participants - Array of participants

     * @returns {Object} Formatted message and mentions

     */

    static createTagAllMessage(message, participants) {

        const mentions = participants.map(p => p.id);

        const allMentions = participants.map(p => `@${p.id.split('@')[0]}`).join(' ');

        

        const text = `┏━━━━━━━━━━━━━━━━━━━┓\n` +

                    `┃ *MEGAN BOT*\n` +

                    `┗━━━━━━━━━━━━━━━━━━━┛\n\n` +

                    `📢 *MESSAGE:*\n${message}\n\n` +

                    `👥 *TAGGED MEMBERS:*\n${allMentions}\n\n` +

                    `> created by wanga`;

        

        return { text, mentions };

    }

    /**

     * Parse poll arguments (handles quoted strings)

     * @param {Array} args - Raw arguments array

     * @returns {Object} Parsed poll data

     */

    static parsePollArgs(args) {

        const parsedArgs = [];

        let currentArg = '';

        let inQuotes = false;

        const fullText = args.join(' ');

        

        for (let i = 0; i < fullText.length; i++) {

            const char = fullText[i];

            

            if (char === '"' && (i === 0 || fullText[i-1] !== '\\')) {

                inQuotes = !inQuotes;

                if (!inQuotes && currentArg) {

                    parsedArgs.push(currentArg);

                    currentArg = '';

                }

            } else if (char === ' ' && !inQuotes) {

                if (currentArg) {

                    parsedArgs.push(currentArg);

                    currentArg = '';

                }

            } else {

                currentArg += char;

            }

        }

        

        if (currentArg) {

            parsedArgs.push(currentArg);

        }

        

        return parsedArgs;

    }

    /**

     * Format poll result

     * @param {string} question - Poll question

     * @param {Array} options - Poll options

     * @param {number} selectableCount - Number of selectable options

     * @returns {string} Formatted poll text

     */

    static formatPollText(question, options, selectableCount = 1) {

        let text = `📊 *POLL CREATED*\n\n`;

        text += `*Question:* ${question}\n\n`;

        text += `*Options:*\n`;

        options.forEach((opt, i) => {

            text += `${i + 1}. ${opt}\n`;

        });

        text += `\n*Select:* ${selectableCount} option(s)`;

        return text;

    }

    /**

     * Extract group code from invite link

     * @param {string} link - Invite link

     * @returns {string|null} Group code or null

     */

    static extractGroupCode(link) {

        if (!link || !link.includes('chat.whatsapp.com')) return null;

        

        const parts = link.split('/');

        return parts[parts.length - 1];

    }

    /**

     * Check if string is a valid group JID

     * @param {string} jid - JID to check

     * @returns {boolean} True if valid group JID

     */

    static isGroupJid(jid) {

        return jid && jid.endsWith('@g.us');

    }

    /**

     * Check if string is a valid user JID

     * @param {string} jid - JID to check

     * @returns {boolean} True if valid user JID

     */

    static isUserJid(jid) {

        return jid && jid.endsWith('@s.whatsapp.net');

    }

    /**

     * Get participant by JID

     * @param {Array} participants - Array of participants

     * @param {string} jid - JID to find

     * @returns {Object|null} Participant object or null

     */

    static getParticipant(participants, jid) {

        return participants.find(p => p.id === jid) || null;

    }

    /**

     * Get participant name/number

     * @param {Object} participant - Participant object

     * @returns {string} Display name/number

     */

    static getParticipantDisplay(participant) {

        if (!participant) return 'Unknown';

        return participant.id.split('@')[0];

    }

    /**

     * Format action result

     * @param {string} action - Action performed

     * @param {Array} results - API results array

     * @returns {string} Formatted result text

     */

    static formatActionResult(action, results) {

        const success = results.filter(r => r.status === '200').length;

        const failed = results.filter(r => r.status !== '200').length;

        

        let emoji = '';

        switch(action) {

            case 'add': emoji = '➕'; break;

            case 'remove': emoji = '➖'; break;

            case 'promote': emoji = '👑'; break;

            case 'demote': emoji = '👤'; break;

            default: emoji = '✅';

        }

        

        return `${emoji} *${action.charAt(0).toUpperCase() + action.slice(1)} Result*\n\n` +

               `✅ Success: ${success}\n` +

               `❌ Failed: ${failed}`;

    }

}

module.exports = GroupHelper;
