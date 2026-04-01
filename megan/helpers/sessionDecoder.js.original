// MEGAN-MD Session Decoder

const zlib = require('zlib');

function decodeSession(sessionString) {
    try {
        const base64Data = sessionString.replace('Megan~', '');
        const compressedData = Buffer.from(base64Data, 'base64');
        const jsonData = zlib.gunzipSync(compressedData);
        return JSON.parse(jsonData.toString('utf8'));
    } catch (error) {
        throw new Error(`Failed to decode session: ${error.message}`);
    }
}

function encodeSession(jsonData) {
    try {
        const jsonString = JSON.stringify(jsonData);
        const compressedData = zlib.gzipSync(Buffer.from(jsonString, 'utf8'));
        return 'Megan~' + compressedData.toString('base64');
    } catch (error) {
        throw new Error(`Failed to encode session: ${error.message}`);
    }
}

function isValid(sessionString) {
    if (!sessionString || typeof sessionString !== 'string') return false;
    if (!sessionString.startsWith('Megan~')) return false;
    try {
        const base64Part = sessionString.replace('Megan~', '');
        Buffer.from(base64Part, 'base64');
        return true;
    } catch {
        return false;
    }
}

module.exports = { decodeSession, encodeSession, isValid };
