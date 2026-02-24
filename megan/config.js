// Load environment variables
require('dotenv').config();

const config = {
    // ===== BOT IDENTITY (from .env with defaults) =====
    BOT_NAME: process.env.BOT_NAME || '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',
    OWNER_NAME: process.env.OWNER_NAME || 'Wanga',
    OWNER_NUMBER: process.env.OWNER_NUMBER || '254758476795',
    PREFIX: process.env.PREFIX || '.',
    
    // ===== SESSION =====
    SESSION_DIR: './session',
    
    // ===== MODE =====
    MODE: process.env.MODE || 'public',
    
    // ===== FEATURE TOGGLES (from .env) =====
    FEATURES: {
        // Master switches
        AUTO_REACT: process.env.AUTO_REACT || 'off',
        AUTO_READ: process.env.AUTO_READ || 'off',
        AUTO_BIO: process.env.AUTO_BIO || 'off',
        ANTI_DELETE: process.env.ANTI_DELETE || 'on',
        ANTI_LINK: process.env.ANTI_LINK || 'off',
        ANTI_CALL: process.env.ANTI_CALL || 'off',
        CHATBOT: process.env.CHATBOT || 'off',
        
        // Specific toggles
        AUTO_REACT_PM: process.env.AUTO_REACT_PM || 'off',
        AUTO_REACT_GROUP: process.env.AUTO_REACT_GROUP || 'off',
        AUTO_READ_PM: process.env.AUTO_READ_PM || 'off',
        AUTO_READ_GROUP: process.env.AUTO_READ_GROUP || 'off',
        
        // Anti-link settings
        ANTI_LINK_ACTION: process.env.ANTI_LINK_ACTION || 'delete',
        ANTI_LINK_WARNING: process.env.ANTI_LINK_WARNING || '3',
        ANTI_LINK_MESSAGE: process.env.ANTI_LINK_MESSAGE || '⚠️ Links are not allowed in this group!',
        
        // Anti-call settings
        ANTI_CALL_MESSAGE: process.env.ANTI_CALL_MESSAGE || '📞 Calls are not allowed! I will reject your call.'
    },
    
    // ===== PRESENCE SETTINGS =====
    PRESENCE: {
        PM: process.env.PRESENCE_PM || 'typing',
        GROUP: process.env.PRESENCE_GROUP || 'typing',
        AUTO_TYPING: process.env.AUTO_TYPING || 'off',
        AUTO_RECORDING: process.env.AUTO_RECORDING || 'off'
    },
    
    // ===== STATUS FEATURES =====
    STATUS: {
        AUTO_VIEW: process.env.AUTO_VIEW_STATUS === 'on' ? true : false,
        AUTO_DOWNLOAD: process.env.AUTO_DOWNLOAD_STATUS === 'on' ? true : false,
        AUTO_REACT: process.env.AUTO_REACT_STATUS === 'on' ? true : false,
        AUTO_REPLY: process.env.AUTO_REPLY_STATUS === 'on' ? true : false,
        REACT_EMOJIS: process.env.STATUS_REACT_EMOJIS || '💛,❤️,💜,🤍,💙,👍,🔥',
        REPLY_TEXT: process.env.STATUS_REPLY_TEXT || '✅ Status viewed via Megan-MD',
        AUTO_SAVE: process.env.AUTO_SAVE_STATUS === 'on' ? true : false,
        AUTO_VIEW_ONCE: process.env.AUTO_VIEW_ONCE === 'on' ? true : false
    },
    
    // ===== WELCOME/GOODBYE SETTINGS =====
    WELCOME: {
        ENABLED: process.env.WELCOME === 'on' ? true : false,
        MESSAGE: process.env.WELCOME_MESSAGE || 'Hey @user welcome to our group! Hope you enjoy and connect with everyone.',
        AUDIO: process.env.WELCOME_AUDIO === 'on' ? true : false
    },
    
    GOODBYE: {
        ENABLED: process.env.GOODBYE === 'on' ? true : false,
        MESSAGE: process.env.GOODBYE_MESSAGE || 'Goodbye @user! 👋',
        AUDIO: process.env.GOODBYE_AUDIO === 'on' ? true : false
    },
    
    // ===== PRIVACY SETTINGS =====
    PRIVACY: {
        LAST_SEEN: process.env.LAST_SEEN || 'all',
        PROFILE_PIC: process.env.PROFILE_PIC || 'all',
        STATUS: process.env.STATUS_PRIVACY || 'all',
        READ_RECEIPTS: process.env.READ_RECEIPTS || 'all',
        ONLINE: process.env.ONLINE_PRIVACY || 'all',
        BLOCK_UNKNOWN: process.env.BLOCK_UNKNOWN === 'on' ? true : false,
        BLOCK_PRIVATE: process.env.BLOCK_PRIVATE === 'on' ? true : false
    },
    
    // ===== CHATBOT AI SETTINGS =====
    CHATBOT_AI: {
        MODE: process.env.AI_MODE || 'normal',
        MODEL: process.env.AI_MODEL || '@cf/meta/llama-3.1-8b-instruct',
        WORKER_URL: process.env.CLOUDFLARE_WORKER || 'https://late-salad-9d56.youngwanga254.workers.dev'
    },
    
    // ===== API ENDPOINTS =====
    API: {
        ELITE_PROTECH: process.env.ELITE_PROTECH_API || 'https://eliteprotech-apis.zone.id',
        CLOUDFLARE_WORKER: process.env.CLOUDFLARE_WORKER || 'https://late-salad-9d56.youngwanga254.workers.dev'
    },
    
    // ===== DATABASE =====
    DATABASE: {
        ENABLED: process.env.DATABASE_ENABLED !== 'false' ? true : false,
        TYPE: 'json'
    },
    
    // ===== CACHE SETTINGS =====
    CACHE: {
        MESSAGES: true,
        STATUS_DURATION: 60 * 1000,
        GROUP_DURATION: 60 * 1000,
        CLEANUP_INTERVAL: 30 * 1000,
        STORE_MESSAGES: true,
        MAX_STORE: 100
    },
    
    // ===== CONNECTION SETTINGS =====
    CONNECTION: {
        RECONNECT_INTERVAL: 1000,
        MAX_RECONNECT_ATTEMPTS: 10,
        RECONNECT_BACKOFF: true
    },
    
    // ===== BROWSER INFO =====
    BROWSER: ["Ubuntu", "Chrome", "20.0.04"],
    
    // ===== LOGGING =====
    LOG_LEVEL: 'silent',
    
    // ===== BOT MEDIA =====
    BOT_PIC: process.env.BOT_PIC || 'https://files.catbox.moe/u29yah.jpg',
    
    // ===== TIMEZONE =====
    TIMEZONE: process.env.TIMEZONE || 'Africa/Nairobi',
    
    // ===== FOOTER =====
    FOOTER: process.env.FOOTER || '© 𝐌𝐄𝐆𝐀𝐍-𝐌𝐃'
};

// ===== VALIDATION =====
// Check if required fields are present (optional)
if (!config.OWNER_NAME) {
    console.warn('⚠️ OWNER_NAME not set in .env - using default');
}

if (!config.OWNER_NUMBER) {
    console.warn('⚠️ OWNER_NUMBER not set in .env - using default');
}

// ===== HELPER FUNCTIONS =====
// Get a setting by key (for backward compatibility)
config.get = function(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return defaultValue;
        }
    }
    
    return value;
};

// Check if a feature is enabled
config.isEnabled = function(feature) {
    const features = this.FEATURES;
    return features[feature] === 'on' || features[feature] === true;
};

// Get bot prefix
config.getPrefix = function() {
    return this.PREFIX;
};

// Get owner JID
config.getOwnerJid = function() {
    return this.OWNER_NUMBER.includes('@') ? 
        this.OWNER_NUMBER : `${this.OWNER_NUMBER}@s.whatsapp.net`;
};

module.exports = config;