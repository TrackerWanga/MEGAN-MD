const zlib = require('zlib');
const fs = require('fs-extra');
const path = require('path');

class SessionDecoder {
    /**
     * Decode Megan~ prefixed session string
     * @param {string} sessionString - Full session string (Megan~H4sIAAAA...)
     * @returns {object} Decoded JSON object
     */
    static decode(sessionString) {
        try {
            // Remove the Megan~ prefix
            const base64Data = sessionString.replace('Megan~', '');
            
            // Decode base64 to buffer
            const compressedData = Buffer.from(base64Data, 'base64');
            
            // Decompress gzip
            const jsonData = zlib.gunzipSync(compressedData);
            
            // Parse JSON
            return JSON.parse(jsonData.toString('utf8'));
            
        } catch (error) {
            throw new Error(`Failed to decode session: ${error.message}`);
        }
    }

    /**
     * Encode JSON object to Megan~ session string
     * @param {object} jsonData - Session JSON object
     * @returns {string} Megan~ prefixed session string
     */
    static encode(jsonData) {
        try {
            // Convert JSON to string
            const jsonString = JSON.stringify(jsonData);
            
            // Compress with gzip
            const compressedData = zlib.gzipSync(Buffer.from(jsonString, 'utf8'));
            
            // Convert to base64 and add prefix
            return 'Megan~' + compressedData.toString('base64');
            
        } catch (error) {
            throw new Error(`Failed to encode session: ${error.message}`);
        }
    }

    /**
     * Validate if string is a valid Megan session
     * @param {string} sessionString 
     * @returns {boolean}
     */
    static isValid(sessionString) {
        if (!sessionString || typeof sessionString !== 'string') return false;
        if (!sessionString.startsWith('Megan~')) return false;
        
        try {
            const base64Part = sessionString.replace('Megan~', '');
            // Check if valid base64
            Buffer.from(base64Part, 'base64').toString('base64') === base64Part;
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Save decoded session to file
     * @param {string} sessionString 
     * @param {string} outputPath 
     */
    static async saveToFile(sessionString, outputPath) {
        const decoded = this.decode(sessionString);
        await fs.writeJson(outputPath, decoded, { spaces: 2 });
        return decoded;
    }

    /**
     * Load session from file and encode
     * @param {string} filePath 
     * @returns {string} Megan~ session string
     */
    static async loadFromFile(filePath) {
        const jsonData = await fs.readJson(filePath);
        return this.encode(jsonData);
    }
}

module.exports = SessionDecoder;