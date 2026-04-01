// MEGAN-MD Group Helper - With LID resolution

const { resolveRealJid } = require('../lib/lidResolver');

class GroupHelper {
    
    static extractPhone(input) {
        if (!input) return null;
        let phone = input.replace('@s.whatsapp.net', '');
        phone = phone.replace('@g.us', '');
        phone = phone.replace('@', '');
        phone = phone.replace(/\D/g, '');
        return phone || null;
    }

    static getJidFromInput(msg, input) {
        if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
            return msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        
        const phone = this.extractPhone(input);
        if (phone && phone.length >= 10) {
            return `${phone}@s.whatsapp.net`;
        }
        
        return null;
    }

    static async formatJid(jid, sock) {
        if (!jid) return 'N/A';
        
        // Try to resolve LID to real JID
        if (jid.endsWith('@lid')) {
            try {
                const resolvedJid = await resolveRealJid(sock, jid);
                if (resolvedJid && resolvedJid.endsWith('@s.whatsapp.net')) {
                    const number = resolvedJid.split('@')[0].split(':')[0];
                    return `@${number}`;
                }
            } catch (e) {
                // Fall through to use LID
            }
        }
        
        // For regular JIDs
        const number = jid.split('@')[0].split(':')[0];
        return `@${number}`;
    }

    static async categorizeParticipants(participants, sock) {
        const superAdmins = [];
        const admins = [];
        const members = [];
        
        for (const p of participants) {
            const display = await this.formatJid(p.id, sock);
            if (p.admin === 'superadmin') {
                superAdmins.push({ jid: p.id, display, role: 'superadmin' });
            } else if (p.admin === 'admin') {
                admins.push({ jid: p.id, display, role: 'admin' });
            } else {
                members.push({ jid: p.id, display, role: 'member' });
            }
        }
        
        return { superAdmins, admins, members };
    }

    static isAdmin(participants, jid) {
        const participant = participants.find(p => p.id === jid);
        return participant && (participant.admin === 'admin' || participant.admin === 'superadmin');
    }

    static isSuperAdmin(participants, jid) {
        const participant = participants.find(p => p.id === jid);
        return participant && participant.admin === 'superadmin';
    }

    static isGroupOwner(metadata, jid) {
        return metadata.owner === jid;
    }

    static isBotOwner(userJid, ownerNumber) {
        return userJid.split('@')[0] === ownerNumber;
    }

    static canPerformAdminAction(metadata, userJid, ownerNumber) {
        return this.isAdmin(metadata.participants, userJid) || 
               this.isBotOwner(userJid, ownerNumber);
    }

    static getAllMentions(participants) {
        return participants.map(p => p.id);
    }

    static getAdminMentions(participants) {
        return participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);
    }

    static formatGroupInfo(metadata) {
        const { subject, desc, size, creation, owner, participants, id, restrict, announce } = metadata;
        
        const created = new Date(creation * 1000).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const ownerJid = owner ? `@${owner.split('@')[0].split(':')[0]}` : 'Not available';
        
        const superAdmins = participants.filter(p => p.admin === 'superadmin').length;
        const admins = participants.filter(p => p.admin === 'admin').length;
        const members = participants.length - superAdmins - admins;
        
        const messageSetting = announce === 'announcement' ? '🔒 Admins only' : '🔓 Everyone';
        const infoSetting = restrict === 'locked' ? '🔒 Admins only' : '🔓 Everyone';
        
        let info = `*📌 GROUP INFORMATION*\n\n`;
        info += `📛 *Name:* ${subject}\n`;
        info += `🆔 *ID:* ${id.split('@')[0]}\n`;
        info += `👥 *Members:* ${size}\n`;
        info += `👑 *Owner:* ${ownerJid}\n`;
        info += `📅 *Created:* ${created}\n\n`;
        
        info += `*⚙️ SETTINGS*\n`;
        info += `• Messages: ${messageSetting}\n`;
        info += `• Edit Info: ${infoSetting}\n\n`;
        
        if (superAdmins) {
            info += `*👑 Super Admins (${superAdmins})*\n`;
            info += `... and ${superAdmins} super admins\n\n`;
        }
        
        if (admins) {
            info += `*👮 Admins (${admins})*\n`;
            info += `... and ${admins} admins\n\n`;
        }
        
        info += `*👤 Members (${members})*\n`;
        info += `... and ${members} members`;
        
        if (desc) {
            info += `\n\n📝 *Description:*\n${desc}`;
        }
        
        info += `\n\n> created by wanga`;
        
        return info;
    }

    static async formatParticipantList(participants, sock) {
        const { superAdmins, admins, members } = await this.categorizeParticipants(participants, sock);
        
        let list = '';
        
        if (superAdmins.length) {
            list += `*👑 Super Admins (${superAdmins.length})*\n`;
            list += superAdmins.map(a => a.display).join('\n') + '\n\n';
        }
        
        if (admins.length) {
            list += `*👮 Admins (${admins.length})*\n`;
            list += admins.map(a => a.display).join('\n') + '\n\n';
        }
        
        list += `*👤 Members (${members.length})*\n`;
        list += members.slice(0, 20).map(m => m.display).join('\n');
        if (members.length > 20) {
            list += `\n... and ${members.length - 20} more`;
        }
        
        list += `\n\n> created by wanga`;
        
        return list;
    }

    static formatActionResult(action, results) {
        const success = results.filter(r => r.status === '200').length;
        const failed = results.filter(r => r.status !== '200').length;
        
        const emoji = {
            'add': '➕', 'remove': '➖', 'promote': '👑', 'demote': '👤'
        }[action] || '✅';
        
        let result = `${emoji} *${action.toUpperCase()} RESULT*\n\n`;
        result += `✅ Success: ${success}\n`;
        if (failed > 0) result += `❌ Failed: ${failed}\n`;
        result += `\n> created by wanga`;
        
        return result;
    }

    static parsePollArgs(args) {
        const parsed = [];
        let current = '';
        let inQuotes = false;
        const text = args.join(' ');
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === '"' && (i === 0 || text[i-1] !== '\\')) {
                inQuotes = !inQuotes;
                if (!inQuotes && current) {
                    parsed.push(current);
                    current = '';
                }
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    parsed.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current) parsed.push(current);
        return parsed;
    }

    static extractGroupCode(link) {
        if (!link || !link.includes('chat.whatsapp.com')) return null;
        const parts = link.split('/');
        return parts[parts.length - 1];
    }

    static isGroupJid(jid) {
        return jid && jid.endsWith('@g.us');
    }

    static isUserJid(jid) {
        return jid && jid.endsWith('@s.whatsapp.net');
    }
}

module.exports = GroupHelper;
