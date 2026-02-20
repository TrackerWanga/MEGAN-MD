const { createContext } = require('./context');

class GroupHelper {
    // Format participant list for display
    static formatParticipantList(participants) {
        let adminList = [];
        let memberList = [];
        
        participants.forEach(p => {
            const jid = p.id.split('@')[0];
            if (p.admin === 'admin' || p.admin === 'superadmin') {
                adminList.push(`👑 @${jid}`);
            } else {
                memberList.push(`👤 @${jid}`);
            }
        });
        
        return { adminList, memberList };
    }

    // Create tag all mentions array
    static getAllMentions(participants) {
        return participants.map(p => p.id);
    }

    // Format group info
    static formatGroupInfo(metadata) {
        const { subject, desc, size, creation, owner, participants } = metadata;
        const created = new Date(creation * 1000).toLocaleDateString();
        const ownerJid = owner ? owner.split('@')[0] : 'Not available';
        
        const { adminList, memberList } = this.formatParticipantList(participants);
        
        let info = `📌 *GROUP INFORMATION*\n\n`;
        info += `📛 *Name:* ${subject}\n`;
        info += `👥 *Members:* ${size}\n`;
        info += `📅 *Created:* ${created}\n`;
        info += `👑 *Owner:* @${ownerJid}\n\n`;
        
        info += `━━━━━━━━━━━━━━\n`;
        info += `*ADMINS (${adminList.length})*\n`;
        info += adminList.join('\n') || 'None';
        info += `\n\n`;
        info += `*MEMBERS (${memberList.length})*\n`;
        info += memberList.join('\n') || 'None';
        
        return info;
    }

    // Check if user is admin
    static isAdmin(participants, jid) {
        const participant = participants.find(p => p.id === jid);
        return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
    }

    // Check if user is bot owner
    static isOwner(userJid, ownerNumber) {
        return userJid.split('@')[0] === ownerNumber;
    }

    // Get group size category
    static getGroupSizeCategory(size) {
        if (size < 50) return 'Small';
        if (size < 200) return 'Medium';
        if (size < 500) return 'Large';
        return 'Very Large';
    }
}

module.exports = GroupHelper;
