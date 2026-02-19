const fs = require('fs-extra');
const path = require('path');

/**
 * Check if session exists
 * @param {string} sessionDir - Session directory path
 * @returns {boolean}
 */
async function sessionExists(sessionDir = './session') {
    try {
        const credsPath = path.join(sessionDir, 'creds.json');
        return await fs.pathExists(credsPath);
    } catch (error) {
        return false;
    }
}

/**
 * Get session info
 * @param {string} sessionDir - Session directory path
 * @returns {Object|null}
 */
async function getSessionInfo(sessionDir = './session') {
    try {
        const credsPath = path.join(sessionDir, 'creds.json');
        if (!await fs.pathExists(credsPath)) {
            return null;
        }
        
        const creds = await fs.readJson(credsPath);
        return {
            registered: creds.registered || false,
            me: creds.me || null,
            platform: creds.platform || 'unknown',
            timestamp: creds.timestamp || null
        };
    } catch (error) {
        return null;
    }
}

/**
 * Backup current session
 * @param {string} sessionDir - Session directory path
 */
async function backupSession(sessionDir = './session') {
    try {
        if (!await sessionExists(sessionDir)) {
            return false;
        }
        
        const backupDir = `./session_backup_${Date.now()}`;
        await fs.copy(sessionDir, backupDir);
        console.log(`✅ Session backed up to: ${backupDir}`);
        return true;
    } catch (error) {
        console.error('❌ Failed to backup session:', error);
        return false;
    }
}

module.exports = {
    sessionExists,
    getSessionInfo,
    backupSession
};
