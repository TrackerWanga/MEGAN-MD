const { 
    jidNormalizedUser,
    isJidGroup,
    isJidUser,
    isLidUser,
    jidDecode
} = require('gifted-baileys');

function standardizeJid(jid) {
    if (!jid) return '';
    try {
        return jidNormalizedUser(jid);
    } catch (error) {
        jid = String(jid).split(':')[0].split('/')[0];
        if (!jid.includes('@')) {
            jid += '@s.whatsapp.net';
        }
        return jid.toLowerCase();
    }
}

function isGroup(jid) {
    return jid && (jid.endsWith('@g.us') || isJidGroup(jid));
}

function isPrivate(jid) {
    return jid && (jid.endsWith('@s.whatsapp.net') || isJidUser(jid));
}

function isLid(jid) {
    return isLidUser(jid);
}

function getPhoneNumber(jid) {
    if (!jid) return '';
    jid = standardizeJid(jid);
    return jid.split('@')[0];
}

function formatPhone(phone) {
    phone = phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
        phone = '254' + phone.slice(1);
    }
    if (!phone.startsWith('254')) {
        phone = '254' + phone;
    }
    return phone;
}

module.exports = {
    standardizeJid,
    isGroup,
    isPrivate,
    isLid,
    getPhoneNumber,
    formatPhone
};
