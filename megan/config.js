// Bot configuration

const config = {

    // Bot info

    BOT_NAME: '𝐌𝐄𝐆𝐀𝐍-𝐌𝐃',

    OWNER_NUMBER: '254758476795', //Your number - make sure this is correct

    OWNER_NAME: 'Wanga',

    PREFIX: '.',

    

    // Session

    SESSION_DIR: './session',

    

    // Database

    DATABASE: {

        ENABLED: true,

        TYPE: 'json'

    },

    

    // Mode

    MODE: 'public',

    

    // Chatbot toggle

    CHATBOT_ENABLED: false,  // Set to true to enable, false to disable

    

    // Status Features (default: view only ON, others OFF)

    STATUS: {

        AUTO_VIEW: true,           // ON by default - marks status as read

        AUTO_DOWNLOAD: false,       // OFF by default

        AUTO_REACT: false,          // OFF by default

        AUTO_REPLY: false,          // OFF by default

        REACT_EMOJIS: '💛,❤️,💜,🤍,💙,👍,🔥',

        REPLY_TEXT: '✅ Status viewed via Megan-MD',

        ANTI_DELETE: false          // OFF by default - save deleted status to DM

    },

    

    // Message Features

    FEATURES: {

        ANTI_DELETE: 'false',        // false, inbox, indm, both

        ANTI_DELETE_STATUS: 'false', // false, true (send to DM)

        ANTICALL: 'false',

        ANTILINK: 'false',

        AUTOREACT: 'false',

        AUTO_READ: 'false',

        AUTO_BIO: 'false',

        AUTO_VIEW_ONCE: 'false'      // Auto-save view once to DM

    },

    

    // Presence settings

    PRESENCE: {

        INBOX: 'typing',

        GROUP: 'typing'

    },

    

    // Messages

    MESSAGES: {

        ANTICALL: '📞 Calls are not allowed! I will reject your call.',

        ANTILINK: '⚠️ Links are not allowed in this group!',

        WELCOME: '👋 Welcome to the group!',

        GOODBYE: '👋 Goodbye!'

    },

    

    // Cache settings

    CACHE: {

        MESSAGES: true,

        STATUS_DURATION: 60 * 1000,

        GROUP_DURATION: 60 * 1000,

        CLEANUP_INTERVAL: 30 * 1000,

        STORE_MESSAGES: true,        // Store messages for anti-delete

        MAX_STORE: 100                // Max messages to store per chat

    },

    

    // Connection settings

    CONNECTION: {

        RECONNECT_INTERVAL: 1000,

        MAX_RECONNECT_ATTEMPTS: 10,

        RECONNECT_BACKOFF: true

    },

    

    // Browser info

    BROWSER: ["Ubuntu", "Chrome", "20.0.04"],

    

    // Logging

    LOG_LEVEL: 'silent',

    

    // ========== ADD THIS MISSING API SECTION ==========

    // API Endpoints

    API: {

        ELITE_PROTECH: 'https://eliteprotech-apis.zone.id',

        CLOUDFLARE_WORKER: 'https://late-salad-9d56.youngwanga254.workers.dev'

    },

    

    // Newsletter and Media

    NEWSLETTER_JID: '120363423423870584@newsletter',

    NEWSLETTER_URL: 'https://whatsapp.com/channel/0029VbCWWXi9hXF2SXUHgZ1b',

    BOT_PIC: 'https://files.catbox.moe/u29yah.jpg',

    

    // Timezone

    TIMEZONE: 'Africa/Nairobi',

    

    // Footer

    FOOTER: '© 𝐌𝐄𝐆𝐀𝐍-𝐌𝐃'

};

module.exports = config;